"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

type EngravingInputProps = {
  value: string
  onChange: (value: string) => void
  maxChars?: number
}

const EngravingInput = ({ value, onChange, maxChars = 20 }: EngravingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, maxChars)
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-light">
          Engraving
        </span>
        <span className="text-[10px] text-gray-400 font-light">
          {value.length}/{maxChars}
        </span>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add personalized text..."
        className={cn(
          "w-full h-10 px-3 text-sm font-light border rounded-sm transition-colors duration-200 outline-none",
          isFocused
            ? "border-gray-900 bg-white"
            : "border-gray-200 bg-gray-50"
        )}
        maxLength={maxChars}
      />
      {value && (
        <div className="border border-gray-100 rounded-sm p-3 bg-gray-50">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-light block mb-1">
            Preview
          </span>
          <p className="text-sm font-serif italic text-gray-700 text-center">
            {value}
          </p>
        </div>
      )}
    </div>
  )
}

export default EngravingInput
