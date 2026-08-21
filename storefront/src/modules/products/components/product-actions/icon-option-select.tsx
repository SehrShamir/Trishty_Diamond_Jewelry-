"use client"

import { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"
import { Diamond, Circle, Hexagon, Pentagon, Gem, Star, Sparkles, Paintbrush } from "lucide-react"

// Map option values to icons
const SHAPE_ICONS: Record<string, React.ElementType> = {
  round: Circle,
  oval: Hexagon,
  pear: Gem,
  cushion: Pentagon,
  emerald: Hexagon,
  princess: Diamond,
  marquise: Star,
  radiant: Diamond,
  asscher: Hexagon,
  heart: Sparkles,
}

const STYLE_ICONS: Record<string, React.ElementType> = {
  solitaire: Diamond,
  pave: Sparkles,
  halo: Circle,
  "three stone": Star,
  vintage: Gem,
  bezel: Pentagon,
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  polished: Paintbrush,
  matte: Circle,
  hammered: Sparkles,
  brushed: Paintbrush,
}

function getIconForValue(value: string, optionTitle: string): React.ElementType {
  const normalized = value.toLowerCase().trim()
  const title = optionTitle.toLowerCase()

  if (title.includes("shape") || title.includes("stone shape") || title.includes("center stone")) {
    return SHAPE_ICONS[normalized] || Diamond
  }
  if (title.includes("style")) {
    return STYLE_ICONS[normalized] || Diamond
  }
  if (title.includes("type") || title.includes("finish")) {
    return TYPE_ICONS[normalized] || Circle
  }
  return Diamond
}

type IconOptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  disabled: boolean
}

const IconOptionSelect = ({ option, current, updateOption, disabled }: IconOptionSelectProps) => {
  const values = (option.values ?? []).map((v) => v.value)
  const title = option.title || ""

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium text-gray-900 tracking-wide">{title}:</span>
        {current && <span className="text-xs text-gray-500 font-light">{current}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const Icon = getIconForValue(value, title)
          const isSelected = value === current

          return (
            <button
              key={value}
              onClick={() => updateOption(option.id, value)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-[68px] h-[72px] border rounded-md transition-all duration-200",
                isSelected
                  ? "border-gray-900 bg-white shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              <Icon className={cn("w-5 h-5", isSelected ? "text-gray-900" : "text-gray-400")} strokeWidth={1.2} />
              <span className={cn("text-[9px] tracking-wider font-light leading-tight text-center", isSelected ? "text-gray-900" : "text-gray-500")}>
                {value}
              </span>
            </button>
          )
        })}
        {/* Plus button for more options */}
        <button className="flex flex-col items-center justify-center gap-1.5 w-[68px] h-[72px] border border-gray-200 rounded-md hover:border-gray-400 transition-all">
          <span className="text-xl text-gray-300 font-light">+</span>
        </button>
      </div>
    </div>
  )
}

/** Determines if an option should use icon-based selection */
export function isIconOption(option: HttpTypes.StoreProductOption): boolean {
  const title = (option.title || "").toLowerCase()
  return (
    title.includes("shape") ||
    title.includes("stone shape") ||
    title.includes("center stone") ||
    title.includes("style") ||
    title.includes("type") ||
    title.includes("finish")
  )
}

export default IconOptionSelect
