"use client"

import { useEffect, useRef } from "react"

// ==========================================
// ADD YOUR WELCOME VIDEO HERE
// ==========================================
// const WELCOME_VIDEO = "/videos/welcome-video.mp4";
const WELCOME_VIDEO = ""

export function WelcomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to the College of Dreamers"
      className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      style={{
        background: "radial-gradient(circle at 50% 35%, rgba(30,70,120,0.55), rgba(12,30,60,0.82))",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="animate-modal-in relative w-full max-w-3xl overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "1px solid oklch(0.97 0.015 320 / 0.5)",
          background: "linear-gradient(180deg, oklch(0.97 0.02 320 / 0.16), oklch(0.62 0.09 225 / 0.2))",
          boxShadow: "0 30px 80px -20px rgba(10,30,60,0.7), inset 0 0 0 1px rgba(255,255,255,0.14)",
        }}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 sm:px-8">
          <div>
            <p className="font-serif text-lg leading-tight tracking-wide text-[oklch(0.98_0.02_320)] sm:text-2xl">
              Welcome, Dreamer
            </p>
            <p className="mt-1 text-xs text-[oklch(0.92_0.03_300)] sm:text-sm">
              You&apos;ve joined the College of Dreamers
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close welcome video"
            className="grid size-9 shrink-0 place-items-center rounded-full text-[oklch(0.98_0.02_320)] transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[oklch(0.42_0.09_235)]">
            {WELCOME_VIDEO ? (
              <video
                className="h-full w-full object-cover"
                src={WELCOME_VIDEO}
                poster="/images/welcome-video-poster.png"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/welcome-video-poster.png"
                  alt="An enchanted underwater palace of the College of Dreamers"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center"
                  style={{ background: "linear-gradient(180deg, rgba(20,50,90,0.05), rgba(20,50,90,0.45))" }}
                >
                  <span
                    className="animate-shimmer grid size-16 place-items-center rounded-full sm:size-20"
                    style={{
                      background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95), oklch(0.86 0.06 350 / 0.85))",
                      boxShadow: "0 0 40px oklch(0.86 0.06 350 / 0.7)",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="oklch(0.42 0.09 235)" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <p className="font-serif text-base tracking-wide text-white drop-shadow sm:text-xl">
                    Your welcome video is on its way
                  </p>
                  <p className="max-w-sm px-6 text-xs text-white/80 sm:text-sm">
                    Add your hosted video link in <code className="rounded bg-white/15 px-1 py-0.5">welcome-modal.tsx</code> and it will play here.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
