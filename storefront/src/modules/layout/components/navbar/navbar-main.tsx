"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, User } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { DesktopNav } from "./desktop-nav"
import { MobileMenu } from "./mobile-menu"
import { SearchBar, SearchSuggestion } from "./search-bar"
import { BookAppointment } from "@/components/book-appointment"

const SCROLL_THRESHOLD = 100
const BRAND = "Trishty"

export function NavbarMain({
  cartButton,
  suggestions,
  topPicks,
}: {
  cartButton: React.ReactNode
  suggestions: SearchSuggestion[]
  topPicks: HttpTypes.StoreProduct[]
}) {
  const [scrolled, setScrolled] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [logoVisible, setLogoVisible] = useState(true)
  const wasScrolled = useRef(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide logo when scrolled, replay animation when back to top
  useEffect(() => {
    if (scrolled) {
      wasScrolled.current = true
      setLogoVisible(false)
    } else if (wasScrolled.current) {
      wasScrolled.current = false
      setAnimKey((k) => k + 1)
      setLogoVisible(true)
    }
  }, [scrolled])

  return (
    <>
      {/* ── Top Banner ── */}
      <div className="bg-foreground text-primary-foreground py-2">
        <div className="bn-container flex items-center justify-center gap-3 small:gap-4 text-xs">
          <span className="hidden xsmall:inline text-primary-foreground/80 tracking-[0.18em] uppercase text-[11px]">
            Private consultation with a Trishty gemologist
          </span>
          <BookAppointment
            variant="ghost"
            size="sm"
            className="group inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-medium uppercase tracking-[0.18em] rounded-full border border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
          >
            <Calendar className="h-3 w-3" strokeWidth={1.75} />
            Virtual Appointment
          </BookAppointment>
        </div>
      </div>

      {/* ── Hero Nav (initial state — centered logo, scrolls away) ── */}
      <nav className="relative w-full bg-white/65 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/55 border-b border-white/40 shadow-[0_8px_32px_-12px_rgba(15,15,15,0.08)]">
        {/* glass sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-white/[0.08] to-transparent" />
        <div className="relative bn-container">
          {/* Left — absolutely positioned */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 small:gap-2 z-10">
            <div className="small:hidden">
              <MobileMenu />
            </div>
            <SearchBar suggestions={suggestions} topPicks={topPicks} />
          </div>

          {/* Right — absolutely positioned */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 small:gap-2 z-10">
            <LocalizedClientLink
              href="/account"
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
            </LocalizedClientLink>
            {!scrolled && cartButton}
          </div>

          {/* Centered logo + nav links below */}
          <div className="flex flex-col items-center py-5 small:py-6">
            <LocalizedClientLink href="/" aria-label="Trishty Home Page">
              <span key={animKey} className={`font-serif text-[26px] small:text-[32px] text-gray-900 tracking-[0.3em] uppercase inline-flex overflow-hidden font-light ${logoVisible ? "" : "invisible"}`}>
                {BRAND.split("").map((char, i) => (
                  <span
                    key={i}
                    className="inline-block animate-[charDrop_0.5s_ease_forwards]"
                    style={{
                      opacity: 0,
                      transform: "translateY(-100%)",
                      animationDelay: `${0.3 + i * 0.07}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </LocalizedClientLink>
            <div className="mt-4 hidden small:flex">
              <DesktopNav />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Compact Sticky Nav (appears on scroll — logo left) ── */}
      <header
        className={`fixed top-0 z-50 w-full bg-white/65 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/55 border-b border-white/40 shadow-[0_8px_32px_-12px_rgba(15,15,15,0.12)] transition-transform duration-300 ease-in-out ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* glass sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-white/[0.08] to-transparent" />
        <nav className="relative bg-transparent">
          <div className="bn-container flex items-center justify-between h-14 small:h-16">
            {/* Logo — left */}
            <div className="flex-1 flex items-center justify-start z-10">
              <LocalizedClientLink
                href="/"
                className="flex-shrink-0"
                aria-label="Trishty Home Page"
              >
                <span className="font-serif text-xl small:text-2xl text-gray-900 tracking-[0.25em] uppercase font-light">
                  Trishty
                </span>
              </LocalizedClientLink>
            </div>

            {/* Navigation — center */}
            <DesktopNav />

            {/* Right actions */}
            <div className="flex-1 flex items-center justify-end gap-1 small:gap-2 z-10">
              <SearchBar suggestions={suggestions} topPicks={topPicks} />
              <LocalizedClientLink
                href="/account"
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
              </LocalizedClientLink>
              {scrolled && cartButton}
              <div className="small:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
