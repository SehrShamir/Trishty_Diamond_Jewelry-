"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

const COUPLES = [
  {
    id: 1,
    names: "Share Your Story",
    quote:
      "We'd love to hear how you popped the question! Share your story with us and be featured.",
    image: null,
  },
  {
    id: 2,
    names: "Your Love Story",
    quote:
      "Every ring has a story. Tell us yours and inspire other couples on their journey.",
    image: null,
  },
  {
    id: 3,
    names: "Be Featured",
    quote:
      "Tag us on social media with your Trishty ring for a chance to be featured here.",
    image: null,
  },
]

const OurCouples = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-light font-sans text-gray-900 tracking-wide uppercase">
          Our Couples
        </h2>
      </div>

      <div className="relative group">
        <Carousel
          opts={{ align: "start", loop: false, dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {COUPLES.map((couple) => (
              <CarouselItem
                key={couple.id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <div className="space-y-3">
                  {/* Placeholder image area */}
                  <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden flex items-center justify-center">
                    <span className="text-xs text-gray-300 uppercase tracking-widest font-light">
                      Photo
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-gray-900 tracking-wide">
                      {couple.names}
                    </p>
                    <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                      {couple.quote}
                    </p>
                    <button className="text-[10px] text-gray-500 uppercase tracking-widest font-light underline underline-offset-4 hover:text-gray-900 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border-0 shadow-md" />
          <CarouselNext className="-right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border-0 shadow-md" />
        </Carousel>
      </div>
    </div>
  )
}

export default OurCouples
