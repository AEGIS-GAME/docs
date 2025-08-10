import { notFound } from "next/navigation"
import Link from "next/link"
import { getMDXComponents } from "@/mdx-components"
import { InlineTOC } from "@/components/inline-toc"
import { guides } from "@/lib/source"
import { NebulaBackground } from "@/components/nebula"
import {
  ArrowLeft,
  User,
  Calendar,
  Shield,
  BookOpen,
  Navigation,
  Eye,
  CheckCircle,
} from "lucide-react"

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const page = guides.getPage([params.slug])

  if (!page) notFound()
  const Mdx = page.data.body

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <NebulaBackground gradient="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

      <div className="relative z-20 p-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">PROTOCOL ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">CLEARANCE: VERIFIED</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400">STATUS: CLASSIFIED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-slate-900/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6 text-sm font-mono">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">AEGIS</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">NAVIGATION-CHARTS</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400">{params.slug.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-cyan-900/50 rounded-full border border-cyan-500/50 text-xs font-mono text-cyan-300">
              DEPLOYMENT PROTOCOL
            </div>
            <div className="px-3 py-1 bg-green-900/50 rounded-full border border-green-500/50 text-xs font-mono text-green-300">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              FIELD VERIFIED
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
            {page.data.title}
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            {page.data.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-4 h-4" />
              <span>Author:</span>
              <span className="text-cyan-300 font-medium">{page.data.author}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>Classification:</span>
              <span className="text-blue-300 font-mono">TACTICAL-7</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>Department:</span>
              <span className="text-green-300 font-mono">FIELD-OPS</span>
            </div>
          </div>

          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 
              border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg text-cyan-300 hover:text-cyan-200
              transition-all duration-200 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Navigation Charts
          </Link>
        </div>
      </div>

      <article className="relative z-10 container mx-auto px-4 pb-12">
        <div className="flex flex-col gap-8">
          <div className="flex-shrink-0">
            <div className="prose-sm">
              <InlineTOC items={page.data.toc} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-cyan-300 font-mono">
                      PROTOCOL DOCUMENTATION
                    </h2>
                    <p className="text-xs text-slate-400">
                      Classified tactical operations manual
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400">LIVE DOCUMENT</span>
                </div>
              </div>

              <Mdx components={getMDXComponents()} />
            </div>
          </div>
        </div>
      </article>

      <div className="relative z-10 mt-16 py-8 border-t border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4 text-slate-400 text-xs">
            <div className="flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-20"></div>
              <div className="flex items-center gap-2 font-mono tracking-wider uppercase">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400">End of Protocol</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-20"></div>
            </div>
            <p className="text-slate-500 text-xs italic">
              &quot;Knowledge shared saves lives, every protocol a beacon through
              uncertainty.&quot;
            </p>
            <p className="text-slate-600 text-xs">
              AEGIS Navigation Division • Sector 7-Alpha • Galactic Standard Time
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams(): { slug: string }[] {
  return guides.getPages().map((page) => ({
    slug: page.slugs[0],
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const page = guides.getPage([params.slug])
  if (!page) notFound()
  return {
    title: page.data.title,
    description: page.data.description,
  }
}
