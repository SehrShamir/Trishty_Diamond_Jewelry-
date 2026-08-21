# Blog Operations

The storefront blog is powered by [Ghost CMS](https://ghost.org/) running alongside Medusa in Docker. This doc covers first-run setup, day-to-day publishing, and the webhook wiring that keeps the storefront fresh.

## Architecture

- **Ghost** — headless CMS, serves Content + Admin APIs on port `2368`
- **Ghost-DB** — MySQL 8 backing store
- **Storefront (Next.js)** — reads posts via the Ghost Content API at build/request time, revalidates on webhooks

Routes:

| Route | Purpose |
| --- | --- |
| `/blog` | Index (featured + grid, category pills, newsletter) |
| `/blog/[tag]` | Category page, server-side filtered via Ghost API |
| `/blog/[tag]/[slug]` | Post with TOC, share buttons, related posts, JSON-LD |
| `/blog/rss.xml` | RSS 2.0 feed (50 latest posts) |
| `/api/revalidate` | Ghost webhook target — revalidates affected paths |
| `/api/newsletter/subscribe` | Public subscribe endpoint (creates/syncs contacts in Loops.so) |

## First-Run Setup

### 1. Start the stack

```bash
docker compose up -d postgres redis ghost-db ghost backend storefront
```

Ghost takes ~60s to initialize MySQL. Watch:

```bash
docker compose logs -f ghost
```

Wait for `Ghost is running in development...`

### 2. Create the Ghost owner

Open <http://localhost:2368/ghost/> and complete the onboarding:

1. Site title: *Trishty Journal*
2. Owner email + name
3. Password

### 3. Generate a Content API key

In Ghost Admin:

1. **Settings → Advanced → Integrations → Add custom integration**
2. Name: `Storefront`
3. Copy the **Content API Key**

Paste into `storefront/.env.local`:

```bash
GHOST_CONTENT_API_KEY=<paste>
```

### 4. (Optional) Configure Loops Newsletter & Email Settings
 
To capture subscribers and deliver newsletters using [Loops.so](https://loops.so):
1. In Loops dashboard: **Settings → API Keys → Generate Key**
2. In Ghost Admin: Go to **Settings → Email newsletter → Loops** to configure your `Loops API Key` and optional `Transactional ID` alongside `Mailgun`.
3. Add to `storefront/.env.local` (and server `.env` in production):
 
```bash
LOOPS_API_KEY=<paste>
```
 
Subscribers will automatically be saved to Loops with `subscribed: true`, `userGroup: "Newsletter"`, and `source: "Storefront Newsletter"`. Ghost newsletters will dispatch via Loops whenever configured.

### 5. Restart storefront

```bash
docker compose restart storefront
```

Visit <http://localhost:8001/blog>. You'll see the "No posts yet" state until you publish.

## Publishing Flow

1. Write/edit in Ghost Admin
2. Tag with one of the canonical category slugs so the category routing works:
   - `engagement-rings`
   - `eternity-rings`
   - `diamonds-gemstones`
   - `pendants`
   - Or any custom tag (it'll still render under `/blog/<tag>`)
3. Add a feature image (appears in grid, hero, OG card)
4. Hit Publish

The storefront will pick up changes within the 60s ISR window, or immediately if the webhook is configured (below).

## Instant Revalidation via Webhook

Without webhooks, new posts appear within 60s. With webhooks, changes go live within 1–2s.

1. In Ghost Admin → **Integrations → Storefront → Webhooks → Add webhook**
2. Event: `post.published`
3. Target URL:

   ```
   https://<your-storefront>/api/revalidate?secret=<REVALIDATE_SECRET>
   ```

4. Repeat for `post.unpublished`, `post.updated`, and optionally `post.deleted`.

The endpoint revalidates `/blog`, the post's `/blog/[tag]`, the post's `/blog/[tag]/[slug]`, `/sitemap.xml`, and `/blog/rss.xml`.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GHOST_URL` | yes | URL Next uses to call Ghost Content API. Docker: `http://ghost:2368`. Prod: `https://cms.trishty.com` |
| `GHOST_CONTENT_API_KEY` | yes | Read-only key for fetching posts/tags |
| `LOOPS_API_KEY` | optional | Loops.so API key — enables storefront newsletter & audience capture |
| `LOOPS_TRANSACTIONAL_ID` | optional | Loops.so transactional email ID — triggers welcome/confirmation email |
| `GHOST_ADMIN_API_KEY` | optional | `id:secret` Admin key — syncs storefront subscribers into Ghost members |
| `MAILGUN_API_KEY` / `MAILGUN_DOMAIN` | optional | Enables Ghost native "Email on publish" bulk post newsletter |
| `NEXT_PUBLIC_GHOST_IMAGE_HOSTNAME` | prod | Ghost hostname for next/image optimization (no protocol) |
| `REVALIDATE_SECRET` | yes | Shared secret for the `/api/revalidate` webhook |
| `GHOST_PUBLIC_URL` | dev | URL Ghost advertises in content (defaults to `http://localhost:2368` in compose) |
| `GHOST_DB_PASSWORD` / `GHOST_DB_ROOT_PASSWORD` | prod | Override the default dev DB passwords |

## Production Deployment Notes

- Host Ghost separately (managed Ghost Pro, or dedicated VPS) with TLS and a real backup strategy — don't run the bundled MySQL in production without volumes + backups.
- Set `NEXT_PUBLIC_GHOST_IMAGE_HOSTNAME` to the production Ghost hostname so next/image can optimize feature images and author avatars.
- Point both `GHOST_URL` and `GHOST_PUBLIC_URL` at the same public URL in prod — the two-URL pattern exists only to bridge docker-internal service names with browser-reachable hostnames in dev.
- Add the webhook (above) so the storefront revalidates on publish rather than waiting for the 60s ISR window.
- Confirm `/robots.txt` and `/sitemap.xml` are generated correctly after a production build (`yarn build` runs `next-sitemap` via postbuild if configured).

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Blog shows "No posts yet" even after publishing | `GHOST_CONTENT_API_KEY` missing/stale — storefront logs `[ghost]` warning on startup |
| Images render broken in dev | Feature images are served from `http://localhost:2368` — make sure Ghost is running and the browser can reach `:2368` |
| Subscribe says "Subscribed" but Loops has no contact | `LOOPS_API_KEY` not set — submissions are logged server-side |
| 401 on `/api/revalidate` | Ghost webhook is missing `?secret=…` or `x-webhook-secret` header |
| RSS feed empty | Ghost has no published posts with `status=published` |
