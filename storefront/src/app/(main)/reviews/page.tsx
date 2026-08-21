import { Metadata } from "next"
import { Star } from "lucide-react"

export const metadata: Metadata = {
    title: "Reviews | Trishty — What Our Clients Say",
    description: "Read verified reviews from real Trishty clients about their engagement rings, wedding bands, and fine jewelry experience.",
    openGraph: { title: "Client Reviews | Trishty", description: "5-star reviews from real Trishty clients.", url: "https://trishty.com/reviews", siteName: "Trishty", type: "website" },
    alternates: { canonical: "https://trishty.com/reviews" },
}

const reviews = [
    { name: "Sarah M.", location: "New York, NY", title: "Exceeded every expectation", body: "The engagement ring my partner designed through the Build Your Own Ring tool is absolutely stunning. The entire process was seamless.", product: "Custom Solitaire Ring" },
    { name: "David & Rachel K.", location: "San Francisco, CA", title: "The perfect proposal ring", body: "The customization options, transparency about diamond grading, and quality of the final piece made this the best decision.", product: "Halo Engagement Ring" },
    { name: "Michael T.", location: "Austin, TX", title: "Museum-quality craftsmanship", body: "The attention to detail is remarkable — from packaging to certification documentation. This is what luxury jewelry should feel like.", product: "Diamond Stud Earrings" },
    { name: "Jennifer L.", location: "Chicago, IL", title: "Worth every penny", body: "Each diamond is perfectly matched and the band sits beautifully. The complimentary resizing was a nice touch.", product: "Diamond Eternity Ring" },
    { name: "Amanda & Chris P.", location: "Los Angeles, CA", title: "An incredible experience", body: "We designed our wedding bands together using Trishty's tools. The bands arrived beautifully packaged and perfectly crafted.", product: "Matching Wedding Bands" },
    { name: "Robert H.", location: "Miami, FL", title: "Impeccable service", body: "The GIA certification gave me peace of mind, and the piece itself is absolutely gorgeous.", product: "Diamond Pendant Necklace" },
]

function Stars() {
    return <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-gray-900 fill-gray-900" strokeWidth={1} />)}</div>
}

export default function ReviewsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        name: "Trishty Jewelry",
        url: "https://trishty.com",
        aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", bestRating: "5", reviewCount: String(reviews.length) },
        review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            name: r.title,
            reviewBody: r.body,
        })),
    }

    return (
        <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center pb-24 relative overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center relative z-10 border-b border-gray-100">
                <h1 className="text-4xl small:text-6xl font-sans text-gray-900 tracking-wide mb-6">Client Reviews.</h1>
                <div className="flex items-center justify-center gap-3 mb-4"><Stars /><span className="text-lg font-sans text-gray-900">5.0</span></div>
                <p className="text-sm text-gray-400 font-light">Based on {reviews.length} verified reviews</p>
            </div>
            <div className="w-full max-w-3xl mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
                    {reviews.map((r, i) => (
                        <div key={i} className="p-6 border border-gray-100 rounded-sm space-y-3">
                            <div className="flex items-center justify-between"><Stars /><span className="text-[9px] uppercase tracking-widest text-emerald-600 font-medium">Verified</span></div>
                            <h3 className="text-sm font-medium text-gray-900">{r.title}</h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">{r.body}</p>
                            <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                                <div><p className="text-xs text-gray-900 font-medium">{r.name}</p><p className="text-[10px] text-gray-400 font-light">{r.location}</p></div>
                                <p className="text-[10px] text-gray-400 font-light uppercase tracking-wider">{r.product}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
