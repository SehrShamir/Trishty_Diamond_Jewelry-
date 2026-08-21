import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 max-w-7xl mx-auto px-4"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="flex flex-col small:flex-row small:items-center justify-between mb-4 border-gray-100 gap-4">
          <div className="flex items-center text-sm font-light text-gray-500 gap-2 flex-wrap">
            <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">
              Home
            </LocalizedClientLink>
            <span>/</span>
            {parents &&
              [...parents].reverse().map((parent) => (
                <span key={parent.id} className="flex items-center gap-2">
                  <LocalizedClientLink
                    className="hover:text-gray-900 transition-colors"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                  <span>/</span>
                </span>
              ))}
            <span className="text-gray-900" data-testid="category-page-title">{category.name}</span>
          </div>
        </div>

        <div className="mt-8 mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Select your jewelry</h1>
          <p className="text-lg text-gray-500">Use the filters below to design your perfect jewelry</p>
        </div>

        <hr className="w-full border-gray-100 mb-4" />

        <div className="flex justify-end mb-8">
          <RefinementList sortBy={sort} data-testid="sort-by-container" />
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
