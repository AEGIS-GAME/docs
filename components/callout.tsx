import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../lib/cn"
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react"

type CalloutProps = Omit<HTMLAttributes<HTMLDivElement>, "title" | "type"> & {
  title?: ReactNode
  /**
   * @defaultValue info
   */
  type?: "info" | "error" | "tip" | "warning"
}

const getCalloutTheme = (type: string) => {
  switch (type) {
    case "info":
      return {
        container: "bg-blue-200",
        border: "border-blue-400",
        icon: <Info className="w-5 h-5 text-blue-600" />,
      }
    case "warning":
      return {
        container: "bg-yellow-200",
        border: "border-yellow-400",
        icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      }
    case "error":
      return {
        container: "bg-red-200",
        border: "border-red-400",
        icon: <XCircle className="w-5 h-5 text-red-600" />,
      }
    case "success":
      return {
        container: "bg-green-200",
        border: "border-green-400",
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      }
    default:
      return {
        container: "bg-blue-200",
        border: "border-blue-400",
        icon: <Info className="w-5 h-5 text-blue-600" />,
      }
  }
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", ...props }, ref) => {
    const theme = getCalloutTheme(type)

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex gap-4 my-6 rounded-2xl border-4 p-4 text-sm overflow-hidden",
          theme.container,
          theme.border,
          className
        )}
        {...props}
      >
        <div className="flex flex-col justify-center gap-2 min-w-0 flex-1">
          {title && (
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">{theme.icon}</span>
              <p className="font-semibold font-mono uppercase tracking-wide text-sm text-black !my-0">
                {title}
              </p>
            </div>
          )}
          <div className="prose-no-margin empty:hidden leading-relaxed text-gray-600">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Callout.displayName = "Callout"
