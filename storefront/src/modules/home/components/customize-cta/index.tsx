import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Diamond, Gem, CircleDot } from "lucide-react"

const STEPS = [
  {
    number: 1,
    icon: CircleDot,
    title: "Choose Your Setting",
    description: "Select from solitaire, halo, three-stone, and more. Pick your metal and style.",
  },
  {
    number: 2,
    icon: Gem,
    title: "Select Your Stone",
    description: "Browse certified diamonds by shape, carat, color, clarity, and cut.",
  },
  {
    number: 3,
    icon: Diamond,
    title: "Complete Your Ring",
    description: "Preview your creation, see the total price, and add to cart.",
  },
]

export default function CustomizeCTA() {
  return (
    <section className="bg-[#faf9f7] py-20 sm:py-28">
      <div className="bn-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-light mb-3">
            Build Your Own Ring
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4">
            Design Your Dream Ring
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Create a one-of-a-kind engagement ring in three simple steps.
            Choose your setting, select your diamond, and watch your vision come to life.
          </p>
        </div>

        {/* 3-Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-14">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-white border border-gray-100 rounded-lg p-8 text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-6 h-6 text-gray-700" strokeWidth={1.2} />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-light">
                  Step {step.number}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 tracking-wide mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <LocalizedClientLink
            href="/collections/settings"
            className="inline-flex items-center justify-between gap-3 bg-gray-900 text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-full px-8 h-[52px] hover:bg-black transition-colors"
          >
            <Diamond className="w-4 h-4" strokeWidth={1.5} />
            <span>Start with a Setting</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/build-your-ring"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-[11px] uppercase tracking-[0.2em] font-medium rounded-full px-8 h-[52px] border border-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Gem className="w-4 h-4" strokeWidth={1.5} />
            <span>Start with a Diamond</span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
