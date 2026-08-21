"use client"

import { useCallback, useEffect, useState } from "react"
import { Calendar, Gem, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const CAL_URL = "https://cal.com/trishty/30min"
const LOADER_MIN_MS = 450

const TRISHTY_QUOTES = [
  "Crafting moments as rare as you are.",
  "Every stone has a story. We'll help you write yours.",
  "Where heritage meets unhurried design.",
  "Exceptional jewelry, thoughtfully chosen.",
]

interface BookAppointmentProps {
  children?: React.ReactNode
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  asSpan?: boolean
}

/**
 * Sibling of vetty's book-demo-dialog.tsx — same information architecture
 * (branded header band → value-prop chips → cal.com iframe → branded loader
 * that masks the iframe until it's ready), expressed in Trishty's
 * ivory/charcoal palette and Cormorant serif headline.
 */
export function BookAppointment({
  children = "Book Appointment",
  variant = "outline",
  size = "lg",
  className,
  asSpan = false,
}: BookAppointmentProps) {
  const [open, setOpen] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [minDelayElapsed, setMinDelayElapsed] = useState(false)
  const [quote, setQuote] = useState(TRISHTY_QUOTES[0])

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (next) {
      setIframeLoaded(false)
      setMinDelayElapsed(false)
      setQuote(
        TRISHTY_QUOTES[Math.floor(Math.random() * TRISHTY_QUOTES.length)]
      )
    }
  }, [])

  const openDialog = useCallback(() => handleOpenChange(true), [handleOpenChange])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => setMinDelayElapsed(true), LOADER_MIN_MS)
    return () => clearTimeout(t)
  }, [open])

  const showLoader = !(iframeLoaded && minDelayElapsed)

  const trigger = asSpan ? (
    <span
      className={className}
      role="button"
      tabIndex={0}
      onClick={openDialog}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openDialog()
        }
      }}
    >
      {children}
    </span>
  ) : (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={openDialog}
    >
      {children}
    </Button>
  )

  return (
    <>
      {trigger}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-[calc(100vw-1rem)] xsmall:max-w-[calc(100vw-2rem)] small:max-w-[800px] medium:max-w-[900px] max-h-[calc(100dvh-1rem)] xsmall:max-h-[calc(100dvh-2rem)] p-0 gap-0 overflow-hidden flex flex-col"
          overlayClassName="bg-neutral-950/60 backdrop-blur-md"
        >
          {/* Header band */}
          <div className="relative p-4 xsmall:p-6 pb-3 xsmall:pb-4 shrink-0 bg-gradient-to-br from-neutral-200/50 via-neutral-100/30 to-transparent">
            {/* Top accent line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-400/60 to-transparent z-10" />

            <DialogHeader>
              <DialogTitle className="font-serif text-xl xsmall:text-2xl font-light text-gray-900">
                Book an Appointment
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Meet with our gemologists for a private 30-minute
                consultation &mdash; virtual or in our atelier.
              </DialogDescription>
            </DialogHeader>

            {/* Value props — hidden on very small mobile */}
            <div className="hidden xsmall:flex flex-wrap gap-4 mt-3">
              {[
                { icon: Calendar, text: "30-min consultation" },
                { icon: Gem, text: "Expert gemologist" },
                { icon: Sparkles, text: "Complimentary" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-xs text-gray-600"
                >
                  <item.icon className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cal.com embed */}
          <div className="relative bg-popover rounded-b-2xl flex-1 min-h-0">
            {open && (
              <iframe
                src={`${CAL_URL}?embed=true&layout=month_view&theme=light&hideEventTypeDetails=false`}
                className="w-full h-full border-0 rounded-b-2xl"
                style={{ minHeight: "450px" }}
                title="Book an appointment with Trishty"
                onLoad={() => setIframeLoaded(true)}
              />
            )}

            {/* Branded loader */}
            <div
              aria-hidden={!showLoader}
              className={`absolute inset-0 rounded-b-2xl bg-popover flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
                showLoader ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-b-2xl bg-gradient-to-b from-gray-100/40 via-transparent to-transparent" />
              <span
                aria-hidden="true"
                className="font-serif text-6xl font-light text-gray-900 leading-none select-none"
              >
                T
              </span>
              <p className="text-sm font-medium text-gray-700 px-6 text-center max-w-md">
                {quote}
              </p>
              <div className="flex items-center gap-1.5" aria-label="Loading">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400/70 animate-bounce [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400/70 animate-bounce [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400/70 animate-bounce" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
