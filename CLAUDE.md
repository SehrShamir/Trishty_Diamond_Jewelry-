# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trishty.com is a premium diamond jewelry e-commerce platform. The monorepo contains:
- **`backend/`** — Medusa V2 headless commerce server (Node.js, TypeScript)
- **`storefront/`** — Next.js 15 storefront (React 19, Tailwind CSS, App Router)
- **`ghost/`** + **`ghost-content/`** — Ghost CMS for blog/education content
- Docker Compose orchestrates all services

## Commands

### Development (Docker — recommended)
```bash
docker compose up --build -d          # Start everything (postgres, redis, backend, storefront, ghost)
docker compose logs -f storefront     # Watch storefront logs
docker compose logs -f backend        # Watch backend logs
docker compose restart storefront     # Restart storefront after code changes
docker compose down                   # Stop all
docker compose down -v                # Stop + wipe databases (destructive)
```

### Storefront (standalone, requires backend running)
```bash
cd storefront
yarn dev                              # Dev server on :8000 (Turbopack)
yarn build                            # Production build (needs NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
yarn test                             # Run vitest
yarn test:run                         # Run vitest once (CI)
yarn lint                             # ESLint
```

### Backend
```bash
cd backend
pnpm dev                              # Dev server on :9000
pnpm build                            # medusa build (compiles to .medusa/server/)
pnpm seed                             # Run seed script (medusa exec ./src/scripts/seed.ts)
```

### Create admin user
```bash
docker compose exec backend sh -c "cd /app/.medusa/server && npx medusa user -e admin@trishty.com -p password"
```

### Production deployment
```bash
scp docker-compose.prod.yml .env.prod user@server:/opt/medusa/
ssh user@server "cd /opt/medusa && docker compose -f docker-compose.prod.yml --env-file .env.prod up -d"
```

## Architecture

### Storefront (Next.js 15 App Router)

**Path aliases** (tsconfig `baseUrl: ./src`):
- `@modules/*` → `src/modules/*` (UI components organized by domain)
- `@lib/*` → `src/lib/*` (data fetching, utilities, config)
- `@/components/*` → `src/components/*` (shared UI primitives like Button, Input)

**Data layer** (`src/lib/data/`): Server actions that call Medusa API via `@medusajs/js-sdk`. Each file maps to a Medusa domain: `products.ts`, `cart.ts`, `customer.ts`, `regions.ts`, `categories.ts`, etc.

**SDK config** (`src/lib/config.ts`): Initializes `@medusajs/js-sdk` with `MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

**Middleware** (`src/middleware.ts`): Resolves user region from cookies/headers, caches region map from Medusa API. Runs on Edge.

**Module structure** (`src/modules/`): Domain-organized with `components/` and `templates/` subdirs:
- `products/` — PDP template, image gallery (carousel + 2x2 grid modes), BYOR flow, product actions, product cards
- `home/` — Hero banner, category carousel, feature carousel, product grid, trust sections
- `layout/` — Navbar (with mega menu), footer, cart dropdown, progress bar
- `checkout/` — Multi-step checkout with Stripe payment wrapper
- `account/` — Login, register, profile, addresses, orders
- `blog/` — Ghost CMS integration

**BYOR (Build Your Own Ring)**: Multi-step flow at `/build-your-ring`. Products in "settings" or "engagement-rings" collections are customizable. Setting + stone linked via cart line item `metadata.byor_group_id`.

**Ghost CMS** (`src/lib/ghost.ts`): Content API integration for blog posts at `/blog/[tag]/[slug]`.

**Analytics** (`src/lib/analytics/`): PostHog (client-side pageview tracking) + GTM, both env-driven and no-op when keys are empty.

### Backend (Medusa V2)

**Config**: `medusa-config.ts` — database, redis, CORS, auth settings. No payment provider module installed yet (Stripe integration pending).

**Seed scripts**: `src/scripts/seed.ts` (base), `src/scripts/seed-jewelry.ts` (jewelry-specific products: settings, diamonds, engagement rings).

**Entrypoint** (`entrypoint.sh`): Runs migrations → checks if seed needed → writes publishable key to `/shared/publishable_key` for storefront container → starts server.

### Docker

- **`docker-compose.yml`** — Development (volumes mount source code, ports offset: backend 9001, storefront 8001, postgres 5433, redis 6380)
- **`docker-compose.prod.yml`** — Production (pre-built images, direct ports: backend 9000, storefront 8000)
- **Publishable key sharing**: Backend writes to `/shared/publishable_key` volume; storefront entrypoint reads it if env var is empty
- **`.env.local`** uses Docker hostnames (`http://backend:9000`, `http://ghost:2368`); don't set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — it's auto-detected

## Key Patterns

- **Static pages** follow the heritage/client-services pattern: hero section (centered, `pt-32 pb-24`, blur orb background) + content sections (`max-w-3xl`, `space-y-16`). All have Metadata export with OG tags + canonical URL.
- **Product cards** use a server component (`ProductPreview`) that passes serialized data to a client component (`ProductCard`) for hover interactions.
- **Image optimization**: All images in `/public/home/` are WebP. Use `cwebp -q 60 -resize 1920 0` for hero images.
- **Fonts**: Cormorant Garamond (serif, `--font-cormorant`) + Montserrat (sans, `--font-montserrat`) via `next/font/google`.
- **Responsive breakpoints**: `small:` (768px), `medium:` (1024px), `large:` (1280px) — Tailwind custom config.
- **"bn-container"**: Custom Tailwind utility for max-width container with padding.

## Environment Variables

**Storefront** (`.env.local`): `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (auto-detected in Docker), `GHOST_URL`, `GHOST_CONTENT_API_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_STRIPE_KEY`

**Backend** (`.env`): `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`

## Ports

| Service | Dev (Docker) | Prod |
|---------|-------------|------|
| Storefront | 8001 | 8000 |
| Backend/Admin | 9001 | 9000 |
| PostgreSQL | 5433 | 5432 |
| Redis | 6380 | 6379 |
| Ghost CMS | 2368 | 2368 |
