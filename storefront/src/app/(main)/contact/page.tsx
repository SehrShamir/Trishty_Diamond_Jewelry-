import { Metadata } from "next"
import ContactForm from "./contact-form"
import { BookAppointment } from "@/components/book-appointment"

export const metadata: Metadata = {
    title: "Contact Us | Trishty — Get in Touch",
    description: "Questions about your order, a custom commission, or just want to say hello? Contact Trishty's jewelry experts. We respond within 24 hours.",
    openGraph: {
        title: "Contact Us | Trishty Jewelry",
        description: "Get in touch with Trishty's jewelry experts. We respond within 24 hours.",
        url: "https://trishty.com/contact",
        siteName: "Trishty",
        type: "website",
    },
    alternates: { canonical: "https://trishty.com/contact" },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
        "@type": "JewelryStore",
        name: "Trishty Jewelry",
        telephone: "+1-650-741-5063",
        email: "contact@trishty.com",
        url: "https://trishty.com",
        address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
        openingHours: "Mo-Fr 09:00-18:00",
    },
}

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">
                    Get in Touch.
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                    We&apos;d love to hear from you. Our team typically responds within 24 hours.
                </p>
            </div>

            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <div className="grid grid-cols-1 small:grid-cols-3 gap-8 text-center">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Phone</h3>
                        <a href="tel:+16507415063" className="text-gray-500 font-light hover:text-gray-900 transition-colors">(650) 741-5063</a>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Email</h3>
                        <a href="mailto:contact@trishty.com" className="text-gray-500 font-light hover:text-gray-900 transition-colors">contact@trishty.com</a>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Hours</h3>
                        <p className="text-gray-500 font-light">Mon–Fri, 9am–6pm EST</p>
                    </div>
                </div>

                <div className="text-center border-y border-gray-100 py-10">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Prefer to talk?</p>
                    <BookAppointment>Book a Consultation</BookAppointment>
                </div>

                <ContactForm />
            </div>
        </div>
    )
}
