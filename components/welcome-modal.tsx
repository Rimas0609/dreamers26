"use client"

import { useEffect, useRef } from "react"

// ==========================================
// WELCOME VIDEO
// ==========================================
const WELCOME_VIDEO = "/videos/welcome.mp4"

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
        className="animate-modal-in relative aspect-[9/16] max-h-[90vh] w-fit max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl bg-[oklch(0.42_0.09_235)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "1px solid oklch(0.97 0.015 320 / 0.5)",
          boxShadow: "0 30px 80px -20px rgba(10,30,60,0.7), inset 0 0 0 1px rgba(255,255,255,0.14)",
        }}
      >
        {WELCOME_VIDEO ? (
          <video
            className="h-full w-full object-cover"
            poster="/images/welcome-video-poster.png"
            controls
            autoPlay
            playsInline
          >
            <source src={WELCOME_VIDEO} type="video/mp4" />
            Your browser can&apos;t play this video.
          </video>
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

        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close welcome video"
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full text-white backdrop-blur-sm transition-colors hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          style={{ background: "rgba(10,25,45,0.35)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
