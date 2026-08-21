# Production Deployment

End-to-end deploy of the full Trishty stack: Medusa backend, Next.js storefront, Postgres, Redis, Ghost CMS, Ghost DB, and an optional Cloudflare Tunnel.

Stack file: [`docker-compose.prod.yml`](../docker-compose.prod.yml)
Env template: [`.env.prod`](../.env.prod)

## Stack topology

All services sit on a dedicated bridge network `trishty-network` (`172.19.3.0/24`) with static IPs, so service-to-service calls always resolve to the same address.

```
            public internet
                  │
      ┌───────────┴───────────┐
      │                       │
 Cloudflare Tunnel      your reverse proxy
 (cloudflared svc)      (nginx / Caddy / ALB — not in this repo)
      │                       │
      └─────────┬─────────────┘
                │
     ┌──────────┴──────────────────┐
     │                             │
  trishty.com                  cms.trishty.com
  api.trishty.com              (ghost)
     │                             │
 storefront:8000              ghost:2368
 backend:9000                      │
     │                             │
     │        ┌──── shared-data (publishable_key)
     │        │
 postgres   redis           ghost-db
 172.19.3.10 172.19.3.20    172.19.3.30
```

Three subdomains is the simplest setup:
- `trishty.com` → storefront (port 8000)
- `api.trishty.com` → backend (port 9000)  — Medusa admin lives at `/app`
- `cms.trishty.com` → ghost (port 2368)     — Ghost admin lives at `/ghost`

You can also use path-based routing; compose just exposes the container ports — TLS and routing happen in your reverse proxy or Cloudflare Tunnel.

## Prerequisites on the server

- Docker + Docker Compose v2
- Public ingress — pick one:
  - **Cloudflare Tunnel** (recommended, matches vetty-website setup). No ports open on the host; Cloudflare terminates TLS. Run the `cloudflared` service inside compose.
  - **Reverse proxy** (nginx / Caddy / Traefik) on the server terminating TLS with Let's Encrypt or similar. Ports 80/443 open publicly, 8000/9000/2368 loopback-only.
- DNS for the three subdomains resolving to Cloudflare (tunnel) or the server's IP (reverse proxy)
- At least ~5GB free disk for Postgres, Ghost MySQL, uploaded content, and pulled images

## First-time deploy

### 1. Clone the repo

```bash
git clone https://github.com/fenilgtm/medusa-docker.git
cd medusa-docker
```

### 2. Create `.env` from the template

```bash
cp .env.prod .env
```

### 3. Fill in the blanks in `.env`

Every placeholder value. Critical ones:

| Variable | Source |
| --- | --- |
| `STRIPE_API_KEY` | Stripe dashboard → API keys (secret). Use `sk_test_` first, swap to `sk_live_` after Stripe activation |
| `STRIPE_WEBHOOK_SECRET` | Filled *after* step 6 below |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe dashboard → API keys (publishable) |
| `GHOST_CONTENT_API_KEY` | Filled *after* step 5 below |
| `GHOST_ADMIN_API_KEY` | Filled *after* step 5 below (optional — enables newsletter auto-subscribe) |
| `GHOST_DB_PASSWORD` / `GHOST_DB_ROOT_PASSWORD` | Pick strong passwords before first boot — changing them later requires volume nuke |
| `NEXT_PUBLIC_POSTHOG_KEY` | app.posthog.com → Project Settings → Project API Keys |
| `POSTGRES_PASSWORD` | Keep the committed value or rotate. Changing after first boot requires `docker compose down -v` (loses data) |
| `JWT_SECRET` / `COOKIE_SECRET` / `REVALIDATE_SECRET` | Keep the committed values or rotate with `openssl rand -base64 32` |

Do **not** commit `.env`; it's `.gitignored` already.

### 4. Bring up the core stack

**Without Cloudflare Tunnel** (reverse proxy handles ingress):

```bash
docker compose -f docker-compose.prod.yml up -d postgres redis ghost-db
# Wait ~30s for MySQL first-time init
docker compose -f docker-compose.prod.yml up -d backend ghost
# Wait for backend to be healthy — writes the publishable key to the shared volume
docker compose -f docker-compose.prod.yml ps   # confirm backend shows (healthy)
docker compose -f docker-compose.prod.yml up -d storefront
```

**With Cloudflare Tunnel**:

```bash
# Same as above, then enable the cloudflared profile
docker compose --profile cloudflared -f docker-compose.prod.yml up -d
```

The `cloudflared` service stays off unless you opt in via `--profile cloudflared` — so the same compose file works for both ingress styles.

