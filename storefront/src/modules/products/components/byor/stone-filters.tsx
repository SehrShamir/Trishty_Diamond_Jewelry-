"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"

export type StoneFilters = {
  stoneType: "lab-grown" | "natural" | null
  shape: string | null
  colorMin: string | null
  clarityMin: string | null
  cut: string | null
  caratMin: number
  caratMax: number
  budgetMin: number
  budgetMax: number
  certificate: string | null
}

export const DEFAULT_FILTERS: StoneFilters = {
  stoneType: "lab-grown",   // Pre-select Lab Grown (recommended, like Keyzar)
  shape: "Round",           // Pre-select Round (most popular shape)
  colorMin: "H",            // Recommended minimum color
  clarityMin: "VS1",        // Recommended minimum clarity
  cut: "EXCELLENT",         // Recommended cut
  caratMin: 0.5,
  caratMax: 11,
  budgetMin: 300,
  budgetMax: 10000000,
  certificate: "GIA",       // Recommended certificate
}

// Ordered from worst → best so we can do >=index comparisons
export const COLOR_ORDER = ["J", "I", "H", "G", "F", "E", "D"]
export const CLARITY_ORDER = ["SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"]

const CUTS = ["GOOD", "VERY GOOD", "EXCELLENT"]
const CERTIFICATES = ["IGI", "GIA"]

// Simple shape SVG paths (inline for zero-dep icons)
const ShapeSVGs: Record<string, React.FC<{ className?: string }>> = {
  Round: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
    </svg>
  ),
  Emerald: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
    </svg>
  ),
  Heart: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" />
    </svg>
  ),
  Marquise: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 3 C16 8, 21 10, 21 12 C21 14, 16 16, 12 21 C8 16, 3 14, 3 12 C3 10, 8 8, 12 3z" />
    </svg>
  ),
  Oval: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <ellipse cx="12" cy="12" rx="7" ry="9" />
    </svg>
  ),
  Pear: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 3 C17 6, 19 10, 19 13 C19 17.5 15.5 21 12 21 C8.5 21 5 17.5 5 13 C5 10 7 6 12 3z" />
    </svg>
  ),
  Princess: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="4" width="16" height="16" />
      <line x1="4" y1="12" x2="20" y2="12" /><line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  Cushion: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="4" width="16" height="16" rx="5" />
    </svg>
  ),
}

const SHAPES = [
  "Round", "Emerald", "Heart", "Marquise", "Oval", "Pear", "Princess", "Cushion",
]

type Props = {
  filters: StoneFilters
  onFilterChange: (f: StoneFilters) => void
}

