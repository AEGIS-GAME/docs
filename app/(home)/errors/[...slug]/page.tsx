import { notFound } from "next/navigation"
import Link from "next/link"
import { errors, source } from "@/lib/source"
import { getMDXComponents } from "@/mdx-components"
import { createRelativeLink } from "fumadocs-ui/mdx"

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const page = errors.getPage(params.slug)

  if (!page) notFound()
  const MDX = page.data.body

  return (
    <main className="flex flex-col justify-center items-center max-w-3xl mx-auto min-h-screen px-4 py-12 text-white overflow-hidden">
      <div className="flex flex-col items-start text-center mb-12">
        <div className="flex flex-wrap justify-between w-full">
          <p className="mb-2 text-fd-muted-foreground">
            {new Date(page.data.date).toLocaleDateString("en-CA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mb-2 text-fd-muted-foreground">
            By {page.data.author}
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl text-left font-medium mb-4 leading-[1.2]">
          {page.data.title}: {page.data.description}
        </h1>
      </div>

      <article className="max-w-3xl">
        <MDX components={getMDXComponents({
          a: createRelativeLink(source, page)
        })} />
      </article>
    </main>
  )
}

export function generateStaticParams(): { slug: string[] }[] {
  return errors.getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const page = errors.getPage(params.slug)

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
