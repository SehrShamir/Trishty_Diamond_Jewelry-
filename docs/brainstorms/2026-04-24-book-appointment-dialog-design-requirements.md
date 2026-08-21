# Book Appointment Dialog — Design Requirements

**Date:** 2026-04-24
**Component:** `storefront/src/components/book-appointment.tsx`
**Reference:** vetty's `book-demo-dialog.tsx` (pre-cal-strip version, git ref `6a678d5`)
**Status:** Decided; ready for implementation.

## Problem

Two previous attempts missed the mark:

1. **First pass** used a shadcn `<Dialog>` with `sm:max-w-[480px] h-[80vh]` and a plain "Book an Appointment" header — layout was broken (rendered nearly full-width) and visually bland.
2. **Second pass** stripped all chrome and rendered only cal.com's modal-exact iframe — "no chrome" isn't what the user wants.

The vetty demo dialog (`/Vetty-website/.../components/book-demo-dialog.tsx` at `6a678d5`) is the design reference: branded header band with gradient accent, title + subtitle, a row of value-prop chips, a cal.com iframe, and a branded loader that masks the iframe until it's ready.

## Goal

Trishty's Book Appointment dialog should feel like a natural sibling of vetty's Book Demo dialog — same information architecture and proportions — but expressed in Trishty's palette (ivory/neutral/charcoal with Cormorant serif) rather than vetty's purple.

## Non-goals

- No switch to a provider/context pattern. Trishty's callers (`hero-banner`, `navbar-main`) use inline `<BookAppointment>` triggers with `variant` / `size` / `className` / `asSpan` props — keep that public API unchanged.
- No reuse of `next-themes`. Trishty is light-only.
- No restoration of vetty's old design in this commit (that's a separate task below).

## Requirements

### R1 — Dialog chrome

| Slot | Spec |
| --- | --- |
| Container | shadcn `<Dialog>`, `md:max-w-[800px] lg:max-w-[900px]`, `max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)]`, `rounded-2xl`, `p-0 gap-0 overflow-hidden flex flex-col` (same outer sizing as vetty reference) |
| Overlay | `bg-neutral-950/60 backdrop-blur-md` (Trishty light theme accepts dark backdrop; no purple tint) |
| Header band | `p-4 sm:p-6 pb-3 sm:pb-4 shrink-0 bg-gradient-to-br from-neutral-200/50 via-neutral-100/30 to-transparent` |
| Top accent line | `h-px bg-gradient-to-r from-transparent via-gray-400/60 to-transparent` at top edge |
| Title | Cormorant serif, `text-xl sm:text-2xl`, `font-light`, `text-gray-900`, copy: **"Book an Appointment"** |
| Subtitle | `text-sm text-gray-500`, copy: *"Meet with our gemologists for a private 30-minute consultation — virtual or in our atelier."* |

### R2 — Value-prop chips (hidden below `xsmall`)

Three chips in a row, icon + text, small gray:

1. `Calendar` → "30-min consultation"
2. `Gem` → "Expert gemologist"
3. `Sparkles` → "Complimentary"

Icon color: `text-gray-700`, same gray as body copy so it reads as neutral luxury, not a branded accent.

### R3 — Iframe region

- Cal.com URL: `https://cal.com/coders-boutique/team-meetings?embed=true&theme=light` (unchanged; theme locked to light)
- Wrapper: `relative bg-popover rounded-b-2xl flex-1 min-h-0`
- `<iframe>`: `w-full h-full border-0 rounded-b-2xl`, `style={{ minHeight: 450 }}`
- Title attr: `"Book an appointment with Trishty"`
- Render iframe only while `open` is true so we don't leak background requests after close.

### R4 — Branded loader

Covers the iframe region until the iframe fires `onLoad` AND a minimum display time of **450ms** has elapsed (prevents loader flash on fast networks).

- Position: absolute over the iframe region, `rounded-b-2xl`
- Background: `bg-popover` with a subtle top-edge wash (`from-gray-100/40 via-transparent to-transparent`)
- Logo: `<span>` with Cormorant `T` monogram (128×128 area, `text-6xl`, `text-gray-900`) — we don't ship a loading GIF on Trishty and shouldn't add one
- Rotating quote (randomized on open): `text-sm font-medium text-gray-700`, max-width 28rem, centered
- Three bouncing dots in `bg-gray-400/70` with the same staggered animation timing vetty uses

**Trishty quotes** (picked randomly on open):

- "Crafting moments as rare as you are."
- "Every stone has a story. We'll help you write yours."
- "Where heritage meets unhurried design."
- "Exceptional jewelry, thoughtfully chosen."

### R5 — Public API (unchanged)

```ts
<BookAppointment
  children={React.ReactNode}      // default "Book Appointment"
  variant?={Button variant}        // default "outline"
  size?={Button size}              // default "lg"
  className?={string}
  asSpan?={boolean}                // render trigger as <span> instead of <Button>
/>
```

Trigger renders as either a `<Button>` (default) or a `<span>` (when `asSpan` is true, so navbar nav items remain structurally correct).

### R6 — Lifecycle + accessibility

- Clicking the backdrop, pressing Escape, or clicking the shadcn X button closes the dialog.
- When opening: reset `iframeLoaded`, reset `minDelayElapsed`, pick a fresh random quote.
- Body scroll lock: handled by shadcn Dialog.
- Trigger button gets `aria-haspopup="dialog"` (shadcn DialogTrigger does this automatically).

## Sibling task — restore vetty's branded dialog

While we were iterating I replaced vetty's `book-demo-dialog.tsx` with a bare cal.com-exact modal, deleting the branded header + chips + loader. **Restore vetty's original design** (git ref `6a678d5:vetty-website/components/book-demo-dialog.tsx`) as a separate commit, then port the pattern to Trishty.

## Files touched

- `Vetty-website/vetty-website/components/book-demo-dialog.tsx` — restore to `6a678d5` (revert the cal-strip commit I made locally; not yet committed to vetty's repo)
- `storefront/src/components/book-appointment.tsx` — rewrite to match this spec

## Open questions — resolved

- **Q:** Use vetty's provider pattern or Trishty's inline trigger pattern?
  **A:** Inline. Public API is already inline; switching would break call sites for no user-visible benefit.
- **Q:** Is there a Trishty loading logo/GIF to mirror vetty's `logo-loading-loop-animation.gif`?
  **A:** No — use a Cormorant-serif `T` monogram instead. Matches Trishty's brand marque without shipping another asset.
