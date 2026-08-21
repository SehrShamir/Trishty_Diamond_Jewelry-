# Trishty — Diamond Jewelry, Made to Order

Premium diamond jewelry e-commerce platform with a Build Your Own Ring (BYOR) customization flow, inspired by Keyzar Jewelry.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Commerce Backend | Medusa V2 |
| Storefront | Next.js 15 (App Router, React 19) |
| Styling | Tailwind CSS, Framer Motion |
| UI Components | Radix UI, Headless UI, Lucide Icons |
| Blog/CMS | Ghost CMS |
| Payments | Stripe |
| Analytics | PostHog, Google Tag Manager |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Infrastructure | Docker Compose |

## Local Development

```bash
docker compose up --build -d
```

Everything is automatic: migrations, seed, publishable key sharing, storefront build.

| Service | URL |
|---------|-----|
| Storefront | http://localhost:8001 |
| Admin Panel | http://localhost:9001/app |
| Ghost CMS | http://localhost:2368 |

### Create admin user

```bash
docker compose exec backend sh -c "cd /app/.medusa/server && npx medusa user -e admin@trishty.com -p yourpassword"
```

### View logs

```bash
docker compose logs -f storefront
docker compose logs -f backend
```

## Project Structure

```
trishty.com/
├── backend/                # Medusa V2 backend
│   ├── src/scripts/        # Seed scripts (seed.ts, seed-jewelry.ts)
│   ├── medusa-config.ts    # Backend configuration
│   └── entrypoint.sh       # Docker entrypoint (migrations + key sharing)
├── storefront/             # Next.js 15 storefront
│   ├── src/app/            # App Router pages
│   │   ├── (main)/         # Main layout (home, PDP, categories, static pages)
│   │   └── (checkout)/     # Checkout layout
│   ├── src/modules/        # Domain-organized UI components
│   │   ├── products/       # PDP, BYOR, product cards, image gallery
│   │   ├── home/           # Hero, carousels, trust sections
│   │   ├── layout/         # Navbar, footer, cart dropdown
│   │   ├── checkout/       # Multi-step checkout with Stripe
│   │   └── account/        # Auth, profile, orders
│   ├── src/lib/            # Data layer, SDK config, utilities
│   └── public/             # Static assets (WebP images, favicons)
├── ghost/                  # Ghost CMS instance
├── docker-compose.yml      # Development orchestration
├── docker-compose.prod.yml # Production orchestration
├── .env.prod               # Production secrets (gitignored)
└── CLAUDE.md               # AI assistant context
```

## Key Features

- **Build Your Own Ring (BYOR)** — 3-step flow: Setting, Stone, Complete Ring
- **Keyzar-style PDP** — 2x2 image grid, category breadcrumbs, metal swatches
- **Product cards with hover** — Image carousel, wishlist, Add to Cart, installment pricing
- **Infinite carousel** — Discover Styles section with smooth infinite scroll
- **SEO** — Full metadata, OG tags, JSON-LD (Product, FAQPage, Organization, BreadcrumbList)
- **Static pages** — Contact, FAQ, Privacy, Terms, Shipping, Returns, Warranty, Reviews, Accessibility, Conflict Free
- **Blog** — Ghost CMS integration with tag-based routing
- **Analytics** — PostHog + GTM (env-driven, no-op when keys empty)
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## Production Deployment

### 1. Copy files to server

```bash
scp docker-compose.prod.yml .env.prod user@your-server:/opt/medusa/
```

### 2. Configure `.env.prod`

Update with your domain, strong secrets, and Stripe keys. See `.env.prod` for all variables.

### 3. Pull and start

```bash
cd /opt/medusa
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### 4. Create admin user (first time)

```bash
docker compose -f docker-compose.prod.yml exec backend sh -c "cd /app/.medusa/server && npx medusa user -e admin@trishty.com -p yourpassword"
```

### 5. Update to new version

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

See `storefront/.env.template` and `backend/.env.template` for all required variables with documentation.

Key variables:
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — Auto-detected in Docker, no need to set manually
- `NEXT_PUBLIC_STRIPE_KEY` — Required for checkout payments
- `NEXT_PUBLIC_POSTHOG_KEY` — Optional, enables analytics
- `NEXT_PUBLIC_GTM_ID` — Optional, enables Google Tag Manager
- `GHOST_CONTENT_API_KEY` — Required for blog functionality
