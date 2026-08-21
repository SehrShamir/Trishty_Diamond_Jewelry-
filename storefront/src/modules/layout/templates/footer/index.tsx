"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Facebook } from "lucide-react"
import { NewsletterSubscribe } from "@modules/blog/components/newsletter-subscribe"

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
)

export default function Footer() {
  const pathname = usePathname()
  const isBlogPage = pathname === "/blog" || pathname.startsWith("/blog/")

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="bn-container py-12 small:py-16">
        {/* Newsletter Signup */}
        {!isBlogPage && (
          <div className="border-b border-primary-foreground/10 pb-10 small:pb-14 mb-10 small:mb-14 text-center">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-3">
              The Trishty Journal
            </p>
            <h3 className="font-serif font-light text-2xl small:text-3xl medium:text-4xl mb-3">
              Stay in the know
            </h3>
            <p className="text-sm text-primary-foreground/60 max-w-md mx-auto mb-6">
              Jewelry insights, new collections, and expert guides &mdash; delivered monthly.
            </p>
            <NewsletterSubscribe variant="dark" />
          </div>
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 small:grid-cols-4 gap-8 small:gap-10 mb-12">
          {/* Company Info */}
          <div className="col-span-2 small:col-span-1">
            <Link href="/" className="font-serif text-2xl font-light tracking-[0.2em] uppercase mb-4 block">
              Trishty
            </Link>
            <p className="text-sm text-primary-foreground/50 leading-relaxed mb-6">
              We&apos;re a team of creatives and jewelry experts dedicated to
              redefining the online jewelry shopping experience.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/50">
              <p>New York, NY</p>
              <a href="tel:+16507415063" className="block hover:text-primary-foreground transition-colors">
                (650) 741-5063
              </a>
              <a href="mailto:contact@trishty.com" className="block hover:text-primary-foreground transition-colors">
                contact@trishty.com
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <PinterestIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-normal mb-4 uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/50">
              <li><Link href="/heritage" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/reviews" className="hover:text-primary-foreground transition-colors">Reviews</Link></li>
              <li><Link href="/blog/diamond-education" className="hover:text-primary-foreground transition-colors">Education</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-normal mb-4 uppercase tracking-wider">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/50">
              <li><Link href="/shipping" className="hover:text-primary-foreground transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-primary-foreground transition-colors">Money Back Guarantee</Link></li>
              <li><Link href="/conflict-free" className="hover:text-primary-foreground transition-colors">Conflict Free Diamonds</Link></li>
              <li><Link href="/warranty" className="hover:text-primary-foreground transition-colors">Professional Appraisal</Link></li>
              <li><Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/accessibility" className="hover:text-primary-foreground transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* Jewelry */}
          <div>
            <h4 className="text-sm font-normal mb-4 uppercase tracking-wider">
              Jewelry
            </h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/50">
              <li><Link href="/store" className="hover:text-primary-foreground transition-colors">Engagement Rings</Link></li>
              <li><Link href="/store" className="hover:text-primary-foreground transition-colors">Wedding Bands</Link></li>
              <li><Link href="/store" className="hover:text-primary-foreground transition-colors">Pendants</Link></li>
              <li><Link href="/store" className="hover:text-primary-foreground transition-colors">Eternity Rings</Link></li>
              <li><Link href="/store" className="hover:text-primary-foreground transition-colors">Diamond Necklaces</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col small:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/30">
              © {new Date().getFullYear()} All Rights Reserved to Trishty Jewelry
            </p>
            <p className="text-xs text-primary-foreground/30">
              Pay in 4. Anywhere — Split any purchase into 4 interest-free payments.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
