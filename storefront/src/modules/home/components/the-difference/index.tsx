import { Diamond, Truck, ShieldCheck, Award, Package, RefreshCw } from "lucide-react"

const promises = [
    { icon: RefreshCw, title: "Free Resizing" },
    { icon: Truck, title: "Insured Shipping" },
    { icon: Package, title: "30-Day Returns" },
    { icon: Award, title: "GIA Certified" },
    { icon: Diamond, title: "Conflict Free" },
    { icon: ShieldCheck, title: "Lifetime Warranty" },
]

export default function TheDifference() {
    return (
        <section className="bg-primary py-16 small:py-20">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="font-serif text-2xl small:text-3xl font-light text-primary-foreground text-center mb-12 uppercase tracking-[0.2em]">
                    Our Promises
                </h2>

                <div className="grid grid-cols-3 small:grid-cols-6 gap-8 small:gap-6">
                    {promises.map((item) => (
                        <div key={item.title} className="flex flex-col items-center text-center gap-3">
                            <item.icon
                                className="w-7 h-7 text-primary-foreground"
                                strokeWidth={1}
                            />
                            <p className="text-[11px] small:text-xs text-primary-foreground font-normal tracking-wide">
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
