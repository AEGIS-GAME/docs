import { type ComponentProps } from "react"
import { cn } from "fumadocs-ui/utils/cn"
import { highlight } from "fumadocs-core/highlight"

function parseDocstring(docstring: string) {
  const sections = {
    description: "",
    arguments: [] as string[],
    returns: "",
    throws: "",
  }

  const lines = docstring.split("\n").map((line) => line.trim())

  let currentSection: keyof typeof sections = "description"
  for (const line of lines) {
    if (/^(Arguments?|Args?):$/i.test(line)) {
      currentSection = "arguments"
      continue
    }
    if (/^Returns?:$/i.test(line)) {
      currentSection = "returns"
      continue
    }
    if (/^Throws?:$/i.test(line)) {
      currentSection = "throws"
      continue
    }

    if (currentSection === "arguments") {
      if (line) sections.arguments.push(line)
    } else if (currentSection === "description") {
      if (sections.description) {
        sections.description += " " + line
      } else {
        sections.description = line
      }
    } else if (currentSection === "returns") {
      if (sections.returns) {
        sections.returns += " " + line
      } else {
        sections.returns = line
      }
    } else if (currentSection === "throws") {
      if (sections.throws) {
        sections.throws += " " + line
      } else {
        sections.throws = line
      }
    }
  }

  return sections
}

export function PyFunction({ docString }: { docString: string }) {
  const doc = docString ? parseDocstring(docString) : null

  return (
    <section className="mt-2 text-fd-muted-foreground leading-relaxed prose prose-slate dark:prose-invert max-w-none">
      {doc ? (
        <>
          <p className="mb-4">{doc.description}</p>

          {doc.arguments.length > 0 && (
            <section className="mb-6">
              <h4 className="font-mono font-semibold text-fd-foreground mb-2">
                Arguments
              </h4>
              <ul className="list-disc list-inside font-mono text-sm space-y-1">
                {doc.arguments.map((arg, i) => (
                  <li key={i} className="whitespace-pre-line">
                    {arg}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {doc.returns && (
            <section className="mb-6">
              <h4 className="font-mono font-semibold text-fd-foreground mb-2">
                Returns
              </h4>
              <p className="font-mono text-sm whitespace-pre-line">{doc.returns}</p>
            </section>
          )}

          {doc.throws && (
            <section className="mb-6">
              <h4 className="font-mono font-semibold text-fd-foreground mb-2">
                Throws
              </h4>
              <p className="font-mono text-sm whitespace-pre-line">{doc.throws}</p>
            </section>
          )}
        </>
      ) : (
        <p className="italic text-fd-muted-foreground mb-6">
          No documentation available.
        </p>
      )}
    </section>
  )
}

export function PyFunctionSignature({ signature }: { signature: string }) {
  return <InlineCode lang="python" code={signature} />
}

export function PyAttribute(props: { type: string; value: string; docString: string }) {
  return (
    <section className="text-fd-muted-foreground leading-relaxed prose prose-slate dark:prose-invert max-w-none my-6">
      {(props.value || props.type) && (
        <InlineCode
          lang="python"
          className="not-prose text-sm font-mono mb-4 block"
          code={`${props.type}${props.value ? ` = ${props.value}` : ""}`}
        />
      )}

      {props.docString ? (
        <p className="whitespace-pre-line">{props.docString}</p>
      ) : (
        <p className="italic text-fd-muted-foreground">No description available.</p>
      )}
    </section>
  )
}

async function InlineCode({
  lang,
  code,
  ...rest
}: ComponentProps<"span"> & {
  lang: string
  code: string
}) {
  return highlight(code, {
    lang,
    components: {
      pre: (props) => (
        <span
          {...props}
          {...rest}
          className={cn(
            rest.className,
            props.className,
            "[--padding-left:0!important]"
          )}
        />
      ),
      code: (props) => (
        <code
          {...props}
          className={cn(
            props.className,
            "bg-transparent border-0 !important",
            "rounded-none",
            "p-0 text-sm"
          )}
        />
      ),
    },
  })
}

export { Tab, Tabs } from "fumadocs-ui/components/tabs"
