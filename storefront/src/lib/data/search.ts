"use server"

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "./products"
import { getDefaultCountryCode } from "./regions"

export async function searchProducts(
  q: string,
  limit: number = 8
): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  const query = q?.trim() ?? ""
  if (query.length < 2) {
    return { products: [], count: 0 }
  }

  const countryCode = await getDefaultCountryCode()

  const { response } = await listProducts({
    queryParams: { q: query, limit } as HttpTypes.StoreProductListParams,
    countryCode,
  })

  return response
}
