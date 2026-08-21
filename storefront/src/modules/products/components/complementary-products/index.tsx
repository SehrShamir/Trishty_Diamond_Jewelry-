import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductCarousel from "./product-carousel"

type ComplementaryProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function ComplementaryProducts({
  product,
  countryCode,
}: ComplementaryProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) return null

  // Find matching tags (tags that start with "matching-band:")
  const matchingTags = product.tags?.filter((t) =>
    t.value?.startsWith("matching-band:")
  )

  if (!matchingTags || matchingTags.length === 0) return null

  const tagIds = matchingTags
    .map((t) => t.id)
    .filter(Boolean) as string[]

  if (tagIds.length === 0) return null

  const { response } = await listProducts({
    countryCode,
    queryParams: {
      tag_id: tagIds,
      limit: 12,
      is_giftcard: false,
    },
  })

  const complementaryProducts = response.products.filter(
    (p) => p.id !== product.id
  )

  if (complementaryProducts.length === 0) return null

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-8">
        <span className="text-xs font-sans uppercase tracking-widest text-gray-500 mb-4 block">
          Complete the look
        </span>
        <p className="text-2xl md:text-3xl font-light font-sans text-gray-900 max-w-lg leading-snug">
          Match Made in Heaven
        </p>
      </div>

      <ProductCarousel products={complementaryProducts} region={region} />
    </div>
  )
}
