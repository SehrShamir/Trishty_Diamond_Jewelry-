import { Metadata } from "next"
import { BookAppointment } from "@/components/book-appointment"

export const metadata: Metadata = {
    title: "Client Services | Trishty — Shipping, Returns & Warranty",
    description:
        "Fully insured delivery, 30-day returns, and lifetime structural warranty. Everything you need to know about your Trishty purchase.",
    openGraph: { title: "Client Services | Trishty", description: "Shipping, returns, and lifetime warranty details.", url: "https://trishty.com/client-services", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/client-services" },
}

export default function ClientServicesPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            {/* Abstract dark light element */}
            <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">
                    Client Services.
                </h1>
                <p className="text-xl text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
                    Every detail handled with the care your piece deserves.
                </p>
            </div>

            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-24 relative z-10">

                {/* Shipping Section */}
                <section id="shipping" className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-8 h-px bg-gray-900"></span>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Shipping & Delivery</h2>
                    </div>

                    <h3 className="text-2xl font-sans text-gray-900 mb-4">Fully insured. Fully tracked.</h3>
                    <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                        <p>
                            Every Trishty piece ships via premium insured courier. Your commission is tracked from our
                            workshop to your door with full coverage for the entire journey.
                        </p>
                        <p>
                            Packaging is discreet, tamper-evident, and designed to match the precision of the piece inside.
                        </p>
                    </div>
                </section>

                {/* Returns Section */}
                <section id="returns" className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-8 h-px bg-gray-900"></span>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Returns</h2>
                    </div>

                    <h3 className="text-2xl font-sans text-gray-900 mb-4">30-day peace of mind.</h3>
                    <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                        <p>
                            Return any piece within 30 days of delivery for a full refund. Return shipping is fully insured at our
                            expense.
                        </p>
                        <p className="bg-white/30 p-6 border-l-2 border-gray-200 mt-4 text-base">
                            <strong className="block text-gray-900 font-medium mb-2">Bespoke Adjustments</strong>
                            Complimentary adjustments — including resizing and re-polishing — are also available within 30
                            days at no cost.
                        </p>
                    </div>
                </section>

                {/* Warranty Section */}
                <section id="warranty" className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-8 h-px bg-gray-900"></span>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Lifetime Warranty</h2>
                    </div>

                    <h3 className="text-2xl font-sans text-gray-900 mb-4">Built to last.</h3>
                    <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                        <p>Every Trishty piece carries a lifetime structural warranty:</p>
                        <ul className="list-disc list-inside space-y-3 marker:text-gray-900 pl-2">
                            <li>Prong integrity and stone security</li>
                            <li>Band structural soundness</li>
                            <li>One complimentary resizing</li>
                        </ul>
                        <p className="text-sm text-gray-500 italic mt-6 border-t border-gray-100 pt-6">
                            *Not covered: cosmetic wear from daily use, loss, or stone damage from impact. Additional resizing
                            and stone replacement available at preferred client pricing.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="space-y-6 p-10 bg-white/50 border border-gray-100 rounded-sm mt-16 text-center">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-6">Reach Us</h2>

                    <div className="space-y-4">
                        <a href="mailto:contact@trishty.com" className="block text-2xl font-sans text-gray-900 hover:text-gray-900 transition-colors">
                            contact@trishty.com
                        </a>
                        <p className="text-gray-500 uppercase text-xs tracking-widest">
                            Response time: Within 24 hours, Monday through Friday.
                        </p>
                    </div>

                    <div className="pt-6">
                        <BookAppointment>Book a Consultation</BookAppointment>
                    </div>

                    <p className="mt-8 text-sm text-gray-500 font-light max-w-lg mx-auto">
                        For urgent matters related to an active order or delivery, include your order number and we will
                        prioritize your request.
                    </p>
                </section>

            </div>
        </div>
    )
}
