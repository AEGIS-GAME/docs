"""
Script to auto-generate API docs for the documentation website.

This script reads the existing stub file and generates comprehensive MDX documentation
for all classes and functions, including proper signatures, docstrings, and attributes.
"""
# pyright: reportExplicitAny = false
# pyright: reportAny = false

import ast
import re
from importlib import resources
from pathlib import Path
from typing import Any, TypedDict

import griffe

PACKAGE = griffe.load("_aegis_game")
API_PATH = Path("./content/docs/api")
AGENT_API_OUTPUT_PATH = API_PATH / "agent.mdx"


##########################################
#                Types                   #
##########################################


class AttrInfo(TypedDict):
    """Represents an attribute of a class."""

    name: str
    annotation: str
    docstring: str | None
    default: Any


class ParamInfo(TypedDict):
    """Represents a parameter of a function."""

    name: str
    annotation: str
    default: Any


class FuncInfo(TypedDict):
    """Represents a function's signature information."""

    name: str
    params: list[ParamInfo]
    return_: str
    docstring: str | None


class ClassInfo(TypedDict):
    """Represents a class' signature information."""

    functions: dict[str, FuncInfo]
    attributes: list[AttrInfo]
    enum_members: list[AttrInfo]
    docstring: str | None


##########################################
#           Utility Functions            #
##########################################


class StringUtils:
    """Utility functions for string manipulation."""

    @staticmethod
    def pascal_to_snake(name: str) -> str:
        """Convert PascalCase string to snake_case."""
        s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
        s2 = re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1)
        return s2.lower()


class DocstringParser:
    """Handles parsing of docstrings for attribute descriptions."""

    @staticmethod
    def parse_attr_descriptions(class_docstring: str) -> dict[str, str]:
        """
        Parse attribute descriptions from a class docstring.

        Args:
            class_docstring: The full docstring of the class.

        Returns:
            Mapping from attribute name to its description.

        """
        if not class_docstring:
            return {}

        attr_section_match = re.search(
            r"Attributes:\s*(.+?)(?:\n\n|$)",
            class_docstring,
            flags=re.DOTALL | re.IGNORECASE,
        )
        if not attr_section_match:
            return {}

        attr_text = attr_section_match.group(1)
        attr_lines = attr_text.strip().split("\n")
        descriptions: dict[str, str] = {}
        attr_line_pattern = re.compile(r"^\s*(\w+)\s*:\s*(.+)$")

        for line in attr_lines:
            match = attr_line_pattern.match(line)
            if match:
                attr_name, description = match.groups()
                descriptions[attr_name] = description.strip()

        return descriptions


class DebugPrinter:
    """Utility functions for debugging output."""

    @staticmethod
    def print_attributes(attributes: list[AttrInfo]) -> None:
        """Print a summary of attributes with their types and docstring presence."""
        for attr in attributes:
            doc_present = "yes" if attr.get("docstring") else "no"
            default_str = (
                f", default: {attr['default']}"
                if attr.get("default") is not None
                else ""
            )
            print(
                f"- {attr['name']} [doc: {doc_present}]: type: {attr['annotation']}{default_str}"
            )

    @staticmethod
    def print_functions(functions: dict[str, FuncInfo]) -> None:
        """Print a summary of functions with their return types and parameters."""
        for fname, finfo in functions.items():
            doc_present = "yes" if finfo.get("docstring") else "no"
            print(
                f"- {fname} [doc: {doc_present}]: returns {finfo['return_']}, args: ["
                + ", ".join(
                    f"{p['name']}:{p['annotation']}"
                    + (f" = {p['default']}" if p["default"] is not None else "")
                    for p in finfo["params"]
                )
                + "]"
            )

    @staticmethod
    def print_classes(class_info: dict[str, ClassInfo]) -> None:
        """Print a summary of classes with their attributes and functions."""
        for class_name, info in class_info.items():
            print(f"\nClass: {class_name}")
            DebugPrinter.print_functions(info["functions"])
            print("--- Attributes ---")
            DebugPrinter.print_attributes(info["attributes"])


##########################################
#           Parser Classes               #
##########################################


class EnumParser:
    """Handles parsing of enum classes."""

    @staticmethod
    def is_enum_class(class_obj: griffe.Class) -> bool:
        """Check if a class is an enum."""
        return any(str(base) == "Enum" for base in class_obj.bases)

    @staticmethod
    def parse_enum_members(class_obj: griffe.Class) -> list[AttrInfo]:
        """Extract enum members from an Enum class."""
        members: list[AttrInfo] = []

        for attr in class_obj.attributes.values():
            if attr.name.startswith("_"):
                continue

            # Enum values are usually class attributes
            if "class-attribute" not in attr.labels:
                continue

            members.append(
                {
                    "name": attr.name,
                    "annotation": "",
                    "docstring": attr.docstring.value if attr.docstring else None,
                    "default": "",
                }
            )

        return members


