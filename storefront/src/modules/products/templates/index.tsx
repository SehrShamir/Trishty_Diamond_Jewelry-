import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import BYORSection from "./byor-section"
import TrustBadges from "@modules/products/components/trust-badges"
import ProductSpecs from "@modules/products/components/product-specs"
import ComplementaryProducts from "@modules/products/components/complementary-products"
import OurCouples from "@modules/products/components/our-couples"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  searchParams?: Record<string, string>
}

const CUSTOMIZABLE_COLLECTIONS = ["settings", "engagement-rings"]

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  searchParams,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const isCustomizable = CUSTOMIZABLE_COLLECTIONS.includes(
    product.collection?.handle || ""
  )

  // When BYOR stepper is in step 2 or 3, hide the main PDP layout
  // so the stone selector or summary takes the full viewport (like Keyzar)
  const byorStep = parseInt(searchParams?.step || "1", 10)
  const isByorFlowActive = isCustomizable && byorStep >= 2

  return (
    <>
      {/* ===== BYOR Stepper — only for customizable products ===== */}
      {isCustomizable && (
        <BYORSection product={product} countryCode={countryCode} />
      )}

      {/* ===== MAIN PDP — hidden when BYOR Step 2+ is active ===== */}
      {!isByorFlowActive && (
        <>
          <div className="max-w-7xl mx-auto px-4 py-6" data-testid="product-container">
            <div className="flex flex-col small:flex-row small:gap-x-8">
              {/* LEFT — Gallery (3/5) */}
              <div className="w-full small:w-[60%] small:sticky small:top-20 small:self-start">
                <ImageGallery
                  product={product}
                  mode="grid"
                  showCaratPills={isCustomizable}
                />
              </div>

              {/* RIGHT — Product info, options, CTAs, specs (2/5) */}
              <div className="w-full small:w-[40%] flex flex-col gap-y-6 py-8 small:py-0">
                <ProductInfo product={product} isCustomizable={isCustomizable} />

                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                      countryCode={countryCode}
                      isCustomizable={isCustomizable}
                    />
                  }
                >
                  <ProductActionsWrapper
                    id={product.id}
                    region={region}
                    countryCode={countryCode}
                    isCustomizable={isCustomizable}
                  />
                </Suspense>

                <TrustBadges />

                <ProductSpecs product={product} />

                <ProductTabs product={product} />
              </div>
            </div>
          </div>

          {/* ===== BELOW-FOLD ===== */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Suspense fallback={null}>
              <ComplementaryProducts product={product} countryCode={countryCode} />
            </Suspense>
          </div>

          <div className="max-w-7xl mx-auto px-4 my-16 small:my-32" data-testid="related-products-container">
            <Suspense fallback={<SkeletonRelatedProducts />}>
              <RelatedProducts product={product} countryCode={countryCode} />
            </Suspense>
          </div>
        </>
      )}
    </>
  )
}

export default ProductTemplate

