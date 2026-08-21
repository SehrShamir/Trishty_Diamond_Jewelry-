import { getPostsByTag, getTags } from "@lib/ghost"
import { blogRevalidate } from "@lib/blog-config"
import { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

/* ── Category config ────────────────────────────────────── */

const categoryConfig: Record<string, { headline: string; subtitle: string }> = {
  "engagement-rings": {
    headline: "Engagement Rings",
    subtitle:
      "Expert guides on choosing the perfect engagement ring — from settings and styles to metals and stones.",
  },
  "eternity-rings": {
    headline: "Eternity Rings",
    subtitle:
      "Everything you need to know about eternity bands, anniversary rings, and forever pieces.",
  },
  "diamonds-gemstones": {
    headline: "Diamonds & Gemstones",
    subtitle:
      "Master the 4Cs, explore diamond shapes, and discover the world of precious gemstones.",
  },
  pendants: {
    headline: "Pendants",
    subtitle:
      "Find the perfect pendant — from diamond solitaires to gemstone drops and layering pieces.",
  },
}

const allCategories = [
  { slug: "engagement-rings", label: "Engagement Rings" },
  { slug: "eternity-rings", label: "Eternity Rings" },
  { slug: "diamonds-gemstones", label: "Diamonds & Gemstones" },
  { slug: "pendants", label: "Pendants" },
]

export const revalidate = blogRevalidate

export async function generateStaticParams() {
  const tags = await getTags()
  return tags.map((tag) => ({ tag: tag.slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const config = categoryConfig[params.tag]
  const title = config?.headline || deSlug(params.tag)

  return {
    title: `${title} — The Trishty Journal`,
    description: config?.subtitle || `Expert jewelry insights about ${title}.`,
    openGraph: {
      title: `${title} — The Trishty Journal`,
      description: config?.subtitle || `Expert jewelry insights about ${title}.`,
      type: "website",
    },
  }
}

function deSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>
}) {
  const params = await props.params
  const posts = await getPostsByTag(params.tag)

  const tagName =
    posts[0]?.primary_tag?.name ||
    categoryConfig[params.tag]?.headline ||
    deSlug(params.tag)

  const config = categoryConfig[params.tag] || {
    headline: tagName,
    subtitle: `All the latest guides and insights about ${tagName.toLowerCase()}.`,
  }

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* Hero */}
      <section className="pt-12 pb-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Homepage
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">{tagName}</span>
          </nav>

          <h1 className="text-4xl small:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            {config.headline}
          </h1>

          {config.subtitle && (
            <p className="max-w-2xl text-gray-500 mb-8">{config.subtitle}</p>
          )}

          {/* Category pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/blog"
              className="px-5 py-2 text-sm rounded-full border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-900 transition-all"
            >
              All Posts
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/${cat.slug}`}
                className={`px-5 py-2 text-sm rounded-full border transition-all ${
                  cat.slug === params.tag
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-900"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-400">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Post grid or empty state */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-medium text-gray-900 mb-3">
                No articles yet in {tagName}
              </h2>
              <p className="text-gray-500 max-w-md mb-8">
                We&apos;re crafting new insights. In the meantime, explore our
                other categories or browse all posts.
              </p>
              <Link
                href="/blog"
                className="px-8 py-3 text-sm font-medium rounded border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                Browse all posts
              </Link>
            </div>
          ) : (
            <div className="grid xsmall:grid-cols-2 small:grid-cols-3 gap-x-8 gap-y-10">
              {posts.map((post) => {
                const publishDate = post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""

                return (
                  <article key={post.uuid} className="group">
                    <Link
                      href={`/blog/${post.primary_tag?.slug || "general"}/${post.slug}`}
                    >
                      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-100 relative shadow-sm">
                        <Image
                          src={post.feature_image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80"}
                          alt={post.title || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                        <span>{publishDate}</span>
                        {post.reading_time && (
                          <>
                            <span>|</span>
                            <span>{post.reading_time} min read</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
