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
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
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
        <div className="scroll-modal relative w-full max-w-2xl h-[85vh] pointer-events-auto flex flex-col overflow-hidden rounded-xl border-[3px] border-[#8b6f47] animate-modal-enter">
          {/* Scroll roll top */}
          <div className="scroll-roll-top" />

          {/* Ornate corner decorations */}
          <span className="scroll-corner scroll-corner-tl" aria-hidden="true">&#x2767;</span>
          <span className="scroll-corner scroll-corner-tr" aria-hidden="true">&#x2767;</span>
          <span className="scroll-corner scroll-corner-bl" aria-hidden="true">&#x2767;</span>
          <span className="scroll-corner scroll-corner-br" aria-hidden="true">&#x2767;</span>

          {/* Inner decorative border */}
          <div className="scroll-inner-border" />

          {/* Close button - wax seal */}
          <button
            onClick={handleClose}
            className="scroll-close-btn absolute top-5 right-5 z-20 focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-offset-2 focus:ring-offset-[#f5ecd7]"
            aria-label="Close scroll popup"
          >
            &#x2715;
          </button>

          {/* Scrollable content */}
          <div className="scroll-content flex-1 overflow-y-auto px-8 py-10 md:px-10 md:py-12 space-y-6">
            {renderContent()}
          </div>

          {/* Scroll roll bottom */}
          <div className="scroll-roll-bottom" />
        </div>
      </div>
    </>
  )
}
