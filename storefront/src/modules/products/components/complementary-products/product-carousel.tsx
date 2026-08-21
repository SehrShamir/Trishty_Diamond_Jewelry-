"use client"

import { HttpTypes } from "@medusajs/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import Product from "@modules/products/components/product-preview"

type ProductCarouselProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const ProductCarousel = ({ products, region }: ProductCarouselProps) => {
  if (products.length === 0) return null

  return (
    <div className="relative group">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4"
            >
              <Product region={region} product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {products.length > 4 && (
          <>
            <CarouselPrevious className="-left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border-0 shadow-md" />
            <CarouselNext className="-right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border-0 shadow-md" />
          </>
        )}
      </Carousel>
    </div>
  )
}

export default ProductCarousel
