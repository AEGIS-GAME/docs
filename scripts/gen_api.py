"""
Script to auto generate api docs for the documentation website.

It parses the `full_stub.py` file and gets all the informatiom from the classes and functions.
"""
# pyright: reportExplicitAny = false
# pyright: reportAny = false

import re
from pathlib import Path
from typing import Any, TypedDict

import griffe

PACKAGE = griffe.load("_aegis")
STUB: griffe.Module = PACKAGE["full_stub"]
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
#           Util functions               #
##########################################


def is_enum_class(cls: griffe.Class) -> bool:
    """
    Check if a class is an enum.

    Returns:
        bool: True if enum, otherwise false

    """
    return any(str(base) == "Enum" for base in cls.bases)


def parse_attr_descriptions(class_docstring: str) -> dict[str, str]:
    """
    Parse attribute descriptions from a class docstring.

    Args:
        class_docstring (str): The full docstring of the class.

    Returns:
        dict[str, str]: Mapping from attribute name to its description.

    """
    if not class_docstring:
        return {}

    # Regex to match the Attributes section, then parse each attribute line:
    attr_section_match = re.search(
        r"Attributes:\s*(.+?)(?:\n\n|$)",
        class_docstring,
        flags=re.DOTALL | re.IGNORECASE,
    )
    if not attr_section_match:
        return {}

    attr_text = attr_section_match.group(1)
    # Split lines by newline and parse "name (type): description"
    attr_lines = attr_text.strip().split("\n")

    descriptions: dict[str, str] = {}
    attr_line_pattern = re.compile(r"^\s*(\w+)\s*\(.*?\):\s*(.+)$")

    for line in attr_lines:
        match = attr_line_pattern.match(line)
        if match:
            attr_name, description = match.groups()
            descriptions[attr_name] = description.strip()

    return descriptions


def print_attributes(attributes: list[AttrInfo]) -> None:
    """
    Print a summary of attributes with their types and docstring presence.

    Args:
        attributes (list[AttrInfo]): A list of attribute details, each including
            the attribute name, type annotation, default value, and optionally docstring content.

    Output Format:
        - attr_name [doc: yes/no]: type: annotation, default: value (if present)

    """
    for attr in attributes:
        doc_present = "yes" if attr.get("docstring") else "no"
        default_str = (
            f", default: {attr['default']}" if attr.get("default") is not None else ""
        )
        print(
            f"- {attr['name']} [doc: {doc_present}]: type: {attr['annotation']}{default_str}"
        )


def print_functions(functions: dict[str, FuncInfo]) -> None:
    """
    Print a summary of functions with their return types, parameters, and docstring presence.

    Args:
        functions (dict[str, FuncInfo]): A dictionary mapping function names to their
            signature information, including parameters, return annotation, defaults,
            and optionally docstring content.

    Output Format:
        - function_name [doc: yes/no]: returns return_type, args: [param1:type1 = default1, ...]

    """
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


def pascal_to_snake(name: str) -> str:
    """Convert PascalCase string to snake_case."""
    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    s2 = re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1)
    return s2.lower()


##########################################
#           Parse functions              #
##########################################


def parse_enum_members(cls: griffe.Class) -> list[AttrInfo]:
    """
    Extract enum members from an Enum class.

    Args:
        cls (griffe.Class): The enum class.

    Returns:
        list[AttrInfo]: List of enum members as attributes (name and value).

    """
    members: list[AttrInfo] = []
    for attr in cls.attributes.values():
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


def parse_attributes(
    attrs: dict[str, griffe.Attribute], class_docstring: str | None = None
) -> list[AttrInfo]:
    """
    Parse class attributes.

    Args:
        attrs (dict[str, griffe.Attribute]): Mapping of attribute names to Griffe
            Attribute objects representing the attributes of the class.
        class_docstring (str | None): The full docstring of the class
            from which attribute descriptions may be extracted. Defaults to None.

    Returns:
        A list of attribute info dictionaries.

    """
    results: list[AttrInfo] = []
    attr_descriptions = (
        parse_attr_descriptions(class_docstring) if class_docstring else {}
    )
    for attr in attrs.values():
        # Skip private ones
        if attr.name.startswith("_"):
            continue

        # Ignore these, mostly for enums
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


