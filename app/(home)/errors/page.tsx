import Link from "next/link"
import { errors } from "@/lib/source"
import { NebulaBackground } from "@/components/nebula"
import {
  AlertTriangle,
  Zap,
  Shield,
  AlertOctagon,
  Bug,
  Activity,
  Wifi,
  Eye,
} from "lucide-react"

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

  const systemStatus = [
    { system: "LUMEN CORE", status: "CRITICAL", level: 23 },
    { system: "TELEPORTER ARRAY", status: "WARNING", level: 67 },
    { system: "LIFE SUPPORT", status: "NOMINAL", level: 94 },
    { system: "DEFENSE GRID", status: "OFFLINE", level: 0 },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "connection":
        return Wifi
      case "authentication":
        return Shield
      case "system":
        return Bug
      case "critical":
        return AlertOctagon
      default:
        return AlertTriangle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return "text-red-400 bg-red-500/20"
      case "WARNING":
        return "text-yellow-400 bg-yellow-500/20"
      case "NOMINAL":
        return "text-green-400 bg-green-500/20"
      case "OFFLINE":
        return "text-gray-400 bg-gray-500/20"
      default:
        return "text-red-400 bg-red-500/20"
    }
  }

  return (
    <main className="relative flex flex-col h-full items-center px-4 py-12 text-white overflow-hidden">
      <NebulaBackground gradient="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950" />

      <div className="hidden sm:absolute top-4 left-4 right-4 z-20 sm:flex justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-2 bg-red-900/80 backdrop-blur px-3 py-1 rounded border border-red-500/50">
          <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
          <span className="text-red-400">DIAGNOSTIC MODE ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-red-500/30">
          <div className="flex items-center gap-1">
            <Bug className="w-3 h-3 text-red-400" />
            <span className="text-red-400">
              ANOMALIES: {Object.keys(postsByCategory).length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400">VOIDSEERS DETECTED</span>
          </div>
        </div>
      </div>

      <header className="relative z-10 mb-12 text-center mt-12">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <AlertOctagon className="w-20 h-20 text-red-400 motion-safe:animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 -translate-x-2 -translate-y-2 border border-red-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
            <div className="absolute inset-0 w-28 h-28 -translate-x-4 -translate-y-4 border border-orange-500/20 rounded-full animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 w-32 h-32 -translate-x-6 -translate-y-6 border border-red-400/10 rounded-full animate-ping" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-widest text-red-400 drop-shadow-md mb-2">
          System Diagnostics
        </h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-red-400 animate-pulse" />
          <p className="text-xs font-mono uppercase tracking-wider text-red-300">
            Anomaly Detection & Operational Restoration
          </p>
          <Zap className="w-4 h-4 text-red-400 animate-pulse" />
        </div>

        <p className="max-w-xl mx-auto text-red-200 text-sm sm:text-base leading-relaxed mb-6">
          Troubleshoot frequent issues encountered during missions. Stay alert, resolve
          anomalies, and maintain station integrity.
        </p>

        <div className="text-xs font-mono text-red-400 bg-red-900/50 rounded px-3 py-1 border border-red-500/50 inline-block">
          ALERT: Multiple system failures detected • Voidseers interference suspected
        </div>
      </header>

      <div className="relative z-10 w-full max-w-4xl mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {systemStatus.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/70 backdrop-blur border border-red-500/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-4 h-4 text-red-400" />
                <span
                  className={`text-xs px-2 py-1 rounded font-mono ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </div>
              <h3 className="text-xs font-mono text-red-300 mb-1">{item.system}</h3>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    item.level > 80
                      ? "bg-green-400"
                      : item.level > 50
                        ? "bg-yellow-400"
                        : item.level > 0
                          ? "bg-red-400"
                          : "bg-gray-600"
                  }`}
                  style={{ width: `${item.level}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 font-mono">{item.level}%</span>
            </div>
          ))}
        </div>
      </div>

      <section className="relative z-10 max-w-6xl w-full">
        {Object.entries(postsByCategory).map(([category, posts]) => {
          const CategoryIcon = getCategoryIcon(category)
          return (
            <section key={category} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-900/50 rounded-lg border border-red-500/30">
                  <CategoryIcon className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-wide text-red-400">
                  {category.replace(/-/g, " ")}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent" />
                <span className="text-xs font-mono text-red-400 bg-red-900/30 px-2 py-1 rounded">
                  {posts.length} ISSUES
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <Link
                    key={post.url}
                    href={post.url}
                    className="group relative flex flex-col gap-3 p-6 rounded-lg border border-red-600/20 bg-slate-900/70 backdrop-blur-sm
                      hover:border-red-400/60 hover:bg-red-900/30
                      transition-all duration-300
                      shadow-md shadow-red-800/30 hover:shadow-lg hover:shadow-red-500/20
                      overflow-hidden
                    "
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-1 group-hover:animate-pulse" />
                      <div className="text-xs font-mono text-red-500 bg-red-900/30 px-2 py-1 rounded">
                        ERROR-{String(index + 1).padStart(3, "0")}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-red-300 group-hover:text-red-400/90 transition-colors">
                      {post.data.title}
                    </h3>
                    <p className="text-sm text-red-400/80 group-hover:text-red-300/90 transition-colors leading-relaxed">
                      {post.data.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-red-400">
                          UNRESOLVED
                        </span>
                      </div>
                      <span className="text-xs text-red-500/60 font-mono">
                        PRIORITY: HIGH
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </section>

      <div className="relative z-10 mt-16 flex flex-col items-center gap-4 text-slate-400 text-xs">
        <div className="flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent w-20"></div>
          <div className="flex items-center gap-2 font-mono tracking-wider uppercase">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-nowrap">Emergency Protocols Active</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent w-20"></div>
        </div>

        <div className="text-center max-w-md">
          <p className="text-red-500 text-xs italic">
            &quot;In the void between stars, every system failure could mean the
            difference between salvation and oblivion.&quot;
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Emergency Diagnostics • Sector Alert Level: CRITICAL
          </p>
        </div>
      </div>
    </main>
  )
}
