export default function TrustStrip() {
    return (
        <div className="w-full bg-[#FAFAF9] border-y border-gray-200 py-4 px-6 z-20 relative">
            <div className="max-w-7xl mx-auto flex flex-col small:flex-row justify-center items-center gap-4 small:gap-12 text-center divide-y small:divide-y-0 small:divide-x divide-gray-200">

                <div className="pt-2 small:pt-0 small:px-8 w-full small:w-auto">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal">
                        Made to order in 3-4 weeks
                    </p>
                </div>

                <div className="pt-4 small:pt-0 small:px-8 w-full small:w-auto">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal">
                        Fully insured delivery
                    </p>
                </div>

                <div className="pt-4 small:pt-0 small:px-8 w-full small:w-auto">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal">
                        Lifetime structural warranty
                    </p>
                </div>

            </div>
        </div>
    )
}
