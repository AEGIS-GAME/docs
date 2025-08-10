import { notFound } from "next/navigation"
import Link from "next/link"
import { InlineTOCError } from "@/components/inline-toc-error"
import { errors } from "@/lib/source"
import { NebulaBackground } from "@/components/nebula"
import { ArrowLeft, AlertTriangle, Cpu, Eye, HardDrive, Shield } from "lucide-react"
import { getMDXComponents } from "@/mdx-components"

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const page = errors.getPage(params.slug)

  if (!page) notFound()
  const Mdx = page.data.body

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <NebulaBackground gradient="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950" />

      <div className="relative z-20 p-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 bg-red-900/80 backdrop-blur px-3 py-1 rounded border border-red-500/30">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400">DIAGNOSTIC UPLINK</span>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">SECURITY: VERIFIED</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400">ACCESS LEVEL: ENGINEERING</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-slate-900/70 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6 text-sm font-mono">
            <HardDrive className="w-4 h-4 text-red-400" />
            <span className="text-slate-400">AEGIS</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">SYSTEM-DIAGNOSTICS</span>
            <span className="text-slate-600">/</span>
            <span className="text-red-400">
              {params.slug[params.slug.length - 1].toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-red-900/50 rounded-full border border-red-500/50 text-xs font-mono text-red-300">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              ERROR CONFIRMED
            </div>
            <div className="px-3 py-1 bg-yellow-900/50 rounded-full border border-yellow-500/50 text-xs font-mono text-yellow-300">
              SEVERITY: CRITICAL
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent mb-4 leading-tight">
            {page.data.title}
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            {page.data.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className="w-4 h-4" />
              <span>Subsystem:</span>
              <span className="text-red-300 font-medium">
                {params.slug[0].toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>

          <Link
            href="/errors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 
              border border-red-500/30 hover:border-red-400/50 rounded-lg text-red-300 hover:text-red-200
              transition-all duration-200 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Diagnostics Index
          </Link>
        </div>
      </div>

      <article className="relative z-10 container mx-auto px-4 pb-12">
        <div className="flex flex-col gap-8">
          <div className="flex-shrink-0">
            <div className="prose-sm">
              <InlineTOCError items={page.data.toc} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-red-700/50 rounded-xl p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-300 font-mono">
                      SYSTEM ERROR REPORT
                    </h2>
                    <p className="text-xs text-slate-400">
                      Automated fault analysis & recovery recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-yellow-400">LIVE DIAGNOSTIC</span>
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
              <div className="h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent w-20"></div>
              <div className="flex items-center gap-2 font-mono tracking-wider uppercase">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-400">End of Diagnostic Report</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent w-20"></div>
            </div>
            <p className="text-slate-500 text-xs italic">
              &quot;Every anomaly is a message. Every error a path to
              understanding.&quot;
            </p>
            <p className="text-slate-600 text-xs">
              AEGIS Engineering Division • Fault Monitoring Node • Galactic Standard
              Time
            </p>
          </div>
        </div>
      </div>
    </div>
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
