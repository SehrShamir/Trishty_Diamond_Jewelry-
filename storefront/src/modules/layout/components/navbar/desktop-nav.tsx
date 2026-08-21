"use client"

import Link from "next/link"
import { NavItemWithMegaMenu } from "./mega-menu"

// ENGAGEMENT RINGS Menu
const engagementRingsMenu = {
  sections: [
    {
      title: "DESIGN YOUR OWN RING",
      links: [
        { label: "Start With A Setting", href: "/engagement-rings/settings" },
        { label: "Start With A Diamond", href: "/diamonds" },
        { label: "Start With A Gemstone", href: "/gemstones" },
        { label: "Creative Studio", href: "/engagement-rings/creative-studio" },
      ],
    },
    {
      title: "SHOP BY SHAPE",
      twoColumn: true,
      links: [
        { label: "Round", href: "/engagement-rings/round" },
        { label: "Princess", href: "/engagement-rings/princess" },
        { label: "Cushion", href: "/engagement-rings/cushion" },
        { label: "Oval", href: "/engagement-rings/oval" },
        { label: "Emerald", href: "/engagement-rings/emerald" },
        { label: "Pear", href: "/engagement-rings/pear" },
        { label: "Asscher", href: "/engagement-rings/asscher" },
        { label: "Heart", href: "/engagement-rings/heart" },
        { label: "Radiant", href: "/engagement-rings/radiant" },
        { label: "Marquise", href: "/engagement-rings/marquise" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "Engagement Rings Guide", href: "/education/engagement-rings" },
      ],
    },
    {
      title: "SHOP BY STYLE",
      links: [
        { label: "Solitaire", href: "/engagement-rings/solitaire" },
        { label: "Halo", href: "/engagement-rings/halo" },
        { label: "Vintage", href: "/engagement-rings/vintage" },
        { label: "Side-Stone", href: "/engagement-rings/side-stone" },
        { label: "Three-Stone", href: "/engagement-rings/three-stone" },
        { label: "Gemstone", href: "/engagement-rings/gemstone" },
        { label: "Men's Engagement", href: "/engagement-rings/mens" },
      ],
    },
    {
      title: "SHOP ALL ENGAGEMENT",
      links: [
        { label: "Best Selling Rings", href: "/engagement-rings/best-sellers" },
        { label: "Designer Engagement Rings", href: "/engagement-rings/designer" },
        { label: "Ready to Ship Engagement Rings", href: "/engagement-rings/ready-to-ship", badge: "NEW" },
        { label: "Find Your Ring Size", href: "/engagement-rings/ring-size" },
      ],
    }
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "Top Engagement Rings",
      title: "TOP ENGAGEMENT RINGS",
      href: "/engagement-rings/top",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Creative Studio",
      title: "CREATIVE STUDIO",
      href: "/engagement-rings/creative-studio",
    },
  ],
}

