"use client"
import { useState } from "react"
import { AdventureMap } from "@/components/adventure-map"
import { ScrollPopup } from "@/components/scroll-popup"
import { FogReveal } from "@/components/fog-reveal"
import { MusicPlayer } from "@/components/music-player"


type LocationId = "lodge" | "trail" | "archive" | "river" | "tower"

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<LocationId | null>(null)

  const handleLocationSelect = (id: LocationId) => {
    setSelectedLocation(id)
  }

  const handleClosePopup = () => {
    setSelectedLocation(null)
  }

  return (
    <main className="min-h-screen w-full bg-[#d5c8b5] flex items-center justify-center overflow-hidden">
      <FogReveal />
      <MusicPlayer />

      <AdventureMap selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} />
      {selectedLocation && <ScrollPopup location={selectedLocation} onClose={handleClosePopup} />}
    </main>
  )
}
