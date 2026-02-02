"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { SECTION_FRAME_MAP, TOTAL_FRAMES } from '@/components/ui/ScrollVideoBackground'

interface Phase {
    id: number
    title: string
    duration: string
    deliverables: string[]
    description: string
}

const phases: Phase[] = [
    {
        id: 1,
        title: "Discovery & Scoping",
        duration: "Week 1",
        description: "Deep dive into requirements, constraints, and success metrics. We map the technical landscape and define clear boundaries.",
        deliverables: ["Technical Requirements Doc", "Architecture Blueprint", "Risk Assessment"]
    },
    {
        id: 2,
        title: "Architecture & Design",
        duration: "Week 2",
        description: "System design with security and scalability as first principles. Clear interfaces, data flows, and integration points.",
        deliverables: ["System Design Doc", "API Specifications", "Data Models"]
    },
    {
        id: 3,
        title: "Implementation Sprint",
        duration: "Weeks 3–8",
        description: "Iterative development with weekly milestones. Continuous integration, testing, and stakeholder visibility.",
        deliverables: ["Core Infrastructure", "Feature Modules", "Test Coverage"]
    },
    {
        id: 4,
        title: "Security & Audit",
        duration: "Weeks 9–10",
        description: "Comprehensive security review, penetration testing, and third-party audit coordination where required.",
        deliverables: ["Security Report", "Audit Findings", "Remediation Plan"]
    },
    {
        id: 5,
        title: "Launch & Handoff",
        duration: "Weeks 11–12",
        description: "Production deployment, monitoring setup, and complete knowledge transfer. Your team is equipped to maintain and extend.",
        deliverables: ["Production Deployment", "Runbooks", "Training Sessions"]
    }
]

function PhaseCard({ phase, index, total }: { phase: Phase; index: number; total: number }) {
    // Dynamic Top Offset Calculation
    const topOffset = `calc(var(--stack-offset) + ${index} * 1rem)`

    const isLast = index === total - 1

    // Last card is RELATIVE, others are STICKY
    // This allows the last card to scroll visually "over" the stack and then away with the flow
    const positioningStyle = isLast ? {
        position: 'relative',
        top: 'auto',
        marginBottom: 0,
        // No negative margin needed if flows are correct
    } : {
        position: 'sticky',
        top: topOffset,
        marginBottom: 'var(--card-margin)',
    }

    return (
        <motion.div
            className="w-full"
            style={{
                ...positioningStyle,
                zIndex: index,
            } as any}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            {/* Added bg-background here to ensure opacity covers previous cards */}
            <div className="panel panel-hover p-6 md:p-8 relative bg-background border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
                {/* Visual "Connector" behind the cards */}
                {index < total - 1 && (
                    <div className="absolute left-8 bottom-0 top-full w-px bg-border/50 -z-10 hidden md:block h-12" />
                )}

                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Number Badge */}
                    <div className="shrink-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-foreground text-background flex items-center justify-center font-serif text-lg md:text-xl font-medium shadow-md">
                            {String(phase.id).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-3">
                            <h4 className="font-serif text-xl md:text-2xl text-foreground order-2 md:order-1">
                                {phase.title}
                            </h4>
                            <span className="text-xs md:text-sm text-muted font-medium uppercase tracking-wider order-1 md:order-2 border border-border px-2 py-1 rounded w-fit">
                                {phase.duration}
                            </span>
                        </div>

                        <p className="text-muted leading-relaxed mb-6 max-w-2xl">
                            {phase.description}
                        </p>

                        {/* Deliverables */}
                        <div>
                            <span className="label block mb-3 opacity-70">Deliverables</span>
                            <div className="flex flex-wrap gap-2">
                                {phase.deliverables.map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 text-xs md:text-sm text-foreground bg-surface-elevated border border-border px-3 py-1.5 rounded-full"
                                    >
                                        <CheckCircle2 size={12} className="text-accent-jewel" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

import { useSectionInView } from '@/components/ui/EditorialLayout'

export default function Process() {
    const sectionRef = useSectionInView('process')
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })

    // Strict Sync: Use Global Scroll Progress
    const { scrollYProgress: globalScroll } = useScroll()

    // Normalized start/end points (0 to 1)
    const startPoint = SECTION_FRAME_MAP.process.start / TOTAL_FRAMES
    const endPoint = SECTION_FRAME_MAP.process.end / TOTAL_FRAMES

    const sectionOpacity = useTransform(
        globalScroll,
        [startPoint - 0.02, startPoint, endPoint, endPoint + 0.02],
        [0, 1, 1, 0]
    )

    return (
        <motion.section
            id="process"
            ref={sectionRef}
            className="editorial-section relative"
            style={{
                opacity: sectionOpacity,
                // CSS Variables for Responsive Tuning
                '--stack-offset': '120px', // Default (Desktop)
                '--card-margin': '4rem',     // Default (Desktop)
            } as any}
        >
            <style jsx global>{`
                @media (max-width: 768px) {
                    #process {
                        --stack-offset: 100px !important;
                        --card-margin: 2rem !important;
                    }
                }
            `}</style>

            <div className="container-editorial">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className="text-center pt-20 md:pt-32 pb-12 md:pb-16 mb-16 md:mb-24 flex justify-center"
                >
                    <motion.div
                        className="glass-panel-dark px-8 py-6 md:px-12 md:py-8 inline-block"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.8 }}
                    >
                        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 flex items-baseline justify-center gap-3 flex-wrap">
                            <span className="font-imperial text-5xl md:text-7xl lg:text-8xl text-accent-warm">Build</span> Sprint
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                            A proven 12-week engagement framework. From discovery to production,
                            with complete transparency at every phase.
                        </p>
                    </motion.div>
                </div>

                {/* Stacking Cards Container */}
                <div className="max-w-4xl mx-auto relative">
                    {/* 
                        No bottom padding needed now because the last card flows naturally
                    */}
                    <div className="flex flex-col relative w-full">
                        {phases.map((phase, i) => (
                            <PhaseCard
                                key={phase.id}
                                phase={phase}
                                index={i}
                                total={phases.length}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA - Appears after the stack */}
                <motion.div
                    className="text-center mt-20 relative z-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <a
                        href="https://calendly.com/gritlabsinit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex text-lg px-8 py-4"
                    >
                        Explore A Build Sprint <ArrowRight size={20} className="ml-2" />
                    </a>
                </motion.div>
            </div>
        </motion.section>
    )
}