def parse_functions(funcs: dict[str, griffe.Function]) -> dict[str, FuncInfo]:
    """
    Parse a collection of Griffe Function objects to extract detailed function signature information.

    Args:
        funcs (dict[str, griffe.Function]): A dictionary of function names to Griffe Function objects.

    Returns:
        dict[str, FuncInfo]: A dictionary mapping function names to their parsed signature details,
            including parameter names, annotations, default values, return type, and docstring.

    """
    functions: dict[str, FuncInfo] = {}

    for func in funcs.values():
        # Skip dunder methods
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


def find_imported_names() -> list[str]:
    """
    Extract imported class names from the stub file.

    Searches the stub file for an import statement of the form:
        from . import (
            ClassName1,
            ClassName2,
            ...
        )
    and returns the imported names as a list of strings.

    Returns:
        list[str]: A list of imported class names found in the stub file.
                   Returns an empty list if no matching import block is found.

    """
    pattern = re.compile(r"from\s+\.\s+import\s*\((.*?)\)", re.DOTALL)
    stub_path = Path(str(STUB.filepath))
    with stub_path.open() as f:
        content = f.read()

    match = pattern.search(content)
    if not match:
        return []

    imports_raw = match.group(1)
    return [
        name.strip().split(",")[0] for name in imports_raw.splitlines() if name.strip()
    ]


def parse_classes(imported_names: list[str]) -> dict[str, ClassInfo]:
    """
    Parse functions from source files corresponding to imported class names.

    Given a list of imported class names, locate their source files under the root
    directory and the 'common' subdirectories, parse their functions, and return
    a mapping from class name to its parsed function signatures.

    Args:
        imported_names (List[str]): List of class names to locate and parse.

    Returns:
        dict[str, dict[str, FuncInfo]]:
            A dictionary mapping each class name to another dictionary that maps
            function names to their parsed signature details.

    """
    classes: dict[str, ClassInfo] = {}
    root_dir = Path(str(STUB.filepath)).parent
    common_dir = root_dir / "common"
    candidate_dirs = [root_dir, common_dir]
    if common_dir.is_dir():
        candidate_dirs.extend(
            p for p in common_dir.iterdir() if p.is_dir() and p.name != "__pycache__"
        )

    for name in imported_names:
        module_path = None
        for directory in candidate_dirs:
            filename = pascal_to_snake(name) + ".py"
            candidate = directory / filename
            if candidate.is_file():
                module_path = candidate
                break

        if module_path is None:
            print(f"Warning: Could not find file for imported name '{name}'")
            continue
        try:
            rel_path = module_path.relative_to(root_dir)
        except ValueError:
            print(f"Warning: Could not make import path for '{module_path}'")
            continue

        import_path = str(rel_path.with_suffix("")).replace("/", ".")
        module: griffe.Module = PACKAGE[import_path]
        cls = module.classes.get(name)
        if cls is None:
            print(f"Warning: Class '{name}' not found in {import_path}")
            continue

        doc_string = cls.docstring.value if cls.docstring else None
        funcs = parse_functions(cls.functions)
        attrs = parse_attributes(cls.attributes, doc_string)

        class_info: ClassInfo = {
            "functions": funcs,
            "attributes": attrs,
            "enum_members": [],
            "docstring": doc_string,
        }
        if is_enum_class(cls):
            class_info["enum_members"] = parse_enum_members(cls)

        classes[name] = class_info

    return classes


##########################################
#           Render functions             #
##########################################


def render_constructor(name: str, attributes: list[AttrInfo]) -> str:
    """
    Generate a Python constructor signature from class attributes.

    Args:
        name (str): The class name.
        attributes (list[AttrInfo]): The list of attributes for the class.

    Returns:
        str: An MDX string with the class init in a code block.

    """
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


def render_function_signature(name: str, func: FuncInfo) -> str:
    """
    Render only the function signature as an MDX inline code block.

    Args:
        name (str): The function name.
        func (FuncInfo): The function info dictionary.

    Returns:
        str: An MDX string with the function signature in a code block.

    """
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


