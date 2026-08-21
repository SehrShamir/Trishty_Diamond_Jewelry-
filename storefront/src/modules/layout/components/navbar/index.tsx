import { ShoppingBag } from "lucide-react"
import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CartButton } from "./cart-button"
import { NavbarMain } from "./navbar-main"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getDefaultCountryCode } from "@lib/data/regions"

export async function Navbar() {
  const cartButton = (
    <Suspense
      fallback={
        <LocalizedClientLink
          href="/cart"
          className="relative p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Shopping cart"
        >
          <ShoppingBag className="h-5 w-5 text-primary" />
        </LocalizedClientLink>
      }
    >
      <CartButton />
    </Suspense>
  )

  const countryCode = await getDefaultCountryCode()

  const [allCategories, topPicksResp] = await Promise.all([
    listCategories({ limit: 20 }).catch(() => []),
    listProducts({
      pageParam: 1,
      queryParams: { limit: 6, order: "-created_at" } as any,
      countryCode,
    }).catch(() => ({ response: { products: [], count: 0 } })),
  ])

  const suggestions = allCategories
    .filter((c) => !c.parent_category_id)
    .slice(0, 8)
    .map((c) => ({ name: c.name, handle: c.handle }))

  return (
    <NavbarMain
      cartButton={cartButton}
      suggestions={suggestions}
      topPicks={topPicksResp.response.products}
    />
  )
}
