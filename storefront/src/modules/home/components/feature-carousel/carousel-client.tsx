"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useMemo, useCallback } from "react"
import { motion, useMotionValue, animate, useTransform, MotionValue } from "framer-motion"

export type CarouselItem = {
  title: string
  description?: string
  image: string | null
  href: string
}

const FALLBACK_IMAGES = [
  "/home/carousel-second/image.png",
  "/home/carousel-second/image copy.png",
  "/home/carousel-second/image copy 2.png",
  "/home/carousel-second/image copy 3.png",
]

const ITEM_WIDTH = 280
const ITEM_GAP = 28
const STEP = ITEM_WIDTH + ITEM_GAP

export default function FeatureCarouselClient({
  items,
}: {
  items: CarouselItem[]
}) {
  // ── Fix 4: Memoize derived arrays so they are stable across renders ──
  const { multiplied, offset } = useMemo(() => {
    // Render enough copies to prevent edge visibility during teleport (min 10 items padding)
    const minPaddingItems = 10
    const paddingCopies = Math.max(1, Math.ceil(minPaddingItems / items.length))
    const totalCopies = paddingCopies * 2 + 1
    const offset = paddingCopies * items.length // middle copy starts here
    
    const multiplied: CarouselItem[] = []
    for (let i = 0; i < totalCopies; i++) {
      multiplied.push(...items)
    }
    return { multiplied, offset }
  }, [items])

  const initialIndex = offset + Math.min(2, items.length - 1)

  // ── Fix 2: useRef mirror so goTo always reads the latest index,
  //           even when called in rapid succession before React re-renders ──
  const activeIndexRef = useRef(initialIndex)
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  // ── Fix 1: Track the in-flight animation so we can cancel it cleanly ──
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)

  const x = useMotionValue(-initialIndex * STEP)

  if (!items.length) return null

  // ── Fix 1 + 2 combined: goTo reads from the ref (no stale closure),
  //   cancels the previous spring cleanly, snaps x when crossing a boundary,
  //   then starts a fresh spring from the corrected x. ──
  const goTo = useCallback(
    (rawTarget: number) => {
      let target = rawTarget

      // ── Hard Boundary Fallback ──
      // If user clicks wildly and escapes the padding, force them back safely
      if (target < items.length) {
        target = target + items.length
        x.set(x.get() - items.length * STEP)
      } else if (target >= multiplied.length - items.length) {
        target = target - items.length
        x.set(x.get() + items.length * STEP)
      }

      // Preserve velocity for seamless rapid clicks
      const currentVelocity = x.getVelocity()

      // Cancel any in-flight animation before starting a new one
      if (animationRef.current) {
        animationRef.current.stop()
        animationRef.current = null
      }

      // Update the ref immediately (no async delay unlike setState)
      activeIndexRef.current = target
      setActiveIndex(target)

      // ── Faster spring — settles before the user can out-click it ──
      animationRef.current = animate(x, -target * STEP, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        velocity: currentVelocity,
        onComplete: () => {
          animationRef.current = null

          // ── Wrap on Settle ──
          // When the spring rests, silently teleport back to the middle band
          const currentIndex = activeIndexRef.current
          if (currentIndex < offset) {
            const snappedIndex = currentIndex + items.length
            x.set(-snappedIndex * STEP)
            activeIndexRef.current = snappedIndex
            setActiveIndex(snappedIndex)
          } else if (currentIndex >= offset + items.length) {
            const snappedIndex = currentIndex - items.length
            x.set(-snappedIndex * STEP)
            activeIndexRef.current = snappedIndex
            setActiveIndex(snappedIndex)
          }
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, offset, x, multiplied.length]
  )

  // Map tripled index back to original for the title/desc display
  const realIndex = ((activeIndex % items.length) + items.length) % items.length

  return (
    <section className="w-full py-20 small:py-24 overflow-hidden">
      <div className="text-center mb-14">
        <h2
          className="font-serif text-2xl small:text-3xl text-gray-900 uppercase font-light mb-3 tracking-[0.2em]"
        >
          Discover Styles
        </h2>
        <p className="text-sm text-gray-500 font-light max-w-md mx-auto">
          Discover diverse engagement ring styles, each embodying a distinct
          symbol of love and devotion
        </p>
      </div>

      {/* Sliding track */}
      <div className="relative" style={{ height: "480px" }}>
        <motion.div
          className="absolute flex items-center"
          style={{
            x,
            left: "50%",
            marginLeft: -(ITEM_WIDTH / 2),
            gap: `${ITEM_GAP}px`,
            height: "100%",
          }}
        >
          {multiplied.map((item, idx) => {
            const copyNum = Math.floor(idx / items.length)
            const itemPos = idx % items.length
            const stableKey = `copy-${copyNum}-item-${itemPos}`

            return (
              <CarouselCard
                key={stableKey}
                item={item}
                idx={idx}
                x={x}
                itemsLength={items.length}
              />
            )
          })}
        </motion.div>
      </div>

      {/* Navigation + Title */}
      <div className="flex items-center justify-center gap-10 mt-10">
        <button
          onClick={() => goTo(activeIndexRef.current - 1)}
          className="text-gray-400 hover:text-gray-900 transition-colors"
          aria-label="Previous style"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="text-center min-w-[220px]">
          <motion.h3
            key={realIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-xl font-light text-gray-900 mb-1"
          >
            {items[realIndex].title}
          </motion.h3>
          <motion.p
            key={`desc-${realIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-sm text-gray-500 font-light"
          >
            {items[realIndex].description || "Explore the collection"}
          </motion.p>
        </div>

        <button
          onClick={() => goTo(activeIndexRef.current + 1)}
          className="text-gray-400 hover:text-gray-900 transition-colors"
          aria-label="Next style"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </section>
  )
}

function CarouselCard({
  item,
  idx,
  x,
  itemsLength,
}: {
  item: CarouselItem
  idx: number
  x: MotionValue<number>
  itemsLength: number
}) {
  const center_x = -idx * STEP

  const scale = useTransform(
    x,
    [center_x - 2 * STEP, center_x - STEP, center_x, center_x + STEP, center_x + 2 * STEP],
    [0.85, 1, 1.55, 1, 0.85]
  )

  const opacity = useTransform(
    x,
    [center_x - 2 * STEP, center_x - STEP, center_x, center_x + STEP, center_x + 2 * STEP],
    [0.5, 0.75, 1, 0.75, 0.5]
  )

  const y = useTransform(
    x,
    [center_x - 2 * STEP, center_x - STEP, center_x, center_x + STEP, center_x + 2 * STEP],
    [-10, 0, 30, 0, -10]
  )

  const itemPos = idx % itemsLength

  return (
    <motion.div
      className="flex-shrink-0"
      style={{
        width: ITEM_WIDTH,
        scale,
        opacity,
        y,
      }}
    >
      <Link href={item.href}>
        <div
          className="relative rounded-2xl overflow-hidden bg-transparent"
          style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
        >
          <Image
            src={item.image ?? FALLBACK_IMAGES[itemPos % FALLBACK_IMAGES.length]}
            alt={item.title}
            fill
            priority
            className="object-contain p-4"
            unoptimized={typeof item.image === "string" && item.image.startsWith("http")}
          />
        </div>
      </Link>
    </motion.div>
  )
}
