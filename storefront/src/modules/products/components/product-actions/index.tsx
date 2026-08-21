"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import OptionSelect from "./option-select"
import MetalSwatchSelect, { isMetalOption } from "./metal-swatch-select"
import IconOptionSelect, { isIconOption } from "./icon-option-select"
import InstallmentPrice from "./installment-price"
import AddonsPanel, { type AddonSelection } from "./addons-panel"
import QuickCheckout from "./quick-checkout"
import { isEqual } from "lodash"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { getProductPrice } from "@lib/util/get-product-price"
import { Heart, ShoppingBag, CalendarDays, Truck, Diamond, ChevronRight, Plus } from "lucide-react"
import { BookAppointment } from "@/components/book-appointment"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  countryCode: string
  isCustomizable?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

function isDropdownOption(option: HttpTypes.StoreProductOption): boolean {
  const title = (option.title || "").toLowerCase()
  return title.includes("size") || title.includes("ring size")
}

export default function ProductActions({
  product,
  disabled,
  countryCode,
  isCustomizable = false,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize options from URL variant or default to the first available variant
  const [options, setOptions] = useState<Record<string, string | undefined>>(() => {
    const vId = searchParams.get("v_id")
    let initialVariant = product.variants?.find(v => v.id === vId)
    if (!initialVariant && product.variants?.length) {
      initialVariant = product.variants[0]
    }
    return initialVariant ? (optionsAsKeymap(initialVariant.options) ?? {}) : {}
  })

  const [isAdding, setIsAdding] = useState(false)
  const [addonSelection, setAddonSelection] = useState<AddonSelection>({
    engraving_text: "",
    selected_addons: [],
  })

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null
    if (params.get("v_id") === value) return
    if (value) params.set("v_id", value)
    else params.delete("v_id")
    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (selectedVariant?.manage_inventory && (selectedVariant?.inventory_quantity || 0) > 0) return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const priceData = useMemo(() => {
    const { variantPrice, cheapestPrice } = getProductPrice({ product, variantId: selectedVariant?.id })
    return selectedVariant ? variantPrice : cheapestPrice
  }, [product, selectedVariant])

  const buildCartMetadata = (): Record<string, unknown> | undefined => {
    const meta: Record<string, unknown> = {}
    if (addonSelection.engraving_text) meta.engraving_text = addonSelection.engraving_text
    if (addonSelection.selected_addons.length > 0) meta.selected_addons = addonSelection.selected_addons
    return Object.keys(meta).length > 0 ? meta : undefined
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode, metadata: buildCartMetadata() })
    setIsAdding(false)
  }

  const handleAddCenterStone = () => {
    if (!selectedVariant?.id) return
    const params = new URLSearchParams()
    params.set("step", "2")
    params.set("setting_vid", selectedVariant.id)
    params.set("setting_pid", product.id)
    router.push(pathname + "?" + params.toString())
  }

  return (
    <>
      <div className="flex flex-col gap-y-5" ref={actionsRef}>

        {/* ─── OPTIONS ─── */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-5">
            {(product.options || []).map((option) => {
              if (isMetalOption(option)) {
                return (
                  <MetalSwatchSelect
                    key={option.id}
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    disabled={!!disabled || isAdding}
                  />
                )
              }
              if (isIconOption(option)) {
                return (
                  <IconOptionSelect
                    key={option.id}
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    disabled={!!disabled || isAdding}
                  />
                )
              }
              if (isDropdownOption(option)) {
                return (
                  <RingSizeSelect
                    key={option.id}
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    disabled={!!disabled || isAdding}
                  />
                )
              }
              return (
                <OptionSelect
                  key={option.id}
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              )
            })}
          </div>
        )}

        {/* ─── ADD-ONS ─── */}
        <AddonsPanel product={product} selection={addonSelection} onSelectionChange={setAddonSelection} />

        {/* ─── QUICK CHECKOUT (customizable only) ─── */}
        {isCustomizable && <QuickCheckout />}

        {/* ─── TOTAL PRICE ─── */}
        <div className="text-center border-t border-gray-100 pt-5">
          <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-light block mb-1">
            Total Price
          </span>
          <ProductPrice product={product} variant={selectedVariant} />
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Truck className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.2} />
            <span className="text-[11px] text-gray-400 font-light">Ships in 3-4 weeks</span>
          </div>
        </div>

        {/* ─── CTA BUTTONS — Keyzar pill style ─── */}
        {isCustomizable ? (
          <div className="flex flex-col gap-y-2.5">
            {/* Add Center Stone — black pill with diamond icon + arrow */}
            <button
              onClick={handleAddCenterStone}
              disabled={!selectedVariant || !!disabled || isAdding || !isValidVariant}
              className="w-full h-[52px] bg-gray-900 text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-full hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-between px-6"
              data-testid="add-center-stone-button"
            >
              <Diamond className="w-4 h-4" strokeWidth={1.5} />
              <span>{!selectedVariant ? "Select options first" : "Add Center Stone"}</span>
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
            {/* Buy Setting Only — outlined pill */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
              className="w-full h-[46px] bg-white text-gray-900 text-[11px] uppercase tracking-[0.2em] font-medium rounded-full border border-gray-900 hover:bg-gray-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center justify-center flex-col"
              data-testid="buy-setting-only-button"
            >
              <span>{isAdding ? "Adding..." : !selectedVariant ? "Select variant" : !inStock ? "Out of stock" : "Buy Setting Only*"}</span>
              {selectedVariant && inStock && (
                <span className="text-[8px] text-gray-400 font-light tracking-wider -mt-0.5">center stone not included</span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-y-2.5">
            {/* Add to Shopping Bag — black pill with bag + plus icons */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
              className="w-full h-[52px] bg-gray-900 text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-full hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-between px-6"
              data-testid="add-product-button"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <span>{isAdding ? "Adding..." : !selectedVariant ? "Select variant" : !inStock ? "Out of stock" : "Add to Shopping Bag"}</span>
              <Plus className="w-4 h-4" strokeWidth={1.5} />
            </button>
            {/* Set A Meeting — outlined pill (opens cal.com dialog) */}
            <BookAppointment
              asSpan
              className="w-full h-[46px] bg-white text-gray-900 text-[11px] uppercase tracking-[0.2em] font-medium rounded-full border border-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Set A Meeting
            </BookAppointment>
          </div>
        )}

        {/* ─── INSTALLMENT ─── */}
        {priceData && (
          <div className="text-center">
            <InstallmentPrice amount={priceData.calculated_price_number} currencyCode={priceData.currency_code} months={4} />
          </div>
        )}

        {/* ─── WISHLIST ─── */}
        <button className="flex items-center justify-center gap-2 text-[11px] text-gray-400 hover:text-gray-900 font-light tracking-[0.1em] transition-colors py-1">
          <Heart className="w-4 h-4" strokeWidth={1.2} />
          Add to wish list
        </button>
      </div>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </>
  )
}

function RingSizeSelect({ option, current, updateOption, disabled }: {
  option: HttpTypes.StoreProductOption; current: string | undefined
  updateOption: (id: string, v: string) => void; disabled: boolean
}) {
  const values = (option.values ?? []).map((v) => v.value)
  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-900 tracking-wide">Select Ring Size</span>
        <button className="text-[10px] text-gray-400 underline underline-offset-4 hover:text-gray-700 font-light tracking-wider transition-colors">
          Find My Ring Size
        </button>
      </div>
      <select
        value={current || ""}
        onChange={(e) => updateOption(option.id, e.target.value)}
        disabled={disabled}
        className="w-full h-12 px-4 text-sm font-light border border-gray-200 rounded-full bg-white text-gray-900 outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
      >
        <option value="" disabled>Select Ring Size</option>
        {values.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  )
}
