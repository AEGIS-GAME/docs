import Link from "next/link"
import { guides } from "@/lib/source"
import Image from "next/image"

export default function GuidesPage() {
  const posts = guides.getPages()

  return (
    <main className="flex flex-col h-full items-center px-4 py-12 text-white overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-medium mb-4 leading-[1.2]">
          Guides
        </h1>
      </div>


      <section className="max-w-xl w-full">
        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            return (
              <Link
                key={post.url}
                href={post.url}
                className="flex items-start justify-between transition-colors hover:bg-fd-muted/30 rounded-xl"
              >
                <div>
                  <p className="mb-2 text-fd-muted-foreground">
                    {new Date(post.data.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex justify-between w-full">
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
    </main>
  )
}
