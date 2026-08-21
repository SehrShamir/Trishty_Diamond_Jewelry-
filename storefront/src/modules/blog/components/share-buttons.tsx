"use client"

import { useState } from "react"
import { Twitter, Linkedin, Link2, Check } from "lucide-react"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const btnBase =
    "p-2 rounded-lg border transition-all duration-200"
  const btnDefault = `${btnBase} border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400`

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={shareTwitter}
        className={btnDefault}
        aria-label="Share on Twitter"
      >
        <Twitter className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={shareLinkedIn}
        className={btnDefault}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={copyLink}
        className={
          copied
            ? `${btnBase} border-green-300 text-green-600`
            : btnDefault
        }
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Link2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  )
}
