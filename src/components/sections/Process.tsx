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
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Timeline Connector */}
            {index < phases.length - 1 && (
                <div className="hidden md:block absolute left-8 top-20 bottom-0 w-px bg-border" />
            )}

            <div className="panel panel-hover p-6 md:p-8 relative">
                {/* Phase Badge */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center font-serif text-xl font-medium">
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
            </div>
        </motion.div>
    )
}

export default function Process() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })
    const prefersReducedMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const progressWidth = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"])

    return (
        <section id="process" ref={sectionRef} className="bg-background scroll-mt-32">

            {/* Chapter Header - Full Width */}
            <div
                ref={headerRef}
                className="text-center py-20 md:py-32 border-b border-border"
            >
                <motion.span
                    className="chapter-number block mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 }}
                >
                    Chapter 03
                </motion.span>
                <motion.h2
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Build Sprint
                </motion.h2>
                <motion.p
                    className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    A proven 12-week engagement framework. From discovery to production,
                    with complete transparency at every phase.
                </motion.p>

                {/* Progress Bar */}
                <motion.div
                    className="max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 }}
                >
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent-jewel rounded-full"
                            style={{ width: prefersReducedMotion ? "100%" : progressWidth }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Timeline */}
            <div className="container-editorial py-16 md:py-24">
                <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
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

        </section>
    )
}
