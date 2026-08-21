"use client"

import { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"
import React from "react"

type MetalInfo = { color: string; label: string; abbr: string }

const METALS: Record<string, MetalInfo> = {
  "14k yellow gold": { color: "#D4AF37", label: "Yellow Gold", abbr: "14K" },
  "18k yellow gold": { color: "#FFD700", label: "Yellow Gold", abbr: "18K" },
  "14k white gold":  { color: "#E0E0E0", label: "White Gold", abbr: "14K" },
  "18k white gold":  { color: "#F0F0F0", label: "White Gold", abbr: "18K" },
  "14k rose gold":   { color: "#B76E79", label: "Rose Gold", abbr: "14K" },
  "18k rose gold":   { color: "#C9917A", label: "Rose Gold", abbr: "18K" },
  "platinum":        { color: "#E5E4E2", label: "Platinum", abbr: "PT" },
  "yellow gold":     { color: "#D4AF37", label: "Yellow Gold", abbr: "14K" },
  "white gold":      { color: "#E0E0E0", label: "White Gold", abbr: "14K" },
  "rose gold":       { color: "#B76E79", label: "Rose Gold", abbr: "14K" },
}

function getMetalInfo(value: string): MetalInfo {
  return METALS[value.toLowerCase().trim()] || { color: "#ccc", label: value, abbr: "" }
}

type MetalSwatchSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  disabled: boolean
}

const MetalSwatchSelect: React.FC<MetalSwatchSelectProps> = ({
  option, current, updateOption, disabled,
}) => {
  const values = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-2.5">
      {/* Label: "Material: 14k Yellow Gold" */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium text-gray-900 tracking-wide">Material:</span>
        {current && <span className="text-xs text-gray-500 font-light">{current}</span>}
      </div>

      {/* Swatch cards — Keyzar style: circle with abbr + label below */}
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Metal type">
        {values.map((value) => {
          const info = getMetalInfo(value)
          const isSelected = value === current

          return (
            <button
              key={value}
              onClick={() => updateOption(option.id, value)}
              disabled={disabled}
              role="radio"
              aria-checked={isSelected}
              aria-label={value}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-[68px] h-[72px] border rounded-md transition-all duration-200",
                isSelected
                  ? "border-gray-900 bg-white shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              {/* Colored circle with abbreviation */}
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-medium border",
                  info.color === "#E0E0E0" || info.color === "#F0F0F0" || info.color === "#E5E4E2"
                    ? "text-gray-600 border-gray-300"
                    : "text-white border-transparent"
                )}
                style={{
                  backgroundColor: info.color,
                  borderColor: isSelected ? "#111" : undefined,
                }}
              >
                {info.abbr}
              </div>
              {/* Label below */}
              <span className={cn(
                "text-[9px] tracking-wider font-light leading-tight text-center",
                isSelected ? "text-gray-900" : "text-gray-500"
              )}>
                {info.label}
              </span>
            </button>
          )
        })}
        {/* Plus card */}
        <button className="flex flex-col items-center justify-center gap-1.5 w-[68px] h-[72px] border border-gray-200 rounded-md hover:border-gray-400 transition-all">
          <span className="text-xl text-gray-300 font-light">+</span>
        </button>
      </div>
    </div>
  )
}

export function isMetalOption(option: HttpTypes.StoreProductOption): boolean {
  const title = (option.title || "").toLowerCase()
  return title.includes("metal") || title === "material"
}

export default MetalSwatchSelect
