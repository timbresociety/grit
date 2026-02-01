'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WorkPost {
    slug: string
    title: string
    date: string
    tags: string[]
}

export default function Work() {
    const [posts, setPosts] = useState<WorkPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/work')
            .then(res => res.json())
            .then(data => {
                setPosts(data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <section className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 text-white">
                <div className="container mx-auto">
                    <div className="mb-20">
                        <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold">
                            Selected Work
                        </span>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold mt-4 leading-none">
                            Case Studies
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/3] bg-white/5 rounded-lg mb-8" />
                                <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
                                <div className="h-8 bg-white/5 rounded w-2/3 mb-2" />
                                <div className="h-4 bg-white/5 rounded w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 text-white">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold">
                        Selected Work
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold mt-4 leading-none">
                        Case Studies
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {posts.map((post, i) => (
                        <Link href={`/work/${post.slug}`} key={post.slug} className="group block relative">
                            {/* Image Placeholder with Mask Reveal */}
                            <div className="relative aspect-[4/3] bg-white/5 border border-white/10 overflow-hidden mb-8 rounded-lg">
                                <div className="absolute inset-0 bg-neutral-900 group-hover:bg-neutral-800 transition-colors duration-500"></div>

                                {/* Placeholder Content */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-9xl font-serif font-bold opacity-20 group-hover:scale-110 transition-transform duration-700">
                                    {i + 1}
                                </div>

                                {/* Mask Overlay */}
                                <div className="absolute inset-0 bg-neon-blue mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-3 mb-3 flex-wrap">
                                        {post.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs font-mono text-neon-blue border border-neon-blue/30 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 group-hover:text-neon-blue transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    {post.date && (
                                        <p className="text-white/40 text-sm font-mono">
                                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                        </p>
                                    )}
                                </div>
                                <ArrowUpRight className="text-white/20 group-hover:text-neon-blue transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 flex-shrink-0 ml-4" size={32} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
