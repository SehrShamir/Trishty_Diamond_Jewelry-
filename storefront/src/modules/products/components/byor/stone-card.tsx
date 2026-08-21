"use client"

import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { Heart, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

type StoneCardProps = {
  product: HttpTypes.StoreProduct
  settingPrice?: number
  isSelected?: boolean
  onSelect: (productId: string, variantId: string) => void
}

type DiamondMeta = {
  carat?: string | number
  color?: string
  clarity?: string
  cut?: string
  shape?: string
  certification?: string
}

// Shape → local beautiful SVG illustrations
const SHAPE_COLORS: Record<string, string> = {
  Round: "#c8d8e8",
  Oval: "#ccd9e5",
  Cushion: "#d2d9e8",
  Princess: "#d0dae8",
  Pear: "#cad5e5",
  Emerald: "#cdd8e6",
  Marquise: "#cad8e8",
  Heart: "#ddd5e8",
}

/** Crisp faceted diamond placeholder — rendered inline, no network request */
function DiamondPlaceholder({ shape = "Round" }: { shape?: string }) {
  const fill = SHAPE_COLORS[shape] || "#cdd8e8"
  const accent = "#a8c0d8"
  const shine = "#e8eff5"

  if (shape === "Oval") {
    return (
      <svg viewBox="0 0 120 140" className="w-full h-full p-4" fill="none">
        <ellipse cx="60" cy="70" rx="46" ry="58" fill={fill} stroke={accent} strokeWidth="0.5" />
        <polygon points="60,15 96,50 96,90 60,125 24,90 24,50" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.6" />
        <ellipse cx="60" cy="55" rx="18" ry="14" fill={shine} opacity="0.4" />
        <line x1="60" y1="15" x2="60" y2="125" stroke={accent} strokeWidth="0.3" opacity="0.4" />
        <line x1="24" y1="70" x2="96" y2="70" stroke={accent} strokeWidth="0.3" opacity="0.4" />
        <line x1="24" y1="50" x2="96" y2="90" stroke={accent} strokeWidth="0.3" opacity="0.3" />
        <line x1="96" y1="50" x2="24" y2="90" stroke={accent} strokeWidth="0.3" opacity="0.3" />
      </svg>
    )
  }

  if (shape === "Emerald") {
    return (
      <svg viewBox="0 0 120 140" className="w-full h-full p-4" fill="none">
        <rect x="20" y="25" width="80" height="90" rx="4" fill={fill} stroke={accent} strokeWidth="0.5" />
        <rect x="28" y="33" width="64" height="74" rx="2" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.7" />
        <rect x="36" y="41" width="48" height="58" rx="1" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.4" />
        <rect x="30" y="40" width="60" height="10" fill={shine} opacity="0.35" />
        <line x1="20" y1="25" x2="36" y2="41" stroke={accent} strokeWidth="0.3" opacity="0.5" />
        <line x1="100" y1="25" x2="84" y2="41" stroke={accent} strokeWidth="0.3" opacity="0.5" />
        <line x1="20" y1="115" x2="36" y2="99" stroke={accent} strokeWidth="0.3" opacity="0.5" />
        <line x1="100" y1="115" x2="84" y2="99" stroke={accent} strokeWidth="0.3" opacity="0.5" />
      </svg>
    )
  }

  if (shape === "Princess") {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full p-4" fill="none">
        <rect x="18" y="18" width="84" height="84" fill={fill} stroke={accent} strokeWidth="0.5" />
        <line x1="18" y1="18" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.6" />
        <line x1="102" y1="18" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.6" />
        <line x1="18" y1="102" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.6" />
        <line x1="102" y1="102" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.6" />
        <line x1="18" y1="18" x2="102" y2="18" stroke={accent} strokeWidth="0.3" opacity="0.3" />
        <line x1="18" y1="60" x2="102" y2="60" stroke={accent} strokeWidth="0.3" opacity="0.3" />
        <line x1="60" y1="18" x2="60" y2="102" stroke={accent} strokeWidth="0.3" opacity="0.3" />
        <polygon points="22,22 50,35 50,85 22,98" fill={shine} opacity="0.2" />
      </svg>
    )
  }

  if (shape === "Pear") {
    return (
      <svg viewBox="0 0 120 150" className="w-full h-full p-4" fill="none">
        <path d="M60 12 C80 30 95 55 95 80 C95 110 80 135 60 135 C40 135 25 110 25 80 C25 55 40 30 60 12Z" fill={fill} stroke={accent} strokeWidth="0.5" />
        <path d="M60 12 C70 35 78 55 78 80 C78 110 70 135 60 135" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.5" />
        <path d="M60 12 C50 35 42 55 42 80 C42 110 50 135 60 135" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.5" />
        <ellipse cx="54" cy="45" rx="12" ry="9" fill={shine} opacity="0.4" />
        <line x1="60" y1="12" x2="60" y2="135" stroke={accent} strokeWidth="0.3" opacity="0.4" />
        <line x1="25" y1="85" x2="95" y2="85" stroke={accent} strokeWidth="0.3" opacity="0.3" />
      </svg>
    )
  }

  // Default: Round brilliant
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full p-3" fill="none">
      {/* Outer girdle */}
      <circle cx="60" cy="60" r="50" fill={fill} stroke={accent} strokeWidth="0.5" />
      {/* Table octagon */}
      <polygon
        points="60,28 79,36 86,55 79,74 60,82 41,74 34,55 41,36"
        fill={shine}
        fillOpacity="0.4"
        stroke={accent}
        strokeWidth="0.5"
      />
      {/* Star facets — lines from table corners to culet */}
      <line x1="60" y1="28" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="79" y1="36" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="86" y1="55" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="79" y1="74" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="60" y1="82" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="41" y1="74" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="34" y1="55" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      <line x1="41" y1="36" x2="60" y2="60" stroke={accent} strokeWidth="0.4" opacity="0.55" />
      {/* Upper half facets to girdle */}
      <line x1="60" y1="10" x2="60" y2="28" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="92" y1="28" x2="79" y2="36" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="105" y1="55" x2="86" y2="55" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="92" y1="92" x2="79" y2="74" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="60" y1="110" x2="60" y2="82" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="28" y1="92" x2="41" y2="74" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="15" y1="55" x2="34" y2="55" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      <line x1="28" y1="28" x2="41" y2="36" stroke={accent} strokeWidth="0.3" opacity="0.4" />
      {/* Culet */}
      <circle cx="60" cy="60" r="4" fill={shine} opacity="0.8" />
      {/* Top shine */}
      <ellipse cx="52" cy="44" rx="9" ry="6" fill={shine} opacity="0.5" transform="rotate(-20 52 44)" />
    </svg>
  )
}

