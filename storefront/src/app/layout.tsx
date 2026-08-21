import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import PostHogProvider from "@lib/analytics/posthog-provider"
import { GoogleTagManager, GoogleTagManagerNoscript } from "@lib/analytics/gtm"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Trishty | Diamond Jewelry — Made to Order",
    template: "%s | Trishty",
  },
  description: "Ethically sourced diamond jewelry crafted with architectural precision. Engagement rings, wedding bands, and fine jewelry. Made to order with fully insured delivery.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Trishty",
    title: "Trishty | Diamond Jewelry — Made to Order",
    description: "Ethically sourced diamond jewelry crafted with architectural precision. Made to order with fully insured delivery.",
    url: "https://trishty.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trishty | Diamond Jewelry — Made to Order",
    description: "Ethically sourced diamond jewelry crafted with architectural precision.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
}

const SITE_URL = getBaseURL().replace(/\/$/, "")

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Trishty",
  legalName: "Trishty Jewelry",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/opengraph-image.jpg`,
  description:
    "Ethically sourced diamond jewelry crafted with architectural precision. Engagement rings, wedding bands, and fine jewelry, made to order with fully insured delivery.",
  email: "contact@trishty.com",
  telephone: "+1-650-741-5063",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
  sameAs: [
    "https://instagram.com",
    "https://facebook.com",
    "https://pinterest.com",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-650-741-5063",
      email: "contact@trishty.com",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Trishty",
  description:
    "Premium diamond jewelry made to order — engagement rings, wedding bands, and fine jewelry.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/store?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <GoogleTagManager />
      <body className="font-sans antialiased text-gray-900 bg-white">
        <GoogleTagManagerNoscript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <PostHogProvider>
          <main className="relative">{props.children}</main>
        </PostHogProvider>
      </body>
    </html>
  )
}
