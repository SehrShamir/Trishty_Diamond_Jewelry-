"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@/components/ui/button"

// Matches the desktop nav exactly
const navigationItems = [
  { label: "ENGAGEMENT RINGS", href: "/categories/engagement" },
  { label: "WEDDING RINGS", href: "/categories/wedding" },
  { label: "FINE JEWELLERY", href: "/categories/fine-jewelry" },
  { label: "BRACELETS", href: "/categories/fine-jewelry/bracelets" },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className=""
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full xsmall:max-w-sm p-0 bg-white">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="text-left">
            <LocalizedClientLink href="/" onClick={() => setOpen(false)}>
              <span className="font-sans text-2xl text-primary font-medium">
                Trishty
              </span>
            </LocalizedClientLink>
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {/* Navigation Items — same as desktop navbar */}
          <nav className="py-2">
            {navigationItems.map((item) => (
              <div key={item.label} className="border-b border-border">
                <LocalizedClientLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center p-5 hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-medium text-primary uppercase tracking-widest">
                    {item.label}
                  </span>
                </LocalizedClientLink>
              </div>
            ))}
          </nav>

          {/* Quick links */}
          <div className="p-5 flex flex-col gap-4 mt-2">
            <LocalizedClientLink
              href="/account"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-primary/70 hover:text-primary transition-colors uppercase tracking-widest"
            >
              My Account
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/cart"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-primary/70 hover:text-primary transition-colors uppercase tracking-widest"
            >
              Shopping Bag
            </LocalizedClientLink>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
