"use client"

import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import GalleryCarousel, { type GallerySlide } from "./gallery-carousel"
import GalleryGrid from "./gallery-grid"
import CaratSizePills from "./carat-size-pills"

type ImageGalleryProps = {
  product: HttpTypes.StoreProduct
  mode?: "carousel" | "grid"
  showCaratPills?: boolean
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string | null
): HttpTypes.StoreProductImage[] {
  if (!selectedVariantId || !product.variants) return product.images ?? []
  const variant = product.variants.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images || !variant.images.length) return product.images ?? []
  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return (product.images ?? []).filter((i) => imageIdsMap.has(i.id))
}

const ImageGallery = ({ product, mode = "carousel", showCaratPills = false }: ImageGalleryProps) => {
  const searchParams = useSearchParams()
  const selectedVariantId = searchParams.get("v_id")
  const [selectedCarat, setSelectedCarat] = useState("3.0")

  const slides = useMemo<GallerySlide[]>(() => {
    const result: GallerySlide[] = []

    const metadata = product.metadata as Record<string, string> | null
    if (metadata?.video_url) {
      result.push({ id: "video-main", type: "video", url: metadata.video_url, alt: `${product.title} - Video` })
    }
    if (metadata?.video_url_360) {
      result.push({ id: "video-360", type: "360", url: metadata.video_url_360, alt: `${product.title} - 360 view` })
    }

    const images = getImagesForVariant(product, selectedVariantId)
    images
      .filter((img) => !!img.url)
      .forEach((img, index) => {
        result.push({
          id: img.id || `image-${index}`,
          type: "image" as const,
          url: img.url!,
          alt: `${product.title} - Image ${index + 1}`,
        })
      })

    return result
  }, [product, selectedVariantId])

  if (mode === "grid") {
    return (
      <div>
        <GalleryGrid slides={slides} />
        {showCaratPills && (
          <CaratSizePills selected={selectedCarat} onSelect={setSelectedCarat} />
        )}
      </div>
    )
  }

  return <GalleryCarousel slides={slides} />
}

export default ImageGallery
