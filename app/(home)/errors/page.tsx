import Link from "next/link"
import { errors } from "@/lib/source"
import Image from "next/image"
import { cn } from "@/lib/cn"

export default function ErrorsPage() {
  const posts = errors.getPages()
  const postsByCategory = posts.reduce(
    (acc, post) => {
      const slug = post.slugs
      const category = slug[0] || "uncategorized"
      if (!acc[category]) acc[category] = []
      acc[category].push(post)
      return acc
    },
    {} as Record<string, typeof posts>
  )

  return (
    <main className="flex flex-col h-full items-center px-4 py-12 text-white overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-medium mb-4 leading-[1.2]">
          Errors
        </h1>
      </div>

      <section className="max-w-xl w-full">
        {Object.entries(postsByCategory).map(([category, posts], index) => {
          return (
            <section key={index} className="max-w-xl w-full justify-between">
              <h2
                className={cn(
                  "font-bold uppercase tracking-wide text-fd-muted-foreground",
                  index > 0 && "mt-4"
                )}
              >
                {category.replace(/-/g, " ")}
              </h2>
              <div className="flex flex-col gap-6">
                {posts.map((post) => {
                  return (
                    <Link
                      key={post.url}
                      href={post.url}
                      className="flex items-start justify-between transition-colors hover:bg-fd-muted/30 rounded-xl mt-4"
                    >
                      <div>
                        <p className="mb-2 text-fd-muted-foreground">
                          {new Date(post.data.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <div className="flex w-full">
                          <p className="text-xl">
                            {post.data.title}: {post.data.description}
                          </p>
                        </div>
                      </div>
                      <Image
                        width={150}
                        height={150}
                        src={post.data.thumbnail}
                        alt="thumbnail"
                        className="rounded-2xl ml-4 aspect-square object-cover"
                      />
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </section>
    </main>
  )
}
