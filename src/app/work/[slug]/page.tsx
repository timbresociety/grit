import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Mock Data (In prod, fetch from CMS/API)
const getCaseStudy = (slug: string) => {
    const studies: Record<string, any> = {
        "defi-aggregator": {
            title: "Cross-Chain DeFi Aggregator",
            client: "YieldMaster",
            problem: "Users managed fragmented liquidity across 7 isolated chains, leading to capital inefficiency and high friction.",
            approach: "We architected a unified liquidity layer using intent-based cross-chain messaging implementation.",
            outcome: "Reduced transaction time by 90% and increased TVL by $40M within 3 months of launch.",
            stack: ["Next.js", "Wagmi", "Foundry", "Solidity", "Node.js"],
            security: "Double-audited smart contracts. Implemented circuit breakers for abnormal volume detection."
        },
        "ai-legal-assistant": {
            title: "Autonomous Legal Aide",
            client: "LexTech",
            problem: "Paralegals spent 40% of their time summarizing redundant case files.",
            approach: "Deployed a secure, on-premise RAG pipeline fine-tuned on legal precedents.",
            outcome: "Automated 85% of summarization tasks, saving the firm approx. $2M annually in billable hours.",
            stack: ["Python", "LangChain", "Pinecone", "React", "Docker"],
            security: "Zero-data retention policy for external queries. PII redaction layer enabled."
        }
    }
    return studies[slug]
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
    const data = getCaseStudy(params.slug)

    // For demo purposes, if slug not found in mock, just show generic
    const study = data || {
        title: "Proprietary Enterprise Solution",
        client: "Confidential Client",
        problem: "Complex operational bottlenecks requiring high-throughput engineering intervention.",
        approach: "Bespoke architecture leveraging best-in-class distributed systems and algorithmic optimization.",
        outcome: "Significant reduction in latency and operational overhead.",
        stack: ["React", "TypeScript", "Go", "Kubernetes"],
        security: "Enterprise-grade encryption and access controls."
    }

    return (
        <article className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <Link href="/work" className="inline-flex items-center text-white/40 hover:text-white mb-12 transition-colors uppercase tracking-widest text-xs font-semibold gap-2">
                    <ArrowLeft size={16} /> Back to Work
                </Link>

                <div className="mb-20">
                    <div className="flex items-center gap-4 text-neon-blue mb-4 font-mono text-sm">
                        <span>{study.client}</span>
                        <span>/</span>
                        <span>2025</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8">
                        {study.title}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="md:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 border-b border-white/10 pb-2">Tech Stack</h3>
                            <ul className="space-y-2 font-mono text-sm text-neon-blue">
                                {study.stack.map((t: string) => <li key={t}>{t}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 border-b border-white/10 pb-2">Security</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {study.security}
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4">The Problem</h2>
                            <p className="text-lg text-white/70 leading-relaxed font-light">
                                {study.problem}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4">Our Approach</h2>
                            <p className="text-lg text-white/70 leading-relaxed font-light">
                                {study.approach}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4">The Outcome</h2>
                            <p className="text-lg text-white/70 leading-relaxed font-light">
                                {study.outcome}
                            </p>
                        </section>
                    </div>
                </div>

            </div>
        </article>
    )
}
