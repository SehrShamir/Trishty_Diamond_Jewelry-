import { Button } from "@/components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const steps = [
  {
    num: "01",
    title: "Choose a Setting",
    desc: "Browse hundreds of handcrafted ring settings in every style.",
    href: "/store",
    image: "/home/grid/second-row-1st.webp",
  },
  {
    num: "02",
    title: "Select a Diamond",
    desc: "Pick your certified, ethically sourced diamond or gemstone.",
    href: "/store",
    image: "/home/grid/3rd-row-1st.webp",
  },
  {
    num: "03",
    title: "Complete Your Ring",
    desc: "We craft your one-of-a-kind ring in 3-4 weeks.",
    href: "/store",
    image: "/home/grid/3rd-row-2nd.webp",
  },
]

export default function ProductGrid() {
  return (
    <section className="w-full">
      {/* ── Full-width hero banner ── */}
      <div className="relative h-[50vh] small:h-[60vh] overflow-hidden">
        <Image
          src="/home/grid/first-row.webp"
          alt="Design your own ring"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/70 font-light mb-4">
            Creative Studio
          </p>
          <h2 className="font-serif text-3xl small:text-5xl medium:text-6xl font-light text-white leading-[1.1] mb-4">
            Build Your Own Ring
          </h2>
          <div className="w-10 h-px bg-[#C9A96E] mx-auto mb-4" />
          <p className="text-sm text-white/80 font-light max-w-md mb-8">
            Design your dream engagement ring in three simple steps.
            Fully customizable, ethically sourced, made just for you.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            <LocalizedClientLink href="/store">Start Designing</LocalizedClientLink>
          </Button>
        </div>
      </div>

      {/* ── Three steps ── */}
      <div className="bg-white py-16 small:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 small:grid-cols-3 gap-8 small:gap-12">
            {steps.map((step) => (
              <LocalizedClientLink
                key={step.num}
                href={step.href}
                className="group text-center"
              >
                <div className="relative aspect-[4/5] bg-[#F5F5F3] overflow-hidden mb-5">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-medium mb-2">
                  Step {step.num}
                </p>
                <h3 className="font-serif text-xl font-light text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 font-light max-w-[260px] mx-auto">
                  {step.desc}
                </p>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
