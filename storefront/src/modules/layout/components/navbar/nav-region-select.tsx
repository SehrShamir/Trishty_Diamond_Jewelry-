"use client"

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
    country: string
    region: string
    label: string
    currency_code: string
}

export function NavRegionSelect({ regions, countryCode }: { regions: HttpTypes.StoreRegion[], countryCode: string }) {
    const [isOpen, setIsOpen] = useState(false)

    const currentPath = usePathname()

    const options = useMemo(() => {
        return regions
            ?.map((r) => {
                return r.countries?.map((c) => ({
                    country: c.iso_2,
                    region: r.id,
                    label: c.display_name,
                    currency_code: r.currency_code
                }))
            })
            .flat()
            .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? "")) as CountryOption[]
    }, [regions])

    const current = useMemo(() => {
        if (!options || options.length === 0) return undefined;
        let option = options.find((o) => o?.country === countryCode)
        if (!option) {
            // Default to US if countryCode is missing or not found
            option = options.find((o) => o?.country === 'us') || options[0]
        }
        return option
    }, [options, countryCode])

    const handleChange = (option: CountryOption) => {
        updateRegion(option.country, currentPath)
        setIsOpen(false)
    }

    if (!regions || regions.length === 0) return null

    return (
        <div
            className="hidden small:block relative z-[900]"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Listbox
                as="span"
                onChange={handleChange}
                value={current}
            >
                <ListboxButton className="py-1">
                    <div className="flex items-center gap-x-2 text-sm font-medium text-primary hover:text-secondary transition-colors cursor-pointer outline-none">
                        {current && (
                            <>
                                {/* @ts-ignore */}
                                <ReactCountryFlag
                                    svg
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                    }}
                                    countryCode={current.country ?? ""}
                                />
                                <span className="uppercase">{current.currency_code || current.country}</span>
                            </>
                        )}
                        {!current && <span>REGION</span>}
                    </div>
                </ListboxButton>
                {/* <Transition
                    show={isOpen}
                    as={Fragment}
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ListboxOptions
                        className="absolute top-full right-0 mt-2 max-h-[442px] overflow-y-scroll bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-max min-w-[200px]"
                        static
                    >
                        <div className="py-1">
                            <div className="px-3 py-2 text-xs text-gray-500 font-semibold bg-gray-50 border-b">
                                Shipping to
                            </div>
                            {options?.map((o, index) => {
                                return (
                                    <ListboxOption
                                        key={index}
                                        value={o}
                                        className="py-2 hover:bg-gray-100 px-3 cursor-pointer flex items-center gap-x-3 text-sm transition-colors"
                                    >
                                        {/* @ts-ignore */}
                                        {/* <ReactCountryFlag
                                            svg
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                borderRadius: "2px"
                                            }}
                                            countryCode={o?.country ?? ""}
                                        />
                                        <span>{o?.label}</span>
                                        <span className="ml-auto text-xs text-gray-400">{o?.currency_code?.toUpperCase()}</span>
                                    </ListboxOption>
                                )
                            })}
                        </div>
                    </ListboxOptions>
                </Transition> */} 
            </Listbox>
        </div>
    )
}

