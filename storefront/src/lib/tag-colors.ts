const TAG_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  "diamond-education": { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/25" },
  "ring-guides":       { bg: "bg-blue-500/15",   text: "text-blue-300",   border: "border-blue-500/25" },
  "gemstones":         { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/25" },
  "style-guides":      { bg: "bg-rose-500/15",   text: "text-rose-300",   border: "border-rose-500/25" },
  "news":              { bg: "bg-cyan-500/15",    text: "text-cyan-300",    border: "border-cyan-500/25" },
  "trends":            { bg: "bg-purple-500/15",  text: "text-purple-300",  border: "border-purple-500/25" },
}

const FALLBACK_COLORS = [
  { bg: "bg-amber-500/15",   text: "text-amber-300",   border: "border-amber-500/25" },
  { bg: "bg-blue-500/15",    text: "text-blue-300",    border: "border-blue-500/25" },
  { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/25" },
  { bg: "bg-rose-500/15",    text: "text-rose-300",    border: "border-rose-500/25" },
  { bg: "bg-cyan-500/15",    text: "text-cyan-300",    border: "border-cyan-500/25" },
  { bg: "bg-purple-500/15",  text: "text-purple-300",  border: "border-purple-500/25" },
]

export function getTagColor(slug: string | undefined) {
  if (!slug) return FALLBACK_COLORS[0]
  if (TAG_COLOR_MAP[slug]) return TAG_COLOR_MAP[slug]
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
}
