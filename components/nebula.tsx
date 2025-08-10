"use client"

interface NebulaBackgroundProps {
  /** Background gradient */
  gradient?: string
  /** Additional CSS classes */
  className?: string
}

export const NebulaBackground = ({
  gradient = "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950",
  className = "",
}: NebulaBackgroundProps) => {
  const lumenParticles = [
    { id: 0, left: 5, top: 10, delay: 0, duration: 3.5, size: 3 },
    { id: 1, left: 15, top: 40, delay: 1, duration: 4.5, size: 4 },
    { id: 2, left: 30, top: 60, delay: 2, duration: 3.8, size: 2 },
    { id: 3, left: 50, top: 20, delay: 0.5, duration: 4.2, size: 3 },
    { id: 4, left: 70, top: 80, delay: 1.5, duration: 3.7, size: 4 },
    { id: 5, left: 85, top: 50, delay: 3, duration: 4.1, size: 3 },
    { id: 6, left: 90, top: 10, delay: 2.5, duration: 3.6, size: 2 },

    { id: 7, left: 12, top: 15, delay: 1.8, duration: 4.3, size: 3 },
    { id: 8, left: 25, top: 55, delay: 2.1, duration: 3.9, size: 2.5 },
    { id: 9, left: 40, top: 75, delay: 0.7, duration: 4.7, size: 3.5 },
    { id: 10, left: 60, top: 30, delay: 1.2, duration: 3.8, size: 2.8 },
    { id: 11, left: 80, top: 70, delay: 2.9, duration: 4.2, size: 3.2 },
    { id: 12, left: 95, top: 25, delay: 0.3, duration: 4.0, size: 3 },
    { id: 13, left: 8, top: 45, delay: 1.4, duration: 3.5, size: 2.7 },

    { id: 14, left: 22, top: 20, delay: 2.6, duration: 4.1, size: 3.3 },
    { id: 15, left: 38, top: 65, delay: 0.8, duration: 3.7, size: 2.9 },
    { id: 16, left: 55, top: 85, delay: 1.1, duration: 4.6, size: 3.6 },
    { id: 17, left: 72, top: 40, delay: 2.3, duration: 3.9, size: 3 },
    { id: 18, left: 88, top: 60, delay: 0.6, duration: 4.3, size: 2.5 },
    { id: 19, left: 93, top: 15, delay: 1.9, duration: 4.0, size: 3.1 },
    { id: 20, left: 10, top: 35, delay: 0.4, duration: 3.8, size: 2.8 },

    { id: 21, left: 27, top: 50, delay: 1.7, duration: 4.4, size: 3.4 },
    { id: 22, left: 42, top: 78, delay: 2.0, duration: 3.6, size: 2.6 },
    { id: 23, left: 58, top: 25, delay: 0.9, duration: 4.5, size: 3.2 },
    { id: 24, left: 75, top: 55, delay: 1.3, duration: 4.1, size: 3 },
    { id: 25, left: 82, top: 80, delay: 2.8, duration: 3.7, size: 2.9 },
    { id: 26, left: 97, top: 45, delay: 0.2, duration: 4.0, size: 3.3 },
    { id: 27, left: 14, top: 65, delay: 1.6, duration: 3.9, size: 2.7 },

    { id: 28, left: 35, top: 35, delay: 2.4, duration: 4.2, size: 3.1 },
    { id: 29, left: 65, top: 75, delay: 0.5, duration: 3.8, size: 2.8 },
  ]

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 ${gradient} ${className}`}
    >
      {lumenParticles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full opacity-60 animate-pulse bg-gradient-to-r from-cyan-400 to-blue-300`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: "0 0 8px rgba(34, 211, 238, 0.6)",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-900/5 to-transparent opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-900/5 to-transparent opacity-20" />
    </div>
  )
}
