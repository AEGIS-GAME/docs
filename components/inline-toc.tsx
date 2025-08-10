"use client"
import { ChevronDown, Navigation, Target } from "lucide-react"
import type { TOCItemType } from "fumadocs-core/server"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ComponentProps } from "react"
import { cn } from "../lib/cn"

export interface InlineTocProps extends ComponentProps<typeof Collapsible> {
  items: TOCItemType[]
}

export function InlineTOC({ items, ...props }: InlineTocProps) {
  return (
    <Collapsible
      {...props}
      className={cn(
        "not-prose relative overflow-hidden rounded-lg",
        "border border-cyan-500/20 bg-slate-900/60 backdrop-blur-sm",
        "hover:bg-slate-800/80 hover:border-cyan-400/50",
        "transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20",
        props.className
      )}
    >
      <CollapsibleTrigger
        className={cn(
          "group relative inline-flex w-full items-center justify-between",
          "px-5 py-4 font-mono font-semibold tracking-wide text-cyan-300",
          "border-b border-cyan-500/20 group-data-[state=open]:border-cyan-400/30",
          "hover:bg-gradient-to-r hover:from-cyan-900/20 hover:via-slate-800/30 hover:to-cyan-900/20",
          "hover:text-cyan-200 transition-all duration-300"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-slate-700 to-slate-800 rounded border border-cyan-500/30 group-hover:border-cyan-400/50 transition-colors">
            <Navigation className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="flex items-center gap-2">
            <span>{props.children ?? "Navigation Chart"}</span>
            <div className="text-xs bg-cyan-900/30 px-2 py-0.5 rounded text-cyan-500">
              NAV-{String(items.length).padStart(2, "0")}
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all duration-300 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-t border-cyan-500/10">
          <div className="flex items-center gap-2 px-5 py-2 bg-slate-900/40 border-b border-cyan-500/10">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
              Contents Active
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent ml-2" />
            <span className="text-xs font-mono text-cyan-400">
              {items.length} SECTIONS
            </span>
          </div>

          <nav
            aria-label="Table of Contents"
            className="flex flex-col p-4 pt-3 text-sm"
          >
            {items.map((item, index) => (
              <a
                key={item.url}
                href={item.url}
                className={cn(
                  "group relative flex items-center gap-3 py-2 px-3 rounded-md font-mono",
                  "text-slate-400 hover:text-cyan-300 hover:bg-cyan-600/10",
                  "border border-transparent hover:border-cyan-500/20",
                  "transition-all duration-200",
                  item.depth > 2 && "text-slate-500 hover:text-slate-300"
                )}
                style={{
                  paddingInlineStart: 12 + 12 * Math.max(item.depth - 1, 0),
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      item.depth === 1 && "bg-cyan-400 group-hover:bg-cyan-300",
                      item.depth === 2 && "bg-blue-400 group-hover:bg-blue-300",
                      item.depth >= 3 && "bg-slate-500 group-hover:bg-slate-400"
                    )}
                  />
                  <span className="group-hover:tracking-wide transition-all duration-200">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs text-cyan-500 bg-cyan-900/30 px-1.5 py-0.5 rounded">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </a>
            ))}
          </nav>

          <div className="px-5 py-3 border-t border-cyan-500/10 bg-slate-900/40">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-mono">CHART VERIFIED</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-mono">
                <Target className="w-3 h-3" />
                <span>NAVIGATION READY</span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
