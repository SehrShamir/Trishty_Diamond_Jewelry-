import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Accessibility | Trishty Jewelry",
    description: "Trishty's commitment to digital accessibility and WCAG 2.1 compliance. We believe luxury should be accessible to everyone.",
    openGraph: { title: "Accessibility | Trishty", url: "https://trishty.com/accessibility", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/accessibility" },
}

export default function AccessibilityPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Accessibility.</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">We believe luxury should be accessible to everyone.</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Our Commitment</h2>
                    <p className="text-gray-600 font-light leading-relaxed">Trishty is committed to ensuring digital accessibility for people with disabilities. We strive to conform to WCAG 2.1 Level AA standards.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Measures We Take</h2>
                    <ul className="text-gray-600 font-light leading-relaxed space-y-2">
                        {["Semantic HTML for screen reader compatibility", "Keyboard navigation support throughout", "Sufficient color contrast ratios", "Alternative text for all product images", "Responsive design across devices"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1 h-1 bg-gray-400 rounded-full mt-2.5 flex-shrink-0" /><span>{item}</span></li>
                        ))}
                    </ul>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Feedback</h2>
                    <p className="text-gray-600 font-light leading-relaxed">Contact us at <a href="mailto:contact@trishty.com" className="text-gray-900 underline">contact@trishty.com</a> or <a href="tel:+16507415063" className="text-gray-900 underline">(650) 741-5063</a>. We respond within 2 business days.</p>
                </section>
            </div>
        </div>
    )
}
