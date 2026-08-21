Trishty Storefront Copy — Medusa Starter Template
This document maps copy changes directly to the nextjs-starter-medusa template components.
Phase 1 (Launch): Medusa-powered e-commerce storefront. Browse → cart → checkout. This is what we are building now. Phase 2 (Later): The Atelier — gated bespoke experience with live concierge, 3D co-browsing, custom commissions. For now, this is a "Coming Soon" page on the storefront.

Global Branding Changes
Every instance of "Medusa Store" in the template must be replaced with "Trishty".
Location
File
Change
Nav logo
src/modules/layout/templates/nav/index.tsx
"Medusa Store" → "Trishty"
Side menu copyright
src/modules/layout/components/side-menu/index.tsx
"Medusa Store" → "Trishty"
Footer logo
src/modules/layout/templates/footer/index.tsx
"Medusa Store" → "Trishty"
Footer copyright
src/modules/layout/templates/footer/index.tsx
"Medusa Store" → "Trishty"
MedusaCTA
src/modules/layout/components/medusa-cta/index.tsx
Remove entirely


1. Navigation
File: src/modules/layout/templates/nav/index.tsx
Current → Updated
Element
Current
Trishty
Logo text
"Medusa Store"
"Trishty"
Account link
"Account"
"Account" (keep)
Cart link
"Cart (0)"
"Cart (0)" (keep)

Side Menu Items
File: src/modules/layout/components/side-menu/index.tsx
Current
Trishty
Href
Home
Home
/
Store
Collections
/store
Account
Account
/account
Cart
Cart
/cart
(new)
The Atelier
/atelier

Add to side menu: A link to "The Atelier" routes to the Coming Soon teaser page.

2. Homepage Hero
File: src/modules/home/components/hero/index.tsx
Current
Ecommerce Starter Template
Powered by Medusa and Next.js
[View on GitHub]

Trishty
Headline (h1): Precision. Privacy. Permanence.
Subheadline (h2): Diamond jewelry crafted with architectural exactness. Ethically sourced. Made to order.
Primary CTA: Explore the Collection → /store

Headline Alternatives
Option A: "Precision. Privacy. Permanence." — Three-word cadence. Sparse, architectural. Communicates brand pillars without explaining them. (Recommended)
Option B: "Diamond Jewelry. Made to Order." — Direct product statement. No abstraction. Strong for cold traffic who need immediate clarity.
Option C: "Where Detail Is Everything." — Evocative. Focuses on craftsmanship positioning. Works if the hero visual is a macro product shot.

3. Homepage Metadata
File: src/app/[countryCode]/(main)/page.tsx
Current
title: "Medusa Next.js Starter Template"
description: "A performant frontend ecommerce starter template with Next.js 15 and Medusa."

Trishty
title: "Trishty | Diamond Jewelry — Made to Order"
description: "Ethically sourced diamond jewelry crafted with architectural precision. Engagement rings, wedding bands, and fine jewelry. Made to order with fully insured delivery."


4. Featured Products Section
File: src/modules/home/components/featured-products/product-rail/index.tsx
No copy changes needed — this component dynamically renders collection titles and "View all" links from Medusa. The collections themselves (Engagement, Wedding, Fine Jewelry) should be titled in the Medusa admin.
Recommended Medusa collection titles:
Engagement Rings
Wedding Bands
Tennis Bracelets
Diamond Studs
Tennis Necklaces

5. Store Page (Browse All)
File: src/modules/store/templates/index.tsx
Current
All products

Trishty
The Collection


6. Collection Pages
File: src/modules/collections/templates/index.tsx
No template copy changes — collection titles are dynamic from Medusa admin. But each collection should have a description set in Medusa:
Collection Descriptions (Set in Medusa Admin)
Engagement Rings: Each stone hand-selected. Each setting made to order. Browse our curated collection — every piece crafted with the same meticulous precision.
Wedding Bands: Designed in concert with your engagement ring — or to stand on its own. Every band is made to order with the same precision and care as your ring.
Fine Jewelry: Tennis bracelets. Diamond studs. Tennis necklaces. Each piece individually certified and hand-finished. Made to order in 3-4 weeks.

7. Category Pages
File: src/modules/categories/templates/index.tsx
No template copy changes — category names and descriptions are dynamic. Set in Medusa admin:
Category Descriptions (Set in Medusa Admin)
Tennis Bracelets: Continuous diamond settings. Individually certified stones. Made to order in 3-4 weeks with fully insured delivery.
Diamond Studs: Precision-matched pairs. Certified for cut, clarity, color, and carat.
Tennis Necklaces: Architectural continuity from clasp to clasp. Every stone placed with exacting symmetry.

8. Product Detail Page
File: src/modules/products/templates/product-info/index.tsx
No template copy changes needed — product title and description are dynamic from Medusa.
Product Description Guidelines (For Medusa Admin)
Write each product description in this structure:
Line 1: One-sentence design statement. Line 2-3: Key specifications (stone, setting, metal). Line 4: Production and delivery note.
Example:
A cathedral solitaire engineered for maximum light performance.

