"use client"
import { useState, useEffect } from "react"

export function RotatePrompt() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Only show on mobile-sized screens in portrait
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth
      const isMobile = window.innerWidth < 768
      if (isPortrait && isMobile && !dismissed) {
        setVisible(true)
        setFading(false)
      } else if (visible) {
        fadeOut()
      }
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [dismissed, visible])

  const fadeOut = () => {
    setFading(true)
    setTimeout(() => setVisible(false), 500)
  }

  const handleDismiss = () => {
    setDismissed(true)
    fadeOut()
  }

  if (!visible) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[200] flex justify-center pointer-events-none transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="pointer-events-auto mx-4 mb-20 px-5 py-3 bg-[#3d2e1f]/85 backdrop-blur-sm rounded-xl border border-[#8b6f47]/40 shadow-xl flex items-center gap-3 cursor-pointer"
        onClick={handleDismiss}
      >
        {/* Animated rotating phone icon */}
        <div className="flex-shrink-0 animate-rotate-hint">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Phone body */}
            <rect
              x="7"
              y="3"
              width="10"
              height="18"
              rx="2"
              stroke="#d5c8b5"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Screen */}
            <rect
              x="8.5"
              y="5"
              width="7"
              height="12"
              rx="0.5"
              fill="#d5c8b5"
              opacity="0.3"
            />
            {/* Home button */}
            <circle cx="12" cy="19" r="0.75" fill="#d5c8b5" />
            {/* Rotation arrow */}
            <path
              d="M2.5 12a9.5 9.5 0 0 1 4.5-8.1"
              stroke="#c9a96e"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M7 2.5L6.8 5.2 4.2 4.5"
              stroke="#c9a96e"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex flex-col">
          <span className="text-[#f5f0e8] text-sm font-scroll-body leading-tight">
            Rotate for the best experience
          </span>
          <span className="text-[#c9a96e] text-xs font-scroll-body opacity-70">
            Tap to dismiss
          </span>
        </div>
      </div>
    </div>
  )
}
