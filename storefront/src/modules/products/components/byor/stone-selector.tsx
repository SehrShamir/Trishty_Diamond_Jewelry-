"use client"

import { useState, useMemo, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import StoneCard from "./stone-card"
import StoneFiltersPanel, { type StoneFilters, DEFAULT_FILTERS, COLOR_ORDER, CLARITY_ORDER } from "./stone-filters"
import { useBYOR } from "./byor-context"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

type StoneSelectorProps = {
  countryCode: string
  diamondsCollectionId?: string
}

const StoneSelector = ({ countryCode, diamondsCollectionId }: StoneSelectorProps) => {
  const { selectStone, preselectStone, stoneProductId } = useBYOR()
  const [diamonds, setDiamonds] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<StoneFilters>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState("price-asc")
  const [page, setPage] = useState(1)
  const perPage = 12

  // ── Fetch diamonds ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDiamonds = async () => {
      setLoading(true)
      try {
        const params: HttpTypes.StoreProductListParams & { limit: number } = { limit: 100 }
        if (diamondsCollectionId) params.collection_id = [diamondsCollectionId]
        const { response } = await listProducts({ countryCode, queryParams: params })
        setDiamonds(response.products)
      } catch (e) {
        console.error("Failed to load diamonds:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchDiamonds()
  }, [countryCode, diamondsCollectionId])

  // ── Filter + Sort ────────────────────────────────────────────────────────
  const filteredDiamonds = useMemo(() => {
    let result = diamonds.filter((d) => {
      const m = (d.metadata || {}) as Record<string, string>

      // Shape: exact match when selected
      if (filters.shape && m.shape?.toLowerCase() !== filters.shape.toLowerCase()) return false

      // Color: colorMin means "at least this quality" — D is best (index 6), J is worst (index 0)
      // A filter of "F" means show F, E, D (index >= indexOf(F))
      if (filters.colorMin) {
        const minIdx = COLOR_ORDER.indexOf(filters.colorMin)
        const dIdx = COLOR_ORDER.indexOf(m.color ?? "")
        if (dIdx < minIdx) return false
      }

      // Clarity: clarityMin means "at least this quality"
      // FL is best (index 6), SI1 is worst (index 0)
      if (filters.clarityMin) {
        const minIdx = CLARITY_ORDER.indexOf(filters.clarityMin)
        const dIdx = CLARITY_ORDER.indexOf(m.clarity ?? "")
        if (dIdx < minIdx) return false
      }

      // Cut: exact match when selected
      if (filters.cut && m.cut?.toUpperCase() !== filters.cut.toUpperCase()) return false

      // Certificate: exact match when selected
      if (filters.certificate && m.certification?.toUpperCase() !== filters.certificate.toUpperCase()) return false

      // Carat range
      const carat = parseFloat(m.carat || "0")
      if (carat < filters.caratMin || carat > filters.caratMax) return false

      // Budget: direct comparison (Medusa V2 exact decimal values)
      const price = (d.variants?.[0] as any)?.calculated_price?.calculated_amount ?? 0
      if (price < filters.budgetMin || (filters.budgetMax < 10000000 && price > filters.budgetMax)) return false

      return true
    })

    // Sort
    result.sort((a, b) => {
      const priceA = (a.variants?.[0] as any)?.calculated_price?.calculated_amount || 0
      const priceB = (b.variants?.[0] as any)?.calculated_price?.calculated_amount || 0
      return sortBy === "price-desc" ? priceB - priceA : priceA - priceB
    })

    return result
  }, [diamonds, filters, sortBy])

  const totalPages = Math.ceil(filteredDiamonds.length / perPage)
  const paginatedDiamonds = filteredDiamonds.slice((page - 1) * perPage, page * perPage)

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [filters])

  // ── Auto-select first diamond when results load ──────────────────────────
  // Ensures user is never blocked from proceeding to Step 3
  useEffect(() => {
    if (filteredDiamonds.length > 0 && !stoneProductId) {
      const first = filteredDiamonds[0]
      const firstVariant = first.variants?.[0]
      if (first.id && firstVariant?.id) {
        // Soft pre-select: stores stone IDs in URL without jumping to Step 3
        preselectStone(first.id, firstVariant.id)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredDiamonds])

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-3 text-sm text-gray-400 font-light tracking-wide">Loading diamonds...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pt-2">
        <h2 className="text-[28px] font-semibold text-gray-900 tracking-tight">Select your Stone Shape and Quality</h2>
        <p className="text-[13px] text-gray-500 font-light mt-1.5 mb-8">Use the filters below to design your perfect engagement ring</p>
      </div>

      {/* Filters */}
      <StoneFiltersPanel filters={filters} onFilterChange={setFilters} />

      {/* Results bar */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-light">
            {filteredDiamonds.length === 0
              ? "No diamonds match your filters"
              : `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filteredDiamonds.length)} of ${filteredDiamonds.length}`}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-6 h-6 flex items-center justify-center text-gray-400 disabled:text-gray-200 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-6 h-6 flex items-center justify-center text-gray-400 disabled:text-gray-200 hover:text-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-[10px] text-gray-500 border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-gray-900 cursor-pointer"
        >
          <option value="price-asc">Price (low-to-high)</option>
          <option value="price-desc">Price (high-to-low)</option>
        </select>
      </div>

      {/* Diamond Grid */}
      {paginatedDiamonds.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400 font-light">No diamonds match your filters.</p>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="mt-3 text-xs text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {paginatedDiamonds.map((diamond) => (
            <StoneCard
              key={diamond.id}
              product={diamond}
              isSelected={diamond.id === stoneProductId}
              onSelect={(pid, vid) => selectStone(pid, vid)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StoneSelector
