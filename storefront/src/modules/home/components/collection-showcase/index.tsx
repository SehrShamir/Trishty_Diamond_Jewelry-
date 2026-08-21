import { sdk } from "@lib/config"
import { getCacheOptions } from "@lib/data/cookies"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

type CollectionProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

type CollectionWithProducts = {
  title: string
  handle: string
  products: CollectionProduct[]
}

const COLLECTION_HANDLES = ["settings", "engagement-rings"]

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
]

async function getCollectionsWithProducts(): Promise<CollectionWithProducts[]> {
  const results: CollectionWithProducts[] = []

  try {
    const next = await getCacheOptions("collections")

    for (const handle of COLLECTION_HANDLES) {
      const { collections } = await sdk.client.fetch<{
        collections: { id: string; title: string; handle: string }[]
      }>("/store/collections", {
        query: { handle, fields: "id,title,handle" },
        next,
        cache: "force-cache",
      })

      const collection = collections?.[0]
      if (!collection) continue

      const productsNext = await getCacheOptions("products")
      const { products } = await sdk.client.fetch<{ products: CollectionProduct[] }>(
        "/store/products",
        {
          query: {
            collection_id: [collection.id],
            limit: 4,
            fields: "id,title,handle,thumbnail",
          },
          next: productsNext,
          cache: "force-cache",
        }
      )

      if (products?.length) {
        results.push({
          title: collection.title,
          handle: collection.handle,
          products,
        })
      }
    }
  } catch {
    // Silently fail — section just won't show
  }

  return results
}

export default async function CollectionShowcase() {
  const collections = await getCollectionsWithProducts()

  if (collections.length === 0) return null

  return (
    <section className="py-20 sm:py-28">
      <div className="bn-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-light mb-3">
            Our Collections
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
            Handcrafted Jewelry
          </h2>
        </div>

        {/* Collection rows */}
        <div className="space-y-16">
          {collections.map((collection) => (
            <div key={collection.handle}>
              {/* Collection header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif text-gray-900">{collection.title}</h3>
                <LocalizedClientLink
                  href={`/collections/${collection.handle}`}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors font-light"
                >
                  View All
                  <ChevronRight className="w-3 h-3" />
                </LocalizedClientLink>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {collection.products.map((product, idx) => (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group"
                  >
                    <div className="relative aspect-square bg-[#f8f8f8] rounded-lg overflow-hidden mb-3">
                      <Image
                        src={product.thumbnail || PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-900 font-light tracking-wide text-center">
                      {product.title}
                    </p>
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
