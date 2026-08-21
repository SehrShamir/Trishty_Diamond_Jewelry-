import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions, getDefaultCountryCode } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<Record<string, string>>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // Use just the default country to generate static params (fewer builds needed)
    const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
    const { response } = await listProducts({
      countryCode: defaultCountry,
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .filter((p) => p.handle)
      .map((product) => ({ handle: product.handle }))
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}


export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const countryCode = await getDefaultCountryCode()
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const description = product.description || `Shop ${product.title} at Trishty. Ethically sourced, made to order with fully insured delivery.`

  return {
    title: `${product.title} | Trishty`,
    description,
    openGraph: {
      title: `${product.title} | Trishty`,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
      url: `https://trishty.com/products/${handle}`,
      siteName: "Trishty",
      type: "website",
    },
    alternates: { canonical: `https://trishty.com/products/${handle}` },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const countryCode = await getDefaultCountryCode()
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const { cheapestPrice } = getProductPrice({ product: pricedProduct })
  const productUrl = `https://trishty.com/products/${params.handle}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: pricedProduct.title,
        description: pricedProduct.description || `Shop ${pricedProduct.title} at Trishty.`,
        image: pricedProduct.images?.map((img) => img.url).filter(Boolean) || [],
        url: productUrl,
        brand: { "@type": "Brand", name: "Trishty" },
        ...(cheapestPrice && {
          offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: cheapestPrice.currency_code?.toUpperCase(),
            price: cheapestPrice.calculated_price_number,
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "Trishty Jewelry" },
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://trishty.com" },
          { "@type": "ListItem", position: 2, name: "Shop", item: "https://trishty.com/store" },
          { "@type": "ListItem", position: 3, name: pricedProduct.title, item: productUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={countryCode}
        searchParams={searchParams}
      />
    </>
  )
}
