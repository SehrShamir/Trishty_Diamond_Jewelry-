import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookAppointment } from "@/components/book-appointment"

export default function HeroBanner() {
  return (
    <section className="w-full bg-[#F0F0EE]">
      {/* Desktop: 50/50 split | Mobile: stacked */}
      <div className="flex flex-col small:flex-row small:h-[70vh]">
        {/* ── Left: Text content ── */}
        <div className="small:w-1/2 flex flex-col justify-center px-8 py-14 small:py-0 small:pl-16 small:pr-12 medium:pl-24 medium:pr-16">
          <div className="max-w-[480px] small:ml-auto">
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-gray-400" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-medium">
                Handcrafted &middot; Ethically Sourced
              </p>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-[2.5rem] small:text-5xl medium:text-[3.5rem] text-gray-900 leading-[1.08] mb-6">
              Find the Ring
              <br />
              <em className="italic">of Your Dreams</em>
            </h1>

            {/* Thin gold divider */}
            <div className="w-12 h-px bg-[#C9A96E] mb-6" />

            {/* Description */}
            <p className="text-[15px] text-gray-500 font-light leading-relaxed mb-10 max-w-sm">
              Design your perfect engagement ring with ethically sourced
              diamonds and architectural precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col xsmall:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/store">Explore Collection</Link>
              </Button>
              <BookAppointment />
            </div>
          </div>
        </div>

        {/* ── Right: Image ── */}
        <div className="relative small:w-1/2 min-h-[50vh] small:min-h-0 overflow-hidden">
          {/* Left blend gradient */}
          <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[#F0F0EE] to-transparent pointer-events-none hidden small:block" />
          {/* Bottom blend gradient (mobile) */}
          <div className="absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-[#F0F0EE] to-transparent pointer-events-none small:hidden" />
          <Image
            src="/home/couple-ring.webp"
            alt="Couple wearing Trishty engagement rings"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  )
}
