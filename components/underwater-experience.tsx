"use client"

import { useCallback, useRef, useState } from "react"
import { Bubbles } from "@/components/bubbles"
import { WelcomeModal } from "@/components/welcome-modal"

export function UnderwaterExperience() {
  const [modalOpen, setModalOpen] = useState(false)
  const [noMoved, setNoMoved] = useState(false)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)
  const areaRef = useRef<HTMLDivElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)

  const teases = [
    "No",
    "Are you sure?",
    "Really?",
    "Think again!",
    "Catch me first!",
    "Not so fast!",
    "The sea says yes",
  ]

  const fleeNo = useCallback(() => {
    const area = areaRef.current
    const btn = noRef.current
    if (!area || !btn) return
    const a = area.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    const maxX = Math.max(40, a.width - b.width - 24)
    const maxY = Math.max(40, a.height - b.height - 24)
    // Random offset relative to the button's natural (centered) position
    const nextX = (Math.random() - 0.5) * maxX
    const nextY = (Math.random() - 0.5) * maxY
    setNoPos({ x: Math.round(nextX), y: Math.round(nextY) })
    setNoMoved(true)
    setDodges((d) => Math.min(d + 1, teases.length - 1))
  }, [teases.length])

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-background">
      {/* Responsive artwork backgrounds — original artwork + typography preserved */}
      <picture aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/images/underwater-mobile.jpg" />
        <img
          src="/images/underwater-desktop.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      </picture>

      {/* Accessible description of the artwork's baked-in headline */}
      <h1 className="sr-only">Are you ready to join the College of Dreamers?</h1>

      {/* Gentle drifting light / shimmer over the whole scene */}
      <div
        aria-hidden="true"
        className="animate-shimmer pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.35), transparent 55%)",
        }}
      />

      <Bubbles count={24} />

      {/* Interaction area anchored to the lower portion so it never covers the artwork's text */}
      <div
        ref={areaRef}
        className="absolute inset-x-0 bottom-0 top-[58%] z-10 flex flex-col items-center justify-end px-6 pb-[7vh] sm:top-[62%] sm:pb-[8vh]"
      >
        <div className="animate-sway mb-5 sm:mb-7">
          <p
            className="text-center font-serif text-sm tracking-[0.18em] text-white sm:text-base"
            style={{ textShadow: "0 2px 12px rgba(20,50,90,0.55)" }}
          >
            CHOOSE YOUR DESTINY
          </p>
        </div>

        <div className="relative flex w-full max-w-md items-center justify-center gap-5 sm:gap-8">
          {/* YES — opens the welcome video immediately */}
          <button
            onClick={() => setModalOpen(true)}
            className="group relative inline-flex items-center gap-2 rounded-full px-9 py-3.5 font-serif text-base tracking-widest text-[oklch(0.35_0.09_240)] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:text-lg"
            style={{
              background:
                "linear-gradient(150deg, oklch(0.98 0.02 320), oklch(0.9 0.05 340) 45%, oklch(0.86 0.06 195))",
              boxShadow:
                "0 10px 30px -8px oklch(0.7 0.08 340 / 0.8), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -3px 8px rgba(140,90,140,0.25)",
            }}
          >
            <span
              aria-hidden="true"
              className="animate-shimmer absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(60% 60% at 30% 20%, rgba(255,255,255,0.85), transparent 60%)",
              }}
            />
            <span className="relative">YES</span>
          </button>

          {/* NO — flees from the cursor */}
          <button
            ref={noRef}
            onMouseEnter={fleeNo}
            onFocus={fleeNo}
            onClick={fleeNo}
            onTouchStart={(e) => {
              e.preventDefault()
              fleeNo()
            }}
            aria-label="No — but this button keeps swimming away"
            className="relative z-20 inline-flex items-center rounded-full px-8 py-3.5 font-serif text-base tracking-widest text-white transition-all duration-300 ease-out focus:outline-none sm:text-lg"
            style={{
              transform: noMoved ? `translate(${noPos.x}px, ${noPos.y}px)` : undefined,
              background: "linear-gradient(150deg, oklch(0.55 0.09 235), oklch(0.46 0.1 250))",
              boxShadow:
                "0 10px 26px -10px rgba(10,40,80,0.9), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            {teases[dodges]}
          </button>
        </div>
      </div>

      <WelcomeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
