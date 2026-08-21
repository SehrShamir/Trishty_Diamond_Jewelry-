import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getDefaultCountryCode } from "@lib/data/regions"
import { getPosts, getTags, isGhostConfigured } from "@lib/ghost"

export const revalidate = 3600

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/store", priority: 0.9, changeFrequency: "daily" },
  { path: "/build-your-ring", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/heritage", priority: 0.6, changeFrequency: "yearly" },
  { path: "/atelier", priority: 0.6, changeFrequency: "yearly" },
  { path: "/client-services", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/reviews", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/shipping", priority: 0.4, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.4, changeFrequency: "yearly" },
  { path: "/warranty", priority: 0.4, changeFrequency: "yearly" },
  { path: "/conflict-free", priority: 0.4, changeFrequency: "yearly" },
  { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
]

async function listAllProducts(countryCode: string) {
  const all: { handle: string; updated_at?: string | null; thumbnail?: string | null; title?: string | null }[] = []
  const LIMIT = 100
  let page = 1
  let nextPage: number | null = 1
  while (nextPage) {
    try {
      const res = await listProducts({
        pageParam: page,
        queryParams: { limit: LIMIT, fields: "handle,updated_at,thumbnail,title" } as any,
        countryCode,
      })
      for (const p of res.response.products) {
        if (p.handle) {
          all.push({
            handle: p.handle,
            updated_at: (p as any).updated_at,
            thumbnail: p.thumbnail,
            title: p.title,
          })
        }
      }
      nextPage = res.nextPage
      page = res.nextPage ?? page + 1
      if (!res.nextPage) break
    } catch {
      break
    }
  }
  return all
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseURL().replace(/\/$/, "")
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const [countryCode, categoriesResult] = await Promise.all([
    getDefaultCountryCode().catch(() => "us"),
    listCategories({ limit: 200 }).catch(() => [] as any[]),
  ])

  const categoryEntries: MetadataRoute.Sitemap = categoriesResult
    .filter((c: any) => c?.handle)
    .map((c: any) => ({
      url: `${base}/categories/${c.handle}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

  const products = await listAllProducts(countryCode)
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.handle}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
    ...(p.thumbnail ? { images: [p.thumbnail] } : {}),
  }))

  let blogEntries: MetadataRoute.Sitemap = []
  if (isGhostConfigured()) {
    const [posts, tags] = await Promise.all([
      getPosts().catch(() => []),
      getTags().catch(() => []),
    ])
    blogEntries = [
      ...tags
        .filter((t) => t.slug)
        .map((t) => ({
          url: `${base}/blog/${t.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        })),
      ...posts
        .filter((p) => p.slug && p.primary_tag?.slug)
        .map((p) => ({
          url: `${base}/blog/${p.primary_tag!.slug}/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          ...(p.feature_image ? { images: [p.feature_image] } : {}),
        })),
    ]
  }

  return [...staticEntries, ...categoryEntries, ...productEntries, ...blogEntries]
}
