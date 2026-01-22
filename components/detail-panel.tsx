"use client"

import type { LocationId } from "./adventure-map"
import { SummitContent } from "./detail-content/summit"
import { LodgeContent } from "./detail-content/lodge"
import { TrailContent } from "./detail-content/trail"
import { ArchiveContent } from "./detail-content/archive"
import { RiverContent } from "./detail-content/river"
import { TowerContent } from "./detail-content/tower"

interface DetailPanelProps {
  location: LocationId
}

export function DetailPanel({ location }: DetailPanelProps) {
  const renderContent = () => {
    switch (location) {
      case "summit":
        return <SummitContent />
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

  return (
    <div
      className="bg-card rounded-sm border-2 border-[#8b6f47]/60 p-6 shadow-lg animate-fade-in"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(139, 111, 71, 0.02) 0%, rgba(217, 205, 184, 0.03) 100%)",
      }}
    >
      {renderContent()}
    </div>
  )
}
