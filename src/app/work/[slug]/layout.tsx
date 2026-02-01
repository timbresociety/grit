import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <article className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/work"
          className="inline-flex items-center text-white/40 hover:text-white mb-12 transition-colors uppercase tracking-widest text-xs font-semibold gap-2"
        >
          <ArrowLeft size={16} /> Back to Work
        </Link>

        <div className="prose-editorial">
          {children}
        </div>
      </div>
    </article>
  )
}
