"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1]
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (pathname && ph) {
      const newsletterEmail = readCookie("newsletter_email")
      if (newsletterEmail) {
        ph.identify(decodeURIComponent(newsletterEmail))
      }

      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) url += `?${search}`
      ph.capture("$pageview", { $current_url: url })

      if (pathname.startsWith("/blog/") && pathname.split("/").length >= 4) {
        if (readCookie("newsletter_clicked") === "1") {
          ph.capture("journal_clicked", {
            $current_url: url,
            journal_path: pathname,
          })
          document.cookie = "newsletter_clicked=; Max-Age=0; path=/"
        }

        ph.capture("journal_viewed", {
          $current_url: url,
          journal_path: pathname,
          journal_slug: pathname.split("/").pop(),
        })
      }
    }
  }, [pathname, searchParams, ph])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false, // we handle manually above
        capture_pageleave: true,
      })
    }
  }, [])

  if (!POSTHOG_KEY) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
