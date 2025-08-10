import React from "react"
import { Folder, File, FolderOpen } from "lucide-react"
import { cn } from "@/lib/cn"

interface Props {
  name: string
  type?: string
  children?: React.ReactNode
}

const TreeItem = ({ name, type = "file", children }: Props) => {
  return (
    <div
      className={cn(
        "relative",
        children &&
          type === "folder" &&
          "before:absolute before:left-[7px] before:top-7 before:bottom-0 before:w-px before:bg-zinc-500"
      )}
    >
      <div
        className={cn("flex items-center space-x-2 py-1 rounded-md", "cursor-default")}
      >
        {type === "folder" ? (
          children ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )
        ) : (
          <File className="w-4 h-4" />
        )}
        <span className="text-sm">{name}</span>
      </div>
      {children && <div className="pl-6">{children}</div>}
    </div>
  )
}

const Tree = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-fd-card p-1 my-4 border rounded-xl">
      <div className="rounded-lg bg-fd-secondary border p-4">{children}</div>
    </div>
  )
}

export { Tree, TreeItem }
