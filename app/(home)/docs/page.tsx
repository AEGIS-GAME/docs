import Link from "next/link"
import { BookOpen, FileText, Code, Zap, ArrowRight } from "lucide-react"
import { NebulaBackground } from "@/components/nebula"
import getConfig from "next/config"

const docCategories = [
  {
    title: "Getting Started",
    description: "Initial setup protocols and basic system configuration.",
    href: "/docs/getting-started/installation",
    icon: Zap,
    status: "ESSENTIAL",
  },
  {
    title: "API Reference",
    description: "Complete command protocols and system interface documentation.",
    href: "/docs/api",
    icon: Code,
    status: "COMPLETE",
  },
  // {
  //   title: 'Changelog',
  //   description: 'Track updates, fixes, and new features in each release.',
  //   href: '/docs/changelog',
  //   icon: FileText,
  //   status: 'UPDATED',
  // }
]

export default function DocsIndexPage() {
  const { publicRuntimeConfig } = getConfig()

  const verstionToStardate = (version: string) => {
    const parts = version.split(".").map(Number)
    return (parts[0] * 1000 + parts[1] * 100 + parts[2]).toFixed(1)
  }

  return (
    <main className="relative flex h-full flex-col px-4 py-12 text-white overflow-hidden">
      <NebulaBackground gradient="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="hidden sm:absolute top-4 left-4 right-4 z-20 sm:flex justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-400">DOCS ARCHIVE</span>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-green-400" />
            <span className="text-green-400">ARTICLES: 247</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400">API REFS: 89</span>
          </div>
          <div className="text-slate-400">LAST SYNC: 2 HOURS AGO</div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-16 h-16 text-cyan-400" />
            <div className="absolute w-24 h-24 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
            <div className="absolute w-28 h-28 border border-indigo-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-32 h-32 border border-cyan-400/10 rounded-full animate-ping" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent mb-2">
            Mission Documentation
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Comprehensive operational manuals and technical references for AEGIS station
            personnel. Access protocols, system documentation, and field procedures.
          </p>

          <div className="text-xs font-mono text-blue-400 bg-slate-900/50 rounded px-4 py-2 border border-blue-500/30 inline-block">
            DOCUMENTATION VERSION {publicRuntimeConfig?.VERSION} • LAST UPDATED:
            STARDATE {verstionToStardate(publicRuntimeConfig.VERSION || "0.0.0")}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {docCategories.map(({ title, description, href, icon: Icon, status }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-lg border border-cyan-500/30
              bg-slate-900/60 backdrop-blur-sm hover:bg-slate-800/80 hover:border-cyan-400/50
              transition-all duration-300 p-6 hover:shadow-lg hover:shadow-cyan-500/20
              hover:scale-[1.02] transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border border-cyan-500/30">
                  <Icon className="w-6 h-6 text-cyan-300" />
                </div>
                <span
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    status === "ESSENTIAL"
                      ? "bg-green-500/20 text-green-400"
                      : status === "COMPLETE"
                        ? "bg-blue-500/20 text-blue-400"
                        : status === "UPDATED"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2">
                {title}
              </h3>

              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors mb-4 flex-grow">
                {description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-green-400">AVAILABLE</span>
                </div>
                <div className="flex items-center text-cyan-400 text-sm font-medium">
                  <span>Access</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-24"></div>
            <div className="flex items-center gap-2 font-mono tracking-wider uppercase text-xs">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400">Knowledge Archive</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-24"></div>
          </div>

          <p className="text-slate-500 text-xs italic mb-2">
            &quot;Information is the currency of survival in the void.&quot;
          </p>

          <div className="text-slate-600 text-xs space-y-1">
            <p>Documentation maintained by AEGIS Technical Archives Division</p>
            <p>For support, contact Station Library at frequency 7.429.DOC</p>
          </div>
        </div>
      </div>
    </main>
  )
}
