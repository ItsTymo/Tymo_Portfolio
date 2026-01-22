"use client"

interface LocationConfig {
  id: string
  label: string
  icon: string
  tooltip: string
  x?: string
  y?: string
}

interface MapLocationProps {
  location: LocationConfig
  isSelected: boolean
  onSelect: () => void
}

// Keeping file for reference but it's replaced by button elements in AdventureMap component
export function MapLocation() {
  return null
}

// You can remove the original implementation if it's no longer needed
// export function MapLocation({ location, isSelected, onSelect }: MapLocationProps) {
//   return (
//     <button
//       onClick={onSelect}
//       style={{
//         position: "absolute",
//         left: location.x,
//         top: location.y,
//         transform: "translate(-50%, -50%)",
//       }}
//       className={`relative group transition-all duration-300 focus:outline-none ${
//         isSelected ? "scale-125" : "hover:scale-110"
//       }`}
//       aria-label={location.label}
//     >
//       <div
//         className={`absolute inset-0 rounded-full blur-md transition-all ${
//           isSelected ? "bg-accent/60 scale-110" : "bg-accent/25 scale-75 group-hover:scale-95"
//         }`}
//         style={{ width: "70px", height: "70px", marginLeft: "-35px", marginTop: "-35px" }}
//       />

//       {/* Hand-drawn cartouche style circle marker */}
//       <div
//         className={`relative w-16 h-16 rounded-full flex items-center justify-center font-serif font-bold text-lg border-3 transition-all shadow-lg ${
//           isSelected
//             ? "bg-accent text-accent-foreground border-[#3a2f1a]"
//             : "bg-[#f5ede0] text-foreground border-[#8b6f47] group-hover:border-accent group-hover:bg-[#faf8f5]"
//         }`}
//         style={{
//           boxShadow: isSelected
//             ? "0 4px 12px rgba(139, 111, 71, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)"
//             : "0 2px 8px rgba(90, 74, 46, 0.2)",
//         }}
//       >
//         {location.icon}
//       </div>

//       {/* Tooltip on hover */}
//       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-[#3a2f1a] text-[#f5ede0] text-xs rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#8b6f47] font-serif">
//         {location.tooltip}
//       </div>

//       {/* Label below marker */}
//       <p className="text-xs font-serif font-semibold text-foreground text-center mt-2 whitespace-nowrap">
//         {location.label}
//       </p>
//     </button>
//   )
// }
