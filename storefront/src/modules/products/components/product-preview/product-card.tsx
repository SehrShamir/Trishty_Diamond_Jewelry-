"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useCallback } from "react"

const METAL_COLORS: Record<string, string> = {
  "14k white gold": "#E0E0E0",
  "14k yellow gold": "#D4AF37",
  "14k rose gold": "#B76E79",
  "platinum": "#E5E4E2",
  "white gold": "#E0E0E0",
  "yellow gold": "#D4AF37",
  "rose gold": "#B76E79",
}

export type ProductCardProps = {
  handle: string
  title: string
  price: string | null
  priceNumber: number | null
  currencyCode: string | null
  thumbnail: string | null
  images: string[]
  metalValues: string[]
}

export default function ProductCard({
  handle,
  title,
  price,
  priceNumber,
  currencyCode,
  thumbnail,
  images,
  metalValues,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const allImages = images.length > 0 ? images : thumbnail ? [thumbnail] : []
  const totalImages = allImages.length

  const prevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages)
    },
    [totalImages]
  )

  const nextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentImage((prev) => (prev + 1) % totalImages)
    },
    [totalImages]
  )

  const swatches = metalValues
    .map((v) => METAL_COLORS[v.toLowerCase()])
    .filter(Boolean)

  const installment =
    priceNumber && currencyCode
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(priceNumber / 4)
      : null

  const displaySrc = allImages[currentImage] || thumbnail

  return (
    <div
      className={`relative flex flex-col p-3 rounded-2xl transition-all duration-500 ease-out border ${
        hovered 
          ? "shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white z-10 border-gray-100 translate-y-[-2px]" 
          : "border-transparent shadow-none translate-y-0"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setCurrentImage(0)
      }}
    >
      <Link href={`/products/${handle}`} className="block">
        {/* Image area */}
        <div className="relative bg-[#f5f5f0] rounded-2xl overflow-hidden aspect-square group/img">
          {displaySrc && (
            <Image
              src={displaySrc}
              alt={title}
              fill
              className={`object-cover object-center transition-all duration-700 ease-out ${
                hovered ? "scale-[1.03]" : "scale-100"
              }`}
              sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
              unoptimized={displaySrc.startsWith("http")}
            />
          )}

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 z-10 text-gray-400 hover:text-red-400 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Image nav — only on hover when multiple images */}
          {hovered && totalImages > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-[11px] text-gray-500 bg-white/80 rounded-full px-2.5 py-0.5">
                {currentImage + 1} | {totalImages}
              </div>
            </>
          )}
        </div>

        {/* Info row */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900 leading-snug">{title}</p>
            {price && <p className="text-sm text-gray-900 mt-0.5">{price}</p>}
          </div>
          {swatches.length > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0 mt-1">
              {swatches.map((color, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Hover expanded area */}
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out overflow-hidden ${
          hovered ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="min-h-0 space-y-2.5">
          <div className="flex gap-2">
            <Link
              href={`/products/${handle}`}
              className="flex-1 text-center text-xs font-medium border border-gray-900 text-gray-900 rounded-full py-2.5 hover:bg-gray-50 transition-colors"
            >
              More Info
            </Link>
            <Link
              href={`/products/${handle}`}
              className="flex-1 text-center text-xs font-medium bg-gray-900 text-white rounded-full py-2.5 hover:bg-black transition-colors"
            >
              Add to Cart &rsaquo;
            </Link>
          </div>
          {installment && (
            <p className="text-[11px] text-gray-500 text-center">
              Pay in 4 interest-free installments of{" "}
              <span className="font-medium text-gray-700">{installment}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
