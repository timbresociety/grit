"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    Coins, Network, Link, Globe, CreditCard, Layers,
    Bot, BarChart, Mic, Eye, Database, ShieldCheck, ArrowRight
} from 'lucide-react'
import LottieIcon from '@/components/ui/LottieIcon'

// Featured capabilities for large showcase cards
const blockchainFeatured = {
    title: "RWA Tokenization",
    tagline: "Bridge physical value to digital rails",
    description: "Fractionalize real-world assets with compliant smart contracts. Enable 24/7 global trading with automated compliance and instant liquidity.",
    lottieIcon: "/animations/multi-platform-delivery.json",
    bullets: ["Increased Liquidity", "Automated Compliance", "24/7 Markets"],
}

const aiFeatured = {
    title: "Enterprise AI Agents",
    tagline: "Autonomous workflows for operations",
    description: "Deploy agents that plan, execute, and report. Multiply your workforce with AI that operates 24/7 and self-corrects.",
    lottieIcon: "/animations/multi-agent-systems.json",
    bullets: ["Workforce Multiplier", "24/7 Operations", "Self-Correcting"],
}

const blockchainServices = [
    {
        title: "Intent-Centric Orchestration",
        description: "Solvers execute desired outcomes optimally across chains.",
        icon: Network,
        lottieIcon: "/animations/scalable-infrastructure.json"
    },
    {
        title: "Supply Chain Traceability",
        description: "Immutable audit trails from source to shelf.",
        icon: Link,
        lottieIcon: "/animations/process-development.json"
    },
    {
        title: "Cross-Border Payments",
        description: "T+0 settlement with <1% fees globally.",
        icon: Globe,
        lottieIcon: "/animations/ux-ui-design.json"
    },
    {
        title: "Interoperable Loyalty",
        description: "Points that travel across brand ecosystems.",
        icon: CreditCard,
        lottieIcon: "/animations/process-launch.json"
    },
    {
        title: "Contract Architecture",
        description: "Gas-optimized and formally verified.",
        icon: Layers,
        lottieIcon: "/animations/process-ideation.json"
    },
]

const aiServices = [
    {
        title: "Evaluation Frameworks",
        description: "Measure hallucination rates before deployment.",
        icon: BarChart,
        lottieIcon: "/animations/rigorous-evaluations.json"
    },
    {
        title: "Voice AI Automation",
        description: "Human-parity voice with zero latency.",
        icon: Mic,
        lottieIcon: "/animations/voice-agents.json"
    },
    {
        title: "Vision Models",
        description: "Pixel-perfect anomaly detection.",
        icon: Eye,
        lottieIcon: "/animations/continuous-observability.json"
    },
    {
        title: "Retrieval Systems (RAG)",
        description: "Semantic search with citable sources.",
        icon: Database,
        lottieIcon: "/animations/custom-guardrails.json"
    },
    {
        title: "Model Monitoring",
        description: "Drift detection and compliance guardrails.",
        icon: ShieldCheck,
        lottieIcon: "/animations/model-finetuning.json"
    },
]

interface FeatureCardProps {
    title: string
    description: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    lottieIcon?: string
    index: number
}

function FeatureCard({ title, description, icon: Icon, lottieIcon, index }: FeatureCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            className="panel panel-hover p-5 flex items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border flex-shrink-0 overflow-hidden">
                {lottieIcon ? (
                    <LottieIcon src={lottieIcon} className="w-8 h-8" />
                ) : (
                    <Icon size={18} className="text-accent-jewel" />
                )}
            </div>
            <div>
                <h4 className="font-serif text-base font-medium text-foreground mb-1">
                    {title}
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}

interface FeaturedCardProps {
    title: string
    tagline: string
    description: string
    lottieIcon: string
    bullets: string[]
}

function FeaturedCard({ title, tagline, description, lottieIcon, bullets }: FeaturedCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            className="panel p-8 md:p-10 texture-grain"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div>
                    <span className="label block mb-4">Featured Capability</span>
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                        {title}
                    </h3>
                    <p className="text-lg text-accent-jewel mb-4">{tagline}</p>
                    <p className="text-muted leading-relaxed mb-6">
                        {description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {bullets.map((bullet) => (
                            <span
                                key={bullet}
                                className="text-xs px-3 py-1.5 bg-background border border-border rounded-full text-muted"
                            >
                                {bullet}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: Lottie Animation */}
                <div className="flex justify-center lg:justify-end">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-background border border-border flex items-center justify-center overflow-hidden">
                        <LottieIcon src={lottieIcon} className="w-40 h-40 md:w-56 md:h-56" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

interface ChapterSectionProps {
    id: string
    number: string
    title: string
    subtitle: string
    featured: FeaturedCardProps
    services: typeof blockchainServices
}

function ChapterSection({ id, number, title, subtitle, featured, services }: ChapterSectionProps) {
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })

    return (
        <div id={id} className="scroll-mt-32">
            {/* Chapter Header - Full Width */}
            <motion.div
                ref={headerRef}
                className="text-center py-20 md:py-32 border-b border-border"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8 }}
            >
                <motion.span
                    className="chapter-number block mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 }}
                >
                    {number}
                </motion.span>
                <motion.h2
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-lg md:text-xl text-muted max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    {subtitle}
                </motion.p>
            </motion.div>

            {/* Featured Capability */}
            <div className="container-editorial py-16">
                <FeaturedCard {...featured} />
            </div>

            {/* More Capabilities Grid */}
            <div className="container-editorial pb-20">
                <div className="flex items-center justify-between mb-8">
                    <span className="label">More Capabilities</span>
                    <a
                        href="#contact"
                        className="text-sm text-muted hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        Discuss your needs <ArrowRight size={14} />
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service, i) => (
                        <FeatureCard key={service.title} {...service} index={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

    return (
        <section ref={sectionRef} className="bg-background">

            {/* Section Intro */}
            <div className="container-editorial py-20 text-center border-b border-border">
                <motion.span
                    className="label block mb-4"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.1 }}
                >
                    Full Spectrum Engineering
                </motion.span>
                <motion.p
                    className="text-xl md:text-2xl text-muted max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 }}
                >
                    End-to-end solutions across blockchain infrastructure and artificial intelligence,
                    delivered by senior operators who've built at scale.
                </motion.p>
            </div>

            {/* Chapter: Blockchain */}
            <ChapterSection
                id="services-blockchain"
                number="Chapter 01"
                title="Blockchain"
                subtitle="Institutional-grade infrastructure for the decentralized economy."
                featured={blockchainFeatured}
                services={blockchainServices}
            />

            {/* Chapter: AI */}
            <ChapterSection
                id="services-ai"
                number="Chapter 02"
                title="Artificial Intelligence"
                subtitle="Production AI systems that augment human capability."
                featured={aiFeatured}
                services={aiServices}
            />

        </section>
    )
}
