import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "./product-card"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  // Extract metal option values for swatches
  const metalOption = product.options?.find(
    (o) =>
      o.title?.toLowerCase().includes("metal") ||
      o.title?.toLowerCase() === "material"
  )
  const metalValues = metalOption?.values?.map((v) => v.value) ?? []

  // Collect all image URLs
  const images = (product.images ?? [])
    .map((img) => img.url)
    .filter(Boolean) as string[]

  return (
    <ProductCard
      handle={product.handle ?? ""}
      title={product.title ?? ""}
      price={cheapestPrice?.calculated_price ?? null}
      priceNumber={cheapestPrice?.calculated_price_number ?? null}
      currencyCode={cheapestPrice?.currency_code ?? null}
      thumbnail={product.thumbnail ?? null}
      images={images}
      metalValues={metalValues}
    />
  )
}
