"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Bubbles } from "@/components/bubbles"
import { UnderwaterFx } from "@/components/underwater-fx"
import { WelcomeModal } from "@/components/welcome-modal"

// ==========================================
// OPTIONAL NO BUTTON ESCAPE SOUND
// ==========================================
// const ESCAPE_SOUND = "/sounds/no-escape.mp3";
const ESCAPE_SOUND = ""

const SAFE_MARGIN = 20 // keep the fleeing button this far from every edge
const YES_GAP = 24 // keep the NO button clear of the YES button

export function UnderwaterExperience() {
  const [modalOpen, setModalOpen] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const [fled, setFled] = useState(false)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })

  const noRef = useRef<HTMLButtonElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Prepare the optional escape sound once (only if a source is provided)
  useEffect(() => {
    if (ESCAPE_SOUND && typeof Audio !== "undefined") {
      audioRef.current = new Audio(ESCAPE_SOUND)
      audioRef.current.volume = 0.5
    }
  }, [])

  // Pick a viewport-safe position that stays fully visible and clear of the YES button
  const computeSafePosition = useCallback(() => {
    const btn = noRef.current
    if (!btn) return { x: SAFE_MARGIN, y: SAFE_MARGIN }

    const bw = btn.offsetWidth
    const bh = btn.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    const minX = SAFE_MARGIN
    const minY = SAFE_MARGIN
    const maxX = Math.max(minX, vw - bw - SAFE_MARGIN)
    const maxY = Math.max(minY, vh - bh - SAFE_MARGIN)

    const yes = yesRef.current?.getBoundingClientRect()

    for (let attempt = 0; attempt < 24; attempt++) {
      const x = minX + Math.random() * (maxX - minX)
      const y = minY + Math.random() * (maxY - minY)

      if (yes) {
        const overlapsYes =
          x < yes.right + YES_GAP &&
          x + bw > yes.left - YES_GAP &&
          y < yes.bottom + YES_GAP &&
          y + bh > yes.top - YES_GAP
        if (overlapsYes) continue
      }
      return { x: Math.round(x), y: Math.round(y) }
    }
    // Fallback: a corner that is always inside the viewport
    return { x: maxX, y: minY }
  }, [])

  const flee = useCallback(() => {
    setNoPos(computeSafePosition())
    setFled(true)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      void audioRef.current.play().catch(() => {})
    }
  }, [computeSafePosition])

  // Keep the fleeing button inside the viewport on resize / orientation change
  useEffect(() => {
    if (!fled) return
    const onResize = () => setNoPos(computeSafePosition())
    window.addEventListener("resize", onResize)
    window.addEventListener("orientationchange", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
    }
  }, [fled, computeSafePosition])

  const handleYes = useCallback(() => {
    setCelebrating(true)
    window.setTimeout(() => {
      setCelebrating(false)
      setModalOpen(true)
    }, 550)
  }, [])

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      {/* Responsive artwork — mobile (<=767px) vs tablet/desktop (>=768px). Original art + typography preserved. */}
      <div className="animate-water absolute inset-0">
        <picture aria-hidden="true">
          <source media="(max-width: 767px)" srcSet="/images/underwater-mobile.jpg" />
          <img
            src="/images/underwater-desktop.jpg"
            alt=""
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* Accessible description of the artwork's baked-in headline (not rendered visually) */}
      <h1 className="sr-only">Are you ready to join the College of Dreamers?</h1>

      {/* Atmosphere layered over the art */}
      <UnderwaterFx />
      <Bubbles count={20} />

      {/* Interaction area — anchored low so buttons sit below the question and above the seabed detail */}
      <div className="absolute inset-x-0 bottom-0 top-[60%] z-10 flex flex-col items-center justify-center px-6 sm:top-[64%]">
        <div className="flex w-full max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {/* YES — primary CTA, opens the welcome video immediately */}
          <button
            ref={yesRef}
            onClick={handleYes}
            className={`group relative inline-flex items-center justify-center rounded-full px-10 py-3.5 font-serif text-base tracking-[0.12em] text-[oklch(0.34_0.08_255)] outline-none transition-transform duration-300 hover:scale-[1.05] focus-visible:ring-2 focus-visible:ring-white/80 sm:text-lg ${
              celebrating ? "animate-pop" : ""
            }`}
            style={{
              background:
                "linear-gradient(150deg, oklch(0.98 0.02 320) 0%, oklch(0.92 0.045 345) 42%, oklch(0.88 0.055 195) 100%)",
              boxShadow:
                "0 12px 34px -10px oklch(0.72 0.08 340 / 0.85), 0 0 22px -4px oklch(0.9 0.05 320 / 0.7), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -3px 9px rgba(150,95,150,0.22)",
            }}
          >
            <span
              aria-hidden="true"
              className="animate-shimmer absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(60% 55% at 32% 22%, rgba(255,255,255,0.9), transparent 62%)",
              }}
            />
            <span className="relative whitespace-nowrap">{"YES, I'M READY"}</span>
          </button>

          {/* NO — genuinely flees from pointer + touch, always staying inside the viewport */}
          <button
            ref={noRef}
            onPointerEnter={flee}
            onPointerDown={(e) => {
              e.preventDefault()
              flee()
            }}
            onFocus={flee}
            disabled={celebrating || modalOpen}
            aria-label="No, not yet — this button keeps swimming away"
            className="inline-flex touch-none select-none items-center justify-center whitespace-nowrap rounded-full px-9 py-3.5 font-serif text-base tracking-[0.12em] text-[oklch(0.97_0.02_320)] outline-none transition-[left,top,transform] duration-300 ease-out sm:text-lg"
            style={{
              position: fled ? "fixed" : "relative",
              left: fled ? noPos.x : undefined,
              top: fled ? noPos.y : undefined,
              zIndex: 30,
              background:
                "linear-gradient(150deg, oklch(0.7 0.07 220 / 0.55), oklch(0.55 0.09 245 / 0.6))",
              border: "1px solid oklch(0.95 0.02 320 / 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow:
                "0 10px 26px -12px rgba(10,40,80,0.85), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            {"NO, NOT YET"}
          </button>
        </div>
      </div>

      <WelcomeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
