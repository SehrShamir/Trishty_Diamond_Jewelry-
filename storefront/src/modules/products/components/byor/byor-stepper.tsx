"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type StepData = {
  productName?: string | null
  price?: string | null
}

type BYORStepperProps = {
  currentStep: number
  onStepClick?: (step: number) => void
  settingData?: StepData
  stoneData?: StepData
  totalPrice?: string | null
}

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M12 3L22 9L12 21L2 9L12 3Z" />
    <path d="M2 9H22" />
    <path d="M12 3L17 9L12 21L7 9L12 3Z" />
  </svg>
)

const RingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" />
    <path d="M16 11L12 7L16 3L20 7L16 11Z" />
  </svg>
)

const SettingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="12" cy="12" r="8" />
  </svg>
)

const BYORStepper = ({
  currentStep,
  onStepClick,
  settingData,
  stoneData,
  totalPrice,
}: BYORStepperProps) => {
  const steps = [
    {
      number: 1,
      label: "Select your",
      title: "SETTING",
      Icon: SettingIcon,
      data: settingData,
    },
    {
      number: 2,
      label: "Select your",
      title: "STONE",
      Icon: DiamondIcon,
      data: stoneData,
    },
    {
      number: 3,
      label: "Complete your",
      title: "RING",
      Icon: RingIcon,
      data: totalPrice ? { productName: "Total Price", price: totalPrice } : undefined,
    },
  ]

  return (
    <nav
      aria-label="Ring builder progress"
      className="w-full py-6 bg-white border-b border-gray-100"
    >
      <div className="max-w-[1100px] mx-auto flex items-stretch bg-[#f8f9fa] rounded-[4px] h-[86px] overflow-visible relative border border-[#e5e7eb]">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep
          const isCompleted = step.number < currentStep
          const isClickable = isCompleted && !!onStepClick

          return (
            <div 
              key={step.number} 
              className={cn(
                "flex-1 flex items-center relative",
                isActive ? "z-20" : "z-10"
              )}
            >
              {/* Step content */}
              <button
                onClick={() => isClickable && onStepClick!(step.number)}
                disabled={!isClickable && !isActive}
                className={cn(
                  "flex-1 flex items-center gap-4 px-8 transition-all duration-200 text-left h-full group relative",
                  isActive && "bg-white border-[1px] border-gray-900 rounded-[4px] -my-[1px] -mx-[1px] z-30"
                )}
              >
                {/* Step number */}
                <span
                  className={cn(
                    "text-[42px] font-light leading-none select-none flex-shrink-0 transition-colors duration-200",
                    isActive || isCompleted ? "text-gray-900" : "text-[#d1d5db]"
                  )}
                >
                  {step.number}
                </span>

                {/* Text group */}
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                  <span className="text-[10px] text-[#8e959c] tracking-tight mb-0.5">
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "text-[14px] font-bold tracking-normal transition-colors duration-200",
                      isActive || isCompleted ? "text-gray-900" : "text-[#b8bfc6]"
                    )}
                  >
                    {step.title}
                  </span>

                  {/* Completed summary line */}
                  {isCompleted && step.data?.productName && (
                    <div className="flex items-center gap-2 mt-1">
                       <button className="text-[10px] text-[#9ca3af] underline hover:text-gray-600">View</button>
                       <span className="text-[10px] text-gray-900 font-medium truncate max-w-[120px]">
                        {step.data.price}
                       </span>
                    </div>
                  )}

                  {/* Active Step 3 Summary */}
                  {isActive && step.number === 3 && (
                    <div className="absolute right-20 text-right pr-6 border-r border-gray-100 py-1">
                      <div className="text-[9px] text-[#9ca3af] font-bold uppercase tracking-tight leading-none mb-1">Total Price</div>
                      <div className="text-[15px] font-bold text-gray-900 leading-tight">
                         {totalPrice || "$0.00"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Check / Icon */}
                <div className="flex-shrink-0 ml-auto flex items-center">
                  {isCompleted ? (
                    <div className="w-[26px] h-[26px] rounded-full border border-[#d1fae5] bg-[#ecfdf5] flex items-center justify-center">
                      <Check className="w-[14px] h-[14px] text-emerald-600" strokeWidth={3} />
                    </div>
                  ) : (
                    <step.Icon
                      className={cn(
                        "w-[28px] h-[28px] transition-colors duration-200",
                        isActive ? "text-gray-900" : "text-[#b8bfc6]"
                      )}
                    />
                  )}
                </div>
              </button>

              {/* Angle separator (Keyzar notch) */}
              {index < 2 && !isActive && (
                <div className="absolute right-0 top-0 h-full w-[12px] z-10 pointer-events-none translate-x-1/2">
                   <svg viewBox="0 0 12 86" className="h-full w-full fill-none">
                      <path d="M0 0 L12 43 L0 86" stroke="#e5e7eb" strokeWidth="1.5" />
                   </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default BYORStepper
