import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | Trishty Jewelry",
    description: "How Trishty collects, uses, and protects your personal information. Read our full privacy policy.",
    openGraph: { title: "Privacy Policy | Trishty", url: "https://trishty.com/privacy", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/privacy" },
}

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Privacy Policy.</h1>
                <p className="text-sm text-gray-400 font-light">Last updated: January 2025</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Information We Collect</h2>
                    <div className="text-gray-600 font-light leading-relaxed space-y-4">
                        <p>We collect information you provide when you create an account, place an order, subscribe to our newsletter, or contact us — including your name, email, shipping address, phone number, and payment information.</p>
                        <p>We also automatically collect browsing data (IP address, browser type, pages visited) using cookies and similar technologies to enhance your experience.</p>
                    </div>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">How We Use Your Information</h2>
                    <p className="text-gray-600 font-light leading-relaxed">We use your information to process orders, communicate about purchases, provide customer support, send marketing (with consent), and improve our services. We never sell personal information to third parties.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Data Security</h2>
                    <p className="text-gray-600 font-light leading-relaxed">We implement industry-standard security including SSL encryption, secure payment processing through Stripe, and restricted internal access to personal data.</p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">Your Rights</h2>
                    <p className="text-gray-600 font-light leading-relaxed">You may access, correct, or delete your personal information at any time. Opt out of marketing via the unsubscribe link or by contacting <a href="mailto:contact@trishty.com" className="text-gray-900 underline">contact@trishty.com</a>.</p>
                </section>
            </div>
        </div>
    )
}
