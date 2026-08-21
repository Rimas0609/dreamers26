"use client"

import { useMemo } from "react"

type Bubble = {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

export function Bubbles({ count = 22 }: { count?: number }) {
  const bubbles = useMemo<Bubble[]>(() => {
    // Deterministic-ish spread so bubbles are evenly distributed across the width
    return Array.from({ length: count }).map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280
      const rnd = seed / 233280
      const rnd2 = ((i * 4517 + 12345) % 100) / 100
      return {
        left: (i / count) * 100 + rnd2 * 6,
        size: 6 + rnd * 22,
        duration: 9 + rnd2 * 12,
        delay: -rnd * 18,
        drift: -20 + rnd * 40,
        opacity: 0.25 + rnd2 * 0.4,
      }
    })
  }, [count])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full animate-bubble-rise"
          style={
            {
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              background:
                "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), rgba(255,255,255,0.28) 45%, rgba(255,255,255,0.05) 72%)",
              boxShadow: "inset 0 0 6px rgba(255,255,255,0.5)",
              "--b-drift": `${b.drift}px`,
              "--b-opacity": b.opacity,
              "--b-scale": 1,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
