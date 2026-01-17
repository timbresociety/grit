"use client"

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

// Placeholder case studies - ready for asset replacement
const caseStudies = [
    {
        id: 1,
        title: "DeFi Protocol",
        category: "Blockchain",
        client: "Confidential",
        description: "Cross-chain liquidity aggregation with intent-based execution.",
        // PLACEHOLDER: Replace with actual case study image
        image: null,
        metrics: ["$50M+ TVL", "5 chains", "0 exploits"]
    },
    {
        id: 2,
        title: "Voice AI Platform",
        category: "AI",
        client: "Enterprise Client",
        description: "Human-parity voice agents for customer support automation.",
        // PLACEHOLDER: Replace with actual case study image
        image: null,
        metrics: ["200K+ calls/mo", "95% resolution", "<2s latency"]
    },
    {
        id: 3,
        title: "Supply Chain Traceability",
        category: "Blockchain",
        client: "Fortune 500",
        description: "End-to-end provenance tracking with immutable audit trails.",
        // PLACEHOLDER: Replace with actual case study image
        image: null,
        metrics: ["10M+ items tracked", "3 continents", "Real-time"]
    },
]

interface CaseStudyCardProps {
    study: typeof caseStudies[0]
    index: number
    featured?: boolean
}

function CaseStudyCard({ study, index, featured }: CaseStudyCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    if (featured) {
        return (
            <motion.div
                ref={ref}
                className="panel p-8 md:p-12 texture-grain col-span-full"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Placeholder Image */}
                    <div className="aspect-[4/3] bg-background border border-border rounded-lg flex items-center justify-center">
                        {study.image ? (
                            <Image
                                src={study.image}
                                alt={study.title}
                                fill
                                className="object-cover rounded-lg"
                            />
                        ) : (
                            <div className="text-center text-muted">
                                <div className="text-4xl mb-2">📸</div>
                                <span className="text-sm">Case Study Image</span>
                                <span className="block text-xs opacity-50">[ PLACEHOLDER ]</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Content */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="label">{study.category}</span>
                        </div>
                        <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                            {study.title}
                        </h3>
                        <p className="text-muted mb-6">{study.description}</p>

                        {/* Metrics */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {study.metrics.map((metric) => (
                                <span
                                    key={metric}
                                    className="text-sm px-3 py-1.5 bg-background border border-border rounded-full text-foreground"
                                >
                                    {metric}
                                </span>
                            ))}
                        </div>

                        <Link
                            href={`/work/${study.id}`}
                            className="inline-flex items-center gap-2 text-sm text-accent-jewel hover:text-accent-hover transition-colors"
                        >
                            View Case Study <ExternalLink size={14} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            ref={ref}
            className="panel panel-hover p-6 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {/* Placeholder Image */}
            <div className="aspect-[3/2] bg-background border border-border rounded-lg mb-4 flex items-center justify-center">
                {study.image ? (
                    <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        className="object-cover rounded-lg"
                    />
                ) : (
                    <div className="text-center text-muted">
                        <span className="text-2xl">📸</span>
                        <span className="block text-xs opacity-50 mt-1">[ PLACEHOLDER ]</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 mb-2">
                <span className="label">{study.category}</span>
            </div>

            <h4 className="font-serif text-lg text-foreground mb-2">
                {study.title}
            </h4>

            <p className="text-sm text-muted flex-grow">{study.description}</p>
        </motion.div>
    )
}

export default function WorkTeaser() {
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })

    return (
        <section id="work" className="bg-background scroll-mt-32">

            <div
                ref={headerRef}
                className="text-center pt-20 md:pt-32 pb-12 md:pb-16 border-b border-border"
            >
                <motion.h2
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    Proof of Execution
                </motion.h2>
                <motion.p
                    className="text-lg md:text-xl text-muted max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    Selected work from our portfolio. Real results for real enterprises.
                </motion.p>
            </div>

            {/* Case Studies Grid */}
            <div className="container-editorial py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Case Study */}
                    <CaseStudyCard study={caseStudies[0]} index={0} featured />

                    {/* Other Case Studies */}
                    {caseStudies.slice(1).map((study, i) => (
                        <CaseStudyCard key={study.id} study={study} index={i + 1} />
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
