import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getDefaultCountryCode } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Shop All Jewelry | Trishty",
  description: "Browse Trishty's full collection of ethically sourced diamond engagement rings, wedding bands, necklaces, earrings, and fine jewelry. Made to order.",
  openGraph: { title: "Shop All Jewelry | Trishty", description: "Browse ethically sourced diamond jewelry. Engagement rings, wedding bands, and fine jewelry.", url: "https://trishty.com/store", siteName: "Trishty", type: "website" },
  alternates: { canonical: "https://trishty.com/store" },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
}

export default async function StorePage(props: Params) {
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams
  const countryCode = await getDefaultCountryCode()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://trishty.com" },
      { "@type": "ListItem", position: 2, name: "Shop All Jewelry", item: "https://trishty.com/store" },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        q={q}
        countryCode={countryCode}
      />
    </>
  )
}
