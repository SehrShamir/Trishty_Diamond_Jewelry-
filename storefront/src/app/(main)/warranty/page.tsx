import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Lifetime Warranty | Trishty Jewelry",
    description: "Every Trishty piece is backed by a lifetime structural warranty covering prong integrity, band soundness, and one complimentary resizing.",
    openGraph: { title: "Lifetime Warranty | Trishty", description: "Built to last. Guaranteed for life.", url: "https://trishty.com/warranty", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/warranty" },
}

export default function WarrantyPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Lifetime Warranty.</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Built to last. Guaranteed for life.</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">What&apos;s Covered</h2>
                    <ul className="text-gray-600 font-light leading-relaxed space-y-2">
                        {["Prong integrity — repair or replacement of damaged prongs", "Band soundness — repair of structural defects", "Setting security — repair of loose stone settings", "One complimentary resizing — available anytime"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1 h-1 bg-gray-400 rounded-full mt-2.5 flex-shrink-0" /><span>{item}</span></li>
                        ))}
                    </ul>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">What&apos;s Not Covered</h2>
                    <ul className="text-gray-600 font-light leading-relaxed space-y-2">
                        {["Normal wear and tear (scratches, patina)", "Accidental damage, misuse, or neglect", "Loss or theft", "Unauthorized repairs or modifications"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1 h-1 bg-gray-400 rounded-full mt-2.5 flex-shrink-0" /><span>{item}</span></li>
                        ))}
                    </ul>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">File a Claim</h2>
                    <p className="text-gray-600 font-light leading-relaxed">Email <a href="mailto:contact@trishty.com" className="text-gray-900 underline">contact@trishty.com</a> with your order number and photos. Repair turnaround is typically 2–3 weeks.</p>
                </section>
            </div>
        </div>
    )
}
