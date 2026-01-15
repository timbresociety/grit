"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    Coins, Network, Link, Globe, CreditCard, Layers,
    Bot, BarChart, Mic, Eye, Database, ShieldCheck
} from 'lucide-react'
import LottieIcon from '@/components/ui/LottieIcon'

// Blockchain capabilities
const blockchainCapabilities = [
    {
        title: "RWA Tokenization",
        description: "Fractionalize real-world assets with compliant smart contracts. Enable 24/7 global trading.",
        icon: Coins,
        lottieIcon: "/animations/multi-platform-delivery.json",
        tags: ["Increased Liquidity", "Automated Compliance", "24/7 Markets"]
    },
    {
        title: "Intent-Centric Orchestration",
        description: "Solvers execute desired outcomes optimally across chains.",
        icon: Network,
        lottieIcon: "/animations/scalable-infrastructure.json",
        tags: ["Cross-Chain", "MEV Protection", "Optimal Routing"]
    },
    {
        title: "Supply Chain Traceability",
        description: "Immutable audit trails from source to shelf.",
        icon: Link,
        lottieIcon: "/animations/process-development.json",
        tags: ["Provenance", "Tamper-Proof", "Real-Time"]
    },
    {
        title: "Cross-Border Payments",
        description: "T+0 settlement with <1% fees globally.",
        icon: Globe,
        lottieIcon: "/animations/ux-ui-design.json",
        tags: ["Instant Settlement", "Low Fees", "Global Reach"]
    },
    {
        title: "Interoperable Loyalty",
        description: "Points that travel across brand ecosystems.",
        icon: CreditCard,
        lottieIcon: "/animations/process-launch.json",
        tags: ["Cross-Brand", "Tradeable", "Unified Wallet"]
    },
    {
        title: "Contract Architecture",
        description: "Gas-optimized and formally verified.",
        icon: Layers,
        lottieIcon: "/animations/process-ideation.json",
        tags: ["Gas Optimized", "Formally Verified", "Upgradeable"]
    },
]

// AI capabilities
const aiCapabilities = [
    {
        title: "Enterprise AI Agents",
        description: "Deploy agents that plan, execute, and report. Multiply your workforce with AI.",
        icon: Bot,
        lottieIcon: "/animations/multi-agent-systems.json",
        tags: ["Workforce Multiplier", "24/7 Operations", "Self-Correcting"]
    },
    {
        title: "Evaluation Frameworks",
        description: "Measure hallucination rates before deployment.",
        icon: BarChart,
        lottieIcon: "/animations/rigorous-evaluations.json",
        tags: ["Accuracy Metrics", "Bias Detection", "Benchmark Suite"]
    },
    {
        title: "Voice AI Automation",
        description: "Human-parity voice with zero latency.",
        icon: Mic,
        lottieIcon: "/animations/voice-agents.json",
        tags: ["Natural Speech", "Low Latency", "Multi-Language"]
    },
    {
        title: "Vision Models",
        description: "Pixel-perfect anomaly detection.",
        icon: Eye,
        lottieIcon: "/animations/continuous-observability.json",
        tags: ["Anomaly Detection", "Quality Control", "Real-Time"]
    },
    {
        title: "Retrieval Systems (RAG)",
        description: "Semantic search with citable sources.",
        icon: Database,
        lottieIcon: "/animations/custom-guardrails.json",
        tags: ["Semantic Search", "Citations", "Knowledge Base"]
    },
    {
        title: "Model Monitoring",
        description: "Drift detection and compliance guardrails.",
        icon: ShieldCheck,
        lottieIcon: "/animations/model-finetuning.json",
        tags: ["Drift Detection", "Guardrails", "Compliance"]
    },
]

interface BentoCardProps {
    title: string
    description: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    lottieIcon?: string
    tags: string[]
    index: number
}

function BentoCard({ title, description, icon: Icon, lottieIcon, tags, index }: BentoCardProps) {
    return (
        <motion.div
            className="panel panel-hover p-6 flex flex-col h-full min-h-[220px] group"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
        >
            {/* Icon */}
            <motion.div
                className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-4 overflow-hidden group-hover:border-accent-jewel/30 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {lottieIcon ? (
                    <LottieIcon src={lottieIcon} className="w-10 h-10" />
                ) : (
                    <Icon size={22} className="text-accent-jewel" />
                )}
            </motion.div>

            {/* Content */}
            <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                {title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
                {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
                {tags.map((tag, i) => (
                    <motion.span
                        key={tag}
                        className="text-[10px] px-2 py-1 bg-background border border-border rounded-full text-muted"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 + i * 0.05 + 0.3 }}
                    >
                        {tag}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    )
}

interface CapabilitySectionProps {
    title: string
    capabilities: typeof blockchainCapabilities
    reverse?: boolean
    className?: string
}

function CapabilitySection({ title, capabilities, reverse, className }: CapabilitySectionProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <div ref={ref} className={`py-16 md:py-20 ${className || ''}`}>
            {/* Section Label */}
            <motion.div
                className={`flex items-center gap-4 mb-10 ${reverse ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, x: reverse ? 30 : -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={`h-px bg-border flex-grow max-w-[100px] ${reverse ? 'order-last' : ''}`} />
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    {title}
                </h3>
            </motion.div>

            {/* Cards Grid with staggered animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {capabilities.map((capability, i) => (
                    <BentoCard key={capability.title} {...capability} index={i} />
                ))}
            </div>
        </div>
    )
}

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

    return (
        <section ref={sectionRef} id="services" className="bg-background">
            <div className="container-editorial">
                {/* Main Section Header */}
                {/* Main Section Header */}
                <div ref={headerRef} className="text-center pt-20 md:pt-32 pb-8">
                    <motion.h2
                        className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 flex items-baseline justify-center gap-3 flex-wrap"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="font-imperial text-5xl md:text-6xl lg:text-7xl text-accent-jewel">Full Spectrum</span> Engineering
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-muted max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        End-to-end solutions across blockchain infrastructure and artificial intelligence.
                    </motion.p>
                </div>

                {/* Blockchain Section */}
                <CapabilitySection
                    title="Blockchain"
                    capabilities={blockchainCapabilities}
                    className="!pt-4 md:!pt-8"
                />

                {/* Divider */}
                <motion.div
                    className="border-t border-border"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* AI Section */}
                <CapabilitySection
                    title="Artificial Intelligence"
                    capabilities={aiCapabilities}
                    reverse
                />
            </div>
        </section>
    )
}
