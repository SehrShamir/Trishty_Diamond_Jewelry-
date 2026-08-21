import { Truck, Shield, RotateCcw, Award, DollarSign } from "lucide-react"

const TRUST_BADGES = [
  { icon: Truck, line1: "Overnight", line2: "Shipping" },
  { icon: Shield, line1: "Lifetime", line2: "Warranty" },
  { icon: DollarSign, line1: "30 Days", line2: "Free Return" },
  { icon: Award, line1: "Certificate", line2: "& Appraisal" },
]

const TrustBadges = () => {
  return (
    <div className="flex items-start justify-between py-5 border-t border-b border-gray-100">
      {TRUST_BADGES.map((badge) => (
        <div key={badge.line1} className="flex flex-col items-center text-center gap-1.5 flex-1">
          <badge.icon className="w-6 h-6 text-gray-700" strokeWidth={1} />
          <div>
            <p className="text-[10px] text-gray-800 font-medium tracking-wide leading-tight">{badge.line1}</p>
            <p className="text-[9px] text-gray-400 font-light tracking-wide leading-tight">{badge.line2}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TrustBadges
