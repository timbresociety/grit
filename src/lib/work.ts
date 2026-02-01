export interface WorkPost {
  slug: string
  title: string
  date: string
  status: string
  tags: string[]
  industry?: string
  domain?: string
  tech?: string
}

// Frontmatter data extracted from MDX files
// This avoids dynamic import issues in API routes
const workPosts: WorkPost[] = [
  {
    slug: "crypto-pricing",
    title: "Accurate Multi-Source Crypto Pricing Infrastructure for Accounting and Financial Reporting",
    date: "2026-01-31",
    status: "published",
    tags: ["crypto-pricing", "accounting", "market-data", "financial-infra", "reconciliation", "audit"]
  },
  {
    slug: "multi-chain-treasury",
    title: "Multi-Chain Treasury Infrastructure for Crypto Organizations",
    date: "2026-01-31",
    status: "published",
    tags: ["crypto", "treasury", "multi-chain", "evm", "fintech", "distributed-systems"]
  },
  {
    slug: "smart-wallet",
    title: "Smart Wallet Infrastructure with Gas Abstraction and Passwordless Authentication",
    date: "2026-01-31",
    status: "published",
    tags: ["smart-wallet", "account-abstraction", "web3-ux", "crypto-infra", "authentication", "gas-abstraction"]
  },
  {
    slug: "knowledge-isolation",
    title: "Architecture-Driven Multi-Tenant Knowledge Isolation for Sensitive Programs",
    date: "2025-12-16",
    status: "published",
    tags: ["multi-tenant", "secure-architecture", "rag", "data-isolation", "enterprise-ai"],
    industry: "defense / aerospace / enterprise",
    domain: "secure data architecture",
    tech: "vector db isolation, namespace security, hybrid indexing"
  },
  {
    slug: "hybrid-retrieval",
    title: "Hybrid Retrieval Architecture for High-Accuracy Technical Documentation AI",
    date: "2025-12-16",
    status: "published",
    tags: ["rag", "hybrid-retrieval", "vector-search", "knowledge-graphs", "technical-ai"],
    industry: "aerospace / manufacturing / industrial",
    domain: "technical document intelligence",
    tech: "embeddings, bm25, knowledge graph retrieval, reranking"
  },
  {
    slug: "offline-document-ai",
    title: "Offline Secure Document Intelligence Platform for Air-Gapped Environments",
    date: "2025-12-16",
    status: "published",
    tags: ["offline-ai", "rag", "secure-ai", "defense", "airgapped", "document-intelligence"],
    industry: "defense / aerospace / regulated industries",
    domain: "secure AI infrastructure",
    tech: "local llm, vector db, hybrid retrieval, microservices"
  }
]

export function getWorkSlugs(): string[] {
  return workPosts.map(p => p.slug)
}

export function getAllWorkPosts(): WorkPost[] {
  // Sort by date descending
  return [...workPosts]
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getWorkPostBySlug(slug: string): WorkPost | null {
  return workPosts.find(p => p.slug === slug) || null
}
