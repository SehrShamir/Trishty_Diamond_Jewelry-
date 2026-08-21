import { getPosts, getSinglePost, getRelatedPosts } from "@lib/ghost"
import { blogRevalidate } from "@lib/blog-config"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Metadata } from "next"
import { ShareButtons } from "@modules/blog/components/share-buttons"
import { TableOfContents } from "@modules/blog/components/table-of-contents"
import { NewsletterSubscribe } from "@modules/blog/components/newsletter-subscribe"
import { getBaseURL } from "@lib/util/env"

export const revalidate = blogRevalidate

export async function generateMetadata(props: {
  params: Promise<{ tag: string; slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const post = await getSinglePost(params.slug)

  if (!post) return { title: "Post Not Found" }

  const description = post.custom_excerpt || post.excerpt?.slice(0, 160) || ""
  const baseUrl = getBaseURL()
  const url = `${baseUrl}/blog/${params.tag}/${params.slug}`
  const title = post.meta_title || post.title
  const metaDescription = post.meta_description || description

  return {
    title: `${title} | The Trishty Journal`,
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.og_title || title,
      description: post.og_description || metaDescription,
      url,
      type: "article",
      siteName: "Trishty",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: post.primary_author?.name ? [post.primary_author.name] : undefined,
      images: post.feature_image
        ? [{ url: post.feature_image, alt: title || "Trishty Journal" }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitter_title || title,
      description: post.twitter_description || metaDescription,
      images: post.feature_image
        ? [{ url: post.feature_image, alt: title || "Trishty Journal" }]
        : undefined,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    tag: post.primary_tag?.slug || "general",
    slug: post.slug,
  }))
}

function formatDate(iso?: string | null) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function PostPage(props: {
  params: Promise<{ tag: string; slug: string }>
}) {
  const params = await props.params
  const post = await getSinglePost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(
    post.slug,
    post.primary_tag?.slug || "general"
  )

  const publishDate = formatDate(post.published_at)
  const baseUrl = getBaseURL()
  const postUrl = `${baseUrl}/blog/${params.tag}/${params.slug}`
  const excerpt = post.custom_excerpt || ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.feature_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.primary_author?.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Trishty",
    },
    description: post.excerpt,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.primary_tag?.name || "General",
        item: `${baseUrl}/blog/${params.tag}`,
      },
      { "@type": "ListItem", position: 4, name: post.title, item: postUrl },
    ],
  }

  return (
    <article className="bg-white text-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Back to Journal */}
      <div className="max-w-7xl mx-auto px-6 pt-6 small:pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-8 small:pt-12 pb-10 small:pb-14">
        <div className="max-w-3xl mx-auto text-center">
          {post.primary_tag?.name && (
            <Link
              href={`/blog/${post.primary_tag.slug}`}
              className="inline-block text-[11px] font-medium tracking-[0.28em] uppercase text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              {post.primary_tag.name}
            </Link>
          )}

          <h1 className="font-serif font-light tracking-tight text-gray-900 leading-[1.08] text-4xl small:text-5xl medium:text-6xl mb-6">
            {post.title}
          </h1>

          {excerpt && (
            <p className="text-base small:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
              {excerpt}
            </p>
          )}

          {/* Byline */}
          <div className="flex items-center justify-center gap-4 small:gap-6 flex-wrap text-sm text-gray-500">
            {post.primary_author && (
              <div className="flex items-center gap-2">
                {post.primary_author.profile_image ? (
                  <Image
                    src={post.primary_author.profile_image}
                    alt={post.primary_author.name || ""}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500 uppercase">
                    {post.primary_author.name?.charAt(0)}
                  </div>
                )}
                <span className="text-gray-700">
                  {post.primary_author.name}
                </span>
              </div>
            )}
            {publishDate && (
              <span className="hidden xsmall:inline text-gray-300">·</span>
            )}
            {publishDate && <span>{publishDate}</span>}
            {post.reading_time && (
              <>
                <span className="hidden xsmall:inline text-gray-300">·</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Feature Image — full-bleed cinematic */}
      {post.feature_image && (
        <div className="relative w-full aspect-[16/9] small:aspect-[21/9] max-w-[1600px] mx-auto overflow-hidden small:rounded-lg mb-12 small:mb-20">
          <Image
            src={post.feature_image}
            alt={post.title || ""}
            fill
            priority
            sizes="(min-width: 1024px) 100vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 small:grid-cols-12 gap-12 medium:gap-16">
          {/* Content */}
          <div className="small:col-span-8 min-w-0">
            <div
              className="ghost-content ghost-content--article"
              dangerouslySetInnerHTML={{ __html: post.html || "" }}
            />

            {/* Share bar after body */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between gap-4">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-gray-500">
                Share this story
              </span>
              <ShareButtons title={post.title || ""} url={postUrl} />
            </div>
          </div>

          {/* TOC Sidebar */}
          <aside className="hidden small:block small:col-span-4">
            <TableOfContents htmlContent={post.html || ""} />
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 small:mt-28 pt-14 small:pt-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-gray-400 mb-3">
                  Keep reading
                </p>
                <h2 className="font-serif font-light text-3xl small:text-4xl text-gray-900">
                  You might also like
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden xsmall:inline-flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 hover:gap-3 transition-all whitespace-nowrap"
              >
                All stories
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 gap-x-8 gap-y-12">
              {relatedPosts.map((relatedPost) => {
                const relDate = formatDate(relatedPost.published_at)
                return (
                  <article key={relatedPost.uuid} className="group">
                    <Link
                      href={`/blog/${relatedPost.primary_tag?.slug || "general"}/${relatedPost.slug}`}
                      className="block"
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-5 bg-gray-100">
                        {relatedPost.feature_image ? (
                          <Image
                            src={relatedPost.feature_image}
                            alt={relatedPost.title || ""}
                            fill
                            sizes="(min-width: 1280px) 30vw, (min-width: 512px) 45vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100" />
                        )}
                      </div>
                      {relatedPost.primary_tag?.name && (
                        <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-gray-400 mb-2">
                          {relatedPost.primary_tag.name}
                        </p>
                      )}
                      <h3 className="font-serif text-lg small:text-xl font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors mb-3">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{relDate}</span>
                        {relatedPost.reading_time && (
                          <>
                            <span>&middot;</span>
                            <span>{relatedPost.reading_time} min read</span>
                          </>
                        )}
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-neutral-900 py-16 small:py-20 mt-20 small:mt-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="font-serif font-light text-white text-2xl small:text-3xl medium:text-4xl mb-3">
            Subscribe to our journal
          </h3>
          <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto">
            Jewelry insights, new collections, and expert guides &mdash;
            delivered monthly.
          </p>
          <NewsletterSubscribe variant="dark" />
        </div>
      </section>
    </article>
  )
}
