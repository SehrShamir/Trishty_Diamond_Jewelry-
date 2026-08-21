import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
    title: "The Atelier — Coming Soon | Trishty",
    description:
        "The Trishty Atelier: live gemologist consultations, real-time 3D co-browsing, and fully bespoke diamond commissions. Join the waitlist.",
    openGraph: { title: "The Atelier — Coming Soon | Trishty", description: "Live gemologist consultations and fully bespoke diamond commissions.", url: "https://trishty.com/atelier", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/atelier" },
}

export default function AtelierPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
            {/* Abstract moody background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
                {/* Header content */}
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">
                    The Atelier Is Coming.
                </h1>
                <p className="text-lg small:text-xl text-gray-600 max-w-2xl mb-16 leading-relaxed font-light">
                    A private digital studio for fully bespoke commissions. One client at a time. One gemologist on call. One vision, executed with architectural precision.
                </p>

                {/* What to Expect Grid */}
                <div className="w-full mb-20 text-left">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-8 text-center">What we are building</h2>

                    <div className="grid grid-cols-1 small:grid-cols-2 gap-8 small:gap-12">
                        <div className="space-y-2 border-l border-gray-200 pl-6">
                            <h3 className="text-gray-900 font-medium text-lg">Live Gemologist Consultations</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Face-to-face sessions over encrypted video. Discuss specifications, examine stones, and finalize designs together.</p>
                        </div>

                        <div className="space-y-2 border-l border-gray-200 pl-6">
                            <h3 className="text-gray-900 font-medium text-lg">3D Co-Browsing</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Your gemologist manipulates 3D models on your screen. Rotate, zoom, and highlight every facet in real-time sync.</p>
                        </div>

                        <div className="space-y-2 border-l border-gray-200 pl-6">
                            <h3 className="text-gray-900 font-medium text-lg">Fully Bespoke Commissions</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">No templates, no constraints. Starting at $10,000, tailored entirely to your vision.</p>
                        </div>

                        <div className="space-y-2 border-l border-gray-200 pl-6">
                            <h3 className="text-gray-900 font-medium text-lg">Dedicated Expert</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Your single point of contact from first consultation to final delivery.</p>
                        </div>
                    </div>
                </div>

                {/* Email Capture Waitlist */}
                <div className="w-full max-w-md bg-white/50 backdrop-blur-md border border-gray-100 p-8 rounded-lg shadow-md mb-16 relative">
                    <div className="absolute inset-0 border border-gray-200 rounded-lg pointer-events-none" />
                    <h3 className="text-lg text-gray-900 mb-2">Be the first to know.</h3>
                    <p className="text-xs text-gray-500 mb-6">We will notify you when access opens.</p>

                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-gray-50 text-gray-900 border-gray-200 focus:border-gray-400 h-12"
                            required
                        />
                        <Button className="w-full h-12 bg-white text-black hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs font-semibold">
                            Join the Waitlist
                        </Button>
                    </form>
                    <p className="text-[10px] text-gray-400 mt-4 text-center uppercase tracking-wide">No spam. Unsubscribe anytime.</p>
                </div>

                {/* Return to store */}
                <div className="pt-8 border-t border-gray-100 w-full flex flex-col items-center gap-4">
                    <p className="text-gray-500 text-sm">In the meantime, explore our made-to-order collection.</p>
                    <LocalizedClientLink
                        href="/store"
                        className="text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest text-xs font-semibold border-b border-gray-400 pb-1"
                    >
                        Explore the Collection
                    </LocalizedClientLink>
                </div>
            </div>
        </div>
    )
}
