import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  q,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  q?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const query = q?.trim() || undefined

  const heading = query ? `Results for “${query}”` : "The Collection"
  const crumb = query ? "Search" : "The Collection"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 bn-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="flex flex-col small:flex-row small:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
          <div className="flex items-center text-sm font-light text-gray-500 gap-2">
            <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">Home</LocalizedClientLink>
            <span>/</span>
            <span className="text-gray-900">{crumb}</span>
          </div>
          <RefinementList sortBy={sort} />
        </div>
        <div className="mb-8 font-sans text-gray-900 text-3xl uppercase tracking-widest font-light">
          <h1 data-testid="store-page-title">{heading}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />} key={`${sort}-${query ?? ""}-${pageNumber}`}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            q={query}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
