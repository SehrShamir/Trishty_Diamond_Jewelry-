import { Metadata } from "next"

import HeroBanner from "@modules/home/components/hero-banner"
import TrustStrip from "@modules/home/components/trust-strip"
import TheDifference from "@modules/home/components/the-difference"
import AtelierTeaser from "@modules/home/components/atelier-teaser"
import TrustGuarantee from "@modules/home/components/trust-guarantee"
import ProductGrid from "@modules/home/components/product-grid"
import CategoryCarousel from "@modules/home/components/category-carousel"
import FeatureCarousel from "@modules/home/components/feature-carousel"
import BestSellers from "@modules/home/components/best-sellers"

export const metadata: Metadata = {
  title: "Trishty | Diamond Jewelry — Made to Order",
  description:
    "Ethically sourced diamond jewelry crafted with architectural precision. Engagement rings, wedding bands, and fine jewelry. Made to order with fully insured delivery.",
  openGraph: {
    title: "Trishty | Diamond Jewelry — Made to Order",
    description: "Ethically sourced diamond jewelry crafted with architectural precision. Made to order with fully insured delivery.",
    url: "https://trishty.com",
    siteName: "Trishty",
    type: "website",
  },
  alternates: { canonical: "https://trishty.com" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://trishty.com/#organization",
      name: "Trishty Jewelry",
      url: "https://trishty.com",
      logo: { "@type": "ImageObject", url: "https://trishty.com/favicon-32x32.png" },
      description: "Ethically sourced diamond jewelry crafted with architectural precision. Made to order.",
      contactPoint: { "@type": "ContactPoint", telephone: "+1-650-741-5063", contactType: "customer service", email: "contact@trishty.com", availableLanguage: "English" },
      sameAs: ["https://instagram.com/trishty", "https://facebook.com/trishty", "https://pinterest.com/trishty"],
    },
    {
      "@type": "WebSite",
      "@id": "https://trishty.com/#website",
      url: "https://trishty.com",
      name: "Trishty",
      publisher: { "@id": "https://trishty.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://trishty.com/store?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "JewelryStore",
      "@id": "https://trishty.com/#store",
      name: "Trishty Jewelry",
      url: "https://trishty.com",
      telephone: "+1-650-741-5063",
      email: "contact@trishty.com",
      address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
      priceRange: "$$$",
    },
  ],
}

export default async function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroBanner />
      <TrustStrip />
      <CategoryCarousel />
      <ProductGrid />
      {/* <BestSellers /> */}
      <FeatureCarousel />
      {/* <TheDifference /> */}
      <AtelierTeaser />
      <TrustGuarantee />
    </>
  )
}
