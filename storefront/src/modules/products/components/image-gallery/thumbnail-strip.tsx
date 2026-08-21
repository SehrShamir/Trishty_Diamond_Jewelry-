"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GallerySlide } from "./gallery-carousel"

type ThumbnailStripProps = {
  slides: GallerySlide[]
  activeIndex: number
  onSelect: (index: number) => void
}

const ThumbnailStrip = ({ slides, activeIndex, onSelect }: ThumbnailStripProps) => {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Product image thumbnails"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`View ${slide.type === "image" ? "image" : "video"} ${index + 1}`}
          onClick={() => onSelect(index)}
          className={cn(
            "relative flex-shrink-0 w-[52px] h-[52px] overflow-hidden transition-all duration-200 border bg-[#f8f8f8]",
            index === activeIndex
              ? "border-gray-900"
              : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
          )}
        >
          {slide.type === "image" ? (
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              className="object-contain p-1"
              sizes="52px"
              unoptimized={slide.url.startsWith("http")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-gray-500" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default ThumbnailStrip
