import Link from "next/link"
import { guides } from "@/lib/source"
import { NebulaBackground } from "@/components/nebula"
import {
  Compass,
  Stars,
  Navigation,
  Map,
  Target,
  BookOpen,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  Navigation2,
} from "lucide-react"

export default function GuidesPage() {
  const posts = guides.getPages()

  const missionStats = [
    { label: "ACTIVE PROTOCOLS", value: posts.length, icon: BookOpen },
    { label: "DEPLOYMENT ZONES", value: "7", icon: Target },
    { label: "SUCCESS RATE", value: "94.2%", icon: Shield },
    { label: "LUMEN EFFICIENCY", value: "87%", icon: Zap },
  ]

  const getGuideIcon = (index: number) => {
    const icons = [Navigation, Map, Compass, Target, BookOpen, Stars]
    return icons[index % icons.length]
  }

  return (
    <main className="relative flex flex-col h-full items-center px-4 py-12 text-white overflow-hidden">
      <NebulaBackground gradient="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />

      <div className="hidden sm:absolute top-4 left-4 right-4 z-20 sm:flex justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-400">NAVIGATION CHARTS ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-green-400" />
            <span className="text-green-400">PROTOCOLS: {posts.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400">STATUS: CLASSIFIED</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center mb-12 mt-12">
        <div className="relative w-32 h-32 flex items-center justify-center mx-auto mb-4">
          <Navigation2 className="w-16 h-16 text-cyan-400 motion-safe:animate-[spin_15s_linear_infinite]" />
          <div className="absolute w-24 h-24 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
          <div className="absolute w-28 h-28 border border-indigo-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-32 h-32 border border-cyan-400/10 rounded-full animate-ping" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 text-cyan-300">
          <Stars className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider">
            Strategic Deployment Protocols
          </span>
          <Stars className="w-4 h-4 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-4 leading-[1.2]">
          Navigation Charts
        </h1>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-16"></div>
          <p className="text-xs font-mono uppercase tracking-wider text-indigo-300">
            Integration & Field Operations Manual
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-16"></div>
        </div>

        <p className="text-sm sm:text-base max-w-2xl mx-auto text-slate-300 leading-relaxed mb-6">
          Field-tested guides to optimize deployment strategies, streamline
          integrations, and ensure mission success across galactic zones.
        </p>

        <div className="text-xs font-mono text-blue-400 bg-slate-900/50 rounded px-3 py-1 border border-blue-500/30 inline-block">
          CLEARANCE LEVEL: CLASSIFIED • For AEGIS Personnel Only
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {missionStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="bg-slate-900/70 backdrop-blur border border-cyan-500/30 rounded-lg p-4 text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <IconComponent className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div className="text-lg font-bold text-cyan-300 font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 font-mono">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-cyan-900/50 rounded-lg border border-cyan-500/30">
            <Map className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-cyan-300">DEPLOYMENT PROTOCOLS</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
          <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">
            {posts.length} ACTIVE
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const GuideIcon = getGuideIcon(index)
            return (
              <Link
                key={post.url}
                href={post.url}
                className="group relative flex flex-col gap-4 p-6 rounded-lg border border-cyan-500/20 
                bg-slate-900/60 backdrop-blur-sm
                hover:bg-slate-800/80 hover:border-cyan-400/50
                transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20
                overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border border-cyan-500/30 group-hover:border-cyan-400/50 transition-colors">
                      <GuideIcon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div className="text-xs font-mono text-cyan-500 bg-cyan-900/30 px-2 py-1 rounded">
                      GUIDE-{String(index + 1).padStart(3, "0")}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-200 group-hover:text-cyan-300 transition-colors mb-2">
                    {post.data.title}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                    {post.data.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-green-400">VERIFIED</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Sparkles className="w-3 h-3" />
                    <span>FIELD TESTED</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 mt-16 flex flex-col items-center gap-4 text-slate-400 text-xs">
        <div className="flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-20"></div>
          <div className="flex items-center gap-2 font-mono tracking-wider uppercase">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400">Navigation Division</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-20"></div>
        </div>

        <div className="text-center max-w-md">
          <p className="text-slate-500 text-xs italic">
            &quot;Charted paths save lives, every guide a light through the void.&quot;
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Logged from Orbital Relay Node • Cerulean Grid 7.429.1
          </p>
        </div>
      </div>
    </main>
  )
}
