"use client"

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

interface AdventureMapProps {
  selectedLocation: LocationId | null
  onLocationSelect: (id: LocationId) => void
}

export function AdventureMap({ selectedLocation, onLocationSelect }: AdventureMapProps) {
  const handleClick = (id: LocationId, label: string) => {
    console.log(`[v0] Clicked ${label} (${id})`)
    onLocationSelect(id)
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#d5c8b5] overflow-hidden">
      <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw]">
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
    </div>
  )
}
