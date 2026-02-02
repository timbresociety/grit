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
            <div className="container-editorial flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="GRIT Labs"
                            width={24}
                            height={24}
                            className="brightness-0"
                        />
                        <span className="text-lg font-medium tracking-tight" style={{ fontFamily: 'var(--font-pp-mondwest)' }}>GRIT Labs</span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/work"
                            className="text-sm text-neutral-800 hover:text-black transition-colors bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30"
                        >
                            Work
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <a
                            href="https://calendly.com/gritlabsinit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-neutral-800 hover:text-black transition-colors bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30"
                        >
                            Explore A Build Sprint <ArrowRight size={14} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}
