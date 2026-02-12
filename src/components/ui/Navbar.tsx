"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useHeroLoading } from '@/contexts/HeroLoadingContext'

export default function Navbar() {
    const { phase } = useHeroLoading()

    // Only show navbar after phase 3
    const showNavbar = phase >= 3

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-40 py-4"
            initial={{ y: -100, opacity: 0 }}
            animate={showNavbar ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Invisible mask area - prevents content from appearing in this zone */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.8) 60%, transparent 100%)'
                }}
            />

            <div className="container-editorial relative flex items-center justify-between">
                {/* Logo Button - Floating */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-neutral-900/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="GRIT Labs"
                            width={22}
                            height={22}
                            className="brightness-0 invert"
                        />
                        <span className="text-base font-medium tracking-tight text-white" style={{ fontFamily: 'var(--font-pp-mondwest)' }}>GRIT Labs</span>
                    </Link>
                </motion.div>

                {/* Navigation buttons container */}
                <div className="flex items-center gap-3">
                    {/* Explore Work Button - Hidden on mobile */}
                    <motion.div
                        className="hidden md:block"
                        initial={{ opacity: 0, y: -20 }}
                        animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-1.5 text-sm text-white hover:opacity-80 transition-opacity bg-neutral-900/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10"
                        >
                            Explore Work <ArrowRight size={14} />
                        </Link>
                    </motion.div>

                    {/* Start Your Sprint Button - Always visible */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="#contact"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:opacity-90 transition-all bg-black/70 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20"
                        >
                            Start Your Sprint <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}
