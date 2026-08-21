"use client"

import { useState } from "react"

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

    if (submitted) {
        return (
            <div className="text-center py-12">
                <h3 className="text-2xl font-sans text-gray-900 tracking-wide mb-4">Message Sent.</h3>
                <p className="text-gray-500 font-light">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-light">Name</label>
                    <input type="text" required className="w-full border border-gray-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-gray-900 transition-colors" placeholder="Your name" />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-light">Email</label>
                    <input type="email" required className="w-full border border-gray-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-gray-900 transition-colors" placeholder="your@email.com" />
                </div>
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-light">Subject</label>
                <select className="w-full border border-gray-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-gray-900 transition-colors bg-white">
                    <option>General Inquiry</option><option>Order Status</option><option>Custom Commission</option><option>Returns & Exchanges</option><option>Other</option>
                </select>
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-light">Message</label>
                <textarea required rows={5} className="w-full border border-gray-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-gray-900 transition-colors resize-none" placeholder="How can we help?" />
            </div>
            <div className="text-center pt-4">
                <button type="submit" className="bg-gray-900 text-white text-[11px] uppercase tracking-[0.35em] font-medium px-12 py-4 hover:bg-gray-800 transition-colors">Send Message</button>
            </div>
        </form>
    )
}
