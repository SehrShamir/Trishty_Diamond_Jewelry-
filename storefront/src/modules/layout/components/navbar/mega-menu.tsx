"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface MegaMenuSection {
  title: string
  links: Array<{
    label: string
    href: string
    badge?: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  twoColumn?: boolean
}

interface MegaMenuImage {
  src: string
  alt: string
  title: string
  href: string
}

interface MegaMenuProps {
  sections: MegaMenuSection[]
  images?: MegaMenuImage[]
}

export function MegaMenu({ sections, images }: MegaMenuProps) {
  // Determine grid columns based on number of sections
  const gridCols = sections.length <= 5 ? "grid-cols-4" : "grid-cols-5"
  const textCols = sections.length <= 5 ? "col-span-2" : "col-span-3"
  const imageCols = "col-span-2"

  // Better distribution algorithm for columns
  const numColumns = sections.length <= 5 ? 2 : 3
  const baseItemsPerColumn = Math.floor(sections.length / numColumns)
  const remainder = sections.length % numColumns
  
  // Distribute remainder to first columns (e.g., 7 items -> 3,2,2 or 8 items -> 3,3,2)
  const getColumnSlice = (columnIndex: number) => {
    let start = 0
    for (let i = 0; i < columnIndex; i++) {
      start += baseItemsPerColumn + (i < remainder ? 1 : 0)
    }
    const end = start + baseItemsPerColumn + (columnIndex < remainder ? 1 : 0)
    return { start, end }
  }

  return (
    <div className="absolute left-0 right-0  w-full bg-background shadow-lg z-50">
      <div className="bn-container py-8">
        <div className={`flex ${gridCols} gap-8  justify-center`}>
          {/* Navigation sections */}
          <div className={`${textCols} flex gap-8 whitespace-nowrap lg:whitespace-normal`}>
            {/* Column 1 */}
            <div className="flex-1 space-y-8">
              {sections.slice(getColumnSlice(0).start, getColumnSlice(0).end).map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-primary mb-4 tracking-wide">
                    {section.title}
                  </h3>
                  <ul className={` ${section.twoColumn ? 'grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-8 ' : ''}`}>
                    {section.links.map((link, linkIdx) => {
                      const IconComponent = link.icon
                      return (
                        <li key={linkIdx}>
                          <Link
                            href={link.href}
                            className="text-sm py-1.5 hover:text-muted-foreground text-slate-600 transition-colors flex items-center gap-2"
                          >
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {link.label}
                            {link.badge && (
                              <span className="text-xs text-secondary font-medium">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 space-y-8">
              {sections.slice(getColumnSlice(1).start, getColumnSlice(1).end).map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <ul className={` ${section.twoColumn ? 'grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-8 ' : ''}`}>
                    {section.links.map((link, linkIdx) => {
                      const IconComponent = link.icon
                      return (
                        <li key={linkIdx}>
                          <Link
                            href={link.href}
                            className="text-sm py-1.5 hover:text-muted-foreground text-slate-600 transition-colors flex items-center gap-2"
                          >
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {link.label}
                            {link.badge && (
                              <span className="text-xs text-secondary font-medium">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Column 3 - Only for menus with more than 5 sections */}
            {sections.length > 5 && (
              <div className="flex-1 space-y-8">
                {sections.slice(getColumnSlice(2).start, getColumnSlice(2).end).map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <ul className={` ${section.twoColumn ? 'grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-8 ' : ''}`}>
                      {section.links.map((link, linkIdx) => {
                        const IconComponent = link.icon
                        return (
                          <li key={linkIdx}>
                            <Link
                              href={link.href}
                              className="text-sm py-1.5 hover:text-muted-foreground text-slate-600 transition-colors flex items-center gap-2"
                            >
                              {IconComponent && <IconComponent className="w-4 h-4" />}
                              {link.label}
                              {link.badge && (
                                <span className="text-xs text-secondary font-medium">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured images */}
          {images && images.length > 0 && (
            <div className={`${imageCols} grid grid-cols-2 gap-4`}>
              {images.map((image, idx) => (
                <Link
                  key={idx}
                  href={image.href}
                  className="group"
                >
                  <div className="relative h-full max-h-72 w-60 bg-muted overflow-hidden mb-2">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs font-medium text-center text-primary group-hover:text-secondary transition-colors uppercase">
                    {image.title}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface NavItemWithMegaMenuProps {
  label: string
  href: string
  sections: MegaMenuSection[]
  images?: MegaMenuImage[]
}

export function NavItemWithMegaMenu({
  label,
  href,
  sections,
  images,
}: NavItemWithMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="static"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={href}
        className="text-[11px] font-normal text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-[0.12em] py-2 px-3 inline-block relative"
      >
        <span className={`relative after:absolute after:-bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:h-[1px] after:bg-muted-foreground after:transition-all after:duration-300 ${
          isOpen ? "after:w-full" : "after:w-0"
        }`}>
          {label}
        </span>
      </Link>
      {/* TEMP DISABLED SUBMENU: uncomment to restore dropdown menu */}
      {/* {isOpen && <MegaMenu sections={sections} images={images} />} */}
    </div>
  )
}