class AttributeParser:
    """Handles parsing of class attributes."""

    @staticmethod
    def parse_attributes(
        attrs: dict[str, griffe.Attribute], class_docstring: str | None = None
    ) -> list[AttrInfo]:
        """Parse class attributes."""
        results: list[AttrInfo] = []
        attr_descriptions = (
            DocstringParser.parse_attr_descriptions(class_docstring)
            if class_docstring
            else {}
        )

        for attr in attrs.values():
            # Skip private attributes
            if attr.name.startswith("_"):
                continue

            # Ignore class attributes (mostly for enums)
            if "class-attribute" in attr.labels:
                continue

            attr_doc = attr.docstring.value if attr.docstring else None
            default_value = attr.value if attr.name not in str(attr.value) else ""

            results.append(
                {
                    "name": attr.name,
                    "annotation": str(attr.annotation) if attr.annotation else "",
                    "docstring": attr_descriptions.get(attr.name) or attr_doc,
                    "default": default_value,
                }
            )

        return results


class FunctionParser:
    """Handles parsing of functions and methods."""

    @staticmethod
    def parse_functions(funcs: dict[str, griffe.Function]) -> dict[str, FuncInfo]:
        """Parse a collection of Griffe Function objects."""
        functions: dict[str, FuncInfo] = {}

        for func in funcs.values():
            # Skip dunder methods except __init__
            if (
                func.name.startswith("__")
                and func.name.endswith("__")
                and func.name != "__init__"
            ):
                continue

            func_info: FuncInfo = {
                "name": func.name,
                "params": [],
                "return_": str(func.returns),
                "docstring": func.docstring.value if func.docstring else None,
            }

            for param in func.parameters:
                # Skip 'self' parameter
                if param.name == "self":
                    continue

                func_info["params"].append(
                    {
                        "name": param.name,
                        "annotation": str(param.annotation),
                        "default": param.default,
                    }
                )

            functions[func.name] = func_info

        return functions


class ResourceReader:
    """Handles reading and parsing of Python source files."""

    def collect_functions(self) -> dict[str, FuncInfo]:
        """Collect all relevant function definitions from modules."""
        method_names = self.get_method_names()

        ac_functions = self.get_functions_from_module(
            "agent_controller", "AgentController", method_names
        )
        print(f"Found {len(ac_functions)} method names from agent_controller.py")
        ac_names = {func.name for func in ac_functions}

        game_functions = self.get_functions_from_module("game", "Game", method_names)
        game_functions = [func for func in game_functions if func.name not in ac_names]
        print(f"Found {len(game_functions)} method names from game.py")

        all_functions = ac_functions + game_functions
        parsed_functions: dict[str, FuncInfo] = {}
        for func in all_functions:
            func_dict = {func.name: func}
            parsed = FunctionParser.parse_functions(func_dict)
            parsed_functions.update(parsed)

        return parsed_functions

    @staticmethod
    def read_source(package: str, filename: str) -> str | None:
        """Read source code from a package resource."""
        try:
            return resources.read_text(package, filename)
        except (FileNotFoundError, OSError) as e:
            print(f"Error reading {filename} from {package}: {e}")
            return None

    @classmethod
    def get_all_exports(cls) -> list[str]:
        """Read and parse __init__.py from the `aegis_game` package to extract __all__."""
        source = cls.read_source("aegis_game", "__init__.py")
        if source is None:
            return []

        tree = ast.parse(source)
        for node in tree.body:
            if not isinstance(node, ast.Assign):
                continue

            for target in node.targets:
                if not (isinstance(target, ast.Name) and target.id == "__all__"):
                    continue

                if not isinstance(node.value, ast.List):
                    continue

                return [
                    elt.value
                    for elt in node.value.elts
                    if isinstance(elt, ast.Constant)
                    and isinstance(elt.value, str)
                    and elt.value != "main"
                ]

        print("Warning: __all__ not found in __init__.py")
        return []

    @classmethod
    def get_method_names(cls) -> list[str]:
        """Extract method names from the game.py methods function."""
        source = cls.read_source("_aegis_game", "game.py")
        if source is None:
            return []

        tree = ast.parse(source)

        for node in tree.body:
            if not isinstance(node, ast.ClassDef):
                continue

            for func in node.body:
                if not (isinstance(func, ast.FunctionDef) and func.name == "methods"):
                    continue

                return cls._extract_method_names_from_function(func)

        return []

    @staticmethod
    def _extract_method_names_from_function(func: ast.FunctionDef) -> list[str]:
        """Extract method names from a methods function that returns a dict."""
        methods: list[str] = []

        for node in ast.walk(func):
            if not (isinstance(node, ast.Return) and isinstance(node.value, ast.Dict)):
                continue

            methods.extend(
                key.value
                for key in node.value.keys
                if isinstance(key, ast.Constant)
                and isinstance(key.value, str)
                and not key.value[0].isupper()
            )

        return methods

    @classmethod
    def get_functions_from_module(
        cls, module: str, class_: str, method_names: list[str]
    ) -> list[griffe.Function]:
        """Get function definitions from a specific module and class."""
        try:
            agent_module: griffe.Module = PACKAGE[module]
            funcs: list[griffe.Function] = []

            ac_class = agent_module.classes.get(class_)
            if ac_class:
                funcs.extend(
                    func
                    for func_name, func in ac_class.functions.items()
                    if func_name in method_names
                )
        except KeyError:
            print(f"Warning: Could not find {module} module")
            return []
        else:
            return funcs


