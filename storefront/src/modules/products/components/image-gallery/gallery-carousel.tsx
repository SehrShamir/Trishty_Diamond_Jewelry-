"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import VideoSlide from "./video-slide"
import ImageZoomModal from "./image-zoom-modal"
import { cn } from "@/lib/utils"

export type GallerySlide = {
  id: string
  type: "image" | "video" | "360"
  url: string
  alt: string
}

type GalleryCarouselProps = {
  slides: GallerySlide[]
}

const GalleryCarousel = ({ slides }: GalleryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [zoomSlide, setZoomSlide] = React.useState<GallerySlide | null>(null)

  React.useEffect(() => { setCurrentIndex(0) }, [slides])

  const goTo = React.useCallback(
    (index: number) => {
      if (slides.length === 0) return
      setCurrentIndex((index + slides.length) % slides.length)
    },
    [slides.length]
  )

  if (slides.length === 0) return null
  const current = slides[currentIndex]

  return (
    <div className="flex flex-col gap-3">
      {/* Main image area */}
      <div className="relative group bg-[#f8f8f8]">
        {current.type === "image" ? (
          <div
            className="relative aspect-square w-full overflow-hidden cursor-zoom-in"
            onClick={() => setZoomSlide(current)}
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              priority={currentIndex === 0}
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 55vw"
              unoptimized={current.url.startsWith("http")}
            />
          </div>
        ) : (
          <VideoSlide url={current.url} type={current.type} />
        )}

        {/* Nav arrows — Keyzar style: thin chevrons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" strokeWidth={1} />
            </button>
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" strokeWidth={1} />
            </button>
          </>
        )}

        {/* Dot indicators — bottom center like Keyzar */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  idx === currentIndex ? "bg-gray-900" : "bg-gray-300"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomSlide && (
        <ImageZoomModal slide={zoomSlide} open={!!zoomSlide} onClose={() => setZoomSlide(null)} />
      )}
    </div>
  )
}

export default GalleryCarousel
