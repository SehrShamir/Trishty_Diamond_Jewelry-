# Stripe Payments — Setup & Operations

## TL;DR

Medusa ships with a built-in `manual` payment provider that can record "paid" but can't charge cards. To actually process cards you install `@medusajs/payment-stripe` and register it in `medusa-config.ts`. This repo has that done. To go live you still need to:

1. Fill the three env vars (`STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_KEY`)
2. Enable Stripe per region in Medusa Admin
3. Create the webhook endpoint in Stripe Dashboard

## Architecture

```
Browser                 Next.js storefront              Medusa backend                  Stripe
  |                            |                               |                          |
  |--[1] Checkout form->       |                               |                          |
  |<-[2] Cart + Stripe key     |                               |                          |
  |                            |                               |                          |
  |--[3] Confirm w/ card------>|                               |                          |
  |                            |--[4] initiatePaymentSession-->|                          |
  |                            |                               |--[5] PaymentIntent.new-->|
  |                            |                               |<-[6] client_secret-------|
  |<---[7] client_secret-------|                               |                          |
  |                            |                               |                          |
  |--[8] confirmCardPayment  (SCA, 3DS, Apple Pay etc.) ------------------------------->   |
  |<-[9] Payment succeeded--------------------------------------------------------------  |
  |                            |                               |                          |
  |--[10] placeOrder--------->|                                |                          |
  |                            |--[11] completeCart----------->|                          |
  |                            |<--[12] Order--                |                          |
  |<--[13] /order/[id]/confirmed                               |                          |
  |                            |                               |<-[14] webhook------------|
  |                            |                               |   payment_intent.succeeded
  |                            |                               |   (reconciles if race)
```

## Required environment variables

### Backend (`backend/.env`)

| Variable | Required | Example | Where to get it |
| --- | --- | --- | --- |
| `STRIPE_API_KEY` | yes | `sk_test_...` / `sk_live_...` | Stripe Dashboard → Developers → API keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | yes in prod; optional in dev | `whsec_...` | Stripe Dashboard → Developers → Webhooks → endpoint → Signing secret, OR from `stripe listen` output |

### Storefront (`storefront/.env.local`)

| Variable | Required | Example | Where to get it |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_STRIPE_KEY` | yes | `pk_test_...` / `pk_live_...` | Same page as Secret key — Publishable key |

**Test vs live keys:** use `_test_` while developing; swap to `_live_` only after Stripe account activation. Nothing in the code cares which one — Stripe tells itself.

## First-time activation checklist

### 1. Add Stripe as a payment provider in Medusa Admin

Once the backend boots with `STRIPE_API_KEY` set, Medusa recognizes the provider. You still need to opt each region in:

1. Open Medusa Admin (`http://localhost:9001/app` or `https://a.trishty.com/app`)
2. **Settings → Regions**
3. Click each region that should accept cards (usually every region)
4. Scroll to **Payment Providers** → toggle **Stripe** on
5. Save

### 2. Create the webhook endpoint (for production)

Deploy the backend so it has a public URL first. Then in Stripe Dashboard → Developers → Webhooks:

1. **Add endpoint**
2. URL: `https://a.trishty.com/hooks/payment/stripe` (use your real backend host)
3. **Events to send** — add at least:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - *(optional)* `payment_intent.amount_capturable_updated` — only if `capture: false` (manual capture)
   - *(optional)* `charge.dispute.created` — if you want Medusa to flag disputed orders
4. **Add endpoint**
5. Copy the **Signing secret** (`whsec_...`) shown on the detail page
6. Paste into production `backend/.env` as `STRIPE_WEBHOOK_SECRET`
7. Redeploy / restart backend

### 3. For local webhook testing (optional but useful)

Use Stripe CLI to bridge live Stripe events to your dev backend:

```bash
# Install (macOS)
brew install stripe/stripe-cli/stripe

# One-time login; opens browser
stripe login

# Forward events to your local backend (runs in foreground)
stripe listen --forward-to http://localhost:9001/hooks/payment/stripe
```

