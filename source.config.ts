import {
  defineConfig,
  defineCollections,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export const guidePosts = defineCollections({
  type: "doc",
  dir: "content/guides",
  schema: frontmatterSchema.extend({
    author: z.string(),
  }),
})

export const errorPosts = defineCollections({
  type: "doc",
  dir: "content/errors",
  schema: frontmatterSchema.extend({
    author: z.string(),
  }),
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },
})
