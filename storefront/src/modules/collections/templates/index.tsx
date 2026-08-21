import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 bn-container">
      <div className="w-full">
        <div className="flex flex-col small:flex-row small:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
          <div className="flex items-center text-sm font-light text-gray-500 gap-2 flex-wrap">
            <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-gray-900" data-testid="collection-page-title">{collection.title}</span>
          </div>
          <RefinementList sortBy={sort} data-testid="sort-by-container" />
        </div>

        <div className="mb-8 font-sans text-gray-900 text-3xl uppercase tracking-widest font-light">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