The CLI prints:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxx (^C to quit)
```

Paste that `whsec_...` into `backend/.env` as `STRIPE_WEBHOOK_SECRET`, restart the backend, and leave the `stripe listen` command running during dev.

Trigger a test event without completing a real checkout:

```bash
stripe trigger payment_intent.succeeded
```

### 4. Test with real test cards

Once everything is wired, use these Stripe test cards in your storefront checkout:

| Card | What it does |
| --- | --- |
| `4242 4242 4242 4242` | Succeeds, no 3DS |
| `4000 0027 6000 3184` | Requires 3DS authentication (SCA) |
| `4000 0000 0000 9995` | Declined — insufficient funds |
| `4000 0000 0000 0002` | Declined — generic |

Any future expiry date (e.g. `12/34`), any 3-digit CVC, any ZIP.

Full list: [stripe.com/docs/testing](https://stripe.com/docs/testing)

## What Medusa's Stripe provider gives you

**Out of the box, once registered:**

- Payment session creation with PaymentIntent (Stripe's async 3DS/SCA flow)
- Automatic capture after `payment_intent.succeeded` (or manual capture if `capture: false`)
- Refund support from Medusa Admin (partial or full, up to the captured amount)
- Webhook signature verification (`STRIPE_WEBHOOK_SECRET` is used here)
- Apple Pay / Google Pay / Link / Klarna / Afterpay / Cash App Pay / SEPA / iDEAL etc.
  out-of-the-box — Stripe's Payment Element handles them all if you enable them
  in Stripe dashboard; no code changes needed
- Idempotency under webhook replay — the PaymentIntent ID uniquely identifies the session

**What it does NOT do:**

- Apply a platform fee / Stripe Connect — that's a separate integration
- Fraud prevention rules — configure in Stripe Radar (built-in, no code)
- Subscriptions / recurring — Medusa v2 does single-payment only

## Operations playbook

### Refund an order
Medusa Admin → Orders → [order] → Refund → choose amount → submit.
Medusa calls `stripe.refunds.create(...)`, which fires `charge.refunded`, which
the webhook updates the order state with.

### A customer says "I was charged but didn't get an order confirmation"
Two possibilities:

1. **Race:** PaymentIntent succeeded but the browser closed before `placeOrder` ran.
   The webhook already captured the session in Medusa; run `completeCart` manually
   (SQL or admin action) to finalize. Rare.
2. **Genuine failure:** check `logs` in the backend for the cart ID, match to the
   PaymentIntent in Stripe dashboard, reconcile manually.

### A webhook isn't firing
Stripe Dashboard → Developers → Webhooks → [endpoint] → "Recent deliveries" —
shows every attempted call with response status. Common causes:

- Backend not publicly reachable (404/timeout)
- Wrong `STRIPE_WEBHOOK_SECRET` → signature verification fails → 401 returned
- Backend hasn't loaded the `@medusajs/payment-stripe` provider — check startup
  logs for `Registered payment provider: stripe`

### Rotating the secret key
1. Stripe Dashboard → Developers → API keys → Roll key (for the secret key)
2. Copy the new `sk_...`
3. Update `backend/.env` → `STRIPE_API_KEY`
4. Restart backend (`docker compose up -d --force-recreate --no-deps backend`)
5. Old key stops working immediately

Publishable key rotation is similar but usually doesn't need doing unless
it's been leaked — it's public by design.

### Going live

1. In Stripe Dashboard, switch to **Live** mode (toggle top-right)
2. Copy live API keys (`sk_live_...`, `pk_live_...`) into prod env vars
3. Create a **new** webhook endpoint in live mode — live mode has its own signing secret
4. Paste that live `whsec_...` into prod `STRIPE_WEBHOOK_SECRET`
5. Restart backend
6. Place one real $0.50 order yourself to verify, then refund it