// RINGS Menu
const ringsMenu = {
  sections: [
    {
      title: "WEDDING RINGS",
      links: [
        { label: "Women's Wedding Rings", href: "/rings/wedding/women" },
        { label: "Men's Wedding Bands", href: "/rings/wedding/men" },
      ],
    },
    {
      title: "DIAMOND ESSENTIALS",
      links: [
        { label: "Eternity Rings", href: "/rings/eternity" },
        { label: "Anniversary Rings", href: "/rings/anniversary" },
      ],
    },
    {
      title: "ENGAGEMENT RINGS",
      links: [
        { label: "Design Your Own Engagement Ring", href: "/engagement-rings/design" },
        { label: "Ready To Ship Engagement Rings", href: "/engagement-rings/ready-to-ship", badge: "NEW" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "Rings Guide", href: "/education/rings" },
      ],
    },
    {
      title: "SHOP ALL RINGS",
      links: [
        { label: "Best Selling Rings", href: "/rings/best-sellers" },
        { label: "Diamond Rings", href: "/rings/diamond" },
        { label: "Gemstone Rings", href: "/rings/gemstone" },
        { label: "Emerald Rings", href: "/rings/emerald" },
        { label: "Sapphire Rings", href: "/rings/sapphire" },
        { label: "Pearl Rings", href: "/rings/pearl" },
        { label: "Stackable Rings", href: "/rings/stackable" },
        { label: "Fashion Rings", href: "/rings/fashion" },
        { label: "Signet Rings", href: "/rings/signet" },
        { label: "Men's Rings", href: "/rings/mens" },
        { label: "Infinity Rings", href: "/rings/infinity" },
      ],
    },
    {
      title: "NEW ARRIVALS",
      links: [
        { label: "See All New Rings", href: "/rings/new" },
      ],
    },
    {
      title: "SALE",
      links: [
        { label: "Today's Deals", href: "/rings/deals" },
        { label: "Clear The Vault", href: "/rings/clearance" },
        { label: "View All Jewelry", href: "/jewelry/all" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "New Arrivals",
      title: "NEW ARRIVALS",
      href: "/rings/new",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Stacking Rings",
      title: "STACKING RINGS",
      href: "/rings/stacking",
    },
  ],
}

// EARRINGS Menu
const earringsMenu = {
  sections: [
    {
      title: "SHOP ALL EARRINGS",
      links: [
        { label: "Best Selling Earrings", href: "/earrings/best-sellers" },
        { label: "Diamond Earrings", href: "/earrings/diamond" },
        { label: "Gemstone Earrings", href: "/earrings/gemstone" },
        { label: "Pearl Earrings", href: "/earrings/pearl" },
        { label: "Hoop Earrings", href: "/earrings/hoop" },
        { label: "Drop Earrings", href: "/earrings/drop" },
        { label: "Stud Earrings", href: "/earrings/stud" },
      ],
    },
    {
      title: "DIAMOND ESSENTIALS",
      links: [
        { label: "Diamond Stud Earrings", href: "/earrings/diamond-studs" },
        { label: "Diamond Hoop Earrings", href: "/earrings/diamond-hoops" },
      ],
    },
    {
      title: "DESIGN YOUR OWN EARRINGS",
      links: [
        { label: "Start with A Setting", href: "/earrings/settings" },
        { label: "Start with Diamonds", href: "/earrings/diamonds" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "Studs Guide", href: "/education/earrings" },
      ],
    },
    {
      title: "NEW ARRIVALS",
      links: [
        { label: "See All New Earrings", href: "/earrings/new" },
      ],
    },
    {
      title: "SALE",
      links: [
        { label: "Today's Deals", href: "/earrings/deals" },
        { label: "Clear The Vault", href: "/earrings/clearance" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "Design Your Own Earrings",
      title: "DESIGN YOUR OWN EARRINGS",
      href: "/earrings/design",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Diamond Hoops",
      title: "DIAMOND HOOPS",
      href: "/earrings/diamond-hoops",
    },
  ],
}

// BRACELETS Menu
const braceletsMenu = {
  sections: [
    {
      title: "SHOP ALL BRACELETS",
      links: [
        { label: "Best Selling Bracelets", href: "/bracelets/best-sellers" },
        { label: "Diamond Bracelets", href: "/bracelets/diamond" },
        { label: "Gemstone Bracelets", href: "/bracelets/gemstone" },
        { label: "Pearl Bracelets", href: "/bracelets/pearl" },
        { label: "Stackable Bracelets", href: "/bracelets/stackable" },
        { label: "Bangle Bracelets", href: "/bracelets/bangle" },
        { label: "Cuff Bracelets", href: "/bracelets/cuff" },
        { label: "Men's Bracelets", href: "/bracelets/mens" },
      ],
    },
    {
      title: "DIAMOND ESSENTIALS",
      links: [
        { label: "Tennis Bracelets", href: "/bracelets/tennis" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "Bracelets Guide", href: "/education/bracelets" },
      ],
    },
    {
      title: "NEW ARRIVALS",
      links: [
        { label: "See All New Bracelets", href: "/bracelets/new" },
      ],
    },
    {
      title: "SALE",
      links: [
        { label: "Today's Deals", href: "/bracelets/deals" },
        { label: "Clear The Vault", href: "/bracelets/clearance" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "Bangle Bracelets",
      title: "BANGLE BRACELETS",
      href: "/bracelets/bangle",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Mini Half Tennis Bracelet",
      title: "MINI HALF TENNIS BRACELET",
      href: "/bracelets/mini-tennis",
    },
  ],
}

// NECKLACES Menu
const necklacesMenu = {
  sections: [
    {
      title: "SHOP ALL NECKLACES",
      links: [
        { label: "Best Selling Necklaces", href: "/necklaces/best-sellers" },
        { label: "Diamond Necklaces", href: "/necklaces/diamond" },
        { label: "Gemstone Necklaces", href: "/necklaces/gemstone" },
        { label: "Pearl Necklaces", href: "/necklaces/pearl" },
        { label: "Cross Necklaces", href: "/necklaces/cross" },
        { label: "Chain Necklaces", href: "/necklaces/chain" },
        { label: "Men's Necklaces", href: "/necklaces/mens" },
      ],
    },
    {
      title: "DIAMOND ESSENTIALS",
      links: [
        { label: "Diamond Pendants", href: "/necklaces/diamond-pendants" },
        { label: "Tennis Necklaces", href: "/necklaces/tennis" },
      ],
    },
    {
      title: "DESIGN YOUR OWN NECKLACES",
      links: [
        { label: "Start With A Diamond", href: "/necklaces/diamonds" },
        { label: "Start With A Setting", href: "/necklaces/settings" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "Necklaces Guide", href: "/education/necklaces" },
      ],
    },
    {
      title: "NEW ARRIVALS",
      links: [
        { label: "See All New Necklaces", href: "/necklaces/new" },
      ],
    },
    {
      title: "SALE",
      links: [
        { label: "Today's Deals", href: "/necklaces/deals" },
        { label: "Clear The Vault", href: "/necklaces/clearance" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "Initials Collection",
      title: "INITIALS COLLECTION",
      href: "/necklaces/initials",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Diamond Essentials",
      title: "DIAMOND ESSENTIALS",
      href: "/necklaces/diamond-essentials",
    },
  ],
}

// DIAMONDS Menu
const diamondsMenu = {
  sections: [
    {
      title: "SHOP DIAMONDS BY SHAPE",
      twoColumn: true,
      links: [
        { label: "Round", href: "/diamonds/round" },
        { label: "Princess", href: "/diamonds/princess" },
        { label: "Cushion", href: "/diamonds/cushion" },
        { label: "Emerald", href: "/diamonds/emerald" },
        { label: "Pear", href: "/diamonds/pear" },
        { label: "Oval", href: "/diamonds/oval" },
        { label: "Radiant", href: "/diamonds/radiant" },
        { label: "Asscher", href: "/diamonds/asscher" },
        { label: "Marquise", href: "/diamonds/marquise" },
        { label: "Heart", href: "/diamonds/heart" },
      ],
    },
    {
      title: "DIAMOND ESSENTIALS",
      links: [
        { label: "Diamond Stud Earrings", href: "/diamonds/stud-earrings" },
      ],
    },
    {
      title: "DESIGN YOUR OWN",
      links: [
        { label: "Start With A Diamond", href: "/diamonds/start" },
        { label: "Start With A Setting", href: "/diamonds/settings" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "Diamond Guide", href: "/education/diamonds" },
      ],
    },
    {
      title: "SHOP SPECIAL",
      links: [
        { label: "Astor By Trishty", href: "/diamonds/astor" },
        { label: "Colored Diamonds", href: "/diamonds/colored" },
        { label: "Lab-Grown Diamonds", href: "/diamonds/lab-grown" },
        { label: "Diamonds On Sale", href: "/diamonds/sale" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "Design Your Own",
      title: "DESIGN YOUR OWN",
      href: "/diamonds/design",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "GIA Diamonds",
      title: "GIA DIAMONDS",
      href: "/diamonds/gia",
    },
  ],
}

// GEMSTONES Menu
const gemstonesMenu = {
  sections: [
    {
      title: "SHOP ALL GEMSTONE JEWELRY",
      links: [
        { label: "Gemstone Rings", href: "/gemstones/rings" },
        { label: "Gemstone Earrings", href: "/gemstones/earrings" },
        { label: "Gemstone Bracelets", href: "/gemstones/bracelets" },
        { label: "Gemstone Necklaces", href: "/gemstones/necklaces" },
      ],
    },
    {
      title: "BIRTHSTONE JEWELRY",
      links: [
        { label: "January | Garnet", href: "/gemstones/garnet" },
        { label: "February | Amethyst", href: "/gemstones/amethyst" },
        { label: "March | Aquamarine", href: "/gemstones/aquamarine" },
        { label: "April | Diamond", href: "/gemstones/diamond" },
        { label: "May | Emerald", href: "/gemstones/emerald" },
        { label: "June | Pearl", href: "/gemstones/pearl" },
        { label: "July | Ruby", href: "/gemstones/ruby" },
        { label: "August | Peridot", href: "/gemstones/peridot" },
        { label: "September | Sapphire", href: "/gemstones/sapphire" },
        { label: "October | Opal", href: "/gemstones/opal" },
        { label: "November | Citrine", href: "/gemstones/citrine" },
        { label: "December | Topaz", href: "/gemstones/topaz" },
      ],
    },
    {
      title: "DESIGN YOUR OWN GEMSTONE JEWELRY",
      links: [
        { label: "Engagement Ring", href: "/gemstones/engagement-ring" },
        { label: "Earrings", href: "/gemstones/earrings-design" },
        { label: "Pendant", href: "/gemstones/pendant" },
      ],
    },
    {
      title: "GEMSTONE GUIDE",
      links: [
        { label: "Gemstone Characteristics", href: "/education/gemstones" },
        { label: "Gemstone Care", href: "/education/gemstone-care" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "Pearl Jewelry",
      title: "PEARL JEWELRY",
      href: "/gemstones/pearl-jewelry",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Birthstone Jewelry",
      title: "BIRTHSTONE JEWELRY",
      href: "/gemstones/birthstone",
    },
  ],
}

// GIFTS & COLLECTIONS Menu
const giftsMenu = {
  sections: [
    {
      title: "NEW ARRIVALS",
      links: [
        { label: "See All New Collections", href: "/collections/new" },
      ],
    },
    {
      title: "SHOP CURATED GIFTS",
      links: [
        { label: "Gift Guide", href: "/gifts/guide" },
        { label: "Gifts For Her", href: "/gifts/her" },
        { label: "Gifts For Him", href: "/gifts/him" },
      ],
    },
    {
      title: "SHOP BY OCCASION",
      links: [
        { label: "Gifts For Mom", href: "/gifts/mom" },
        { label: "Spring Occasions", href: "/gifts/spring" },
        { label: "Sentimental Gifts", href: "/gifts/sentimental" },
        { label: "Graduation Gifts", href: "/gifts/graduation" },
        { label: "Anniversary Gifts", href: "/gifts/anniversary" },
        { label: "Wedding Party Gifts", href: "/gifts/wedding-party" },
      ],
    },
    {
      title: "DIAMOND ESSENTIALS",
      links: [
        { label: "Diamond Eternity Rings", href: "/gifts/eternity-rings" },
        { label: "Diamond Anniversary Rings", href: "/gifts/anniversary-rings" },
        { label: "Diamond Stud Earrings", href: "/gifts/stud-earrings" },
        { label: "Diamond Tennis Bracelets", href: "/gifts/tennis-bracelets" },
        { label: "Diamond Pendant Necklaces", href: "/gifts/pendant-necklaces" },
        { label: "Diamond Hoop Earrings", href: "/gifts/hoop-earrings" },
        { label: "Diamond Tennis Necklaces", href: "/gifts/tennis-necklaces" },
      ],
    },
    {
      title: "EDUCATION",
      links: [
        { label: "GIA Jewelry report", href: "/education/gia" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "COLLECTIONS",
      links: [
        { label: "Butterfly Diamond Jewelry", href: "/collections/butterfly" },
        { label: "Personalized Jewelry Initial", href: "/collections/personalized", badge: "NEW" },
        { label: "Illusion Collection", href: "/collections/illusion", badge: "NEW" },
        { label: "Marquise Collection", href: "/collections/marquise", badge: "NEW" },
        { label: "Bezel Collection", href: "/collections/bezel" },
        { label: "Mini Half Tennis Collection", href: "/collections/mini-tennis" },
        { label: "Initials Collection", href: "/collections/initials" },
        { label: "Zodiac Collection", href: "/collections/zodiac" },
        { label: "Extraordinary Collection", href: "/collections/extraordinary" },
      ],
    },
    {
      title: "SALE",
      links: [
        { label: "Today's Deals", href: "/gifts/deals" },
        { label: "Clear The Vault", href: "/gifts/clearance" },
      ],
    },
  ],
  images: [
    {
      src: "/navbar/top-engagement-ring.png",
      alt: "The Extraordinary Collection",
      title: "THE EXTRAORDINARY COLLECTION",
      href: "/collections/extraordinary",
    },
    {
      src: "/navbar/creative-studio.png",
      alt: "Gift Guide",
      title: "GIFT GUIDE",
      href: "/gifts/guide",
    },
  ],
}

const navigationItems = [
  {
    label: "ENGAGEMENT RINGS",
    href: "/categories/engagement",
    menu: engagementRingsMenu,
  },
  {
    label: "WEDDING RINGS",
    href: "/categories/wedding",
    menu: ringsMenu,
  },
  {
    label: "FINE JEWELLERY",
    href: "/categories/fine-jewelry",
    menu: ringsMenu,
  },
  {
    label: "BRACELETS",
    href: "/categories/fine-jewelry/bracelets",
    menu: braceletsMenu,
  }
]

export function DesktopNav() {
  return (
    <div className="hidden small:flex items-center gap-1 justify-center static z-[1] shrink-0">
      {navigationItems.map((item) =>
        item.menu ? (
          <NavItemWithMegaMenu
            key={item.label}
            label={item.label}
            href={item.href}
            sections={item.menu.sections}
            images={item.menu.images}
          />
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className="text-[11px] font-normal text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-[0.12em] px-3 py-2"
          >
            {item.label}
          </Link>
        )
      )}
    </div>
  )
}
