"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { useBYOR } from "./byor-context"
import { listProducts } from "@lib/data/products"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { Loader2, CalendarDays, ChevronDown, Check, Diamond, Plane, ShieldCheck, RefreshCcw, FileText, CheckCircle2, ChevronRight, Gem, Info, Star, Truck, ShoppingBag, Plus } from "lucide-react"
import { BookAppointment } from "@/components/book-appointment"

type BYORSummaryProps = { countryCode: string }

export default function BYORSummary({ countryCode }: BYORSummaryProps) {
  const { settingProductId, settingVariantId, stoneProductId, stoneVariantId, goToStep, reset } = useBYOR()
  const [settingProduct, setSettingProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [stoneProduct, setStoneProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const promises = []
        if (settingProductId) promises.push(listProducts({ countryCode, queryParams: { id: [settingProductId] } }).then(({ response }) => response.products[0]))
        if (stoneProductId) promises.push(listProducts({ countryCode, queryParams: { id: [stoneProductId] } }).then(({ response }) => response.products[0]))
        const results = await Promise.all(promises)
        if (settingProductId) setSettingProduct(results[0] || null)
        if (stoneProductId) setStoneProduct(results[settingProductId ? 1 : 0] || null)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [settingProductId, stoneProductId, countryCode])

  // Pricing
  const settingPrice = useMemo(() => {
    if (!settingProduct || !settingVariantId) return null
    return getProductPrice({ product: settingProduct, variantId: settingVariantId }).variantPrice
  }, [settingProduct, settingVariantId])

  const stonePrice = useMemo(() => {
    if (!stoneProduct || !stoneVariantId) return null
    return getProductPrice({ product: stoneProduct, variantId: stoneVariantId }).variantPrice
  }, [stoneProduct, stoneVariantId])

  const totalPrice = useMemo(() => {
    if (!settingPrice || !stonePrice) return null
    const amount = settingPrice.calculated_price_number + stonePrice.calculated_price_number
    return convertToLocale({ amount, currency_code: settingPrice.currency_code })
  }, [settingPrice, stonePrice])

  const settingVariant = settingProduct?.variants?.find((v) => v.id === settingVariantId)
  const stoneMeta = (stoneProduct?.metadata || {}) as Record<string, string>

  const isLabGrown = stoneMeta.certificate === "IGI" || stoneMeta.certificate?.includes("Lab")
  const typeText = isLabGrown ? "Lab Grown" : "Natural"
  const shapeText = stoneMeta.shape || "Round"
  const combinedTitle = `${settingProduct?.title || "Engagement Ring"} with a ${stoneMeta.carat || "0.5"} Carat ${stoneMeta.color || "H"} ${stoneMeta.clarity || "VS1"} ${shapeText} ${typeText} Diamond`

  const handleAddToCart = async () => {
    if (!settingVariantId || !stoneVariantId) return
    setIsAdding(true)
    const groupId = crypto.randomUUID()
    try {
      await addToCart({ variantId: settingVariantId, quantity: 1, countryCode, metadata: { build_type: "byor", byor_group_id: groupId, linked_stone_product_id: stoneProductId } })
      await addToCart({ variantId: stoneVariantId, quantity: 1, countryCode, metadata: { build_type: "byor", byor_group_id: groupId, linked_setting_product_id: settingProductId } })
    } catch (e) {
      console.error(e)
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-40"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
  }

  return (
    <>
    <div className="flex flex-col small:flex-row w-full max-w-[1360px] mx-auto gap-8 small:gap-12 xl:gap-20 pb-16 small:pb-32 items-start">
      {/* ─── LEFT COLUMN: MEDIA GRID ───────────────────────────────────────── */}
      <div className="w-full small:w-[55%] flex flex-col gap-12 small:shrink-0">
        <div className="grid grid-cols-2 gap-1.5 small:sticky small:top-24 small:h-max">
          {/* Top Left: Video / Empty state */}
          <div className="bg-[#fcfcfc] aspect-square rounded-tl-[16px] overflow-hidden relative">
            {stoneProduct?.images?.[1]?.url ? (
               <Image src={stoneProduct.images[1].url} alt="Video" fill className="object-cover" />
            ) : (
               <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center text-gray-300">
                 <Diamond className="w-8 h-8 opacity-20" />
               </div>
            )}
          </div>
          {/* Top Right: Diamond */}
          <div className="bg-[#e2e8f0]/40 aspect-square rounded-tr-[16px] relative flex items-center justify-center overflow-hidden">
             {stoneProduct?.thumbnail ? (
                <Image src={stoneProduct.thumbnail} alt={stoneProduct.title} fill className="object-cover scale-110 mix-blend-multiply" />
             ) : (
                <Gem className="w-16 h-16 text-gray-300" strokeWidth={1} />
             )}
          </div>
          {/* Bottom Left: Certificate Seal */}
          <div className="bg-white aspect-square border border-gray-100 flex flex-col items-center justify-center gap-3">
             <div className="w-20 h-20 rounded-full border border-yellow-600 flex flex-col items-center justify-center p-1">
               <div className="w-full h-full rounded-full border border-yellow-600 border-dashed flex items-center justify-center text-yellow-700 bg-yellow-50/30">
                 <span className="font-serif text-[10px] tracking-widest">{stoneMeta.certificate || "GIA"}</span>
               </div>
             </div>
             <div className="text-center">
                <p className="text-[#a58662] text-[13px] font-bold tracking-widest uppercase">{typeText} Diamond</p>
                <button className="text-[10px] text-gray-500 underline underline-offset-4 decoration-gray-300 mt-2 tracking-widest uppercase hover:text-gray-900 transition-colors">
                  View Certificate
                </button>
             </div>
          </div>
          {/* Bottom Right: Setting Image */}
          <div className="bg-[#f8f9fa] aspect-square rounded-br-[16px] relative flex items-center justify-center overflow-hidden">
             {settingProduct?.thumbnail ? (
                <Image src={settingProduct.thumbnail} alt={settingProduct.title} fill className="object-cover scale-[1.3] pt-12 mix-blend-multiply" />
             ) : (
                <Diamond className="w-16 h-16 text-gray-300" strokeWidth={1} />
             )}
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: STICKY DETAILS ──────────────────────────────────── */}
      <div className="w-full small:w-[42%] flex flex-col small:shrink-0 lg:pl-10 xl:pl-16">
        {/* Title */}
        <div className="flex items-start justify-between gap-6 mb-8 mt-2">
           <h1 className="text-[24px] md:text-[28px] font-semibold text-gray-900 leading-tight tracking-tight">
             {combinedTitle}
           </h1>
           <button className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0 group">
             <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-50 transition-colors">
               <Gem className="w-[18px] h-[18px] text-gray-600" />
             </div>
             <span className="text-[9px] text-gray-500 uppercase tracking-widest">Drop a Hint</span>
           </button>
        </div>

        {/* Product Cards */}
        <div className="space-y-3 mb-8">
           {/* Setting */}
           <div className="bg-[#f8f9fa] rounded-xl p-4 flex items-center gap-4 transition-colors hover:bg-gray-100/70 relative">
             <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
               <Diamond className="w-[18px] h-[18px] text-gray-400" strokeWidth={1.5} />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900 tracking-wide">{settingProduct?.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{settingVariant?.options?.map((o: any) => o.value).join(", ")}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => goToStep(1)} className="text-[10px] text-gray-500 underline underline-offset-4 decoration-gray-300 hover:text-gray-900">Change</button>
                  <span className="text-[10px] text-gray-300">|</span>
                  <button className="text-[10px] text-gray-500 underline underline-offset-4 decoration-gray-300 hover:text-gray-900">View Details</button>
                </div>
             </div>
             <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-[15px] font-bold text-gray-900">{settingPrice?.calculated_price}</span>
             </div>
           </div>

           {/* Stone */}
           <div className="bg-[#f8f9fa] rounded-xl p-4 flex items-center gap-4 transition-colors hover:bg-gray-100/70 relative">
             <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
               <Gem className="w-[18px] h-[18px] text-gray-400" strokeWidth={1.5} />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900 tracking-wide">{shapeText}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{[stoneMeta.carat && `${stoneMeta.carat}ct`, stoneMeta.color, stoneMeta.clarity].filter(Boolean).join(" ")}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => goToStep(2)} className="text-[10px] text-gray-500 underline underline-offset-4 decoration-gray-300 hover:text-gray-900">Change</button>
                  <span className="text-[10px] text-gray-300">|</span>
                  <button className="text-[10px] text-gray-500 underline underline-offset-4 decoration-gray-300 hover:text-gray-900">View Details</button>
                </div>
             </div>
             <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-[15px] font-bold text-gray-900">{stonePrice?.calculated_price}</span>
             </div>
           </div>

           {/* Extras */}
           <div className="bg-[#f8f9fa] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-[14px] font-bold tracking-wide">Extras</span>
              </div>
              <button className="text-[11px] text-gray-500 underline underline-offset-4 decoration-gray-300 hover:text-gray-900">Add Extras</button>
           </div>
        </div>

        {/* Ring Size Dropdown */}
        <div className="flex items-center gap-4 mb-6 relative">
          <div className="flex-1 relative">
            <select className="w-full appearance-none bg-[#f8f9fa] rounded-full border border-transparent h-[48px] px-6 text-[13px] font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300">
               <option>Select Ring Size</option>
               <option>4.0</option>
               <option>5.0</option>
               <option>6.5</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2} />
          </div>
          <button className="text-[11px] font-medium underline underline-offset-4 decoration-gray-400 hover:text-gray-600 transition-colors shrink-0">
            Find My Ring Size
          </button>
        </div>

        {/* Main Price */}
        <div className="flex flex-col items-center justify-center mb-8 border-t border-gray-100 pt-6">
           <span className="text-[12px] text-gray-400 mb-1">Total Price</span>
           <span className="text-[28px] md:text-[34px] font-bold text-gray-900 tracking-tight leading-none">{totalPrice || "—"}</span>
           
           <div className="bg-[#f8f9fa] rounded-full px-4 py-1.5 mt-3 flex items-center gap-2 border border-gray-200">
             <Truck className="w-[14px] h-[14px] text-gray-500" />
             <span className="text-[11px] font-bold text-gray-900 tracking-wide uppercase">Ships in 3-4 weeks</span>
           </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 mb-4">
           <button
             onClick={handleAddToCart}
             disabled={!settingVariantId || !stoneVariantId || isAdding}
             className="w-full h-[54px] bg-[#0c0c0c] text-white text-[13px] font-semibold rounded-full hover:bg-black transition-all flex items-center justify-between px-6 shadow-md disabled:opacity-50"
           >
             <ShoppingBag className="w-5 h-5 flex-shrink-0 opacity-80" strokeWidth={1.5} />
             <span className="tracking-wide absolute left-1/2 -translate-x-1/2">{isAdding ? "Adding..." : "Add to Shopping Bag"}</span>
             <Plus className="w-5 h-5 flex-shrink-0 opacity-80" strokeWidth={1.5} />
           </button>
           <BookAppointment
             asSpan
             className="w-full h-[54px] bg-white text-gray-900 text-[13px] font-semibold rounded-full border border-gray-900 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center cursor-pointer"
           >
             Set A Meeting
           </BookAppointment>
        </div>

        <p className="text-center text-[10px] text-gray-500 mb-10">
          Pay in 12 interest-free installments of <span className="font-bold text-gray-900">${settingPrice && stonePrice ? ((settingPrice.calculated_price_number + stonePrice.calculated_price_number)/12).toFixed(2) : '—'}</span> <button className="underline">Learn more</button>
        </p>

        {/* Value Props */}
        <div className="grid grid-cols-4 gap-2 mb-10 py-6 border-t border-b border-gray-100">
           {[
             { title: "Overnight\nShipping", icon: Plane },
             { title: "Lifetime\nWarranty", icon: ShieldCheck },
             { title: "30 Days\nFree Return", icon: RefreshCcw },
             { title: "Certificate\n& Appraisal", icon: FileText }
           ].map((v, i) => (
             <div key={i} className="flex flex-col items-center text-center gap-2">
                <v.icon className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                <span className="text-[9px] text-gray-600 font-medium whitespace-pre-line leading-tight">{v.title}</span>
             </div>
           ))}
        </div>

        {/* Diamond Info Card */}
        <div className="bg-[#fcfcfc] border border-gray-200 rounded-2xl p-6 mb-6">
           <div className="flex items-center gap-2 mb-4">
              <Diamond className="w-5 h-5 text-gray-900 fill-gray-50" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold text-gray-900">Your Diamond info</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              {/* Carat */}
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between aspect-[4/3] relative">
                 <span className="text-[9px] uppercase tracking-widest text-[#d8c3f3] font-bold flex items-center gap-1">
                   <Diamond className="w-3 h-3 text-[#d8c3f3] fill-[#d8c3f3]" /> CARAT
                 </span>
                 <Info className="w-3 h-3 text-gray-300 absolute top-3 right-3" />
                 <span className="text-xl font-bold text-gray-900">{stoneMeta.carat || "0.5"}</span>
                 <p className="text-[9px] text-gray-400 mt-2 leading-tight">Universal measurement unit for diamonds</p>
              </div>

              {/* Color */}
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between aspect-[4/3] relative">
                 <span className="text-[9px] uppercase tracking-widest text-[#d8c3f3] font-bold flex items-center gap-1">
                   <span className="w-2.5 h-2.5 rounded-full bg-[#f8e5c4]" /> COLOR
                 </span>
                 <Info className="w-3 h-3 text-gray-300 absolute top-3 right-3" />
                 <span className="text-xl font-bold text-gray-900">{stoneMeta.color || "H"}</span>
                 <div className="w-full h-8 flex mt-1 bg-gradient-to-r from-transparent to-[#fef5d8] border border-gray-100 relative items-center justify-center">
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400"></div>
                 </div>
                 <p className="text-[9px] text-gray-400 mt-1">Nearly colorless</p>
              </div>

              {/* Clarity */}
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between aspect-[4/3] relative">
                 <span className="text-[9px] uppercase tracking-widest text-[#d8c3f3] font-bold flex items-center gap-1">
                   <Gem className="w-3 h-3 text-[#d8c3f3]" /> CLARITY
                 </span>
                 <Info className="w-3 h-3 text-gray-300 absolute top-3 right-3" />
                 <span className="text-xl font-bold text-gray-900">{stoneMeta.clarity || "VVS2"}</span>
                 <div className="w-full flex items-center justify-between text-[8px] text-gray-300 mt-2 border-b border-gray-100 pb-1">
                    <span>FL</span><span>IF</span><span>VVS1</span><span className="text-gray-900 font-bold">VVS2</span><span>VS1</span><span>VS2</span><span>SI1</span>
                 </div>
                 <p className="text-[9px] text-gray-400 mt-2 leading-tight">Hard to see inclusions even under 10x max</p>
              </div>

              {/* Cut */}
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between aspect-[4/3] relative">
                 <span className="text-[9px] uppercase tracking-widest text-[#69cbf9] font-bold flex items-center gap-1">
                   <Gem className="w-3 h-3 text-[#69cbf9] fill-[#69cbf9]" /> CUT
                 </span>
                 <Info className="w-3 h-3 text-gray-300 absolute top-3 right-3" />
                 <span className="text-xl font-bold text-gray-900">{stoneMeta.cut || "Excellent"}</span>
                 <p className="text-[9px] text-gray-400 mt-auto leading-tight">Incredible fire and brilliance</p>
              </div>

              {/* Dimensions */}
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between">
                 <span className="text-[9px] uppercase tracking-widest text-[#a8b8d8] font-bold flex items-center gap-1">
                   DIMENSIONS (MM)
                 </span>
                 <span className="text-xl font-bold text-gray-900 mt-1">5.18x5.22</span>
                 <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mt-2">
                    <span className="text-[8px] text-gray-500">1.0</span>
                 </div>
                 <p className="text-[9px] text-gray-400 mt-2">Ratio: 0.99</p>
              </div>

              {/* Certification */}
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between">
                 <span className="text-[9px] uppercase tracking-widest text-[#ebd4a4] font-bold flex items-center gap-1">
                   CERTIFICATION
                 </span>
                 <span className="text-xl font-bold text-gray-900 mt-1">{stoneMeta.certificate || "GIA"}</span>
                 <p className="text-[#a58662] text-[9px] font-bold mt-2 uppercase tracking-wide flex items-center gap-1">
                   <div className="w-3 h-3 rounded-full border border-yellow-600 bg-yellow-50 flex items-center justify-center text-[5px]">•</div> {typeText} DIAMOND
                 </p>
                 <button className="text-[9px] text-gray-500 underline underline-offset-2 hover:text-gray-900 text-left mt-2 uppercase tracking-wide">
                   View Certificate
                 </button>
              </div>
           </div>
        </div>

        {/* Setting Info Card */}
        <div className="bg-[#fcfcfc] border border-gray-200 rounded-2xl p-6 mb-6">
           <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Diamond className="w-3.5 h-3.5 text-gray-900" strokeWidth={1.5} />
              </span>
              <h3 className="text-[15px] font-bold text-gray-900">Know your setting</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Width */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between aspect-[5/3] relative">
                 <span className="text-[9px] uppercase tracking-widest text-[#f085a1] font-bold flex items-center gap-1.5">
                   <span className="w-3 px-0.5 border-t border-b border-[#f085a1] h-2"></span> WIDTH
                 </span>
                 <span className="text-xl font-bold text-gray-900 mt-2">1.8mm</span>
                 <p className="text-[9px] text-gray-400 mt-2">Measured at the base of the ring</p>
              </div>

              {/* Profile */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between aspect-[5/3] relative">
                 <span className="text-[9px] uppercase tracking-widest text-[#f5a898] font-bold flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f5a898]"></div> PROFILE
                 </span>
                 <span className="text-xl font-bold text-gray-900 mt-2">Medium</span>
                 <p className="text-[9px] text-gray-400 mt-2 leading-tight">Only stacks with a chevron/curved band</p>
              </div>
           </div>

           {/* Metal */}
           <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between relative">
              <span className="text-[9px] uppercase tracking-widest text-[#98b8de] font-bold flex items-center gap-1.5 mb-2">
                <Diamond className="w-3 h-3 text-[#98b8de]" /> METAL
              </span>
              <span className="text-[18px] font-bold text-gray-900">{settingVariant?.options?.map((o: any) => o.value).join(", ") || "14k Yellow Gold"}</span>
              
              <div className="flex gap-4 mt-4 items-center">
                 <div className="w-12 h-12 rounded-full border-[6px] border-[#ebb973] border-t-[#dcdcdc] border-r-[#c08269] flex-shrink-0"></div>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[8px] font-medium text-gray-900">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ebb973]"></span> 58.5% Gold</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#c08269]"></span> 20.5% Copper</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#dcdcdc]"></span> 6.1% Silver</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span> 4.7% Zinc</div>
                 </div>
              </div>
              <p className="text-[9px] text-gray-400 mt-3 border-t border-gray-100 pt-2">The secret sauce that makes this piece.</p>
           </div>
        </div>
        
        {/* Accordions */}
        <div className="border-t border-gray-200">
           {["Ring Details", "Shipping", "Return Policy"].map((title, i) => (
             <div key={i} className="py-5 border-b border-gray-200 flex items-center justify-between cursor-pointer group">
               <div className="flex items-center gap-3">
                 <div className="w-7 h-7 bg-gray-50 flex items-center justify-center rounded">
                    <ListIcon className="w-4 h-4 text-gray-600" />
                 </div>
                 <span className="text-[13px] font-bold text-gray-900">{title}</span>
               </div>
               <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
             </div>
           ))}
        </div>
      </div>
    </div>

    {/* Match Made in Heaven (Cross-sell placeholder) - Placed below main layout */}
    <div className="max-w-[1360px] mx-auto pb-32 hidden lg:block">
      <h3 className="text-[28px] font-bold text-gray-900 mb-8 tracking-tight">Match Made in Heaven</h3>
      <div className="grid grid-cols-4 gap-6">
         {[1,2,3,4].map(i => (
            <div key={i} className="bg-[#fcfcfc] aspect-square rounded-xl relative flex items-center justify-center border border-gray-100">
              <HeartIcon className="absolute top-4 right-4 w-5 h-5 text-gray-400" />
              <span className="text-gray-300 text-sm">Product</span>
            </div>
         ))}
      </div>
    </div>
    </>
  )
}

function HeartIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  )
}

function ListIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <path d="M15 12h-1M15 5h-1M15 19h-1" />
    </svg>
  )
}