Confirm each container is healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

All 6 services should show `Up ... (healthy)`.

### 5. First-run Ghost setup

Ghost boots with an empty DB and waits for owner setup.

1. Open `https://cms.trishty.com/ghost/` (your Ghost URL + `/ghost/`)
2. Complete the onboarding form (owner email, strong password, blog title: *Trishty Journal*)
3. In Ghost Admin → **Settings → Advanced → Integrations → Add custom integration** named "Storefront"
4. Copy the **Content API Key** → paste into `.env` as `GHOST_CONTENT_API_KEY`
5. Copy the **Admin API Key** (format `id:secret`) → paste into `.env` as `GHOST_ADMIN_API_KEY`
6. Restart storefront so it re-reads the env:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --force-recreate --no-deps storefront
   ```
7. Optional: in Ghost Admin add a webhook pointed at `https://trishty.com/api/revalidate?secret=$REVALIDATE_SECRET` for events `post.published`, `post.updated`, `post.unpublished` so new posts appear on the storefront immediately (otherwise the 60s ISR window handles it)

Detail reference: [`docs/BLOG.md`](./BLOG.md)

### 6. Stripe webhook endpoint

Once the backend is publicly reachable:

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**
2. URL: `https://api.trishty.com/hooks/payment/stripe`
3. Events to send (minimum): `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Click **Add endpoint**
5. Copy the **Signing secret** (`whsec_...`) → paste into `.env` as `STRIPE_WEBHOOK_SECRET`
6. Restart backend:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --force-recreate --no-deps backend
   ```

Detail reference: [`docs/STRIPE.md`](./STRIPE.md)

### 7. Enable Stripe per region in Medusa Admin

1. Open `https://api.trishty.com/app` (Medusa Admin)
2. Create an admin account if one wasn't seeded
3. **Settings → Regions → United States** (or whichever regions you configured)
4. **Payment Providers** → toggle **Stripe** on → save
5. Repeat for every region that should accept cards

### 8. Smoke test

- Visit `https://trishty.com` — storefront loads
- Open DevTools → Network — should see a `/e/?...` call to PostHog (or the configured host)
- Add a product to cart → go to checkout → pay with `4242 4242 4242 4242` / any future date / any CVC
- Confirmation page should show "Your order has been placed"
- Stripe Dashboard → Payments — the test payment shows up
- Medusa Admin → Orders — the order shows up, marked paid
- PostHog → Activity → Live events — `$pageview`, `product_viewed`, `product_added_to_cart`, `checkout_started`, `order_completed` fire

If anything misses, see Troubleshooting below.

## Going live (switching from test to live Stripe)

1. In Stripe Dashboard, flip **Test mode** off (top-right toggle). Live mode uses separate keys.
2. Generate live API keys → replace `STRIPE_API_KEY` (`sk_live_`) and `NEXT_PUBLIC_STRIPE_KEY` (`pk_live_`) in `.env`
3. Create a **new** webhook endpoint in live mode (test-mode webhooks do not fire live-mode events) → copy its `whsec_...` → replace `STRIPE_WEBHOOK_SECRET` in `.env`
4. Restart backend and storefront:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --force-recreate --no-deps backend storefront
   ```
5. Place one real $0.50 order yourself to verify, then refund it from Medusa Admin

## Updating / deploying new code

Images are pulled from Docker Hub (`everythingtalentdeveloper/medusa-docker:backend` and `:storefront`). After a new image is pushed:

```bash
docker compose -f docker-compose.prod.yml pull backend storefront
docker compose -f docker-compose.prod.yml up -d backend storefront
```

The storefront rebuilds and restarts on boot (per its entrypoint) — no explicit rebuild step needed.

If you're changing source code, push to Docker Hub from CI or manually:

```bash
docker compose -f docker-compose.yml build backend storefront
docker push everythingtalentdeveloper/medusa-docker:backend
docker push everythingtalentdeveloper/medusa-docker:storefront
```

Then pull + up on the server as above.

## Backups

- **Postgres** (Medusa): dump nightly — `docker compose exec postgres pg_dump -U postgres medusa | gzip > /backups/medusa-$(date +%F).sql.gz`
- **Ghost MySQL**: `docker compose exec ghost-db mysqldump -uroot -p"$GHOST_DB_ROOT_PASSWORD" ghostdb | gzip > /backups/ghost-$(date +%F).sql.gz`
- **Ghost content volume** (`./ghost-content`): rsync to S3 or another host weekly — contains uploaded images, themes, routes
- **Storefront has no state** — nothing to back up

Restore by dropping the backup into the DB and starting the stack; named volumes persist across container recreation.

## Troubleshooting

### Storefront shows "No posts yet" on /blog

Content API key mismatch. Check:

```bash
docker compose -f docker-compose.prod.yml logs storefront | grep ghost
```

Look for `[ghost:getPosts] Unknown Content API Key` — means the key in `.env` doesn't match what Ghost has. Regenerate in Ghost Admin → Integrations → Storefront → Content API Key, paste in `.env`, restart storefront.

### Checkout says "payment provider not found"

Stripe provider not enabled for the region. Fix in Medusa Admin → Settings → Regions → [region] → Payment Providers → toggle Stripe on.

Or the backend image was built without `@medusajs/payment-stripe`. Confirm:

```bash
docker compose -f docker-compose.prod.yml exec backend \
  ls /app/node_modules/@medusajs/payment-stripe
