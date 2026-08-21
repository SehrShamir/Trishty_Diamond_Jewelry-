import { getPosts } from "@lib/ghost"
import { blogRevalidate } from "@lib/blog-config"
import { Metadata } from "next"
import { BlogContent } from "@modules/blog/components/blog-content"
import { getBaseURL } from "@lib/util/env"

const baseUrl = getBaseURL().replace(/\/$/, "")

export const metadata: Metadata = {
  title: "Blog — Trishty Jewelry",
  description:
    "Expert guides on diamonds, gemstones, ring styles, and the art of fine jewelry. Curated insights from the Trishty team.",
  keywords: [
    "diamond education",
    "jewelry blog",
    "engagement ring guide",
    "gemstone guide",
    "luxury jewelry insights",
  ],
  alternates: {
    canonical: `${baseUrl}/blog`,
    types: {
      "application/rss+xml": `${baseUrl}/blog/rss.xml`,
    },
  },
  openGraph: {
    title: "Blog — Trishty Jewelry",
    description:
      "Expert guides on diamonds, gemstones, and the art of fine jewelry.",
    type: "website",
    url: `${baseUrl}/blog`,
    siteName: "Trishty",
    images: [
      {
        url: `${baseUrl}/opengraph-image.jpg`,
        alt: "Trishty Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Trishty Jewelry",
    description:
      "Expert guides on diamonds, gemstones, and the art of fine jewelry.",
    images: [`${baseUrl}/twitter-image.jpg`],
  },
}

export const revalidate = blogRevalidate

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Trishty Blog",
            description:
              "Expert guides on diamonds, gemstones, and the art of fine jewelry.",
            isPartOf: {
              "@type": "WebSite",
              name: "Trishty",
            },
          }),
        }}
      />
      <BlogContent posts={posts || []} />
    </main>
  )
}
