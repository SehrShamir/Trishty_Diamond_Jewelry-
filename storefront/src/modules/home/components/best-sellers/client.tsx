"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { BestSellerProduct } from "./index"

const CUSTOMIZABLE_COLLECTIONS = ["settings", "engagement-rings"]

const METAL_COLORS: Record<string, string> = {
  "14k white gold": "#E0E0E0",
  "14k yellow gold": "#D4AF37",
  "14k rose gold": "#B76E79",
  "platinum": "#E5E4E2",
  "white gold": "#E0E0E0",
  "yellow gold": "#D4AF37",
  "rose gold": "#B76E79",
}

function getMetalSwatches(product: BestSellerProduct): string[] {
  const metalOption = product.options?.find(
    (o) => o.title.toLowerCase().includes("metal") || o.title.toLowerCase() === "material"
  )
  if (!metalOption) return []
  return metalOption.values
    .map((v) => METAL_COLORS[v.value.toLowerCase()] || null)
    .filter(Boolean) as string[]
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function BestSellersClient({ products }: { products: BestSellerProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300
    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth - 20 : cardWidth + 20,
      behavior: "smooth",
    })
  }

  return (
    <section className="w-full py-20 small:py-24 bg-white">
      <div className="bn-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-2xl small:text-3xl font-light text-gray-900 uppercase tracking-[0.2em]">
            Our Best Sellers
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Scrollable product cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => {
            const isCustomizable = CUSTOMIZABLE_COLLECTIONS.includes(
              product.collection?.handle || ""
            )
            const swatches = getMetalSwatches(product)
            const variant = product.variants?.[0]
            const price = variant?.calculated_price
            const hasDiscount = price && price.original_amount > price.calculated_amount

            return (
              <div key={product.id} className="flex-shrink-0 w-[240px] small:w-[280px] snap-start">
                <LocalizedClientLink
                  href={`/products/${product.handle}`}
                  className="block relative overflow-hidden bg-card-cream group"
                >
                  <div className="relative aspect-square">
                    {/* Customizable badge */}
                    {isCustomizable && (
                      <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-[9px] text-gray-600 font-normal tracking-[0.1em] uppercase px-2.5 py-1">
                        Customizable
                      </span>
                    )}

                    {/* Heart icon */}
                    <button
                      className="absolute top-3 right-3 z-10 text-gray-300 hover:text-gray-900 transition-colors"
                      onClick={(e) => e.preventDefault()}
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4" strokeWidth={1.5} />
                    </button>

                    {/* Product image */}
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain mix-blend-darken p-4"
                        sizes="280px"
                        unoptimized={product.thumbnail.startsWith("http")}
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </LocalizedClientLink>

                {/* Info below card */}
                <div className="mt-3 px-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <LocalizedClientLink
                      href={`/products/${product.handle}`}
                      className="text-sm font-normal text-gray-900 hover:underline truncate"
                    >
                      {product.title}
                    </LocalizedClientLink>

                    {swatches.length > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {swatches.map((color, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {price && (
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(price.calculated_amount, price.currency_code)}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(price.original_amount, price.currency_code)}
                          </span>
                          <span className="text-[9px] bg-gray-900 text-white px-1.5 py-0.5 font-normal tracking-wide">
                            {Math.round(((price.original_amount - price.calculated_amount) / price.original_amount) * 100)}% off
                          </span>
                        </>
                      )}
                      {isCustomizable && (
                        <span className="text-[11px] text-gray-400 font-light">
                          With stone: {formatPrice(price.calculated_amount + 91000, price.currency_code)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Explore More */}
        <div className="flex justify-center mt-12">
          <Button asChild variant="outline" size="lg">
            <LocalizedClientLink href="/store">Explore More</LocalizedClientLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
