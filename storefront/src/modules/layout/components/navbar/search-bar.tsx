"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { searchProducts } from "@lib/data/search"

export type SearchSuggestion = { name: string; handle: string }

interface SearchBarProps {
  suggestions: SearchSuggestion[]
  topPicks: HttpTypes.StoreProduct[]
}

export function SearchBar({ suggestions, topPicks }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [searching, setSearching] = useState(false)
  const reqIdRef = useRef(0)
  const router = useRouter()

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setSearching(false)
    }
  }, [open])

  // Debounced live search
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    const myReqId = ++reqIdRef.current
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(q, 8)
        if (myReqId === reqIdRef.current) {
          setResults(data.products ?? [])
        }
      } catch {
        if (myReqId === reqIdRef.current) setResults([])
      } finally {
        if (myReqId === reqIdRef.current) setSearching(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [query, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/store?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  const trimmed = query.trim()
  const hasQuery = trimmed.length >= 2

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 p-2 small:px-4 small:py-2 small:bg-background hover:bg-muted rounded-full small:rounded-sm transition-colors"
        aria-label="Open search"
      >
        <Search className="h-5 w-5 text-gray-700 small:text-primary" strokeWidth={1.5} />
        <span className="hidden small:inline text-sm font-medium text-primary uppercase tracking-wide">
          Search
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[95vw] max-w-4xl h-[90vh] small:h-[640px] p-0 flex flex-col bg-white border border-gray-200 shadow-2xl rounded-lg"
          overlayClassName="bg-neutral-950/60"
        >
          <DialogHeader className="border-b border-gray-200 px-4 small:px-6 py-4">
            <DialogTitle className="font-serif text-lg small:text-xl font-light text-gray-900 tracking-wide">
              Search
            </DialogTitle>
            <DialogDescription className="sr-only">
              Search Trishty for products by name, category, or tag.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 small:p-6 flex-1 min-h-0 flex flex-col">
            <form onSubmit={handleSubmit} className="relative mb-4 small:mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search Trishty ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-11 pr-10 py-5 w-full bg-gray-50 border-gray-200 focus-visible:ring-gray-900 focus-visible:border-gray-900 text-sm placeholder:text-gray-400"
                autoFocus
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </form>

            <div className="flex-1 min-h-0 flex flex-col small:grid small:grid-cols-4 gap-4 small:gap-6">
              {/* Suggestions: horizontal chip row on mobile, vertical list on desktop */}
              <div className="small:col-span-1 small:border-r small:border-gray-200 small:pr-6 small:overflow-y-auto flex-shrink-0">
                <h3 className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase mb-3 small:mb-4">
                  Suggestions
                </h3>
                {suggestions.length === 0 ? (
                  <p className="text-xs text-gray-500">No categories yet.</p>
                ) : (
                  <ul className="flex flex-wrap gap-1.5 small:block small:space-y-1">
                    {suggestions.map((s) => (
                      <li key={s.handle}>
                        <LocalizedClientLink
                          href={`/categories/${s.handle}`}
                          onClick={() => setOpen(false)}
                          className="group inline-flex small:flex small:w-full items-center justify-between gap-2 text-xs small:text-sm text-gray-700 hover:text-gray-900 bg-gray-100 small:bg-transparent hover:bg-gray-200 small:hover:bg-gray-50 transition-colors text-left px-3 py-1.5 small:px-2 small:-mx-2 rounded-full small:rounded"
                        >
                          <span className="whitespace-nowrap">{s.name}</span>
                          <span className="hidden small:inline text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all">
                            →
                          </span>
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Results / Top Picks */}
              <div className="small:col-span-3 flex-1 overflow-y-auto pr-1 min-h-0">
                {hasQuery ? (
                  <>
                    <div className="flex items-center justify-between mb-3 small:mb-4">
                      <h3 className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase">
                        Search Results
                      </h3>
                      {results.length > 0 && (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="text-xs font-medium text-gray-900 hover:text-gray-600 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                        >
                          View all →
                        </button>
                      )}
                    </div>
                    {searching && results.length === 0 ? (
                      <p className="text-sm text-gray-500">Searching…</p>
                    ) : results.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No products found for &ldquo;{trimmed}&rdquo;.
                      </p>
                    ) : (
                      <ProductGrid products={results} onNavigate={() => setOpen(false)} />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3 small:mb-4">
                      <h3 className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase">
                        Top Picks
                      </h3>
                      <LocalizedClientLink
                        href="/store"
                        onClick={() => setOpen(false)}
                        className="text-xs font-medium text-gray-900 hover:text-gray-600 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                      >
                        View all →
                      </LocalizedClientLink>
                    </div>
                    {topPicks.length === 0 ? (
                      <p className="text-sm text-gray-500">No products available.</p>
                    ) : (
                      <ProductGrid products={topPicks} onNavigate={() => setOpen(false)} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ProductGrid({
  products,
  onNavigate,
}: {
  products: HttpTypes.StoreProduct[]
  onNavigate: () => void
}) {
  return (
    <div className="grid grid-cols-2 small:grid-cols-3 gap-3 small:gap-4">
      {products.map((p) => {
        const variant = p.variants?.[0]
        const price = (variant as any)?.calculated_price
        const amount = price?.calculated_amount
        const currency = price?.currency_code?.toUpperCase()
        return (
          <LocalizedClientLink
            key={p.id}
            href={`/products/${p.handle}`}
            onClick={onNavigate}
            className="group border border-gray-200 rounded overflow-hidden hover:border-gray-400 transition-colors bg-white"
          >
            <div className="aspect-square bg-gray-50 relative">
              {p.thumbnail ? (
                <Image
                  src={p.thumbnail}
                  alt={p.title ?? ""}
                  fill
                  sizes="(max-width: 768px) 45vw, 200px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : null}
            </div>
            <div className="px-2 py-2 small:py-2.5 text-center">
              <p className="text-[11px] small:text-xs text-gray-900 line-clamp-1 leading-tight">
                {p.title}
              </p>
              {amount != null && currency ? (
                <p className="text-[10px] small:text-xs text-gray-500 mt-0.5">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 0,
                  }).format(amount)}
                </p>
              ) : null}
            </div>
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}