class ClassParser:
    """Handles parsing of complete classes with all their components."""

    def __init__(self) -> None:
        """Initialize a ClassParser."""
        self.function_parser: FunctionParser = FunctionParser()
        self.attribute_parser: AttributeParser = AttributeParser()
        self.enum_parser: EnumParser = EnumParser()

    def parse_classes(self, imported_names: list[str]) -> dict[str, ClassInfo]:
        """Parse classes from source files corresponding to imported names."""
        classes: dict[str, ClassInfo] = {}

        root_dir = Path(str(PACKAGE.filepath)).parent
        common_dir = root_dir / "common"

        candidate_dirs = [root_dir, common_dir]
        if common_dir.is_dir():
            candidate_dirs.extend(
                p
                for p in common_dir.iterdir()
                if p.is_dir() and p.name != "__pycache__"
            )

        for name in imported_names:
            module_path = self._find_module_path(name, candidate_dirs)
            if not module_path:
                print(f"Warning: Could not find file for imported name '{name}'")
                continue

            try:
                rel_path = module_path.relative_to(root_dir)
            except ValueError:
                print(f"Warning: Could not make import path for '{module_path}'")
                continue

            import_path = str(rel_path.with_suffix("")).replace("/", ".")
            try:
                module: griffe.Module = PACKAGE[import_path]
                cls = module.classes.get(name)

                if cls is None:
                    print(f"Warning: Class '{name}' not found in {import_path}")
                    continue

                classes[name] = self._parse_single_class(cls)
            except KeyError:
                print(f"Warning: Could not load module {import_path}")
                continue

        return classes

    def _find_module_path(self, name: str, candidate_dirs: list[Path]) -> Path | None:
        """Find the module path for a given class name."""
        for directory in candidate_dirs:
            filename = StringUtils.pascal_to_snake(name) + ".py"
            candidate = directory / filename
            if candidate.is_file():
                return candidate
        return None

    def _parse_single_class(self, cls: griffe.Class) -> ClassInfo:
        """Parse a single class into ClassInfo."""
        doc_string = cls.docstring.value if cls.docstring else None
        funcs = self.function_parser.parse_functions(cls.functions)
        attrs = self.attribute_parser.parse_attributes(cls.attributes, doc_string)

        class_info: ClassInfo = {
            "functions": funcs,
            "attributes": attrs,
            "enum_members": [],
            "docstring": doc_string,
        }

        if self.enum_parser.is_enum_class(cls):
            class_info["enum_members"] = self.enum_parser.parse_enum_members(cls)

        return class_info


##########################################
#           MDX Renderers                #
##########################################


class MDXRenderer:
    """Base class for MDX rendering functionality."""

    @staticmethod
    def render_constructor(name: str, attributes: list[AttrInfo]) -> str:
        """Generate a Python constructor signature from class attributes."""
        params: list[str] = []

        for attr in attributes:
            param_str = attr["name"]
            if attr.get("annotation"):
                param_str += f": {attr['annotation']}"
            if attr.get("default"):
                param_str += f" = {attr['default']}"
            params.append(param_str)

        init = f"{name}({', '.join(params)})"
        return f'<PyFunctionSignature signature="{init}" />'

    @staticmethod
    def render_function_signature(name: str, func: FuncInfo) -> str:
        """Render only the function signature as an MDX component."""
        params: list[str] = []

        for p in func["params"]:
            param_str = p["name"]
            if p.get("annotation"):
                param_str += f": {p['annotation']}"
            if p.get("default") is not None:
                param_str += f" = {p['default']}"
            params.append(param_str)

        params_str = ", ".join(params)
        return_type = func.get("return_", "None")
        signature = f"def {name}({params_str}) -> {return_type}"

        return f'<PyFunctionSignature signature="{signature}" />'

    @staticmethod
    def render_function(name: str, func: FuncInfo) -> str:
        """Render a complete function with header and documentation."""
        signature_mdx = MDXRenderer.render_function_signature(name, func)
        doc = func.get("docstring", "")
        return f'### {name}\n\n{signature_mdx}\n\n<PyFunction docString="{doc}" />'

    @staticmethod
    def render_attribute(attr: AttrInfo) -> str:
        """Render a single class attribute as an MDX component."""
        default = attr.get("default")
        default_str = str(default) if default is not None else ""
        type_str = attr.get("annotation") or ""
        doc = attr.get("docstring") or ""

        return (
            f"### {attr['name']}\n\n"
            f'<PyAttribute type="{type_str}" value="{default_str}" docString="{doc}" />\n'
        )


