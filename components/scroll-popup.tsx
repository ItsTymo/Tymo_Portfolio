"use client"
import { useRef } from "react"
import type { LocationId } from "./adventure-map"
import { LodgeContent } from "./detail-content/lodge"
import { TrailContent } from "./detail-content/trail"
import { ArchiveContent } from "./detail-content/archive"
import { RiverContent } from "./detail-content/river"
import { TowerContent } from "./detail-content/tower"

interface ScrollPopupProps {
  location: LocationId
  onClose: () => void
}

export function ScrollPopup({ location, onClose }: ScrollPopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  console.log(`[v0] ScrollPopup rendered for location: ${location}`)

  const renderContent = () => {
    switch (location) {
      case "lodge":
        return <LodgeContent />
      case "trail":
        return <TrailContent />
      case "archive":
        return <ArchiveContent />
      case "river":
        return <RiverContent />
      case "tower":
        return <TowerContent />
    }
  }

  const handleClose = () => {
    console.log("[v0] Closing scroll popup")
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scroll-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
      >
        <div className="relative w-full max-w-2xl h-[85vh] pointer-events-auto flex flex-col overflow-hidden rounded-3xl bg-card shadow-2xl border-4 border-[#8b6f47] animate-modal-enter">
          {/* Scroll decorative top */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#5a4a2e] to-transparent opacity-50 rounded-t-3xl pointer-events-none z-10" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors font-serif font-bold text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Close scroll popup"
          >
            ✕
          </button>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {renderContent()}
          </div>

          {/* Scroll decorative bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#5a4a2e] to-transparent opacity-50 rounded-b-3xl pointer-events-none z-10" />
        </div>
      </div>
    </>
  )
}