def render_function(name: str, func: FuncInfo) -> str:
    """
    Render a function and its parameters as an MDX PyFunction component with header.

    Args:
        name (str): The function name.
        func (FuncInfo): A dictionary with function info.

    Returns:
        str: An MDX string representing the PyFunction component for this function.

    """
    signature_mdx = render_function_signature(name, func)
    doc = func.get("docstring", "")

    return f'### {name}\n\n{signature_mdx}\n\n<PyFunction docString="{doc}" />'


def render_agent_api_docs(stub_functions: dict[str, FuncInfo]) -> str:
    """
    Generate a complete MDX document string for the Agent docs.

    Includes frontmatter and renders all stub functions.

    Args:
        stub_functions (dict[str, FuncInfo]): Dictionary of stub functions info.

    Returns:
        str: A complete MDX string for the agent documentation.

    """
    mdx = """---
title: Agent
description: Agent functions to interact with the world.
---\n\n
"""

    if stub_functions:
        mdx += "\n".join(render_function(name, f) for name, f in stub_functions.items())
        mdx += "\n"

    return mdx


def render_attribute(attr: AttrInfo) -> str:
    """
    Render a single class attribute as an MDX PyAttribute component.

    Args:
        attr (AttrInfo): A dictionary containing attribute information.

    Returns:
        str: An MDX string representing a PyAttribute component.

    """
    default = attr.get("default")
    default_str = str(default) if default is not None else ""
    type_str = attr.get("annotation") or ""
    doc = attr.get("docstring") or ""

    return (
        f"### {attr['name']}\n\n"
        f'<PyAttribute type="{type_str}" value="{default_str}" docString="{doc}" />\n'
    )


def render_class_docs(name: str, class_info: ClassInfo) -> str:
    """
    Render the complete MDX documentation for a class including its attributes and functions.

    Args:
        name (str): The name of the class.
        class_info (ClassInfo): A dictionary containing the class information.

    Returns:
        str: A complete MDX string for the class documentation.

    """
    mdx = f"""---
title: {name}
description: {class_info["docstring"].partition("\n")[0] if class_info["docstring"] else "Could not generate description"}
---\n\n
"""
    # Only render constructor if __init__ has a docstring
    init_func = class_info["functions"].get("__init__")
    if init_func and init_func.get("docstring"):
        mdx += f"## Constructor\n\n{render_constructor(name, class_info['attributes'])}"

    if class_info:
        if class_info["enum_members"]:
            enums = "\n".join(
                render_attribute(a) for a in class_info.get("enum_members", [])
            )
            mdx += f"## Enum Constants\n\n{enums}"

        attrs = "\n".join(render_attribute(a) for a in class_info.get("attributes", []))
        funcs = "\n".join(
            render_function(fname, finfo)
            for fname, finfo in class_info.get("functions", {}).items()
            if fname != "__init__"
        )
        if attrs:
            mdx += f"\n\n## Attributes\n\n{attrs}"

        if funcs:
            mdx += f"\n\n## Methods\n\n{funcs}"

    return mdx


def main() -> None:
    """
    Entry point for analyzing the stub file and its imported classes.

    Output is printed to the console for inspection.
    """
    stub_functions = parse_functions(STUB.functions)

    print("\nFunctions in stub file:")
    print_functions(stub_functions)

    imported_names = find_imported_names()
    print(f"\nImported names from stub: {imported_names}")

    mod_sigs = parse_classes(imported_names)
    for mod_name, mod_info in mod_sigs.items():
        print(f"Module: {mod_name}")
        print_functions(mod_info["functions"])
        attrs = mod_info["attributes"]
        print("--- Attributes ---")
        print_attributes(attrs)

    agent_api_mdx = render_agent_api_docs(stub_functions)

    _ = AGENT_API_OUTPUT_PATH.write_text(agent_api_mdx, encoding="utf-8")

    for name, class_info in mod_sigs.items():
        class_api_mdx = render_class_docs(name, class_info)
        _ = Path(API_PATH / f"{name.lower()}.mdx").write_text(
            class_api_mdx, encoding="utf-8"
        )

    print("\nMDX Files Generated!")


if __name__ == "__main__":
    main()
