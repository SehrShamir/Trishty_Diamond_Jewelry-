import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BookAppointment } from "@/components/book-appointment"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">Client Services</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <BookAppointment asSpan className="cursor-pointer hover:underline">
              Book a Consultation
            </BookAppointment>
          </li>
          <li>
            <LocalizedClientLink href="/client-services#shipping">Shipping & Delivery</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/client-services#returns">
              Returns & Warranty
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
