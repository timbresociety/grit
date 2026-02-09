"use client"

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'


// Selected case studies from our portfolio
const caseStudies = [
    {
        slug: "multi-chain-treasury",
        title: "Multi-Chain Treasury Infrastructure",
        category: "Crypto",
        description: "Event-sourced treasury state system with cross-chain normalization for crypto organizations.",
        image: "/work/multi-chain-treasury.webp",
        metrics: ["$1B+ managed", "10+ chains", "300+ orgs"]
    },
    {
        slug: "hybrid-retrieval",
        title: "Hybrid Retrieval Architecture",
        category: "AI",
        description: "Multi-modal retrieval combining semantic, lexical, and knowledge graph search for technical documentation.",
        image: "/work/hybrid-retrieval.webp",
        metrics: ["Sub-second latency", "3 retrieval modes", "Zero hallucination"]
    },
    {
        slug: "knowledge-isolation",
        title: "Multi-Tenant Knowledge Isolation",
        category: "Security",
        description: "Architecture-driven data isolation for classified programs on shared infrastructure.",
        image: "/work/knowledge-isolation.webp",
        metrics: ["Zero leakage", "Audit-ready", "Defense-grade"]
    },
]

interface CaseStudyCardProps {
    study: typeof caseStudies[0]
    index: number
}

function CaseStudyCard({ study, index }: CaseStudyCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {/* Image Container */}
            <div className="aspect-video relative mb-6 rounded-lg overflow-hidden bg-black/50 border border-white/10">
                {study.image ? (
                    <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/20">
                        <span className="text-2xl">📸</span>
                    </div>
                )}

                {/* Category Badge - Floating */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-white/90 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                        {study.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-2xl text-foreground mb-3 group-hover:text-accent-jewel transition-colors">
                    {study.title}
                </h3>

                <p className="text-sm text-muted mb-6 flex-grow leading-relaxed">
                    {study.description}
                </p>

                {/* Metrics - Compact */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {study.metrics.slice(0, 2).map((metric) => (
                        <span
                            key={metric}
                            className="text-[10px] px-2 py-1 bg-gray-100 rounded text-muted-foreground font-medium"
                        >
                            {metric}
                        </span>
                    ))}
                </div>

                {/* Link */}
                <Link
                    href={`/work/${study.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-accent-jewel hover:text-accent-hover transition-colors font-medium mt-auto"
                >
                    Read Case Study <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    )
}

import { useSectionInView } from '@/components/ui/EditorialLayout'

export default function WorkTeaser() {
    const sectionRef = useSectionInView('work')
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })

    return (
        <section
            ref={sectionRef}
            className="editorial-section scroll-mt-32"
        >

            <div
                ref={headerRef}
                className="text-center pt-20 md:pt-32 pb-12 md:pb-16 flex justify-center px-4"
            >
                <motion.div
                    className="glass-panel-dark px-6 py-6 md:px-12 md:py-8 inline-block max-w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6">
                        Proof of <span className="font-imperial text-5xl md:text-7xl lg:text-8xl text-accent-warm">Execution</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        Selected work from our portfolio. Real results for real enterprises.
                    </p>
                </motion.div>
            </div>

            {/* Case Studies Grid - Redesigned */}
            <div className="container-editorial pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {caseStudies.map((study, i) => (
                        <CaseStudyCard key={study.slug} study={study} index={i} />
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Link
                        href="/work"
                        className="btn-secondary inline-flex"
                    >
                        View All Case Studies <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>

        </section>
    )
}
