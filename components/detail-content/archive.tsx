"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import type { Photo } from "@/lib/photos"

export function ArchiveContent() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch("/api/photos")
        if (response.ok) {
          const data = await response.json()
          setPhotos(data)
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const closeModal = () => setSelectedPhoto(null)

  const goToPrevious = () => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setPhotos((currentPhotos) => {
      setSelectedPhoto(currentPhotos[prevIndex])
      return currentPhotos
    })
  }

  const goToNext = () => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1
    setPhotos((currentPhotos) => {
      setSelectedPhoto(currentPhotos[nextIndex])
      return currentPhotos
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-accent/20 pb-4">
        <h2 className="font-scroll-title text-2xl md:text-3xl font-semibold text-foreground">Scenic Lookout</h2>
        <p className="font-scroll-body text-sm italic text-neutral-700 mt-1">Gallery of Adventures</p>
      </div>

      <p className="font-scroll-body text-foreground leading-relaxed text-center">
        Moments captured from trails, peaks, and wild places. Click any photo to explore.
      </p>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-neutral-500 font-scroll-body">
          Loading gallery...
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 font-scroll-body">
          No photos yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square overflow-hidden rounded-lg border-2 border-[#8b6f47]/30 hover:border-[#8b6f47]/60 hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="absolute bottom-2 left-2 text-white text-xs font-scroll-body">
                  {photo.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Subtle Admin Link */}
      <div className="text-center pt-2">
        <Link
          href="/admin/gallery"
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Manage Gallery
        </Link>
      </div>

      {/* Fullscreen Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center animate-fade-in"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
            aria-label="Previous photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
            aria-label="Next photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="flex-1 flex items-center justify-center w-full px-16 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Photo info */}
          <div
            className="w-full max-w-2xl px-6 pb-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-scroll-title text-2xl font-semibold text-white mb-2">
              {selectedPhoto.title}
            </h3>
            <div className="flex justify-center gap-4 text-sm font-scroll-body text-white/70 mb-3">
              <span>{selectedPhoto.location}</span>
              <span>•</span>
              <span>{selectedPhoto.date}</span>
            </div>
            <p className="font-scroll-body text-white/80 leading-relaxed">
              {selectedPhoto.description}
            </p>
            <p className="text-white/40 text-xs mt-4 font-scroll-body">
              Click outside or press the X to close • Use arrows to navigate
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
