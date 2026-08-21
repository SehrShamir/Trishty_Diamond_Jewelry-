"use client"

import { HttpTypes } from "@medusajs/types"
import { BYORProvider, useBYOR } from "@modules/products/components/byor/byor-context"
import BYORStepper from "@modules/products/components/byor/byor-stepper"
import StoneSelector from "@modules/products/components/byor/stone-selector"
import BYORSummary from "@modules/products/components/byor/byor-summary"
import { useSearchParams } from "next/navigation"
import { getProductPrice } from "@lib/util/get-product-price"

type BYORSectionProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default function BYORSection({ product, countryCode }: BYORSectionProps) {
  return (
    <BYORProvider>
      <BYORSectionContent product={product} countryCode={countryCode} />
    </BYORProvider>
  )
}

function BYORSectionContent({ product, countryCode }: BYORSectionProps) {
  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get("step") || "1", 10)
  const { goToStep } = useBYOR()

  // Get setting price for stepper display
  const { cheapestPrice } = getProductPrice({ product })
  const settingPrice = cheapestPrice?.calculated_price || null

  const diamondsCollectionId = (product.metadata as Record<string, string>)?.diamonds_collection_id

  return (
    <div>
      {/* Full-bleed stepper bar */}
      <BYORStepper
        currentStep={step}
        onStepClick={goToStep}
        settingData={step > 1 ? { productName: product.title, price: settingPrice } : undefined}
      />

      {step === 2 && (
        <div className="bn-container py-8">
          <StoneSelector countryCode={countryCode} diamondsCollectionId={diamondsCollectionId} />
        </div>
      )}

      {step === 3 && (
        <div className="bn-container py-8">
          <BYORSummary countryCode={countryCode} />
        </div>
      )}
    </div>
  )
}