const StoneCard = ({ product, settingPrice, isSelected, onSelect }: StoneCardProps) => {
  const metadata = (product.metadata || {}) as DiamondMeta
  const variant = product.variants?.[0]
  const { cheapestPrice } = getProductPrice({ product })
  const stonePrice = cheapestPrice?.calculated_price_number || 0

  const handleSelect = () => {
    if (variant?.id) onSelect(product.id, variant.id)
  }

  // Only use the image if it's a real diamond image (not a random Unsplash)
  // We seed diamonds with the same Unsplash photo, so we use our SVG placeholder instead for cleaner UI
  const usePlaceholder = !product.thumbnail || product.thumbnail.includes("unsplash")

  return (
    <button
      onClick={handleSelect}
      className={cn(
        "group text-left w-full rounded-xl overflow-hidden transition-all duration-200 bg-white relative",
        isSelected
          ? "ring-2 ring-gray-900 shadow-lg scale-[1.01]"
          : "border border-gray-100 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
      )}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        className="absolute top-3 right-3 z-10 flex items-center justify-center transition-all group/heart"
      >
        <Heart
          className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors"
          strokeWidth={1.5}
        />
      </button>

      {/* Image / Placeholder bg matches Keyzar */}
      <div className="relative aspect-square overflow-hidden bg-[#c5cfd6]">
        {!usePlaceholder ? (
          <Image
            src={product.thumbnail!}
            alt={product.title || "Diamond"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <DiamondPlaceholder shape={String(metadata.shape || "Round")} />
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="p-3.5 pt-3">
        {/* Shape + Price row */}
        <div className="flex items-start justify-between gap-1 mb-2">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight">
              {metadata.shape || product.title}
            </p>
            {settingPrice != null && cheapestPrice ? (
              <p className="text-[10px] text-gray-500 font-normal leading-tight mt-[3px]">
                With setting: ${(stonePrice + settingPrice).toLocaleString()}
              </p>
            ) : null}
          </div>
          <span className="text-[13px] font-semibold text-gray-900 whitespace-nowrap flex-shrink-0">
            {cheapestPrice?.calculated_price}
          </span>
        </div>

        {/* Spec grid — 4 columns like Keyzar */}
        <div className="grid grid-cols-4 pt-2.5 mt-1 border-t border-gray-100">
          {metadata.carat   && <SpecCol label="Carat"   value={String(metadata.carat)} />}
          {metadata.color   && <SpecCol label="Color"   value={metadata.color} />}
          {metadata.clarity && <SpecCol label="Clarity" value={metadata.clarity} />}
          {metadata.cut     && <SpecCol label="Cut"     value={metadata.cut} />}
        </div>
      </div>
    </button>
  )
}

function SpecCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center border-r border-gray-200 last:border-r-0 py-0.5">
      <p className="text-[10.5px] font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-[8.5px] text-gray-400 tracking-wider uppercase leading-tight mt-0.5">{label}</p>
    </div>
  )
}

export default StoneCard
