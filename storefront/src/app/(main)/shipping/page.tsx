import { Metadata } from "next"
import { Package, Clock, Shield, Globe } from "lucide-react"

export const metadata: Metadata = {
    title: "Shipping Info | Trishty — Free Insured Delivery",
    description: "Free fully insured shipping on all orders. Made-to-order: 3–4 weeks. Ready-to-ship: 2–3 business days. Signature required.",
    openGraph: { title: "Shipping Info | Trishty", description: "Free insured shipping on all Trishty orders.", url: "https://trishty.com/shipping", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/shipping" },
}

const cards = [
    { Icon: Package, title: "Free Insured Shipping", desc: "All domestic orders include complimentary fully insured delivery. No minimum purchase." },
    { Icon: Clock, title: "Delivery Timeline", desc: "Made-to-order: 3–4 weeks. Ready-to-ship: 2–3 business days. Rush options available." },
    { Icon: Shield, title: "Secure Packaging", desc: "Discreet, tamper-evident packaging. No external branding. Engineered to protect your piece." },
    { Icon: Globe, title: "International Shipping", desc: "Currently US only. International shipping coming soon — join our newsletter for updates." },
]

export default function ShippingPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Shipping Information.</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Every piece ships fully insured, from our workshop to your door.</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <div className="grid grid-cols-1 small:grid-cols-2 gap-8">
                    {cards.map(({ Icon, title, desc }) => (
                        <div key={title} className="p-8 border border-gray-100 rounded-sm">
                            <Icon className="w-6 h-6 text-gray-400 mb-4" strokeWidth={1.2} />
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-3">{title}</h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Signature Required</h2>
                    <p className="text-gray-600 font-light leading-relaxed">All shipments require a signature upon delivery for security. Contact <a href="mailto:contact@trishty.com" className="text-gray-900 underline">contact@trishty.com</a> for tracking inquiries.</p>
                </section>
            </div>
        </div>
    )
}
