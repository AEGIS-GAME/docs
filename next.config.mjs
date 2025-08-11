import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

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
}

export default withMDX(config)
