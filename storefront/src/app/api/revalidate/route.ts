import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const SECRET = process.env.REVALIDATE_SECRET

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 }
    )
  }

  const token =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-webhook-secret")

  if (token !== SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "invalid secret" },
      { status: 401 }
    )
  }

  const requestedPath = request.nextUrl.searchParams.get("path")

  try {
    if (requestedPath) {
      revalidatePath(requestedPath)
      return NextResponse.json({
        revalidated: true,
        paths: [requestedPath],
        now: Date.now(),
      })
    }

    const paths = ["/blog", "/blog/rss.xml", "/sitemap.xml"]
    paths.forEach((p) => revalidatePath(p))

    let body: { post?: { current?: { slug?: string; primary_tag?: { slug?: string } } } } = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const slug = body?.post?.current?.slug
    const tag = body?.post?.current?.primary_tag?.slug

    if (slug) {
      const postPath = `/blog/${tag || "general"}/${slug}`
      revalidatePath(postPath)
      paths.push(postPath)
    }
    if (tag) {
      const tagPath = `/blog/${tag}`
      revalidatePath(tagPath)
      paths.push(tagPath)
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        revalidated: false,
        error: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
