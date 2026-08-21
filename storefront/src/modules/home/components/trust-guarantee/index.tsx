import { Package, Shield, RefreshCw, Award } from "lucide-react"

export default function TrustGuarantee() {
    return (
        <section className="py-20 small:py-28 px-6 text-gray-900 border-t border-gray-200 relative flex justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center">

                <div className="text-center mb-14 medium:mb-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-medium mb-5">
                        Our Promise
                    </p>
                    <h2 className="font-serif text-2xl small:text-3xl medium:text-4xl text-gray-900 font-light mb-5">
                        Your purchase is protected.
                    </h2>
                    <div className="w-10 h-px bg-[#C9A96E] mx-auto" />
                </div>

                <div className="flex flex-col gap-y-8 medium:gap-y-10 w-full max-w-3xl">
                    {[
                        {
                            icon: <Package className="w-4 h-4 medium:w-5 medium:h-5" strokeWidth={1.2} />,
                            title: "Fully Insured Delivery",
                            desc: "White-glove courier dispatch. Full coverage throughout the journey. Tamper-evident, discreet packaging.",
                        },
                        {
                            icon: <RefreshCw className="w-4 h-4 medium:w-5 medium:h-5" strokeWidth={1.2} />,
                            title: "30-Day Returns",
                            desc: "Applies to all Atelier Collection pieces. No questions asked. Complimentary resizing provided for bespoke commissions.",
                        },
                        {
                            icon: <Shield className="w-4 h-4 medium:w-5 medium:h-5" strokeWidth={1.2} />,
                            title: "Lifetime Structural Warranty",
                            desc: "Covers prong integrity, band soundness, and includes one complimentary lifetime resizing.",
                        },
                        {
                            icon: <Award className="w-4 h-4 medium:w-5 medium:h-5" strokeWidth={1.2} />,
                            title: "Certified Stones",
                            desc: "Every diamond is accompanied by independent gemological certification verifying exact specifications.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-5 medium:gap-6">
                            <div className="w-10 h-10 medium:w-11 medium:h-11 flex-shrink-0 flex items-center justify-center rounded-full border border-gray-200 text-gray-500">
                                {item.icon}
                            </div>
                            <div className="pt-1">
                                <h3 className="text-sm font-medium text-gray-900 mb-1.5 uppercase tracking-[0.08em]">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
