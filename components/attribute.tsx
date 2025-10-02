import { type ComponentProps } from "react"
import { cn } from "fumadocs-ui/utils/cn"
import { highlight } from "fumadocs-core/highlight"

interface Attr {
  type: string
  docstring: string
}

export default function Attribute({ type, docstring }: Attr) {
  return (
    <div>
      <InlineCode lang="python" code={type} />
      <p className="text-fd-muted-foreground">
        {docstring}
      </p>
    </div>

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
