"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

export default function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
    return (
        <Accordion.Root type="multiple" className="space-y-2">
            {items.map((item, i) => (
                <Accordion.Item key={i} value={`item-${i}`} className="border border-gray-100 rounded-sm overflow-hidden">
                    <Accordion.Header>
                        <Accordion.Trigger className="flex items-center justify-between w-full px-6 py-5 text-left group cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-light text-gray-900 pr-4">{item.question}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-6 pb-5 text-sm text-gray-500 font-light leading-relaxed">{item.answer}</div>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    )
}
