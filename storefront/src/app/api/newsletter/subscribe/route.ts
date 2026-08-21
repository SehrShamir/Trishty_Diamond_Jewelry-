import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOOPS_API_KEY = process.env.LOOPS_API_KEY
const LOOPS_TRANSACTIONAL_ID = process.env.LOOPS_TRANSACTIONAL_ID
const GHOST_URL = process.env.GHOST_URL?.replace(/\/$/, "")
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_API_KEY

interface LoopsSubscribeResult {
  ok: boolean
  alreadySubscribed?: boolean
  confirmationSent?: boolean
  reason?: string
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function signGhostAdminToken(adminKey: string): string | null {
  const [id, secret] = adminKey.split(":")
  if (!id || !secret) return null

  const header = { alg: "HS256", kid: id, typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const payload = { iat: now, exp: now + 5 * 60, aud: "/admin/" }

  const headerPart = base64url(JSON.stringify(header))
  const payloadPart = base64url(JSON.stringify(payload))
  const unsigned = `${headerPart}.${payloadPart}`

  const secretBytes = new Uint8Array(Buffer.from(secret, "hex"))
  const signature = crypto
    .createHmac("sha256", secretBytes)
    .update(unsigned)
    .digest()

  return `${unsigned}.${base64url(signature)}`
}

async function syncToGhostAdmin(email: string, name?: string) {
  if (!GHOST_URL || !GHOST_ADMIN_KEY) return

  const token = signGhostAdminToken(GHOST_ADMIN_KEY)
  if (!token) return

  try {
    await fetch(`${GHOST_URL}/ghost/api/admin/members/`, {
      method: "POST",
      headers: {
        Authorization: `Ghost ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        members: [
          {
            email,
            name: name || undefined,
            subscribed: true,
          },
        ],
      }),
      cache: "no-store",
    })
  } catch (err) {
    console.error("[newsletter:ghost] optional sync failed:", err)
  }
}

/**
 * Adds or updates a subscriber contact in Loops (https://loops.so)
 * and sends welcome transactional email if configured.
 */
async function subscribeViaLoops(
  email: string,
  firstName?: string,
  lastName?: string
): Promise<LoopsSubscribeResult> {
  if (!LOOPS_API_KEY) {
    return { ok: false, reason: "loops-not-configured" }
  }

  try {
    const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        subscribed: true,
        userGroup: "Newsletter",
        source: "Storefront Newsletter",
      }),
      cache: "no-store",
    })

    let alreadySubscribed = false

    if (res.ok) {
      alreadySubscribed = false
    } else {
      const data = await res.json().catch(() => ({}))

      // Handle duplicate / already existing contact in Loops
      if (
        res.status === 409 ||
        (data.message &&
          typeof data.message === "string" &&
          data.message.toLowerCase().includes("already"))
      ) {
        alreadySubscribed = true
        // Update contact to active subscription
        await fetch("https://app.loops.so/api/v1/contacts/update", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            subscribed: true,
            userGroup: "Newsletter",
          }),
          cache: "no-store",
        }).catch(() => {})
      } else {
        console.error("[newsletter:loops] API error:", res.status, data)
        return { ok: false, reason: data.message || `loops-error-${res.status}` }
      }
    }

    let confirmationSent = false

    // Send transactional welcome email if configured in Loops
    if (LOOPS_TRANSACTIONAL_ID && !alreadySubscribed) {
      try {
        const transactionalRes = await fetch("https://app.loops.so/api/v1/transactional", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionalId: LOOPS_TRANSACTIONAL_ID,
            email,
            dataVariables: {
              firstName: firstName || "there",
              lastName: lastName || "",
            },
          }),
          cache: "no-store",
        })
        const data = await transactionalRes.json().catch(() => ({}))

        if (transactionalRes.ok) {
          confirmationSent = true
        } else {
          console.error(
            "[newsletter:loops] transactional send failed:",
            transactionalRes.status,
            data
          )
        }
      } catch (err) {
        console.error("[newsletter:loops] transactional send failed:", err)
      }
    }

    return { ok: true, alreadySubscribed, confirmationSent }
  } catch (err) {
    console.error("[newsletter:loops] network request failed:", err)
    return { ok: false, reason: "network-error" }
  }
}

export async function POST(request: NextRequest) {
  let body: { email?: string; firstName?: string; lastName?: string; name?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    )
  }

  // Parse names if provided
  let firstName = body.firstName?.trim()
  let lastName = body.lastName?.trim()
  if (!firstName && body.name) {
    const parts = body.name.trim().split(" ")
    firstName = parts[0]
    lastName = parts.slice(1).join(" ") || undefined
  }

  const result = await subscribeViaLoops(email, firstName, lastName)

  if (result.ok) {
    // Optionally background sync to Ghost Admin
    const fullName = firstName ? (lastName ? `${firstName} ${lastName}` : firstName) : undefined
    syncToGhostAdmin(email, fullName).catch(() => {})

    return NextResponse.json({
      ok: true,
      alreadySubscribed: !!result.alreadySubscribed,
      confirmationSent: !!result.confirmationSent,
    })
  }

  // If Loops API key is not yet configured, log and return graceful queued state
  if (result.reason === "loops-not-configured") {
    console.warn(
      "[newsletter] LOOPS_API_KEY is not configured. Captured subscription locally:",
      { email, firstName, lastName }
    )
    return NextResponse.json({ ok: true, queued: true })
  }

  return NextResponse.json(
    { ok: false, error: result.reason || "Failed to subscribe. Please try again later." },
    { status: 500 }
  )
}
