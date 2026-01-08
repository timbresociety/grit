"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ContactCTA() {
    return (
        <section className="py-40 bg-[#050505] relative flex items-center justify-center text-center">
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8">
                    Ready to build?
                </h2>
                <Link href="/contact" className="inline-flex items-center gap-3 bg-neon-blue text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Start a Project <ArrowRight size={18} />
                </Link>
            </div>

            {/* Decorative Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
        </section>
    )
}
