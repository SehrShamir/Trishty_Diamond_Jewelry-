import { Metadata } from "next"
import FaqAccordion from "./faq-accordion"

export const metadata: Metadata = {
    title: "FAQ | Trishty — Frequently Asked Questions",
    description: "Find answers about ordering, shipping, returns, custom rings, diamond certification, and jewelry care at Trishty.",
    openGraph: {
        title: "FAQ | Trishty Jewelry",
        description: "Find answers about ordering, shipping, returns, and custom rings at Trishty.",
        url: "https://trishty.com/faq",
        siteName: "Trishty",
        type: "website",
    },
    alternates: { canonical: "https://trishty.com/faq" },
}

const faqSections = [
    {
        title: "Ordering",
        items: [
            { question: "How do I place an order?", answer: "Browse our collection, select your piece, choose your options (metal type, ring size, etc.), and add to cart. Complete checkout with a credit card. All orders are confirmed via email." },
            { question: "Can I customize my jewelry?", answer: "Yes. Our engagement rings and select fine jewelry can be fully customized through our Build Your Own Ring tool. Choose your setting, select your stone, and we'll craft it to your specifications." },
            { question: "How long does it take to receive my order?", answer: "Made-to-order pieces take 3–4 weeks. Ready-to-ship items dispatch within 2–3 business days. All orders include fully insured delivery." },
            { question: "Can I cancel or modify my order?", answer: "Orders can be modified or cancelled within 24 hours. After production begins on made-to-order pieces, modifications may not be possible. Contact us immediately for changes." },
        ],
    },
    {
        title: "Shipping",
        items: [
            { question: "Do you offer free shipping?", answer: "Yes. All orders within the United States include complimentary fully insured shipping via white-glove courier." },
            { question: "Do you ship internationally?", answer: "We currently ship within the United States. International shipping is coming soon." },
        ],
    },
    {
        title: "Returns & Exchanges",
        items: [
            { question: "What is your return policy?", answer: "30-day return policy on all non-customized pieces. Items must be in original, unworn condition. Custom and engraved pieces are final sale." },
            { question: "Do you offer resizing?", answer: "Yes. One complimentary resizing within the first year. Additional resizing available at a nominal fee." },
        ],
    },
    {
        title: "Diamonds & Care",
        items: [
            { question: "Are your diamonds certified?", answer: "Every diamond comes with an independent gemological certificate (GIA or IGI) verifying carat, color, clarity, and cut." },
            { question: "Are your diamonds conflict-free?", answer: "All diamonds are sourced in compliance with the Kimberley Process and guaranteed conflict-free." },
            { question: "What does your warranty cover?", answer: "Lifetime structural warranty covering prong integrity, band soundness, and setting security. Includes one complimentary resizing." },
        ],
    },
]

export default function FaqPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSections.flatMap((s) =>
            s.items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
            }))
        ),
    }

    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Frequently Asked Questions.</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Everything you need to know about shopping with Trishty.</p>
            </div>

            <div className="w-full max-w-3xl mx-auto px-6 py-16 space-y-16 relative z-10">
                {faqSections.map((section) => (
                    <section key={section.title} className="space-y-6">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">{section.title}</h2>
                        <FaqAccordion items={section.items} />
                    </section>
                ))}
            </div>
        </div>
    )
}
