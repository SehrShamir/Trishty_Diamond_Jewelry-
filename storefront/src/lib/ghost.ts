import GhostContentAPI, { type PostOrPage, type Tag } from "@tryghost/content-api"
import { unstable_noStore as noStore } from "next/cache"

const GHOST_URL = process.env.GHOST_URL?.replace(/\/$/, "") || ""
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY || ""

const isConfigured = Boolean(GHOST_URL && GHOST_KEY)

function markGhostFetchDynamic() {
  if (process.env.NODE_ENV === "development") {
    noStore()
  }
}

if (!isConfigured && process.env.NODE_ENV !== "test") {
  console.warn(
    "[ghost] GHOST_URL or GHOST_CONTENT_API_KEY missing. Blog pages will render empty until Ghost is configured."
  )
}

const api = isConfigured
  ? new GhostContentAPI({
      url: GHOST_URL,
      key: GHOST_KEY,
      version: "v5.0",
    })
  : null

function logError(scope: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  console.error(`[ghost:${scope}]`, message)
}

export async function getPosts(): Promise<PostOrPage[]> {
  if (!api) return []
  markGhostFetchDynamic()
  try {
    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
    })
    if (posts.length === 0) {
      console.warn(
        "[ghost:getPosts] Ghost is configured but returned no published posts."
      )
    }
    return posts
  } catch (err) {
    logError("getPosts", err)
    return []
  }
}

export async function getPostsByTag(tagSlug: string): Promise<PostOrPage[]> {
  if (!api) return []
  markGhostFetchDynamic()
  try {
    return await api.posts.browse({
      filter: `tag:${tagSlug}`,
      limit: "all",
      include: ["tags", "authors"],
    })
  } catch (err) {
    logError("getPostsByTag", err)
    return []
  }
}

export async function getSinglePost(postSlug: string): Promise<PostOrPage | null> {
  if (!api) return null
  markGhostFetchDynamic()
  try {
    return await api.posts.read(
      { slug: postSlug },
      { include: ["tags", "authors"] }
    )
  } catch (err) {
    logError("getSinglePost", err)
    return null
  }
}

export async function getTags(): Promise<Tag[]> {
  if (!api) return []
  markGhostFetchDynamic()
  try {
    return await api.tags.browse({
      limit: "all",
    })
  } catch (err) {
    logError("getTags", err)
    return []
  }
}

export async function getRelatedPosts(
  slug: string,
  tag: string
): Promise<PostOrPage[]> {
  if (!api) return []
  markGhostFetchDynamic()
  try {
    return await api.posts.browse({
      filter: `tag:${tag}+slug:-${slug}`,
      limit: 3,
      include: ["tags", "authors"],
    })
  } catch (err) {
    logError("getRelatedPosts", err)
    return []
  }
}

export function isGhostConfigured() {
  return isConfigured
}
