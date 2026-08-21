"use client"

import * as React from "react"
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import type { GallerySlide } from "./gallery-carousel"

type ImageZoomModalProps = {
  slide: GallerySlide
  open: boolean
  onClose: () => void
}

const ImageZoomModal = ({ slide, open, onClose }: ImageZoomModalProps) => {
  const [scale, setScale] = React.useState(1)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStart = React.useRef({ x: 0, y: 0 })

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 1), 4))
  }, [])

  const handleDoubleClick = React.useCallback(() => {
    if (scale > 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setScale(2.5)
    }
  }, [scale])

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (scale <= 1) return
      setIsDragging(true)
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [scale, position]
  )

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    },
    [isDragging]
  )

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center focus:outline-none">
          <Dialog.Title className="sr-only">Product image zoom</Dialog.Title>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close zoom"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Zoom hint */}
          {scale === 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-wider font-light z-10">
              Double-click to zoom
            </div>
          )}

          {/* Zoomable image */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              className="relative w-full max-w-3xl aspect-[3/4]"
            >
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                className="object-contain"
                sizes="100vw"
                quality={95}
                unoptimized={slide.url.startsWith("http")}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ImageZoomModal