class AgentDocsRenderer(MDXRenderer):
    """Renders agent API documentation."""

    @staticmethod
    def render_agent_api_docs(all_methods: dict[str, FuncInfo]) -> str:
        """Generate a complete MDX document for the Agent API."""
        mdx = """---
title: Agent
description: Agent functions to interact with the world.
---

"""

        if all_methods:
            mdx += "\n".join(
                MDXRenderer.render_function(name, func)
                for name, func in all_methods.items()
            )
            mdx += "\n"

        return mdx


class ClassDocsRenderer(MDXRenderer):
    """Renders class documentation."""

    @staticmethod
    def render_class_docs(name: str, class_info: ClassInfo) -> str:
        """Render complete MDX documentation for a class."""
        description = (
            class_info["docstring"].partition("\n")[0]
            if class_info["docstring"]
            else "Could not generate description"
        )

        mdx = f"""---
title: {name}
description: {description}
---

"""

        # Constructor section
        init_func = class_info["functions"].get("__init__")
        if init_func and init_func.get("docstring"):
            mdx += f"## Constructor\n\n{MDXRenderer.render_constructor(name, class_info['attributes'])}\n\n"

        # Enum constants section
        if class_info["enum_members"]:
            enums = "\n".join(
                MDXRenderer.render_attribute(member)
                for member in class_info["enum_members"]
            )
            mdx += f"## Enum Constants\n\n{enums}\n\n"

        # Attributes section
        if class_info["attributes"]:
            attrs = "\n".join(
                MDXRenderer.render_attribute(attr) for attr in class_info["attributes"]
            )
            mdx += f"## Attributes\n\n{attrs}\n\n"

        # Methods section
        methods = {
            fname: finfo
            for fname, finfo in class_info["functions"].items()
            if fname != "__init__"
        }
        if methods:
            funcs = "\n".join(
                MDXRenderer.render_function(fname, finfo)
                for fname, finfo in methods.items()
            )
            mdx += f"## Methods\n\n{funcs}\n\n"

        return mdx


##########################################
#           Main Documentation Generator #
##########################################


class DocumentationGenerator:
    """Main class that orchestrates the documentation generation process."""

    def __init__(self) -> None:
        """Initialize a DocumentationGenerator."""
        self.function_parser: FunctionParser = FunctionParser()
        self.class_parser: ClassParser = ClassParser()
        self.resource_reader: ResourceReader = ResourceReader()
        self.agent_renderer: AgentDocsRenderer = AgentDocsRenderer()
        self.class_renderer: ClassDocsRenderer = ClassDocsRenderer()
        self.debug_printer: DebugPrinter = DebugPrinter()

    def generate_documentation(self) -> None:
        """Generate all documentation."""
        all_methods = self.resource_reader.collect_functions()
        print(f"\nTotal API methods found: {len(all_methods)}")
        print("\nAll methods:")
        self.debug_printer.print_functions(all_methods)

        imported_names = self.resource_reader.get_all_exports()
        print(f"\nImported names from __all__: {imported_names}")

        class_info = self.class_parser.parse_classes(imported_names)
        self.debug_printer.print_classes(class_info)

        self._generate_agent_docs(all_methods)
        self._generate_class_docs(class_info)

        print("\nMDX Files Generated!")

    def _generate_agent_docs(self, all_methods: dict[str, FuncInfo]) -> None:
        """Generate agent API documentation."""
        agent_api_mdx = self.agent_renderer.render_agent_api_docs(all_methods)
        _ = AGENT_API_OUTPUT_PATH.write_text(agent_api_mdx, encoding="utf-8")

    def _generate_class_docs(self, class_info: dict[str, ClassInfo]) -> None:
        """Generate documentation for all classes."""
        for name, info in class_info.items():
            class_api_mdx = self.class_renderer.render_class_docs(name, info)
            output_path = API_PATH / f"{name.lower()}.mdx"
            _ = output_path.write_text(class_api_mdx, encoding="utf-8")


def main() -> None:
    """Entry point for the documentation generator."""
    generator = DocumentationGenerator()
    generator.generate_documentation()


if __name__ == "__main__":
    main()
