"use client"

import { useState, useEffect, useCallback } from "react"

export type LocationId = "lodge" | "trail" | "archive" | "river" | "tower"

interface LocationConfig {
  id: LocationId
  label: string
  x: string
  y: string
  width: string
  height: string
}

const locations: LocationConfig[] = [
  { id: "trail", label: "Trailhead", x: "55%", y: "24%", width: "18%", height: "12%" },
  { id: "river", label: "River Crossing", x: "58%", y: "40%", width: "20%", height: "12%" },
  { id: "lodge", label: "The Lodge", x: "38%", y: "62%", width: "18%", height: "14%" },
  { id: "tower", label: "Signal Tower", x: "20%", y: "70%", width: "16%", height: "16%" },
  { id: "archive", label: "Scenic Lookout", x: "78%", y: "72%", width: "22%", height: "14%" },
]

const ZOOM_SCALE = 3

function getLocationCoords(id: LocationId): { x: number; y: number } {
  const coords: Record<LocationId, { x: number; y: number }> = {
    trail: { x: 55, y: 24 },
    river: { x: 58, y: 40 },
    lodge: { x: 38, y: 62 },
    tower: { x: 20, y: 70 },
    archive: { x: 78, y: 72 },
  }
  return coords[id]
}

interface AdventureMapProps {
  selectedLocation: LocationId | null
  onLocationSelect: (id: LocationId) => void
}

export function AdventureMap({ selectedLocation, onLocationSelect }: AdventureMapProps) {
  const [zoomedLocation, setZoomedLocation] = useState<LocationId | null>(null)
  const [isMobilePortrait, setIsMobilePortrait] = useState(false)

  const checkMobilePortrait = useCallback(() => {
    const isPortrait = window.innerHeight > window.innerWidth
    const isMobile = window.innerWidth < 768
    setIsMobilePortrait(isPortrait && isMobile)
  }, [])

  useEffect(() => {
    checkMobilePortrait()
    window.addEventListener("resize", checkMobilePortrait)
    window.addEventListener("orientationchange", checkMobilePortrait)
    return () => {
      window.removeEventListener("resize", checkMobilePortrait)
      window.removeEventListener("orientationchange", checkMobilePortrait)
    }
  }, [checkMobilePortrait])

  // Reset zoom when leaving mobile portrait
  useEffect(() => {
    if (!isMobilePortrait) {
      setZoomedLocation(null)
    }
  }, [isMobilePortrait])

  const handleClick = (id: LocationId, label: string) => {
    console.log(`[v0] Clicked ${label} (${id})`)

    if (isMobilePortrait) {
      if (zoomedLocation === id) {
        // Already zoomed to this location — open the popup
        onLocationSelect(id)
      } else {
        // Zoom to this location
        setZoomedLocation(id)
      }
    } else {
      // Desktop: open popup immediately
      onLocationSelect(id)
    }
  }

  const handleZoomOut = () => {
    setZoomedLocation(null)
  }

  const handleLabelTap = (id: LocationId) => {
    setZoomedLocation(id)
  }

  // Calculate transform for zoomed state
  const getMapTransform = (): string => {
    if (!zoomedLocation || !isMobilePortrait) return "none"
    const { x, y } = getLocationCoords(zoomedLocation)
    const translateX = 50 - x
    const translateY = 50 - y
    return `scale(${ZOOM_SCALE}) translate(${translateX}%, ${translateY}%)`
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#d5c8b5] overflow-hidden">
      <div
        className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw]"
        style={{
          transform: getMapTransform(),
          transition: "transform 0.5s ease",
          transformOrigin: "center center",
        }}
      >
        <img
          src="/images/Career_of_Tymo_Map.png"
          alt="The Career of Tymo - Fantasy Map"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        />

        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => handleClick(location.id, location.label)}
            style={{
              position: "absolute",
              left: location.x,
              top: location.y,
              width: location.width,
              height: location.height,
              transform: "translate(-50%, -50%)",
            }}
            className="z-50 bg-transparent border-none outline-none cursor-pointer pointer-events-auto transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus:outline-none focus-visible:outline-none group"
            aria-label={`${location.label} - Click to explore`}
          >
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none blur-xl bg-amber-200/40"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* Zoom out button — shown when zoomed in on mobile portrait */}
      {isMobilePortrait && zoomedLocation && (
        <button
          onClick={handleZoomOut}
          className="fixed top-4 left-4 z-[150] px-3 py-2 bg-[#3d2e1f]/90 backdrop-blur-sm rounded-lg border border-[#8b6f47]/50 shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
          aria-label="Zoom out to full map"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d5c8b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-[#d5c8b5] text-sm font-scroll-body">Full Map</span>
        </button>
      )}

      {/* Location label buttons — shown at bottom in mobile portrait when not zoomed */}
      {isMobilePortrait && !zoomedLocation && (
        <div className="fixed bottom-0 left-0 right-0 z-[150] pb-6 pt-3 px-3 flex flex-wrap justify-center gap-2 bg-gradient-to-t from-[#3d2e1f]/80 via-[#3d2e1f]/40 to-transparent">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLabelTap(location.id)}
              className="px-4 py-2 bg-[#f5ecd7]/90 border border-[#8b6f47]/60 rounded-lg shadow-md active:scale-95 transition-transform"
            >
              <span className="text-[#3d2e1f] text-sm font-scroll-title tracking-wide">
                {location.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Tap hint when zoomed */}
      {isMobilePortrait && zoomedLocation && (
        <div className="fixed bottom-6 left-0 right-0 z-[150] flex justify-center pointer-events-none">
          <span className="px-4 py-2 bg-[#3d2e1f]/80 backdrop-blur-sm rounded-lg text-[#d5c8b5] text-sm font-scroll-body border border-[#8b6f47]/40">
            Tap location to open
          </span>
        </div>
      )}
    </div>
  )
}
