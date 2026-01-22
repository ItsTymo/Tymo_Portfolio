"use client"
import { useState, useEffect } from "react"

export function FogReveal({ onRevealComplete }: { onRevealComplete?: () => void }) {
  const [isRevealing, setIsRevealing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealing(false)
      onRevealComplete?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onRevealComplete])

  if (!isRevealing) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Base fog layers */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#c9bda8] via-[#d5c8b5]/90 to-transparent animate-fog-rise"
        style={{ animationDelay: "0s" }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#c9bda8] via-[#d5c8b5]/80 to-transparent animate-fog-rise"
        style={{ animationDelay: "0.3s" }}
      />
      
      {/* Wispy fog tendrils */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-[200%] h-[40%] top-[10%] -left-[50%] bg-gradient-to-r from-transparent via-[#e8ddd0]/70 to-transparent rounded-full blur-3xl animate-fog-drift-1"
        />
        <div 
          className="absolute w-[180%] h-[35%] top-[30%] -left-[40%] bg-gradient-to-r from-transparent via-[#d8cfc2]/60 to-transparent rounded-full blur-3xl animate-fog-drift-2"
        />
        <div 
          className="absolute w-[220%] h-[45%] top-[50%] -left-[60%] bg-gradient-to-r from-transparent via-[#e0d5c8]/65 to-transparent rounded-full blur-3xl animate-fog-drift-3"
        />
        <div 
          className="absolute w-[160%] h-[30%] top-[70%] -left-[30%] bg-gradient-to-r from-transparent via-[#d0c4b5]/55 to-transparent rounded-full blur-3xl animate-fog-drift-4"
        />
      </div>

      {/* Particle mist overlay */}
      <div className="absolute inset-0 opacity-40 animate-fog-fade">
        <div className="absolute w-4 h-4 top-[20%] left-[10%] bg-[#f5f0e8] rounded-full blur-xl animate-float-1" />
        <div className="absolute w-6 h-6 top-[40%] left-[25%] bg-[#f0ebe3] rounded-full blur-xl animate-float-2" />
        <div className="absolute w-5 h-5 top-[60%] left-[50%] bg-[#ebe5db] rounded-full blur-xl animate-float-3" />
        <div className="absolute w-4 h-4 top-[30%] left-[70%] bg-[#f5f0e8] rounded-full blur-xl animate-float-1" />
        <div className="absolute w-6 h-6 top-[50%] left-[85%] bg-[#f0ebe3] rounded-full blur-xl animate-float-2" />
        <div className="absolute w-3 h-3 top-[75%] left-[40%] bg-[#ebe5db] rounded-full blur-xl animate-float-3" />
      </div>

      {/* Central glow that fades out */}
      <div className="absolute inset-0 flex items-center justify-center animate-fog-fade">
        <div className="w-[80%] h-[80%] bg-radial-gradient from-[#f5f0e8]/30 via-transparent to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  )
}
