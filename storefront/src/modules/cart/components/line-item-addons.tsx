import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemAddonsProps = {
  item: HttpTypes.StoreCartLineItem
}

const LineItemAddons = ({ item }: LineItemAddonsProps) => {
  const metadata = item.metadata as Record<string, unknown> | null

  if (!metadata) return null

  const addons: { label: string; value: string }[] = []

  if (metadata.engraving_text) {
    addons.push({ label: "Engraving", value: String(metadata.engraving_text) })
  }

  if (metadata.prong_style && metadata.prong_style !== "Standard") {
    addons.push({ label: "Prongs", value: String(metadata.prong_style) })
  }

  if (metadata.selected_addons && Array.isArray(metadata.selected_addons)) {
    for (const addon of metadata.selected_addons) {
      addons.push({ label: "Add-on", value: String(addon) })
    }
  }

  if (addons.length === 0) return null

  return (
    <div className="mt-1 space-y-0.5">
      {addons.map((addon, i) => (
        <Text key={i} className="text-[10px] text-gray-400 font-light">
          {addon.label}: <span className="text-gray-600">{addon.value}</span>
        </Text>
      ))}
    </div>
  )
}

export default LineItemAddons
