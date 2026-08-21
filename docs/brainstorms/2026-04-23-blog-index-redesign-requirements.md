# Blog Index Redesign — Requirements

**Date:** 2026-04-23
**Page:** `storefront/src/app/(main)/blog/page.tsx` via `storefront/src/modules/blog/components/blog-content.tsx`
**Status:** Decided; ready for implementation.

## Problem

The current `/blog` index renders posts in a single stacked column on all viewports. Two causes:

1. **Breakpoint bug** — the component uses Tailwind defaults (`md:`, `lg:`) but the project's `tailwind.config.js` replaces all screens with custom names (`xsmall`, `small`, `medium`, `large`, `xlarge`). `md:grid-cols-2` and `lg:grid-cols-3` never compile. Every blog view is affected.
2. **No editorial hierarchy** — featured posts look identical to the rest; the hero is text-only with a gradient placeholder; the lead story has no visual promotion.

The content pages (`/blog/[tag]/[slug]`, `/blog/[tag]`) read fine. This brainstorm scopes to the **index page only**.

## Goal

The index should feel like an editorial journal — a lead story that commands attention, followed by a clean, scannable grid of secondary articles. Visual language matches Trishty's existing minimal-luxury palette (Cormorant serif, Montserrat sans, lots of whitespace, neutral grays).

## Non-goals

- No changes to the post page (`[tag]/[slug]`) or category page (`[tag]`) layouts beyond the breakpoint fix.
- No backend/content-model changes.
- No new components in Ghost admin.
- No author bios or search UI in this pass.

## Requirements

### R1 — Fix the breakpoint bug (blocking)

Replace every `sm:` / `md:` / `lg:` / `xl:` in the blog module and routes with the repo's custom screens:

| Default | Use |
| --- | --- |
| `md:` (768px) | `small:` (1024px) |
| `lg:` (1024px) | `small:` (1024px) or `medium:` (1280px) |
| `sm:` (640px) | `xsmall:` (512px) |

### R2 — Editorial hero card

When 1+ posts exist, render the newest as a hero card spanning the full content width:

- **Layout:** 12-col grid at `small:` — image 7 cols on the left, content 5 cols on the right. Below `small:`, image stacks above content.
- **Image:** 4:3 aspect, object-cover, subtle hover scale, rounded-lg.
- **Content block:**
  - Category chip (primary tag name, uppercase, tracked).
  - Title — Cormorant serif, size `text-3xl small:text-4xl medium:text-5xl`, weight light, line-height tight.
  - Excerpt — Montserrat, `text-base`, gray-600, max 3 lines.
  - Meta row — author name • published date • reading time, small gray text.
  - CTA — "Read the story →" link with arrow, underline on hover.
- **Link target:** `/blog/[primary_tag.slug || 'general']/[slug]`.
- When there are zero posts, skip the hero and fall through to the existing empty state.

### R3 — Secondary grid

Remaining posts after the hero render in a 3-up responsive grid:

- `grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 gap-x-8 gap-y-12`.
- Card: image (aspect 4:3, hover scale), category chip, Cormorant title (`text-lg small:text-xl`, weight medium, 2-line clamp), meta row (date • reading time).
- When fewer than 3 posts remain, keep the grid centered without filler cards.

### R4 — Hero intro band

Keep the text intro ("Stories, guides & insights"), but:

- Tighten vertical padding (`py-10 small:py-14` — currently `py-16 small:py-20`).
- Title uses Cormorant serif instead of the existing sans.
- Subtitle one line shorter.

### R5 — Category pills (no behavior change, visual tightening)

- Place below the hero card, not under the intro.
- Small horizontal scroll on narrow viewports; center on desktop.
- Active/hover states unchanged.

### R6 — Newsletter footer band

Unchanged. Keep the dark neutral-900 section with `NewsletterSubscribe variant="dark"`.

### R7 — No motion-gated reveals on the grid

Remove `framer-motion`'s `whileInView` opacity fade on post cards. It makes static captures look empty and adds perceived jank on slow scroll. Replace with a CSS-only hover-scale on the image (`transition-transform`, `group-hover:scale-105`).

### R8 — Load More (unchanged)

`Load More` button stays; bumps `visibleCount` by 9. First post always counts toward `visibleCount` (the hero occupies `visibleCount: 1`).

## Edge cases

| State | Behavior |
| --- | --- |
| 0 posts | Existing empty state ("No posts yet") |
| 1 post | Hero only; no secondary grid, no Load More |
| 2 posts | Hero + 1 card centered in grid |
| 3+ posts | Hero + grid as described |
| Post missing `feature_image` | Neutral gray fill `bg-gray-100`, no broken image icon |
| Post missing `primary_tag` | Category chip hidden; link falls back to `/blog/general/[slug]` |
| Post missing `custom_excerpt` and `excerpt` | Excerpt section omitted |

## Success criteria

- Desktop (1440px): hero card splits roughly 60/40 image/content; secondary grid shows 3 cards per row.
- Tablet (~1024px): hero stays side-by-side; secondary grid shows 3 cards per row.
- Narrow desktop/tablet (700–1023px): hero stacks; secondary grid is 2 cards per row.
- Mobile (<512px): single column throughout.
- Page renders without JS animation doing the heavy lifting (grade: static screenshot looks correct).
- All other blog routes still render (breakpoint fix shouldn't regress anything else).

## Open questions — resolved

- **Q:** Should the hero rotate through posts or always be the latest?
  **A:** Always the latest (first in `posts[]` as returned by Ghost Content API, ordered by `published_at desc`).
- **Q:** Should we show a "Featured" badge on the hero?
  **A:** No. The size and position already communicate it; a badge would feel redundant.

## Files touched

- `storefront/src/modules/blog/components/blog-content.tsx` — complete rewrite
- `storefront/src/app/(main)/blog/loading.tsx` — update skeleton to match new layout
- `storefront/src/app/(main)/blog/[tag]/page.tsx` — breakpoint fix only
- `storefront/src/app/(main)/blog/[tag]/[slug]/page.tsx` — breakpoint fix only
- `storefront/src/app/(main)/blog/[tag]/[slug]/loading.tsx` — breakpoint fix only
- `storefront/src/modules/blog/components/blog-post-content.tsx` — breakpoint fix only
- `storefront/src/modules/blog/components/newsletter-subscribe.tsx` — `sm:` → `xsmall:` one-liner
- `storefront/src/app/(main)/blog/error.tsx` — `sm:` → `xsmall:` one-liner
