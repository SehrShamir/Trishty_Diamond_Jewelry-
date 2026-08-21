"use client"

import { BYORProvider, useBYOR } from "@modules/products/components/byor/byor-context"
import BYORStepper from "@modules/products/components/byor/byor-stepper"
import StoneSelector from "@modules/products/components/byor/stone-selector"
import BYORSummary from "@modules/products/components/byor/byor-summary"
import { useSearchParams } from "next/navigation"

type Props = {
  countryCode: string
}

export default function BuildYourRingClient({ countryCode }: Props) {
  return (
    <BYORProvider>
      <div className="bn-container py-8">
        <BuildYourRingContent countryCode={countryCode} />
      </div>
    </BYORProvider>
  )
}

function BuildYourRingContent({ countryCode }: Props) {
  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get("step") || "2", 10)
  const { goToStep } = useBYOR()

  return (
    <div className="space-y-8">
      <BYORStepper currentStep={step} onStepClick={goToStep} />

      {step === 2 && (
        <StoneSelector countryCode={countryCode} />
      )}

      {step === 3 && (
        <BYORSummary countryCode={countryCode} />
      )}
    </div>
  )
}