const StoneFiltersPanel = ({ filters, onFilterChange }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const toggle = <K extends keyof StoneFilters>(key: K, val: StoneFilters[K]) => {
    onFilterChange({ ...filters, [key]: filters[key] === val ? null : val })
  }

  return (
    <div className="space-y-5">

      {/* Stone Type Toggle */}
      <div className="flex justify-center gap-3">
        {(["lab-grown", "natural"] as const).map((type) => (
          <button
            key={type}
            onClick={() => toggle("stoneType", type)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 border rounded-full text-sm font-light tracking-wide transition-all",
              filters.stoneType === type
                ? "border-gray-900 bg-white text-gray-900 shadow-sm font-medium"
                : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
            {type === "lab-grown" ? "Lab Grown" : "Natural"}
          </button>
        ))}
      </div>

      {/* Shape Picker */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {SHAPES.map((shape) => {
          const Icon = ShapeSVGs[shape]
          const isActive = filters.shape === shape
          return (
            <button
              key={shape}
              onClick={() => toggle("shape", shape)}
              className={cn(
                "flex flex-col items-center gap-1.5 w-[64px] py-3 rounded-xl transition-all duration-150 border-[1.5px]",
                isActive
                  ? "border-gray-900 bg-white shadow-sm"
                  : "border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50"
              )}
            >
              {Icon ? (
                <Icon className={cn("w-5 h-5", isActive ? "text-gray-900" : "text-gray-400")} />
              ) : (
                <div className={cn("w-5 h-5 rounded-full border", isActive ? "border-gray-900" : "border-gray-300")} />
              )}
              <span className={cn(
                "text-[9px] tracking-widest uppercase mt-0.5",
                isActive ? "text-gray-900 font-semibold" : "text-gray-400"
              )}>
                {shape}
              </span>
            </button>
          )
        })}
      </div>

      {/* Reset */}
      <div className="text-center -mt-1">
        <button
          onClick={() => onFilterChange(DEFAULT_FILTERS)}
          className="text-[10px] text-gray-400 tracking-widest uppercase underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Color / Clarity / Cut */}
      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        {/* Color */}
        <div>
          <span className="text-[11px] font-semibold text-gray-700 block mb-2 tracking-wide">Color</span>
          <div className="flex w-full">
            {COLOR_ORDER.map((c, i) => {
              const isActive = filters.colorMin === c;
              return (
                <button
                  key={c}
                  onClick={() => toggle("colorMin", c)}
                  className={cn(
                    "flex-1 py-1.5 text-[10.5px] tracking-widest transition-all relative border",
                    i === 0 ? "rounded-l-md" : "-ml-px",
                    i === COLOR_ORDER.length - 1 ? "rounded-r-md" : "",
                    isActive
                      ? "border-gray-900 bg-white text-gray-900 font-semibold z-10 shadow-[0_0_0_0.5px_rgba(17,24,39,1)]"
                      : "border-gray-200 bg-[#f8f9fa] text-gray-400 hover:bg-gray-50 hover:text-gray-600 z-0"
                  )}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* Clarity */}
        <div>
          <span className="text-[11px] font-semibold text-gray-700 block mb-2 tracking-wide">Clarity</span>
          <div className="flex w-full">
            {CLARITY_ORDER.map((c, i) => {
              const isActive = filters.clarityMin === c;
              return (
                <button
                  key={c}
                  onClick={() => toggle("clarityMin", c)}
                  className={cn(
                    "flex-1 py-1.5 text-[10.5px] tracking-widest transition-all relative border",
                    i === 0 ? "rounded-l-md" : "-ml-px",
                    i === CLARITY_ORDER.length - 1 ? "rounded-r-md" : "",
                    isActive
                      ? "border-gray-900 bg-white text-gray-900 font-semibold z-10 shadow-[0_0_0_0.5px_rgba(17,24,39,1)]"
                      : "border-gray-200 bg-[#f8f9fa] text-gray-400 hover:bg-gray-50 hover:text-gray-600 z-0"
                  )}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* Cut */}
        <div className="col-span-1">
          <span className="text-[11px] font-semibold text-gray-700 block mb-2 tracking-wide">Cut</span>
          <div className="flex w-full">
            {CUTS.map((c, i) => {
              const isActive = filters.cut === c;
              return (
                <button
                  key={c}
                  onClick={() => toggle("cut", c)}
                  className={cn(
                    "flex-1 py-1.5 text-[10px] tracking-widest uppercase transition-all relative border",
                    i === 0 ? "rounded-l-md" : "-ml-px",
                    i === CUTS.length - 1 ? "rounded-r-md" : "",
                    isActive
                      ? "border-gray-900 bg-white text-gray-900 font-semibold z-10 shadow-[0_0_0_0.5px_rgba(17,24,39,1)]"
                      : "border-gray-200 bg-[#f8f9fa] text-gray-400 hover:bg-gray-50 hover:text-gray-600 z-0"
                  )}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Carat / Budget / Certificate */}
      <div className="grid grid-cols-3 gap-4">
        {/* Carat */}
        <div>
          <span className="text-[11px] font-semibold text-gray-700 block mb-2 tracking-wide">Carat</span>
          <input
            type="range"
            min={0.5}
            max={11}
            step={0.1}
            value={filters.caratMax}
            onChange={(e) => onFilterChange({ ...filters, caratMax: parseFloat(e.target.value) })}
            className="w-full accent-gray-900 h-1 cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">{filters.caratMin} ct</span>
            <span className="text-[10px] text-gray-600 font-medium">{filters.caratMax} ct</span>
          </div>
        </div>

        {/* Budget */}
        <div>
          <span className="text-[11px] font-semibold text-gray-700 block mb-2 tracking-wide">Budget</span>
          <div className="flex gap-1.5">
            <input
              type="number"
              value={filters.budgetMin}
              onChange={(e) => onFilterChange({ ...filters, budgetMin: parseInt(e.target.value) || 0 })}
              className="w-full h-8 px-2 text-[10px] border border-gray-200 rounded text-gray-600 outline-none focus:border-gray-900 transition-colors"
              placeholder="Min $"
            />
            <input
              type="number"
              value={filters.budgetMax}
              onChange={(e) => onFilterChange({ ...filters, budgetMax: parseInt(e.target.value) || 0 })}
              className="w-full h-8 px-2 text-[10px] border border-gray-200 rounded text-gray-600 outline-none focus:border-gray-900 transition-colors"
              placeholder="Max $"
            />
          </div>
        </div>

        {/* Certificate */}
        <div>
          <span className="text-[11px] font-semibold text-gray-700 block mb-2 tracking-wide">Certificate</span>
          <div className="flex w-full mt-1">
            {CERTIFICATES.map((c, i) => {
              const isActive = filters.certificate === c;
              return (
                <button
                  key={c}
                  onClick={() => toggle("certificate", c)}
                  className={cn(
                    "flex-1 text-[10px] tracking-widest py-1.5 border transition-all uppercase relative",
                    i === 0 ? "rounded-l-md" : "-ml-px",
                    i === CERTIFICATES.length - 1 ? "rounded-r-md" : "",
                    isActive
                      ? "border-gray-900 text-gray-900 font-semibold bg-white z-10 shadow-[0_0_0_0.5px_rgba(17,24,39,1)]"
                      : "border-gray-200 bg-[#f8f9fa] text-gray-400 hover:bg-gray-50 hover:text-gray-600 z-0"
                  )}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center justify-center gap-1 w-full text-[10px] text-gray-400 tracking-widest uppercase hover:text-gray-600 transition-colors"
      >
        Advanced Quality Specs
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", showAdvanced && "rotate-180")} />
      </button>
    </div>
  )
}

// GradePill wrapper removed as we are now using inline segmented controls

export default StoneFiltersPanel
