"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Navbar() {
    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-40 py-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="container-editorial flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="font-serif text-xl font-medium tracking-tight hover:opacity-70 transition-opacity bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30"
                >
                    Grit Labs
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/work"
                        className="text-sm text-neutral-800 hover:text-black transition-colors bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30"
                    >
                        Work
                    </Link>
                    <a
                        href="https://calendly.com/gritlabsinit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-2.5 px-5"
                    >
                        Start a Project <ArrowRight size={14} />
                    </a>
                </div>
            </div>
        </motion.nav>
    )
}