2.01ct oval center stone, GIA certified E color / VVS2 clarity. Six-prong platinum setting with a 1.8mm knife-edge band.

Made to order in 3-4 weeks. Fully insured white-glove delivery included.

Product Tab Content
File: src/modules/products/components/product-tabs/index.tsx
The starter template includes expandable tabs on the PDP. Use these for:
Tab
Content
Product Information
(Dynamic from Medusa — material, dimensions, weight)
Shipping & Returns
Every Trishty piece ships via fully insured white-glove courier. Atelier Collection pieces include 30-day returns. Made-to-order pieces include complimentary adjustments within 30 days.
Warranty
Lifetime structural warranty covering prong integrity, band soundness, and one complimentary resizing.


9. Order Confirmation
File: src/modules/order/templates/order-completed-template.tsx
Current
Thank you!
Your order was placed successfully.

Trishty
Your commission has been placed.
We will begin production within 24 hours. Expect delivery in 3-4 weeks via fully insured white-glove courier.


10. Help / Post-Order Support
File: src/modules/order/components/help/index.tsx
Current
Need help?
- Contact
- Returns & Exchanges

Trishty
Client Services
- Contact Us
- Shipping & Delivery
- Returns & Warranty

Links should point to /client-services (or anchored sections within it).

11. Footer
File: src/modules/layout/templates/footer/index.tsx
Structure
The footer has three dynamic columns (Categories, Collections, and a static links column). Replace the static "Medusa" column:
Current Static Column
Medusa
- GitHub
- Documentation
- Source code

Trishty Static Column
Trishty
- Heritage (→ /heritage)
- Client Services (→ /client-services)
- The Atelier (→ /atelier)

Copyright
© {year} Trishty. All rights reserved.

Remove
MedusaCTA component ("Powered by Medusa & Next.js") — remove from footer entirely.

12. Checkout
File: src/modules/checkout/templates/checkout-form/index.tsx
No copy changes needed in the template — Medusa handles form labels. But ensure the checkout page metadata reflects the brand:
Checkout page title: "Checkout | Trishty"

13. Account / Login
File: src/app/[countryCode]/(main)/account/@login/page.tsx
The login template is standard. No copy changes needed beyond ensuring "Medusa Store" references are replaced with "Trishty" if they appear in surrounding templates.

New Pages to Add (Not in Medusa Starter)
These pages need to be created as new routes in the Next.js app.

14. Homepage — Full Section Breakdown
The Medusa starter homepage is: Hero + Featured Product Rails. For Trishty, expand it:
Section 1: Hero
(See Section 2 above)
Section 2: Trust Strip
Below the hero. Small text, centered.
Made to order in 3-4 weeks | Fully insured delivery | Lifetime structural warranty
Section 3: Featured Collections
(Existing Medusa FeaturedProducts component — renders collection product rails)
Section 4: The Difference (New Component)
Section Header: Not another jewelry website.
Column 1: Made-to-Order Precision No mass production. Every piece enters a 3-4 week production process. Hand-finished settings. Individually certified stones.
Column 2: Ethically Sourced Every diamond is individually certified and responsibly sourced. Full gemological documentation accompanies every piece.
Column 3: White-Glove Delivery Fully insured courier from our workshop to your door. Discreet, tamper-evident packaging designed to match the precision of the piece inside.
Section 5: Atelier Teaser Banner (New Component)
Headline: The Atelier is coming.
Body: Live gemologist consultations. Real-time 3D co-browsing. Fully bespoke commissions. A private digital studio for one-of-a-kind pieces — arriving soon.
CTA: Join the Waitlist → /atelier
Section 6: Trust / Guarantee Section (New Component)
Section Header: Your purchase is protected.
Fully insured delivery — white-glove courier, full coverage, discreet packaging.
30-day returns — on all Atelier Collection pieces. No questions.
Lifetime structural warranty — prong integrity, band soundness, one complimentary resizing.
Certified stones — every diamond accompanied by independent gemological certification.

15. The Atelier — Coming Soon (/atelier)
New route: src/app/[countryCode]/(main)/atelier/page.tsx
A single-screen teaser page. Builds anticipation for Phase 2 and captures early interest via email.
Hero
Headline: The Atelier Is Coming.
Subheadline: A private digital studio for fully bespoke commissions. One client at a time. One gemologist on call. One vision, executed with architectural precision.
What to Expect
Section Header: What we are building.
Live gemologist consultations — face-to-face sessions over encrypted video. Discuss specifications, examine stones, finalize designs together.
Real-time 3D co-browsing — your gemologist manipulates 3D models on your screen. Rotate, zoom, highlight every facet in sync.
Fully bespoke commissions — no templates, no constraints. Starting at $10,000.
A dedicated gemologist — your single point of contact from first consultation to final delivery.
Email Capture
Prompt: Be the first to know when the Atelier opens.
Email Address (single field)
Submit Button: Join the Waitlist
Below submit: We will notify you when access opens. No spam. Unsubscribe anytime.
Closing Line
In the meantime, explore our made-to-order collection. CTA: Explore the Collection → /store
Meta Content
Page Title: The Atelier — Coming Soon | Trishty
Meta Description: The Trishty Atelier: live gemologist consultations, real-time 3D co-browsing, and fully bespoke diamond commissions. Join the waitlist.

