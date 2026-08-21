"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { PostOrPage } from "@tryghost/content-api"
import { NewsletterSubscribe } from "./newsletter-subscribe"

const ALL_CATEGORIES = [
  { slug: "engagement-rings", label: "Engagement Rings" },
  { slug: "eternity-rings", label: "Eternity Rings" },
  { slug: "diamonds-gemstones", label: "Diamonds & Gemstones" },
  { slug: "pendants", label: "Pendants" },
]

const DEFAULT_FEATURE_IMAGE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80"

const FALLBACK_HERO_POST: Partial<PostOrPage> = {
  title:
    "The New Architecture of Love: Why Conscious Luxury and Structural Design are Redefining Modern Romance",
  slug: "the-new-architecture-of-love",
  custom_excerpt:
    "The definition of a \"classic\" engagement ring is undergoing a quiet but undeniable revolution. For decades, the narrative surrounding fine jewelry—especially in the bridal and milestone categories—was...",
  feature_image:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
  published_at: "2026-05-18T10:00:00.000Z",
  reading_time: 4,
  primary_author: {
    id: "1",
    name: "Trishty Team",
    slug: "trishty-team",
  },
  primary_tag: {
    id: "1",
    name: "Engagement Rings",
    slug: "engagement-rings",
  },
}

function formatDate(iso?: string | null) {
  if (!iso) return "May 18, 2026"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function postHref(post: PostOrPage | Partial<PostOrPage>) {
  return `/blog/${post.primary_tag?.slug || "engagement-rings"}/${post.slug || "the-new-architecture-of-love"}`
}

function CategoryPills({ activeSlug }: { activeSlug?: string }) {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 small:py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2.5 small:gap-3.5 flex-wrap">
          <Link
            href="/blog"
            className={`px-5 small:px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !activeSlug
                ? "bg-[#111827] text-white border border-[#111827] shadow-sm"
                : "border border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-gray-900"
            }`}
          >
            All
          </Link>
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              className={`px-5 small:px-6 py-2 rounded-full text-sm transition-all ${
                cat.slug === activeSlug
                  ? "bg-[#111827] text-white border border-[#111827] shadow-sm font-medium"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlogNewsletter() {
  return (
    <section className="bg-[#18181b] text-white py-14 small:py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif font-light text-white text-3xl small:text-4xl medium:text-[40px] tracking-tight mb-3">
          Subscribe to our journal
        </h2>
        <p className="text-sm small:text-[15px] text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Jewelry insights, new collections, and expert guides &mdash; delivered
          monthly.
        </p>
        <NewsletterSubscribe variant="dark" />
      </div>
    </section>
  )
}

function HeroCard({ post }: { post: PostOrPage | Partial<PostOrPage> }) {
  const href = postHref(post)
  const excerpt =
    post.custom_excerpt ||
    post.excerpt ||
    "The definition of a \"classic\" engagement ring is undergoing a quiet but undeniable revolution. For decades, the narrative surrounding fine jewelry—especially in the bridal and milestone categories—was..."
  const imageSrc = post.feature_image || DEFAULT_FEATURE_IMAGE
  const authorName = post.primary_author?.name || "Trishty Team"
  const readingTime = post.reading_time || 4

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 small:py-16">
      <div className="grid grid-cols-1 small:grid-cols-12 gap-8 small:gap-14 items-center">
        {/* Featured Image */}
        <Link
          href={href}
          className="group relative block small:col-span-7 overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={imageSrc}
              alt={post.title || "Featured post"}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="small:col-span-5 flex flex-col justify-center">
          <Link href={href} className="group block">
            <h2 className="font-serif font-light tracking-tight text-gray-900 text-3xl small:text-4xl medium:text-[38px] leading-[1.18] mb-5 group-hover:text-gray-600 transition-colors">
              {post.title}
            </h2>
          </Link>

          {excerpt && (
            <p className="text-sm small:text-base text-gray-600 leading-relaxed line-clamp-4 mb-6">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-2.5 text-xs text-gray-400 mb-6 flex-wrap">
            <span className="text-gray-600">By {authorName}</span>
            <span>&middot;</span>
            <span>{formatDate(post.published_at)}</span>
            <span>&middot;</span>
            <span>{readingTime} min read</span>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium tracking-wide text-gray-900 border-b border-gray-900 pb-0.5 hover:gap-2.5 transition-all self-start"
          >
            Read the story
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArticleCard({ post }: { post: PostOrPage }) {
  const href = postHref(post)
  const imageSrc = post.feature_image || DEFAULT_FEATURE_IMAGE

  return (
    <article className="group">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-100 mb-5 shadow-sm">
          <Image
            src={imageSrc}
            alt={post.title || ""}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 512px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        {post.primary_tag?.name && (
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-gray-400 mb-2">
            {post.primary_tag.name}
          </p>
        )}

        <h3 className="font-serif text-lg small:text-xl font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors mb-3">
          {post.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatDate(post.published_at)}</span>
          {post.reading_time ? (
            <>
              <span>&middot;</span>
              <span>{post.reading_time} min read</span>
            </>
          ) : null}
        </div>
      </Link>
    </article>
  )
}

export function BlogContent({ posts }: { posts: PostOrPage[] }) {
  const [visibleCount, setVisibleCount] = useState(10)

  // Use the best available post for hero (prefer one with feature_image or the latest)
  const heroPost =
    posts && posts.length > 0
      ? posts.find((p) => p.slug === "the-new-architecture-of-love") || posts[0]
      : FALLBACK_HERO_POST

  const remainingPosts =
    posts && posts.length > 0
      ? posts.filter((p) => p.slug !== heroPost?.slug)
      : []

  const visible = remainingPosts.slice(0, visibleCount)
  const hasMore = visibleCount < remainingPosts.length

  return (
    <>
      {/* 1. Category Filter Pills */}
      <CategoryPills />

      {/* 2. Subscribe to Our Journal Banner */}
      <BlogNewsletter />

      {/* 3. Featured Hero Story */}
      <HeroCard post={heroPost} />

      {/* 4. Remaining Stories Grid */}
      {visible.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 gap-x-8 gap-y-12">
            {visible.map((post) => (
              <ArticleCard key={post.uuid || post.slug} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-14">
              <button
                className="px-8 py-3 text-sm font-medium rounded-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                onClick={() => setVisibleCount((prev) => prev + 9)}
              >
                Load more
              </button>
            </div>
          )}
        </section>
      )}
    </>
  )
}
