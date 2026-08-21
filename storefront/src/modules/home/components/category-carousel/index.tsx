import { sdk } from "@lib/config"
import { listCategories } from "@lib/data/categories"
import { getCacheOptions } from "@lib/data/cookies"
import CategoryCarouselClient, { CarouselItem } from "./carousel-client"

const FALLBACK_IMAGES = [
  "/home/carousel-first/image.png",
  "/home/carousel-first/image copy.png",
  "/home/carousel-first/image copy 2.png",
]

const FALLBACK_ITEMS: CarouselItem[] = [
  { title: "Engagement Rings", image: FALLBACK_IMAGES[0], href: "/store" },
  { title: "Wedding Bands", image: FALLBACK_IMAGES[1], href: "/store" },
  { title: "Fine Jewelry", image: FALLBACK_IMAGES[2], href: "/store" },
]

/** Fetch the thumbnail of the first product in a category */
async function getCategoryThumbnail(categoryId: string): Promise<string | null> {
  try {
    const next = await getCacheOptions("products")
    const { products } = await sdk.client.fetch<{ products: { thumbnail: string | null }[] }>(
      "/store/products",
      {
        query: { category_id: [categoryId], limit: 1, fields: "thumbnail" },
        next,
        cache: "force-cache",
      }
    )
    return products?.[0]?.thumbnail ?? null
  } catch {
    return null
  }
}

/** Fetch first product's video_url metadata for the category (fallback when category has no video set) */
async function getCategoryProductVideo(categoryId: string): Promise<string | null> {
  try {
    const next = await getCacheOptions("products")
    const { products } = await sdk.client.fetch<{ products: { metadata: Record<string, unknown> | null }[] }>(
      "/store/products",
      {
        query: { category_id: [categoryId], limit: 1, fields: "metadata" },
        next,
        cache: "force-cache",
      }
    )
    const value = products?.[0]?.metadata?.video_url
    return typeof value === "string" && value.length > 0 ? value : null
  } catch {
    return null
  }
}

/** Fetch all products to use as carousel items when no categories exist */
async function getProductItems(): Promise<CarouselItem[]> {
  try {
    const next = await getCacheOptions("products")
    const { products } = await sdk.client.fetch<{
      products: { id: string; title: string; thumbnail: string | null; handle: string; metadata: Record<string, unknown> | null }[]
    }>("/store/products", {
      query: { limit: 12, fields: "id,title,thumbnail,handle,metadata" },
      next,
      cache: "force-cache",
    })

    if (!products?.length) return FALLBACK_ITEMS

    return products.map((p): CarouselItem => {
      const videoMeta = p.metadata?.video_url
      const video = typeof videoMeta === "string" && videoMeta.length > 0 ? videoMeta : null
      return {
        title: p.title,
        image: p.thumbnail ?? null,
        video,
        href: `/products/${p.handle}`,
      }
    })
  } catch {
    return FALLBACK_ITEMS
  }
}

export default async function CategoryCarousel() {
  let items: CarouselItem[] = FALLBACK_ITEMS

  try {
    const categories = await listCategories({ limit: 20, offset: 0 })

    if (categories && categories.length > 0) {
      // Fetch a thumbnail + fallback product video for each category in parallel
      const [thumbnails, productVideos] = await Promise.all([
        Promise.all(categories.map((cat) => getCategoryThumbnail(cat.id))),
        Promise.all(categories.map((cat) => getCategoryProductVideo(cat.id))),
      ])

      items = categories.map((cat, idx): CarouselItem => ({
        title: cat.name,
        image:
          (cat.metadata?.image as string | null) ??
          thumbnails[idx] ??
          FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
        video:
          (cat.metadata?.video_url as string | null) ??
          productVideos[idx] ??
          null,
        href: `/categories/${cat.handle}`,
      }))
    } else {
      // No categories yet — show real products from the backend instead
      items = await getProductItems()
    }
  } catch {
    // API unavailable — use static fallback silently
  }

  return <CategoryCarouselClient items={items} />
}
