"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { List, Gem } from "lucide-react"
import { BookAppointment } from "@/components/book-appointment"

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ htmlContent }: { htmlContent: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const headingsRef = useRef<TocItem[]>([])
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const contentEl = document.querySelector(".ghost-content")
    if (!contentEl) return

    const elements = contentEl.querySelectorAll("h2, h3")
    const items: TocItem[] = []

    elements.forEach((el, index) => {
      const id =
        el.id ||
        el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        `heading-${index}`
      el.id = id

      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      })
    })

    setHeadings(items)
    headingsRef.current = items
    if (items.length > 0) setActiveId(items[0].id)
  }, [htmlContent])

  const handleScroll = useCallback(() => {
    const items = headingsRef.current
    if (items.length === 0) return

    const scrollY = window.scrollY
    const offset = 120

    let current = items[0].id
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) {
        const top = el.getBoundingClientRect().top + scrollY
        if (scrollY >= top - offset) {
          current = item.id
        } else {
          break
        }
      }
    }

    setActiveId((prev) => {
      if (prev !== current) {
        requestAnimationFrame(() => {
          const activeBtn = listRef.current?.querySelector(
            `[data-toc-id="${current}"]`
          )
          activeBtn?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        })
      }
      return current
    })
  }, [])

  useEffect(() => {
    if (headings.length === 0) return
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings, handleScroll])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <nav className="h-full">
      <div className="sticky top-28">
        <div className="relative p-5 border-l border-gray-200">
          <div className="relative flex items-center gap-2 mb-5 text-gray-400 text-[11px] font-medium uppercase tracking-[0.22em]">
            <List className="w-3.5 h-3.5" />
            <span>In this story</span>
          </div>

          <ul
            ref={listRef}
            className="relative space-y-1 max-h-[40vh] overflow-y-auto pr-1"
          >
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  data-toc-id={heading.id}
                  onClick={() => handleClick(heading.id)}
                  className={`
                    w-full text-left text-sm py-2 px-2 rounded-lg transition-all duration-200
                    ${heading.level === 3 ? "pl-6" : ""}
                    ${
                      activeId === heading.id
                        ? "text-gray-900 bg-gray-100 font-medium border-l-2 border-gray-900"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="line-clamp-2">{heading.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-8 p-6 bg-neutral-50 rounded-lg">
          <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
            <Gem className="w-4 h-4 text-gray-900" />
          </div>

          <h4 className="font-serif text-xl text-gray-900 mb-2 leading-tight">
            Need expert advice?
          </h4>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            Book a complimentary consultation with our gemologists.
          </p>

          <BookAppointment
            variant="default"
            className="w-full bg-gray-900 text-white hover:bg-gray-800 font-medium"
          >
            Get in touch
          </BookAppointment>
        </div>
      </div>
    </nav>
  )
}