```

If missing, the image needs rebuilding with the updated `backend/package.json`.

### Stripe webhooks not firing

Stripe Dashboard → Developers → Webhooks → your endpoint → Recent deliveries — shows attempted calls. Common failures:

- 404: backend not publicly reachable, or `/hooks/payment/stripe` path not proxied correctly
- 401: `STRIPE_WEBHOOK_SECRET` mismatch — signature verification failed. Copy the secret fresh from Stripe and restart backend
- Timeout: backend took too long to respond. Usually a cold-start issue; Stripe retries automatically with exponential backoff

### PostHog events not arriving

- `NEXT_PUBLIC_POSTHOG_KEY` missing or wrong (key is public by design, must start with `phc_`)
- DevTools Network panel should show calls to the configured host. If none, provider isn't initialized — check for JS errors
- Key rotation invalidates old events — new events use the new key; old events remain under the old key's project

### Out-of-disk after a few weeks

Docker image layers accumulate. Clean periodically:

```bash
docker image prune -f
docker system df           # see reclaimable space
```

Also rotate old `medusa-docker:backend` and `:storefront` tags from Docker Hub — each pulled tag is cached locally.

## Ports exposed and what proxies to them

| Port | Service | Subdomain | Notes |
| --- | --- | --- | --- |
| 8000 | storefront | trishty.com | Next.js; reads `NEXT_PUBLIC_*` at build/boot |
| 9000 | backend | api.trishty.com | Medusa; admin at `/app`, store API at `/store`, hooks at `/hooks/*` |
| 2368 | ghost | cms.trishty.com | Ghost; admin at `/ghost`, content API at `/ghost/api/content` |
| — | postgres | (internal) | Not publicly exposed |
| — | redis | (internal) | Not publicly exposed |
| — | ghost-db | (internal) | Not publicly exposed |

Your reverse proxy owns TLS termination and subdomain routing. Example Caddyfile:

```Caddyfile
trishty.com, www.trishty.com {
  reverse_proxy localhost:8000
}
api.trishty.com {
  reverse_proxy localhost:9000
}
cms.trishty.com {
  reverse_proxy localhost:2368
}
```

## Cloudflare Tunnel setup (alternative to reverse proxy)

If you want ingress without opening ports on the host — recommended for single-server deploys — use the bundled `cloudflared` service instead.

### 1. Create the tunnel

1. Open [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/)
2. **Networks → Tunnels → Create a tunnel**
3. Name it `trishty-prod`, choose **Cloudflared** as the connector
4. Copy the **tunnel token** shown on the Install connector screen
5. Paste into `.env`:
   ```
   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjo...
   ```

### 2. Add public hostnames

On the tunnel's **Public Hostname** tab, add three routes:

| Subdomain | Service | Type / URL |
| --- | --- | --- |
| `trishty.com` | storefront | HTTP → `storefront:8000` |
| `api.trishty.com` | backend | HTTP → `backend:9000` |
| `cms.trishty.com` | ghost | HTTP → `ghost:2368` |

Cloudflare auto-creates DNS CNAMEs pointing each subdomain at the tunnel.

Because the `cloudflared` service sits on `trishty-network` alongside the other services, it can reach them by their compose service names (`storefront:8000`, not `localhost:8000`). This is the main reason the network has static IPs — consistent internal DNS regardless of boot order.

### 3. Start the tunnel alongside the stack

```bash
docker compose --profile cloudflared -f docker-compose.prod.yml up -d
```

Check that `cloudflared` shows `registered` in its logs:

```bash
docker compose -f docker-compose.prod.yml logs cloudflared | grep -i registered
```

TLS certs are managed by Cloudflare; nothing to renew, nothing to rotate.
