import defaultMdxComponents from "fumadocs-ui/mdx"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import * as TreeComponents from "./components/file-tree"
import * as PythonComponents from "./components/python"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import type { MDXComponents } from "mdx/types"
import { Callout } from "./components/callout"
import { cn } from "./lib/cn"

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...TreeComponents,
    ...PythonComponents,
    ...TabsComponents,
    ...defaultMdxComponents,
    ...components,
    Callout,
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="relative [&>h3]:step steps mb-12 ml-4 border-l border-solid border-zinc-300 dark:border-zinc-700 pl-8 [counter-reset:step]"
        {...props}
      />
    ),
    img: (props) => <ImageZoom {...(props as any)} />,
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={cn("mt-2 scroll-m-20 text-4xl font-bold", className)} {...props} />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          "mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn(
          "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className={cn(
          "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p className={cn("leading-7 not-first:mt-6", className)} {...props} />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "relative inline-block font-medium text-cyan-400 transition-all duration-500 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
          "no-underline cursor-pointer",
          "after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]",
          "after:bg-gradient-to-r after:from-cyan-500 after:via-cyan-400 after:to-cyan-300",
          "after:rounded-full after:transition-all after:duration-500 after:ease-out",
          "after:shadow-[0_0_4px_rgb(34,211,238)]",
          "hover:after:w-full hover:after:shadow-[0_0_8px_rgb(34,211,238)]",
          className
        )}
        {...props}
      />
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-cyan-500 bg-cyan-900/10 pl-4 py-2 my-4 text-cyan-200 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code
        className={cn(
          "relative bg-fd-muted rounded-md px-1.5 py-0.5 font-mono text-sm text-fd-foreground",
          "break-all whitespace-pre max-w-full overflow-auto",
          "[&:not(pre_&)]:font-semibold",
          className
        )}
        {...props}
      />
    ),
  }
}
