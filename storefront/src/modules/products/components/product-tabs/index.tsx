"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Details",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping",
      component: <ShippingInfoTab />,
    },
    {
      label: "Return Policy",
      component: <ReturnPolicyTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-y-4 text-gray-700 font-light">
          <div>
            <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">Material</span>
            <p className="text-sm">{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">Country of origin</span>
            <p className="text-sm">{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">Type</span>
            <p className="text-sm">{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 text-gray-700 font-light">
          <div>
            <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">Weight</span>
            <p className="text-sm">{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">Dimensions</span>
            <p className="text-sm">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-6 space-y-4">
      <div className="flex items-start gap-x-4">
        <div className="text-gray-900 pt-0.5">
          <FastDelivery />
        </div>
        <div>
          <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">
            Complimentary Shipping
          </span>
          <p className="text-gray-500 font-light text-xs leading-relaxed">
            Overnight complimentary shipping on all orders. Your package will arrive
            fully insured via FedEx Priority Overnight, signature required.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-4">
        <div className="text-gray-900 pt-0.5">
          <Refresh />
        </div>
        <div>
          <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">
            Production Time
          </span>
          <p className="text-gray-500 font-light text-xs leading-relaxed">
            Each piece is crafted to order. Please allow 3-4 weeks for
            production before shipping.
          </p>
        </div>
      </div>
    </div>
  )
}

const ReturnPolicyTab = () => {
  return (
    <div className="py-6 space-y-4">
      <div className="flex items-start gap-x-4">
        <div className="text-gray-900 pt-0.5">
          <Back />
        </div>
        <div>
          <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">
            30-Day Free Returns
          </span>
          <p className="text-gray-500 font-light text-xs leading-relaxed">
            We want you to be completely satisfied. Return your purchase within
            30 days for a full refund. Items must be in original, unworn condition.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-4">
        <div className="text-gray-900 pt-0.5">
          <Refresh />
        </div>
        <div>
          <span className="font-sans text-gray-900 tracking-widest uppercase text-xs block mb-1">
            Free Resizing
          </span>
          <p className="text-gray-500 font-light text-xs leading-relaxed">
            Complimentary first resize within one year of purchase.
            Lifetime warranty on all craftsmanship.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
