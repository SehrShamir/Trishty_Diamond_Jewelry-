"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

const testimonials = [
  {
    name: "Ryan K.",
    rating: 5,
    text: "Absolutely remarkable product and price!",
  },
  {
    name: "Melton S.",
    rating: 5,
    text: "Easy ordering, was perfect. Simple. High quality.",
  },
  {
    name: "Cameron H.",
    rating: 5,
    text: "Beautiful and great price",
  },
  {
    name: "Scott C.",
    rating: 5,
    text: "Excellent service. Beautiful ring, shipped quickly.",
  },
  {
    name: "Orlando W.",
    rating: 5,
    text: "Amazing and reasonable price. This ring amazed everyone at the engagement!",
  },
  {
    name: "James G.",
    rating: 5,
    text: "My fiancé absolutely loved the diamond! Great service and the company took care of my every concern!",
  },
]

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="w-full py-12 small:py-16 bg-muted/30">
      <div className="px-6">
        <h2 className="text-2xl small:text-3xl font-light text-center mb-12 uppercase tracking-wide">
          REVIEWS
        </h2>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors hidden small:block"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 small:px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4">{testimonial.text}</p>
                <p className="text-sm font-medium text-primary">{testimonial.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors hidden small:block"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
