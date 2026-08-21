import { sdk } from "@lib/config"
import { listCategories } from "@lib/data/categories"
import { getCacheOptions } from "@lib/data/cookies"
import FeatureCarouselClient, { CarouselItem } from "./carousel-client"

const FALLBACK_IMAGES = [
  "/home/carousel-second/image.png",
  "/home/carousel-second/image copy.png",
  "/home/carousel-second/image copy 2.png",
  "/home/carousel-second/image copy 3.png",
]

const FALLBACK_ITEMS: CarouselItem[] = [
  { title: "THE TRISHTY DIFFERENCE", image: FALLBACK_IMAGES[0], href: "/heritage" },
  { title: "BESPOKE COMMISSIONS", image: FALLBACK_IMAGES[1], href: "/atelier" },
  { title: "WHITE-GLOVE DELIVERY", image: FALLBACK_IMAGES[2], href: "/client-services" },
  { title: "ARCHITECTURAL PRECISION", image: FALLBACK_IMAGES[3], href: "/store" },
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

/** Fetch all products to use as carousel items when no categories exist */
async function getProductItems(): Promise<CarouselItem[]> {
  try {
    const next = await getCacheOptions("products")
    const { products } = await sdk.client.fetch<{
      products: { id: string; title: string; thumbnail: string | null; handle: string }[]
    }>("/store/products", {
      query: { limit: 12, fields: "id,title,thumbnail,handle" },
      next,
      cache: "force-cache",
    })

    if (!products?.length) return FALLBACK_ITEMS

    return products.map((p): CarouselItem => ({
      title: p.title,
      image: p.thumbnail ?? null,
      href: `/products/${p.handle}`,
    }))
  } catch {
    return FALLBACK_ITEMS
  }
}

export default async function FeatureCarousel() {
  let items: CarouselItem[] = FALLBACK_ITEMS

  try {
    const product_categories = await listCategories({ limit: 20, offset: 0 })

    if (product_categories && product_categories.length > 0) {
      // Fetch a thumbnail for each category in parallel
      const thumbnails = await Promise.all(
        product_categories.map((cat) => getCategoryThumbnail(cat.id))
      )

      items = product_categories.map((cat, idx): CarouselItem => ({
        title: cat.name,
        image:
          (cat.metadata?.image as string | null) ??
          thumbnails[idx] ??
          FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
        href: `/categories/${cat.handle}`,
      }))
    } else {
      // No categories yet — show real products from the backend instead
      items = await getProductItems()
    }
  } catch {
    // API unavailable — use static fallback silently
  }

  return <FeatureCarouselClient items={items} />
}
