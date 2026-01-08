"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const caseStudies = [
    {
        slug: "defi-aggregator",
        client: "YieldMaster",
        title: "Cross-Chain DeFi Aggregator",
        description: "Unified liquidity layer allowing users to stake assets across 7 chains in a single transaction.",
        tags: ["Blockchain", "Smart Contracts", "React"]
    },
    {
        slug: "ai-legal-assistant",
        client: "LexTech",
        title: "Autonomous Legal Aide",
        description: "Agentic workflow that parses thousands of case files to generate pretrial memos.",
        tags: ["AI Agents", "RAG", "Python"]
    },
    {
        slug: "rwa-marketplace",
        client: "EstateBlock",
        title: "Real Estate Tokenization",
        description: "Fractional ownership platform complying with Reg D/S for high-value properties.",
        tags: ["RWA", "Solidity", "Compliance"]
    },
    {
        slug: "supply-chain-track",
        client: "Logistix",
        title: "Pharma Supply Chain",
        description: "IoT + Blockchain solution ensuring temperature integrity for vaccine distribution.",
        tags: ["IoT", "Traceability", "Enterprise"]
    }
]

export default function Work() {
    return (
        <section className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 text-white">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold">
                        Selected Work
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold mt-4 leading-none">
                        Case Studies
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {caseStudies.map((study, i) => (
                        <Link href={`/work/${study.slug}`} key={study.slug} className="group block relative">
                            {/* Image Placeholder with Mask Reveal */}
                            <div className="relative aspect-[4/3] bg-white/5 border border-white/10 overflow-hidden mb-8 rounded-lg">
                                <div className="absolute inset-0 bg-neutral-900 group-hover:bg-neutral-800 transition-colors duration-500"></div>

                                {/* Placeholder Content */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-9xl font-serif font-bold opacity-20 group-hover:scale-110 transition-transform duration-700">
                                    {i + 1}
                                </div>

                                {/* Mask Overlay */}
                                <div className="absolute inset-0 bg-neon-blue mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-3 mb-3">
                                        {study.tags.map(tag => (
                                            <span key={tag} className="text-xs font-mono text-neon-blue border border-neon-blue/30 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold mb-2 group-hover:text-neon-blue transition-colors">
                                        {study.title}
                                    </h3>
                                    <p className="text-white/60 max-w-md font-light leading-relaxed">
                                        {study.description}
                                    </p>
                                </div>
                                <ArrowUpRight className="text-white/20 group-hover:text-neon-blue transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" size={32} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
