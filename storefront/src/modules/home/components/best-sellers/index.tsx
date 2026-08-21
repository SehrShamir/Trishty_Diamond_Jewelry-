import { listProducts } from "@lib/data/products"
import { getDefaultCountryCode } from "@lib/data/regions"
import BestSellersClient from "./client"

export type BestSellerProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  collection?: { handle: string; title: string } | null
  metadata?: Record<string, unknown> | null
  options?: { title: string; values: { value: string }[] }[]
  variants?: {
    calculated_price?: {
      calculated_amount: number
      original_amount: number
      currency_code: string
    }
  }[]
}

export default async function BestSellers() {
  const countryCode = await getDefaultCountryCode()

  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 12 },
    })

    const products = response.products as unknown as BestSellerProduct[]

    if (!products || products.length === 0) return null

    return <BestSellersClient products={products} />
  } catch {
    return null
  }
}
