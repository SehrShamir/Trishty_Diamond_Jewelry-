"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[blog] route error", error)
  }, [error])

  return (
    <main className="bg-white min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-gray-400 mb-4">
          Something went wrong
        </p>
        <h1 className="text-3xl font-medium text-gray-900 mb-3">
          The Journal is temporarily unavailable
        </h1>
        <p className="text-gray-500 mb-8">
          We couldn&apos;t load the latest articles. It&apos;s usually brief —
          please try again.
        </p>
        <div className="flex flex-col xsmall:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 text-sm font-medium rounded bg-gray-900 text-white hover:bg-gray-800 transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-8 py-3 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
