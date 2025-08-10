import { createMDX } from "fumadocs-mdx/next"
import { readFileSync } from "fs"

const withMDX = createMDX()
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"))

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  distDir: "build",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  basePath: process.env.NODE_ENV === "production" ? "/aegis-docs" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  publicRuntimeConfig: {
    VERSION: pkg.version,
  },
}

export default withMDX(config)
