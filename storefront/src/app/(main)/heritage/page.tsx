import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
    title: "Heritage | Trishty — High-Tech Heritage",
    description:
        "Trishty bridges old-world craftsmanship with modern digital precision. Curated diamond jewelry and fully bespoke commissions through a private digital atelier.",
    openGraph: { title: "About Trishty — High-Tech Heritage", description: "Where old-world craftsmanship meets modern digital precision.", url: "https://trishty.com/heritage", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/heritage" },
}

export default function HeritagePage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            {/* Abstract background element */}
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">
                    High-Tech Heritage.
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                    Where old-world craftsmanship meets modern digital precision.
                </p>
            </div>

            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-24 relative z-10">
                {/* Section 1 */}
                <section className="space-y-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">The luxury experience was broken.</h2>
                    <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                        <p>
                            Walk into a traditional high-end jeweler and you enter a world built on intimidation — hushed
                            tones, velvet ropes, and a salesperson deciding whether you belong.
                        </p>
                        <p>
                            Browse a jewelry website and you get the opposite problem — an endless scroll of options, a
                            configurator, and zero human guidance for a decision worth thousands.
                        </p>
                        <p className="font-medium text-gray-900">
                            Neither experience respects the modern buyer: analytical, time-conscious, and entirely comfortable
                            making significant decisions online — provided the service matches the stakes.
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="space-y-6 border-l-2 border-gray-200 pl-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Precision at every step.</h2>
                    <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                        <p>
                            Trishty replaced the intimidating showroom with a digital experience built around the buyer.
                            Every piece in our collection is made to order — the same meticulous production process, whether it
                            is an engagement ring or a pair of diamond studs.
                        </p>
                        <p>
                            Every stone is individually certified. Every setting
                            is hand-finished. Every delivery is fully insured.
                        </p>
                    </div>
                </section>

                {/* Section 3 Principles */}
                <section className="space-y-12">
                    <div className="grid gap-8">
                        <div className="p-8 bg-white/30 border border-gray-100 rounded-sm">
                            <h3 className="text-gray-900 font-sans text-2xl mb-4 tracking-wide">01. Precision over volume.</h3>
                            <p className="text-gray-500 leading-relaxed font-light">
                                We do not mass-produce. Every piece is a commission, not a transaction.
                            </p>
                        </div>

                        <div className="p-8 bg-white/30 border border-gray-100 rounded-sm">
                            <h3 className="text-gray-900 font-sans text-2xl mb-4 tracking-wide">02. Transparency over theater.</h3>
                            <p className="text-gray-500 leading-relaxed font-light">
                                You see every specification, every certification, every detail of your stone — before you commit.
                            </p>
                        </div>

                        <div className="p-8 bg-white/30 border border-gray-100 rounded-sm">
                            <h3 className="text-gray-900 font-sans text-2xl mb-4 tracking-wide">03. Privacy over spectacle.</h3>
                            <p className="text-gray-500 leading-relaxed font-light">
                                No showroom crowds. No public pressure. Your decision is yours alone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <div className="pt-16 border-t border-gray-100 text-center flex flex-col items-center">
                    <h3 className="text-2xl font-sans text-gray-900 tracking-wide mb-8">See the collection.</h3>
                    <LocalizedClientLink
                        href="/store"
                        className="w-full sm:w-auto inline-flex justify-center items-center h-12 px-8 bg-white text-black hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs font-semibold"
                    >
                        Explore the Collection
                    </LocalizedClientLink>
                </div>
            </div>
        </div>
    )
}