16. Heritage Page (/heritage)
New route: src/app/[countryCode]/(main)/heritage/page.tsx
Hero
Headline: High-Tech Heritage.
Subheadline: Where old-world craftsmanship meets modern digital precision.
Section 1: The Problem We Solved
Section Header: The luxury experience was broken.
Body: Walk into a traditional high-end jeweler and you enter a world built on intimidation — hushed tones, velvet ropes, and a salesperson deciding whether you belong.
Browse a jewelry website and you get the opposite problem — an endless scroll of options, a configurator, and zero human guidance for a decision worth thousands.
Neither experience respects the modern buyer: analytical, time-conscious, and entirely comfortable making significant decisions online — provided the service matches the stakes.
Section 2: What We Built
Section Header: Precision at every step.
Body: Trishty replaced the intimidating showroom with a digital experience built around the buyer.
Every piece in our collection is made to order — the same meticulous production process, whether it is an engagement ring or a pair of diamond studs. Every stone is individually certified. Every setting is hand-finished. Every delivery is fully insured.
Section 3: Our Principles
Principle 1: Precision over volume. We do not mass-produce. Every piece is a commission, not a transaction.
Principle 2: Transparency over theater. You see every specification, every certification, every detail of your stone — before you commit.
Principle 3: Privacy over spectacle. No showroom crowds. No public pressure. Your decision is yours alone.
Closing CTA
Headline: See the collection.
CTA: Explore the Collection → /store
Meta Content
Page Title: Heritage | Trishty — High-Tech Heritage
Meta Description: Trishty bridges old-world craftsmanship with modern digital precision. Curated diamond jewelry and fully bespoke commissions through a private digital atelier.

17. Client Services Page (/client-services)
New route: src/app/[countryCode]/(main)/client-services/page.tsx
Hero
Headline: Client Services
Subheadline: Every detail handled with the care your piece deserves.
Section 1: Shipping & Delivery
Section Header: Fully insured. Fully tracked.
Every Trishty piece ships via premium insured courier. Your commission is tracked from our workshop to your door with full coverage for the entire journey.
Packaging is discreet, tamper-evident, and designed to match the precision of the piece inside.
Section 2: Returns
Section Header: 30-day peace of mind.
Return any piece within 30 days of delivery for a full refund. Return shipping is fully insured at our expense.
Complimentary adjustments — including resizing and re-polishing — are also available within 30 days at no cost.
Section 3: Lifetime Warranty
Section Header: Built to last.
Every Trishty piece carries a lifetime structural warranty:
Prong integrity and stone security
Band structural soundness
One complimentary resizing
Not covered: cosmetic wear from daily use, loss, or stone damage from impact. Additional resizing and stone replacement available at preferred client pricing.
Section 4: Contact
Section Header: Reach us.
Email: contact@trishty.com Response time: Within 24 hours, Monday through Friday.
For urgent matters related to an active order or delivery, include your order number and we will prioritize your request.
Meta Content
Page Title: Client Services | Trishty — Shipping, Returns & Warranty
Meta Description: Fully insured delivery, 30-day returns, and lifetime structural warranty. Everything you need to know about your Trishty purchase.

Component-to-Copy Quick Reference
For developers implementing these changes:
Component
File Path
Copy Action
Hero
src/modules/home/components/hero/index.tsx
Rewrite — new headline, subheadline, CTAs
Nav
src/modules/layout/templates/nav/index.tsx
Replace "Medusa Store" → "Trishty"
Side Menu
src/modules/layout/components/side-menu/index.tsx
Update menu items, add "The Atelier" link
Footer
src/modules/layout/templates/footer/index.tsx
Replace branding, static links, remove MedusaCTA
MedusaCTA
src/modules/layout/components/medusa-cta/index.tsx
Remove
Store Template
src/modules/store/templates/index.tsx
Replace "All products" → "The Collection"
Order Confirmed
src/modules/order/templates/order-completed-template.tsx
Replace thank you copy
Help
src/modules/order/components/help/index.tsx
Replace links and heading
Homepage metadata
src/app/[countryCode]/(main)/page.tsx
Replace title and description
Homepage sections
src/app/[countryCode]/(main)/page.tsx
Add Trust Strip, Difference, Atelier CTA, Guarantee sections
The Atelier (Coming Soon)
(new) src/app/[countryCode]/(main)/atelier/page.tsx
Create
Heritage
(new) src/app/[countryCode]/(main)/heritage/page.tsx
Create
Client Services
(new) src/app/[countryCode]/(main)/client-services/page.tsx
Create

Medusa Admin Content (Not in Code)
These are set in the Medusa admin dashboard, not in the codebase:
