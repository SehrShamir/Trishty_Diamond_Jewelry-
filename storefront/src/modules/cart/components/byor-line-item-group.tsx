"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import LineItemPrice from "@modules/common/components/line-item-price"
import DeleteButton from "@modules/common/components/delete-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LineItemAddons from "./line-item-addons"
import { Gem } from "lucide-react"

type BYORLineItemGroupProps = {
  items: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const BYORLineItemGroup = ({ items, currencyCode }: BYORLineItemGroupProps) => {
  if (items.length === 0) return null

  const settingItem = items.find(
    (item) => (item.metadata as Record<string, unknown>)?.linked_stone_product_id
  )
  const stoneItem = items.find(
    (item) => (item.metadata as Record<string, unknown>)?.linked_setting_product_id
  )

  return (
    <div className="border border-gray-100 rounded-sm p-4 space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Gem className="w-4 h-4 text-gray-500" />
        <Text className="text-xs uppercase tracking-widest text-gray-500 font-light">
          Custom Ring
        </Text>
      </div>

      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex-shrink-0 w-14"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
          <div className="flex-1 min-w-0">
            <Text className="text-sm font-light text-gray-900 truncate">
              {item.product_title}
            </Text>
            <Text className="text-[10px] text-gray-400 font-light uppercase tracking-wider">
              {item === settingItem ? "Setting" : item === stoneItem ? "Stone" : "Add-on"}
            </Text>
            <LineItemAddons item={item} />
          </div>
          <div className="flex items-center gap-2">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
            <DeleteButton id={item.id} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Groups cart line items by their BYOR group ID.
 * Returns { grouped: Map<string, items[]>, ungrouped: items[] }
 */
export function groupBYORItems(items: HttpTypes.StoreCartLineItem[]) {
  const grouped = new Map<string, HttpTypes.StoreCartLineItem[]>()
  const ungrouped: HttpTypes.StoreCartLineItem[] = []

  for (const item of items) {
    const groupId = (item.metadata as Record<string, unknown>)?.byor_group_id as string | undefined
    if (groupId) {
      if (!grouped.has(groupId)) {
        grouped.set(groupId, [])
      }
      grouped.get(groupId)!.push(item)
    } else {
      ungrouped.push(item)
    }
  }

  return { grouped, ungrouped }
}

export default BYORLineItemGroup
