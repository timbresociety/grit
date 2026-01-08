"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function WorkTeaser() {
    return (
        <section className="py-32 bg-neutral-900 border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16">
                    <div>
                        <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold block mb-4">
                            Selected Work
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                            Proof of<br />Execution.
                        </h2>
                    </div>
                    <Link href="/work" className="hidden md:flex items-center gap-2 text-white border-b border-white/30 hover:border-neon-blue hover:text-neon-blue transition-all pb-1 uppercase tracking-widest text-sm mt-8 md:mt-0">
                        View Case Studies <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Teaser Grid (Abstract representation) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/10 text-4xl font-serif">
                            0{i}
                        </div>
                    ))}
                </div>

                <Link href="/work" className="md:hidden flex items-center gap-2 text-white border-b border-white/30 hover:border-neon-blue hover:text-neon-blue transition-all pb-1 uppercase tracking-widest text-sm mt-12 w-fit">
                    View Case Studies <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    )
}
