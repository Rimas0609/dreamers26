"use client"

import { useMemo } from "react"

/**
 * Subtle underwater atmosphere layered OVER the artwork:
 * soft light rays near the surface + a few slow drifting particles.
 * Purely decorative and non-interactive.
 */
export function UnderwaterFx({ particleCount = 14 }: { particleCount?: number }) {
  const rays = useMemo(
    () => [
      { left: "12%", width: "10vw", delay: "0s", duration: "10s", opacity: 0.22 },
      { left: "34%", width: "7vw", delay: "-3s", duration: "12s", opacity: 0.3 },
      { left: "52%", width: "12vw", delay: "-1.5s", duration: "9s", opacity: 0.26 },
      { left: "72%", width: "8vw", delay: "-4.5s", duration: "13s", opacity: 0.3 },
      { left: "88%", width: "6vw", delay: "-2s", duration: "11s", opacity: 0.2 },
    ],
    [],
  )

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const seed = (i * 6151 + 2749) % 100
      const seed2 = (i * 3571 + 907) % 100
      return {
        left: (seed / 100) * 96 + 2,
        top: (seed2 / 100) * 96 + 2,
        size: 1.5 + (seed % 3),
        duration: 14 + (seed2 % 12),
        delay: -(seed % 16),
        driftX: -18 + (seed % 36),
        driftY: -40 - (seed2 % 40),
        opacity: 0.25 + (seed2 % 40) / 130,
      }
    })
  }, [particleCount])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Light rays descending from the surface */}
      {rays.map((r, i) => (
        <span
          key={`ray-${i}`}
          className="animate-ray absolute -top-[10%] h-[80%] origin-top mix-blend-screen"
          style={{
            left: r.left,
            width: r.width,
            animationDelay: r.delay,
            animationDuration: r.duration,
            opacity: r.opacity,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.12) 55%, transparent 85%)",
            filter: "blur(6px)",
          }}
        />
      ))}

      {/* Slow drifting motes */}
      {particles.map((p, i) => (
        <span
          key={`p-${i}`}
          className="animate-particle absolute rounded-full bg-white"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 6px rgba(255,255,255,0.7)",
              "--p-x": `${p.driftX}px`,
              "--p-y": `${p.driftY}px`,
              "--p-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
