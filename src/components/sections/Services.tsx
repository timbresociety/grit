"use client"

import ServiceCard from '@/components/ui/ServiceCard'
import {
    Coins, Network, Link, Globe, CreditCard, Layers,
    Bot, BarChart, Mic, Eye, Database, ShieldCheck
} from 'lucide-react'

const blockchainServices = [
    {
        title: "RWA Tokenization",
        description: "Bridge physical value to digital rails. Fractionalize assets with compliant smart contracts.",
        bullets: ["Increased Liquidity", "Automated Compliance", "24/7 Markets"],
        icon: Coins,
        lottieIcon: "/animations/multi-platform-delivery.json"
    },
    {
        title: "Intent-Centric Orchestration",
        description: "Abstract complexity for users. Solvers execute desired outcomes optimally across chains.",
        bullets: ["Gasless UX", "Best Execution", "Slippage Protection"],
        icon: Network,
        lottieIcon: "/animations/scalable-infrastructure.json"
    },
    {
        title: "Supply Chain Traceability",
        description: "Immutable audit trails for logistics. Verify provenance from source to shelf in real-time.",
        bullets: ["Fraud Reduction", "Instant Audits", "Consumer Trust"],
        icon: Link,
        lottieIcon: "/animations/process-development.json"
    },
    {
        title: "Cross-Border Payments",
        description: "Instant settlement infrastructure. Eliminate intermediaries and reduce FX friction.",
        bullets: ["T+0 Settlement", "<1% Fees", "Global Reach"],
        icon: Globe,
        lottieIcon: "/animations/ux-ui-design.json"
    },
    {
        title: "Interoperable Loyalty",
        description: "Points that travel with users. Create ecosystems where rewards execute across brands.",
        bullets: ["Higher Engagement", "Partner Networks", "No Lock-in"],
        icon: CreditCard,
        lottieIcon: "/animations/process-launch.json"
    },
    {
        title: "Contract Architecture",
        description: "Battle-tested solidity engineering. Gas-optimized and formally verified.",
        bullets: ["Security First", "Gas Optimization", "Upgradeable Patterns"],
        icon: Layers,
        lottieIcon: "/animations/process-ideation.json"
    }
]

const aiServices = [
    {
        title: "Enterprise AI Agents",
        description: "Autonomous workflows for operations. Agents that plan, execute, and report.",
        bullets: ["Workforce Multiplier", "24/7 Operations", "Self-Correcting"],
        icon: Bot,
        lottieIcon: "/animations/multi-agent-systems.json"
    },
    {
        title: "Evaluation Frameworks",
        description: "Rigorous testing for LLMs. Measure hallucination rates and alignment before deployment.",
        bullets: ["Benchmarking", "Safety Guardrails", "Confidence Scores"],
        icon: BarChart,
        lottieIcon: "/animations/rigorous-evaluations.json"
    },
    {
        title: "Voice AI Automation",
        description: "Human-parity voice interfaces. Handle complex support flows with zero latency.",
        bullets: ["Natural Prosody", "Context Aware", "Instant Scale"],
        icon: Mic,
        lottieIcon: "/animations/voice-agents.json"
    },
    {
        title: "Vision Models",
        description: "Automated visual inspection and analysis. Detect anomalies with pixel-perfect precision.",
        bullets: ["QC Automation", "Safety Monitoring", "Asset Tagging"],
        icon: Eye,
        lottieIcon: "/animations/continuous-observability.json"
    },
    {
        title: "Retrieval Systems (RAG)",
        description: "Connect LLMs to your data. Semantic search that understands accurate enterprise context.",
        bullets: ["No Hallucinations", "Live Data", "Citable Sources"],
        icon: Database,
        lottieIcon: "/animations/custom-guardrails.json"
    },
    {
        title: "Model Monitoring",
        description: "Drift detection and guardrails. Ensure models stay compliant and performing over time.",
        bullets: ["Drift Alerts", "PII Redaction", "Audit Logs"],
        icon: ShieldCheck,
        lottieIcon: "/animations/model-finetuning.json"
    }
]

export default function Services() {
    return (
        <section id="services" className="py-24 bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Label Column */}
                    <div className="lg:w-1/6">
                        <div className="sticky top-24">
                            <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold block mb-4">
                                Capabilities
                            </span>
                            <h2 className="text-3xl font-serif font-bold leading-tight">
                                Full Spectrum<br />Engineering.
                            </h2>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="lg:w-5/6 flex flex-col gap-20">

                        {/* Group 1: Blockchain */}
                        <div>
                            <h3 className="text-xl font-light uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                                01 / Blockchain Infrastructure
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {blockchainServices.map((s) => (
                                    <ServiceCard key={s.title} {...s} />
                                ))}
                            </div>
                        </div>

                        {/* Group 2: AI */}
                        <div>
                            <h3 className="text-xl font-light uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                                02 / Artificial Intelligence
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {aiServices.map((s) => (
                                    <ServiceCard key={s.title} {...s} />
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
