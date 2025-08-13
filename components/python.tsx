import { Fragment, type ComponentProps } from "react"
import { cn } from "fumadocs-ui/utils/cn"
import { highlight } from "fumadocs-core/highlight"

function parseDocstring(docstring: string) {
  const sections = {
    description: "",
    arguments: [] as string[],
    returns: "",
    raises: "",
  }

  const lines = docstring.split("\n").map((line) => line.replace(/^\s+|\s+$/g, ""))

  let currentSection: keyof typeof sections = "description"
  for (const line of lines) {
    if (/^(Args?):$/i.test(line)) {
      currentSection = "arguments"
      continue
    }
    if (/^Returns?:$/i.test(line)) {
      currentSection = "returns"
      continue
    }
    if (/^Raises?:$/i.test(line)) {
      currentSection = "raises"
      continue
    }

    if (currentSection === "arguments") {
      if (line) sections.arguments.push(line)
    } else if (currentSection === "description") {
      sections.description += line ? line + "\n" : "\n"
    } else if (currentSection === "returns") {
      sections.returns += line ? line + "\n" : "\n"
    } else if (currentSection === "raises") {
      sections.raises += line ? line + "\n" : "\n"
    }
  }

  sections.description = sections.description.trimEnd()
  sections.returns = sections.returns.trimEnd()
  sections.raises = sections.raises.trimEnd()

  return sections
}

function renderDescriptionLine(line: string) {
  const parts = line.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const content = part.slice(1, -1)
      return (
        <code key={i} className="font-mono ">
          {content}
        </code>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function PyFunction({ docString }: { docString: string }) {
  const doc = docString ? parseDocstring(docString) : null

  return (
    <section className="mt-2 text-fd-muted-foreground leading-relaxed prose prose-slate dark:prose-invert max-w-none">
      {doc ? (
        <>
          <p className="mb-4">
            {doc.description.split("\n").map((line, i) => (
              <Fragment key={i}>
                {renderDescriptionLine(line)}
                <br />
              </Fragment>
            ))}
          </p>

          {doc.arguments.length > 0 && (
            <section className="mb-6">
              <h4 className="font-mono font-semibold text-fd-foreground mb-2">
                Arguments
              </h4>
              <div className="space-y-2">
                {doc.arguments.map((arg, i) => {
                  const [name, description] = arg.split(":").map((s) => s.trim())
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono">{name}:</span>
                      <span className="">{description}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {doc.returns && (
            <section className="mb-6">
              <h4 className="font-mono font-semibold text-fd-foreground mb-2">
                Returns
              </h4>
              <p className="whitespace-pre-line">{doc.returns}</p>
            </section>
          )}

          {doc.raises && (
            <section className="mb-6">
              <h4 className="font-mono font-semibold text-fd-foreground mb-2">
                Raises
              </h4>
              <div>
                {doc.raises.split("\n").map((raise, i) => {
                  const [name, description] = raise.split(":").map((s) => s.trim())
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono">{name}:</span>
                      <span className="">{description}</span>
                    </div>
                  )
                })}
              </div>
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
  console.log(props.docString)
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
        <p className="whitespace-pre-line">
          {props.docString.split("\n").map((line, i) => (
            <Fragment key={i}>
              {renderDescriptionLine(line)}
              <br />
            </Fragment>
          ))}
        </p>
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
