"use client"

import { FormEvent, useState } from "react"
import { Check, Loader2 } from "lucide-react"

type Variant = "dark" | "light"

interface NewsletterSubscribeProps {
  variant?: Variant
}

export function NewsletterSubscribe({ variant = "dark" }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === "loading") return

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        setStatus("error")
        setMessage(data.error || "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — thank you!"
          : data.confirmationSent
            ? "Thanks for subscribing. Check your inbox to confirm."
            : "Thanks for subscribing. Your email has been added to the list."
      )
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  const isDark = variant === "dark"

  const inputClasses = isDark
    ? "h-12 flex-1 bg-transparent border border-neutral-700 rounded-none px-4 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-white transition-colors"
    : "h-12 flex-1 bg-white border border-gray-300 rounded px-4 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-900 transition-colors"

  const buttonClasses = isDark
    ? "h-12 px-8 bg-white text-neutral-900 font-medium text-sm rounded-none hover:bg-neutral-100 transition-colors shrink-0 disabled:opacity-60 flex items-center justify-center gap-2"
    : "h-12 px-8 bg-gray-900 text-white font-medium text-sm rounded hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-60 flex items-center justify-center gap-2"

  const messageClasses = isDark
    ? status === "error"
      ? "text-red-300"
      : "text-neutral-300"
    : status === "error"
      ? "text-red-600"
      : "text-gray-600"

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col xsmall:flex-row gap-3"
        noValidate
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          className={inputClasses}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className={buttonClasses}
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === "success" && <Check className="w-4 h-4" />}
          {status === "success"
            ? "Subscribed"
            : status === "loading"
              ? "Subscribing…"
              : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-xs text-center ${messageClasses}`} role="status">
          {message}
        </p>
      )}
    </div>
  )
}
