"use client"

import * as React from "react"
import Image from "next/image"
import ImageZoomModal from "./image-zoom-modal"
import type { GallerySlide } from "./gallery-carousel"

type GalleryGridProps = {
  slides: GallerySlide[]
}

const GalleryGrid = ({ slides }: GalleryGridProps) => {
  const [zoomSlide, setZoomSlide] = React.useState<GallerySlide | null>(null)

  if (slides.length === 0) return null

  // Show only the unique slides we actually have — never repeat to fill cells.
  // Cap visible slides at 4 and surface remainder via "+N more" overlay.
  const visible = slides.slice(0, 4)
  const remaining = slides.length > 4 ? slides.length - 4 : 0

  // Adapt the grid to the number of slides so a single slide isn't forced
  // into a quarter cell while three empties stare back.
  const gridClass =
    visible.length === 1
      ? "grid grid-cols-1 gap-2"
      : visible.length === 2
      ? "grid grid-cols-2 gap-2"
      : visible.length === 3
      ? "grid grid-cols-2 grid-rows-2 gap-2 [&>*:first-child]:row-span-2"
      : "grid grid-cols-2 gap-2"

  return (
    <div>
      <div className={gridClass}>
        {visible.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="relative bg-[#f5f5f0] overflow-hidden cursor-zoom-in aspect-square rounded-xl"
            onClick={() => slide?.type === "image" && setZoomSlide(slide)}
          >
            {slide?.type === "image" ? (
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                priority={index < 2}
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 28vw"
                unoptimized={slide.url.startsWith("http")}
              />
            ) : slide?.type === "video" ? (
              <video
                src={slide.url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            ) : slide?.type === "360" ? (
              <iframe
                src={slide.url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="360-degree product view"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="w-full h-full bg-[#f5f5f0]" />
            )}

            {/* "+N more" overlay on last cell if more than 4 images */}
            {index === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-sm font-light tracking-wider">
                  +{remaining} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      {zoomSlide && (
        <ImageZoomModal slide={zoomSlide} open={!!zoomSlide} onClose={() => setZoomSlide(null)} />
      )}
    </div>
  )
}

export default GalleryGrid
