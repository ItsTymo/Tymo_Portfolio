"use client"
import { useState, useEffect, useRef, useCallback } from "react"

const songs = [
  "/All_Star__Bardcore_.mp3",
  "/Crab_Rave_-_medieval_style__o7xKrouqL0c_.mp3",
  "/Mii_channel_theme_-_Miidieval_style__sYMAsJn50jk_.mp3",
  "/Pokemon_Theme_Song__Bardcore_Medieval_Cover__-_Frichter__EhxqtvfS6LE_.mp3",
  "/System_of_a_Down_-_Toxicity_-_Medieval_Style_-_Bardcore.mp3",
]

// Max volume cap (0.25 = 25% of full volume)
const MAX_VOLUME = 0.25

// Shuffle array using Fisher-Yates
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function MusicPlayer() {
  const [volume, setVolume] = useState(0.15)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const queueRef = useRef<string[]>([])
  const hasStartedRef = useRef(false)

  const initAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return

    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    audioContextRef.current = ctx

    const gainNode = ctx.createGain()
    gainNode.gain.value = volume * MAX_VOLUME
    gainNodeRef.current = gainNode

    const source = ctx.createMediaElementSource(audioRef.current)
    sourceNodeRef.current = source

    source.connect(gainNode)
    gainNode.connect(ctx.destination)
  }, [])

  const getNextFromQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffleArray(songs)
    }
    return queueRef.current.shift()!
  }, [])

  const playNextSong = useCallback(() => {
    if (!audioRef.current) return

    const nextSong = getNextFromQueue()
    audioRef.current.src = nextSong
    audioRef.current.play().catch(console.error)
  }, [getNextFromQueue])

  const startMusic = useCallback(() => {
    if (hasStartedRef.current || !audioRef.current) return
    hasStartedRef.current = true

    initAudioContext()

    // Resume audio context if suspended (required by browsers)
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume()
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true)
    }).catch(console.error)
  }, [initAudioContext])

  useEffect(() => {
    // Initialize audio element with first song from shuffled queue
    queueRef.current = shuffleArray(songs)
    const initialSong = queueRef.current.shift()!
    audioRef.current = new Audio(initialSong)

    // When song ends, play next random song (no repeat)
    audioRef.current.addEventListener('ended', playNextSong)

    // Try autoplay immediately
    initAudioContext()
    audioRef.current.play().then(() => {
      hasStartedRef.current = true
      setIsPlaying(true)
    }).catch(() => {
      // Autoplay blocked - wait for user interaction
      console.log("Autoplay blocked - waiting for user interaction")
    })

    // Listen for first user interaction to start music
    const handleInteraction = () => {
      startMusic()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', playNextSong)
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
    }
  }, [playNextSong, startMusic, initAudioContext])

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume * MAX_VOLUME
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return

    initAudioContext()

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume()
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(console.error)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-[#f5f0e8]/90 backdrop-blur-sm border-2 border-[#8b6f47] rounded-xl px-4 py-2 shadow-lg">
      <button
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center text-[#3d2e1f] hover:text-[#8b6f47] transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#3d2e1f]">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-2 bg-[#d5c8b5] rounded-lg appearance-none cursor-pointer accent-[#4a5d2a]"
          aria-label="Volume"
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#3d2e1f]">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      </div>
    </div>
  )
}
