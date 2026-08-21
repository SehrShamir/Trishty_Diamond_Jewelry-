import crypto from "crypto"
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
    return data as { email: string; postUrl: string }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const data = verifyToken(request.nextUrl.searchParams.get("token") || "")
  if (!data) {
    return NextResponse.json({ ok: false, error: "Invalid newsletter link." }, { status: 400 })
  }

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
