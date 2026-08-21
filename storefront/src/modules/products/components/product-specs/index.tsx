import { HttpTypes } from "@medusajs/types"
import Accordion from "@modules/products/components/product-tabs/accordion"
import { Ruler, Layers, Sparkles } from "lucide-react"

type ProductSpecsProps = { product: HttpTypes.StoreProduct }

const METAL_DOT_COLORS = ["#D4AF37", "#CD7F32", "#C0C0C0", "#808080"]

const ProductSpecs = ({ product }: ProductSpecsProps) => {
  const m = product.metadata as Record<string, string> | null
  if (!m) return null

  const hasSpecs = m.ring_width || m.metal_composition || m.profile_height
  if (!hasSpecs) return null

  return (
    <Accordion type="multiple">
      <Accordion.Item title="Know your setting" headingSize="medium" value="specs">
        <div className="py-4 space-y-3">
          {/* Spec cards grid — side by side like Keyzar */}
          <div className="grid grid-cols-2 gap-3">
            {/* Width card */}
            {m.ring_width && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Ruler className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.2} />
                  <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-light">Width</span>
                </div>
                <p className="text-2xl font-serif text-gray-900">{m.ring_width}mm</p>
                <p className="text-[10px] text-gray-400 font-light mt-2">Measured at the base of the ring</p>
              </div>
            )}

            {/* Profile card */}
            {m.profile_height && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.2} />
                  <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-light">Profile</span>
                </div>
                <p className="text-2xl font-serif text-gray-900">{m.profile_height}</p>
                <p className="text-[10px] text-gray-400 font-light mt-2">
                  {m.profile_note || "Only stacks with a chevron/curved band"}
                </p>
              </div>
            )}
          </div>

          {/* Metal composition card — full width */}
          {m.metal_composition && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.2} />
                <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-light">Metal</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {/* Metal color swatch */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex-shrink-0" />
                <p className="text-lg font-serif text-gray-900">{m.metal_name || product.material || "14k Yellow Gold"}</p>
              </div>

              {/* Composition dots with percentages */}
              <div className="grid grid-cols-2 gap-2">
                {m.metal_composition.split(",").map((comp, i) => {
                  const parts = comp.trim().split(" ")
                  const percent = parts[0]
                  const metal = parts.slice(1).join(" ")
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: METAL_DOT_COLORS[i % METAL_DOT_COLORS.length] }} />
                      <span className="text-xs text-gray-600 font-light">{percent} {metal}</span>
                    </div>
                  )
                })}
              </div>

              {m.metal_note && (
                <p className="text-[10px] text-gray-400 font-light italic mt-3">{m.metal_note}</p>
              )}
            </div>
          )}

          {/* Extras row */}
          {m.has_extras && (
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.2} />
                <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-light">Extras</span>
              </div>
              <button className="text-[10px] text-gray-500 underline underline-offset-4 hover:text-gray-900 transition-colors tracking-wider">
                Add Extra Features
              </button>
            </div>
          )}

          {/* Accent gems */}
          {m.accent_specs && (
            <div className="border border-gray-200 rounded-lg p-4">
              <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-light block mb-1">Accent Gemstones</span>
              <p className="text-xs text-gray-600 font-light">{m.accent_specs}</p>
            </div>
          )}

          {/* SKU */}
          {product.variants?.[0]?.sku && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 font-light">SKU: {product.variants[0].sku}</span>
            </div>
          )}
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default ProductSpecs
