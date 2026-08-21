import { getPosts } from "@lib/ghost"
import { blogRevalidate } from "@lib/blog-config"
import { getBaseURL } from "@lib/util/env"

export const revalidate = blogRevalidate

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}

export async function GET() {
  const posts = await getPosts()
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const feedUrl = `${baseUrl}/blog/rss.xml`
  const buildDate = new Date().toUTCString()

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.primary_tag?.slug || "general"}/${post.slug}`
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : buildDate
      const description = post.custom_excerpt || post.excerpt || ""
      const author = post.primary_author?.name || "Trishty"
      const category = post.primary_tag?.name || ""

      return `    <item>
      <title>${escapeXml(post.title || "Untitled")}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(author)}</dc:creator>
      ${category ? `<category>${escapeXml(category)}</category>` : ""}
      <description>${escapeXml(description)}</description>
      ${post.feature_image ? `<enclosure url="${escapeXml(post.feature_image)}" type="image/jpeg" />` : ""}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Trishty Journal</title>
    <link>${escapeXml(`${baseUrl}/blog`)}</link>
    <description>Expert guides on diamonds, gemstones, and the art of fine jewelry.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  })
}
