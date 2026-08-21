"use client"

import { useState } from "react"
import { ChevronDown, Gem } from "lucide-react"
import { cn } from "@/lib/utils"

const QuickCheckout = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
          <span className="text-sm font-medium text-gray-900">Quick Checkout</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-light leading-relaxed mt-3">
            Choose your center stone&apos;s origin &amp; size and let our experts handpick the perfect diamond for you.
          </p>
          <button className="text-xs text-gray-900 font-medium underline underline-offset-4 mt-2 hover:text-gray-600 transition-colors">
            Let&apos;s Do It
          </button>
        </div>
      )}
    </div>
  )
}

export default QuickCheckout
