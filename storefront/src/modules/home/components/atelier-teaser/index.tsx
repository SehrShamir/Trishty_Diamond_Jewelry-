"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "@/components/sparkles"

export default function AtelierTeaser() {
    return (
        <section className="relative h-[75vh] small:h-[80vh] w-full overflow-hidden bg-black">
            {/* Spotlight beam from top */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] small:w-[600px] h-[70%] z-[1] pointer-events-none"
                style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)",
                    clipPath: "polygon(45% 0%, 55% 0%, 80% 100%, 20% 100%)",
                }}
            />

            {/* Light source glow at top */}
            <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-[120px] h-[120px] small:w-[180px] small:h-[180px] rounded-full z-[2] pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)",
                    filter: "blur(25px)",
                }}
            />

            {/* Content — centered */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 h-full">
                <p className="text-[10px] tracking-[0.5em] uppercase text-white/50 font-medium mb-6">
                    Coming Soon
                </p>
                <h2 className="font-serif text-4xl small:text-7xl medium:text-8xl font-light text-white mb-4 leading-none">
                    The Atelier
                </h2>
                <p className="text-sm text-white/40 font-light leading-relaxed mb-10 max-w-xs">
                    A private studio for fully bespoke, one-of-a-kind pieces.
                </p>

                {/* Email capture */}
                <div className="flex flex-col xsmall:flex-row gap-2 w-full max-w-sm">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 h-11 px-4 text-sm bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 backdrop-blur-sm"
                    />
                    <Button size="lg" className="h-11 bg-white text-black hover:bg-white/90 border-none shrink-0">
                        Notify Me
                    </Button>
                </div>
            </div>

            {/* Sparkles rising from bottom */}
            <div className="absolute bottom-0 z-[3] h-[400px] w-full overflow-hidden [mask-image:radial-gradient(100%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.15),transparent_70%)]">
                <Sparkles
                    density={1200}
                    speed={1}
                    color="#ffffff"
                    direction="top"
                    opacity={0.6}
                    size={1}
                    className="absolute inset-x-0 bottom-0 h-full w-full"
                />
            </div>
        </section>
    )
}
