import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight, Gift, Hand } from "lucide-react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  isCustomizable?: boolean
}

const ProductInfo = ({ product, isCustomizable = false }: ProductInfoProps) => {
  return (
    <div id="product-info">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-x-2 gap-y-1 font-sans text-[11px] tracking-[0.04em] text-gray-500 mb-5"
      >
        <LocalizedClientLink
          href="/"
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          Home
        </LocalizedClientLink>
        {product.collection && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-300" strokeWidth={1.5} aria-hidden />
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {product.collection.title}
            </LocalizedClientLink>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-gray-300" strokeWidth={1.5} aria-hidden />
        <span className="text-gray-900 font-medium truncate max-w-[60vw]" aria-current="page">
          {product.title}
        </span>
      </nav>

      {/* Title row with action icons */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1
            className="text-2xl md:text-[28px] leading-tight text-gray-900 font-serif font-normal"
            data-testid="product-title"
          >
            {product.title}
          </h1>

          {/* Customize badge for customizable products */}
          {isCustomizable && (
            <span className="inline-flex items-center mt-2 bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-sm">
              Customize
            </span>
          )}
        </div>

        {/* Action icons — like Keyzar: Try-On / Drop a Hint */}
        <div className="flex items-center gap-3 flex-shrink-0 pt-1">
          {!isCustomizable && (
            <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 transition-colors">
              <Hand className="w-5 h-5" strokeWidth={1.2} />
              <span className="text-[8px] tracking-wider">Try-On</span>
            </button>
          )}
          <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 transition-colors">
            <Gift className="w-5 h-5" strokeWidth={1.2} />
            <span className="text-[8px] tracking-wider">Drop a Hint</span>
          </button>
        </div>
      </div>

      {product.description && (
        <p
          className="text-xs text-gray-500 font-light leading-relaxed mt-3"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
