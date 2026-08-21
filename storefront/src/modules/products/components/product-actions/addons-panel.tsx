"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"
import EngravingInput from "./engraving-input"

export type AddonSelection = {
  engraving_text: string
  selected_addons: string[]
}

type Addon = {
  id: string
  label: string
  type: "free" | "paid"
  description?: string
}

type AddonsPanelProps = {
  product: HttpTypes.StoreProduct
  selection: AddonSelection
  onSelectionChange: (selection: AddonSelection) => void
}

const AddonsPanel = ({ product, selection, onSelectionChange }: AddonsPanelProps) => {
  const metadata = product.metadata as Record<string, unknown> | null

  // Read available add-ons from product metadata
  const availableAddons = (metadata?.available_addons as Addon[] | undefined) || []

  // Check if engraving is available (from metadata or default for settings)
  const hasEngraving = metadata?.has_engraving === true || availableAddons.some((a) => a.id === "engraving")

  if (availableAddons.length === 0 && !hasEngraving) return null

  const toggleAddon = (addonId: string) => {
    const isSelected = selection.selected_addons.includes(addonId)
    onSelectionChange({
      ...selection,
      selected_addons: isSelected
        ? selection.selected_addons.filter((id) => id !== addonId)
        : [...selection.selected_addons, addonId],
    })
  }

  return (
    <div className="space-y-4">
      <span className="text-xs uppercase tracking-widest text-gray-500 font-light block">
        Personalize
      </span>

      {/* Toggle add-ons */}
      {availableAddons
        .filter((addon) => addon.id !== "engraving")
        .map((addon) => {
          const isSelected = selection.selected_addons.includes(addon.id)

          return (
            <button
              key={addon.id}
              onClick={() => toggleAddon(addon.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 border rounded-sm transition-all duration-200 text-left",
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div>
                <p className="text-sm font-light text-gray-900">{addon.label}</p>
                {addon.description && (
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    {addon.description}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors",
                  isSelected
                    ? "border-gray-900 bg-gray-900"
                    : "border-gray-300"
                )}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </button>
          )
        })}

      {/* Engraving */}
      {hasEngraving && (
        <EngravingInput
          value={selection.engraving_text}
          onChange={(text) =>
            onSelectionChange({ ...selection, engraving_text: text })
          }
        />
      )}
    </div>
  )
}

export default AddonsPanel
