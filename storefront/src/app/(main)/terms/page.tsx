import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Use | Trishty Jewelry",
    description: "Terms and conditions governing the use of Trishty's website and services, including orders, returns, and intellectual property.",
    openGraph: { title: "Terms of Use | Trishty", url: "https://trishty.com/terms", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/terms" },
}

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Terms of Use.</h1>
                <p className="text-sm text-gray-400 font-light">Last updated: January 2025</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Acceptance of Terms</h2>
                    <p className="text-gray-600 font-light leading-relaxed">By accessing and using the Trishty website, you accept and agree to be bound by these Terms of Use.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Products & Pricing</h2>
                    <p className="text-gray-600 font-light leading-relaxed">Product descriptions and images are provided as accurately as possible. Due to handcrafted nature, actual products may vary slightly. Prices are in USD and subject to change. Taxes calculated at checkout.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Orders & Payment</h2>
                    <p className="text-gray-600 font-light leading-relaxed">All orders are subject to acceptance and availability. Made-to-order pieces require 3–4 weeks. Custom and engraved items are final sale. Payment processed securely through Stripe.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Returns</h2>
                    <p className="text-gray-600 font-light leading-relaxed">Non-customized items may be returned within 30 days in original condition. See our <a href="/returns" className="text-gray-900 underline">Return Policy</a> for details.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Contact</h2>
                    <p className="text-gray-600 font-light leading-relaxed">Questions? Contact us at <a href="mailto:contact@trishty.com" className="text-gray-900 underline">contact@trishty.com</a>.</p>
                </section>
            </div>
        </div>
    )
}
