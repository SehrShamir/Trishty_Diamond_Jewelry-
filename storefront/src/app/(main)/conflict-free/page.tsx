import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Conflict Free Diamonds | Trishty Jewelry",
    description: "Every Trishty diamond is ethically sourced and Kimberley Process certified. Lab-grown alternatives available with full certification.",
    openGraph: { title: "Conflict Free Diamonds | Trishty", description: "Every stone, ethically sourced. Every purchase, responsible.", url: "https://trishty.com/conflict-free", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/conflict-free" },
}

export default function ConflictFreePage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Conflict Free Diamonds.</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Every stone, ethically sourced. Every purchase, responsible.</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <section className="space-y-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Our Commitment</h2>
                    <p className="text-gray-600 font-light leading-relaxed text-lg">At Trishty, ethical sourcing is a foundational principle. Every diamond is guaranteed conflict-free and sourced in full compliance with international standards.</p>
                </section>
                <section className="space-y-12">
                    {[
                        { title: "Certified Origins.", desc: "Every natural diamond comes with an independent gemological certificate (GIA or IGI). We can trace the origin of every stone we sell." },
                        { title: "Lab-Grown Alternative.", desc: "We offer lab-grown diamonds that are chemically, physically, and optically identical — with zero mining impact. Full certification included." },
                        { title: "Responsible Partners.", desc: "We work exclusively with suppliers committed to fair labor practices, environmental responsibility, and community development in mining regions." },
                    ].map(({ title, desc }) => (
                        <div key={title} className="p-8 border border-gray-100 rounded-sm">
                            <h3 className="text-gray-900 font-sans text-2xl mb-4 tracking-wide">{title}</h3>
                            <p className="text-gray-500 leading-relaxed font-light">{desc}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    )
}
