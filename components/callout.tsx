import { CircleX, Info, AlertTriangle, CheckCircle2, Radio } from "lucide-react"
import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../lib/cn"

type CalloutProps = Omit<HTMLAttributes<HTMLDivElement>, "title" | "type" | "icon"> & {
  title?: ReactNode
  /**
   * @defaultValue info
   */
  type?: "info" | "warn" | "error" | "success" | "warning"
  /**
   * Force an icon
   */
  icon?: ReactNode
}

const getCalloutTheme = (type: string) => {
  switch (type) {
    case "info":
      return {
        container: "bg-slate-900/70 border-cyan-500/30 shadow-cyan-500/20",
        accent: "bg-cyan-500/50",
        icon: "text-cyan-400",
        title: "text-cyan-300",
        content: "text-slate-300",
        glow: "shadow-lg shadow-cyan-500/10",
        status: "INFORMATION",
        statusColor: "text-cyan-400 bg-cyan-500/20",
      }
    case "warning":
      return {
        container: "bg-slate-900/70 border-yellow-500/30 shadow-yellow-500/20",
        accent: "bg-yellow-500/50",
        icon: "text-yellow-400",
        title: "text-yellow-300",
        content: "text-slate-300",
        glow: "shadow-lg shadow-yellow-500/10",
        status: "CAUTION",
        statusColor: "text-yellow-400 bg-yellow-500/20",
      }
    case "error":
      return {
        container: "bg-slate-900/70 border-red-500/30 shadow-red-500/20",
        accent: "bg-red-500/50",
        icon: "text-red-400",
        title: "text-red-300",
        content: "text-slate-300",
        glow: "shadow-lg shadow-red-500/10",
        status: "CRITICAL",
        statusColor: "text-red-400 bg-red-500/20",
      }
    case "success":
      return {
        container: "bg-slate-900/70 border-green-500/30 shadow-green-500/20",
        accent: "bg-green-500/50",
        icon: "text-green-400",
        title: "text-green-300",
        content: "text-slate-300",
        glow: "shadow-lg shadow-green-500/10",
        status: "CONFIRMED",
        statusColor: "text-green-400 bg-green-500/20",
      }
    default:
      return {
        container: "bg-slate-900/70 border-slate-500/30 shadow-slate-500/20",
        accent: "bg-slate-500/50",
        icon: "text-slate-400",
        title: "text-slate-300",
        content: "text-slate-300",
        glow: "shadow-lg shadow-slate-500/10",
        status: "NOTICE",
        statusColor: "text-slate-400 bg-slate-500/20",
      }
  }
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    if (type === "warn") type = "warning"
    if ((type as unknown) === "tip") type = "info"

    const theme = getCalloutTheme(type)

    const getIcon = () => {
      if (icon) return icon

      switch (type) {
        case "info":
          return <Radio className={`w-5 h-5 ${theme.icon}`} />
        case "warning":
          return <AlertTriangle className={`w-5 h-5 ${theme.icon}`} />
        case "error":
          return <CircleX className={`w-5 h-5 ${theme.icon}`} />
        case "success":
          return <CheckCircle2 className={`w-5 h-5 ${theme.icon}`} />
        default:
          return <Info className={`w-5 h-5 ${theme.icon}`} />
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex gap-4 my-6 rounded-lg border backdrop-blur-sm p-4 text-sm overflow-hidden",
          theme.container,
          theme.glow,
          className
        )}
        {...props}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accent} rounded-r-sm`}
        >
          <div
            className={`absolute inset-0 ${theme.accent} animate-pulse opacity-60`}
          />
        </div>

        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-mono px-2 py-1 rounded-full ${theme.statusColor} border border-current/30`}
          >
            {theme.status}
          </span>
        </div>

        <div className="flex-shrink-0 mt-0.5">
          <div
            className={`p-2 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-current/20 ${theme.icon}`}
          >
            {getIcon()}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2 min-w-0 flex-1">
          {title && (
            <div className="flex items-center gap-2">
              <p
                className={`font-semibold font-mono uppercase tracking-wide text-sm ${theme.title} !my-0`}
              >
                {title}
              </p>
            </div>
          )}
          <div
            className={`${theme.content} prose-no-margin empty:hidden leading-relaxed`}
          >
            {children}
          </div>
        </div>

        <div
          className={`absolute inset-0 pointer-events-none opacity-5 ${theme.accent} rounded-lg`}
        />
      </div>
    )
  }
)

Callout.displayName = "Callout"
