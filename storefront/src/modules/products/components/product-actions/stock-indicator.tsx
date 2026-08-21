import { HttpTypes } from "@medusajs/types"
import { Circle } from "lucide-react"

type StockIndicatorProps = {
  variant?: HttpTypes.StoreProductVariant
}

const StockIndicator = ({ variant }: StockIndicatorProps) => {
  if (!variant) return null

  const inStock =
    !variant.manage_inventory ||
    variant.allow_backorder ||
    (variant.inventory_quantity ?? 0) > 0

  const isMadeToOrder =
    variant.manage_inventory && (variant.inventory_quantity ?? 0) === 0 && variant.allow_backorder

  return (
    <div className="flex items-center gap-1.5">
      <Circle
        className={`w-2 h-2 ${inStock ? "fill-emerald-500 text-emerald-500" : "fill-gray-300 text-gray-300"}`}
      />
      <span className="text-xs font-light tracking-wider text-gray-600 uppercase">
        {isMadeToOrder ? "Made to order" : inStock ? "In stock" : "Out of stock"}
      </span>
    </div>
  )
}

export default StockIndicator
