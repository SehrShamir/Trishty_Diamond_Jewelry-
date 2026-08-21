import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Returns & Exchanges | Trishty — 30-Day Guarantee",
    description: "30-day money-back guarantee on all non-customized Trishty pieces. Free resizing included. Learn about our return process.",
    openGraph: { title: "Returns & Exchanges | Trishty", description: "30-day returns. No questions asked.", url: "https://trishty.com/returns", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/returns" },
}

export default function ReturnsPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Returns & Exchanges.</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">30-day returns. No questions asked.</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Return Policy</h2>
                    <p className="text-gray-600 font-light leading-relaxed">30-day money-back guarantee on all non-customized pieces in original, unworn condition. <strong className="font-medium text-gray-900">Custom and engraved pieces are final sale.</strong></p>
                </section>
                <section className="space-y-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">How to Return</h2>
                    {[
                        { step: "1", title: "Contact Us", desc: "Email contact@trishty.com with your order number. We'll send a prepaid return label." },
                        { step: "2", title: "Pack & Ship", desc: "Place item in original packaging. Attach return label and drop off at any authorized location." },
                        { step: "3", title: "Receive Your Refund", desc: "Refund processed within 5–10 business days to your original payment method." },
                    ].map(({ step, title, desc }) => (
                        <div key={step} className="flex gap-6">
                            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-sm font-light">{step}</div>
                            <div><h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3><p className="text-sm text-gray-500 font-light">{desc}</p></div>
                        </div>
                    ))}
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Resizing</h2>
                    <p className="text-gray-600 font-light leading-relaxed">One complimentary resizing within the first year. Additional resizing available at a nominal fee.</p>
                </section>
            </div>
        </div>
    )
}
