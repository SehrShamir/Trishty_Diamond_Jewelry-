import crypto from "crypto"
import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"

function verifyToken(token: string) {
  const [payload, signature] = token.split(".")
  const secret = process.env.NEWSLETTER_TRACKING_SECRET
  if (!payload || !signature || !secret) return null

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url")
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    if (!data.email || !data.postUrl || data.exp < Date.now()) return null
    return data as { email: string; postUrl: string; emailId?: string }
  } catch {
    return null
  }
}

async function markGhostEmailOpened(data: { email: string; emailId?: string; postUrl: string }) {
  if (!data.emailId) return

  const db = await mysql.createConnection({
    host: process.env.GHOST_DB_HOST || "ghost-db",
    user: process.env.GHOST_DB_USER || "ghost",
    password: process.env.GHOST_DB_PASSWORD || "ghostpass",
    database: process.env.GHOST_DB_NAME || "ghostdb",
  })

  try {
    const [recipients] = await db.execute(
      "SELECT id, member_id FROM email_recipients WHERE email_id = ? AND member_email = ? LIMIT 1",
      [data.emailId, data.email]
    )
    const recipient = (recipients as Array<{ id: string; member_id: string }>)[0]
    if (!recipient) return

    await db.execute("UPDATE email_recipients SET opened_at = COALESCE(opened_at, UTC_TIMESTAMP()) WHERE id = ?", [recipient.id])
    const [emails] = await db.execute("SELECT post_id FROM emails WHERE id = ? LIMIT 1", [data.emailId])
    const postId = (emails as Array<{ post_id: string | null }>)[0]?.post_id || null
    const redirectId = crypto.randomBytes(12).toString("hex")
    await db.execute(
      "INSERT INTO redirects (id, `from`, `to`, post_id, created_at, updated_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())",
      [redirectId, data.postUrl, data.postUrl, postId]
    )
    await db.execute(
      "INSERT INTO members_click_events (id, member_id, redirect_id, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP())",
      [crypto.randomBytes(12).toString("hex"), recipient.member_id, redirectId]
    )
  } finally {
    await db.end()
  }
}

export async function GET(request: NextRequest) {
  const data = verifyToken(request.nextUrl.searchParams.get("token") || "")
  if (!data) {
    return NextResponse.json({ ok: false, error: "Invalid newsletter link." }, { status: 400 })
  }

  await markGhostEmailOpened(data)

  const response = NextResponse.redirect(data.postUrl)
  response.cookies.set("newsletter_email", data.email, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
  response.cookies.set("newsletter_clicked", "1", {
    maxAge: 60,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return response
}
