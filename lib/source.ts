import { docs, guidePosts, errorPosts } from "@/.source"
import { loader } from "fumadocs-core/source"
import { icons } from "lucide-react"
import { createElement } from "react"
import { createMDXSource } from "fumadocs-mdx"

export const source = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (icon && icon in icons) return createElement(icons[icon as keyof typeof icons])
  },
  source: docs.toFumadocsSource(),
})

export const guides = loader({
  baseUrl: "/guides",
  source: createMDXSource(guidePosts),
})

export const errors = loader({
  baseUrl: "/errors",
  source: createMDXSource(errorPosts),
})
