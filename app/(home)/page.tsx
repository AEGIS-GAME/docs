"use client"

import Link from "next/link"
import {
  BookText,
  Rocket,
  Compass,
  Bug,
  Stars,
  Satellite,
  Users,
  Eye,
  Sparkle,
} from "lucide-react"
import { NebulaBackground } from "@/components/nebula"
import { useEffect, useState } from "react"
import AegisVersion from "@/components/aegis-version"

const cards = [
  {
    title: "Mission Control (Docs)",
    description: "Initialize station systems and begin rescue operations.",
    href: "/docs",
    icon: Rocket,
    status: "OPERATIONAL",
  },
  {
    title: "Command Manual (API)",
    description: "Agent protocols and system reference documentation.",
    href: "/docs/api",
    icon: BookText,
    status: "UPDATED",
  },
  {
    title: "Navigation Charts (Guides)",
    description: "Strategic deployment maps and integration protocols.",
    href: "/guides",
    icon: Compass,
    status: "CLASSIFIED",
  },
  {
    title: "System Diagnostics",
    description: "Anomaly detection and operational restoration tools.",
    href: "/errors",
    icon: Bug,
    status: "MONITORING",
  },
]

export default function HomePage() {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVersion() {
      try {
        const res = await fetch("https://pypi.org/pypi/aegis-game/json")
        if (!res.ok) throw new Error("Failed to fetch version")
        const data = await res.json()
        setVersion(data.info.version)
      } catch {
        setVersion(null)
      }
    }
    fetchVersion()
  }, [])

  return (
    <main className="relative flex h-full flex-col items-center justify-center px-4 py-12 text-white overflow-hidden">
      <NebulaBackground gradient="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950" />

      <div className="hidden sm:absolute top-11 left-4 right-4 z-20 sm:flex justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400">AEGIS OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded border border-cyan-500/30">
          <div className="flex items-center gap-1">
            <Sparkle className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400">LUMENS: 1,247</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400">AGENTS: 12</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-red-400" />
            <span className="text-red-400">VOIDSEERS: 3</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Satellite className="w-20 h-20 text-cyan-400 motion-safe:animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 w-24 h-24 -translate-x-2 -translate-y-2 border border-cyan-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
            <div className="absolute inset-0 w-28 h-28 -translate-x-4 -translate-y-4 border border-purple-500/20 rounded-full animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 w-32 h-32 -translate-x-6 -translate-y-6 border border-cyan-400/10 rounded-full animate-ping" />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
          AEGIS
        </h1>

        <div className="flex items-center justify-center gap-2 my-4">
          <Stars className="w-4 h-4 text-yellow-400 animate-pulse" />
          <p className="text-xs font-mono uppercase tracking-wider text-cyan-300">
            Advanced Exploration & Galaxy-wide Rescue Initiative
          </p>
          <Stars className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>

        <p className="text-sm sm:text-base max-w-2xl mx-auto text-slate-300 leading-relaxed mb-4">
          The galaxy&apos;s last beacon of coordinated rescue operations. Deploy agents,
          manage Lumen reserves, and coordinate life-saving missions across hostile
          regions of space.
        </p>
        {version && <AegisVersion version={version} />}
      </div>

      <div className="z-10 grid gap-4 sm:grid-cols-2 max-w-4xl w-full">
        {cards.map(({ title, description, href, icon: Icon, status }) => (
          <Link
            key={href}
            href={href}
            className="group flex gap-4 items-start rounded-lg border border-cyan-500/30
            bg-slate-900/60 backdrop-blur-sm
            hover:bg-slate-800/80 hover:border-cyan-400/50
            transition-all duration-300 p-4 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border border-cyan-500/30">
              <Icon className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {title}
                </h2>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    status === "OPERATIONAL"
                      ? "bg-green-500/20 text-green-400"
                      : status === "UPDATED"
                      ? "bg-blue-500/20 text-blue-400"
                      : status === "CLASSIFIED"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-300 transition-colors">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative z-10 mt-16 flex flex-col items-center gap-4 text-slate-400 text-xs">
        <div className="flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-20"></div>
          <div className="flex items-center gap-2 font-mono tracking-wider uppercase">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Goobs Initiative</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-20"></div>
        </div>

        <div className="text-center max-w-md">
          <p className="text-slate-500 text-xs italic">
            &quot;Every life saved, every path taken, paid for in Lumens.&quot;
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Stationed within the Cerulean Nebula • Galactic Coordinate 7.429.1
          </p>
        </div>
      </div>
    </main>
  )
}
