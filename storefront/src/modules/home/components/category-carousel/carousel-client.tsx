"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "lucide-react"

export type CarouselItem = {
  title: string
  image: string | null
  video?: string | null
  href: string
}

const FALLBACK_IMAGES = [
  "/home/carousel-first/image.png",
  "/home/carousel-first/image copy.png",
  "/home/carousel-first/image copy 2.png",
]

export default function CategoryCarouselClient({
  items,
}: {
  items: CarouselItem[]
}) {
  return (
    <section className="w-full py-20 small:py-24 bg-white">
      <div className="bn-container">
        <h2 className="font-serif text-2xl small:text-3xl font-light text-gray-900 text-center mb-10 uppercase tracking-[0.2em]">
          Our Selections
        </h2>

        <div className="grid grid-cols-2 small:grid-cols-4 gap-5">
          {items.slice(0, 4).map((item, idx) => (
            <LocalizedClientLink
              key={idx}
              href={item.href}
              className="group"
            >
              <div className="overflow-hidden bg-card-cream">
                {/* Product image or video */}
                <div className="relative aspect-square bg-card-cream">
                  {item.video ? (
                    <video
                      src={item.video}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                    />
                  ) : (
                    <Image
                      src={
                        item.image ??
                        FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
                      }
                      alt={item.title}
                      fill
                      className="object-contain mix-blend-darken"
                      unoptimized={
                        typeof item.image === "string" &&
                        item.image.startsWith("http")
                      }
                    />
                  )}
                </div>

                {/* Text inside card — bottom */}
                <div className="p-4">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center text-[11px] font-normal text-gray-500 uppercase tracking-[0.1em] group-hover:text-gray-900 transition-colors">
                    Shop Now
                    <ChevronRight className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
