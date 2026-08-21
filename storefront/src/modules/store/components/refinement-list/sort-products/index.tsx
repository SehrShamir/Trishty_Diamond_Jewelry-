"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price (low-to-high)",
  },
  {
    value: "price_desc",
    label: "Price (high-to-low)",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (value: SortOptions) => {
    setQueryParams("sortBy", value)
    setIsOpen(false)
  }

  const currentOption = sortOptions.find((o) => o.value === sortBy) || sortOptions[0]

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-testid={dataTestId}
          className="bg-white text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between min-w-[200px] hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {currentOption.label}
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50 py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value as SortOptions)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  sortBy === option.value
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SortProducts
