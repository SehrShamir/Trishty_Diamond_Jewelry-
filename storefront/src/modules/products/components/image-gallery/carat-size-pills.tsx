"use client"

import { cn } from "@/lib/utils"

const CARAT_SIZES = ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"]

type CaratSizePillsProps = {
  selected: string
  onSelect: (size: string) => void
}

const CaratSizePills = ({ selected, onSelect }: CaratSizePillsProps) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
      {CARAT_SIZES.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full text-[11px] font-light transition-all duration-200 border",
            size === selected
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          )}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

export default CaratSizePills
