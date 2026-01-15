"use client"

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'

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

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Track scroll progress of the specific card container to animate scale/opacity
    // when it gets covered by the next one
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'start start']
    })

    // Scale down slightly as it moves up to create depth
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

    // Dynamic top position for stacking effect
    // Fixed base offset since header is no longer sticky
    const topPosition = `calc(6rem + ${index * 1}rem)`

    return (
        <motion.div
            ref={containerRef}
            className="sticky mb-24 last:mb-0"
            style={{
                top: topPosition,
                zIndex: index
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Timeline Connector */}
            {index < phases.length - 1 && (
                <div className="hidden md:block absolute left-8 top-20 -bottom-24 w-px bg-border" />
            )}

            <motion.div
                ref={ref}
                className="panel panel-hover p-6 md:p-8 relative bg-background"
                style={{
                    // Optional: subtle scale effect as it sticks
                    // scale 
                }}
            >
                {/* Phase Badge */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center font-serif text-xl font-medium shadow-sm">
                        {String(phase.id).padStart(2, '0')}
                    </div>
                    <div>
                        <span className="text-xs text-muted font-medium">{phase.duration}</span>
                        <h4 className="font-serif text-xl md:text-2xl text-foreground">
                            {phase.title}
                        </h4>
                    </div>
                </div>

                {/* Description */}
                <p className="text-muted leading-relaxed mb-6 pl-0 md:pl-20">
                    {phase.description}
                </p>

                {/* Deliverables */}
                <div className="pl-0 md:pl-20">
                    <span className="label block mb-3">Deliverables</span>
                    <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((item) => (
                            <span
                                key={item}
                                className="flex items-center gap-1.5 text-sm text-foreground bg-background border border-border px-3 py-1.5 rounded-full"
                            >
                                <CheckCircle2 size={12} className="text-accent-jewel" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function Process() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })
    const prefersReducedMotion = useReducedMotion()

    return (
        <section id="process" ref={sectionRef} className="bg-background scroll-mt-32">

            {/* Section Header - Static */}
            <div
                ref={headerRef}
                className="text-center pt-20 md:pt-24 pb-12 border-b border-border"
            >
                <motion.h2
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-4 flex items-baseline justify-center gap-3 flex-wrap"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    <span className="font-imperial text-5xl md:text-7xl lg:text-8xl text-accent-jewel">Build</span> Sprint
                </motion.h2>
                <motion.p
                    className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    A proven 12-week engagement framework. From discovery to production,
                    with complete transparency at every phase.
                </motion.p>
            </div>

            {/* Timeline */}
            <div className="container-editorial pt-12 pb-16 md:pb-32">
                <div className="max-w-4xl mx-auto relative">
                    {phases.map((phase, i) => (
                        <PhaseCard key={phase.id} phase={phase} index={i} />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <a
                        href="https://calendly.com/gritlabsinit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex"
                    >
                        Start Your Sprint <ArrowRight size={16} />
                    </a>
                </motion.div>
            </div>

        </section >
    )
}
