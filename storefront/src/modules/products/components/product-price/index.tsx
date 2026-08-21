import { clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({ product, variantId: variant?.id })
  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <span className="text-lg font-light text-gray-400">Price upon request</span>
  }

  return (
    <div className="flex flex-col items-center gap-y-0.5">
      <span
        className={clx("text-3xl font-serif font-normal tracking-wide text-gray-900")}
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </span>
      {selectedPrice.price_type === "sale" && (
        <div className="flex items-center gap-2">
          <span className="line-through text-gray-400 text-sm font-light" data-testid="original-product-price" data-value={selectedPrice.original_price_number}>
            {selectedPrice.original_price}
          </span>
          <span className="text-xs font-medium text-red-600 uppercase tracking-wider">-{selectedPrice.percentage_diff}%</span>
        </div>
      )}
    </div>
  )
}
