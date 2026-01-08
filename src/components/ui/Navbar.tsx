"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import MenuOverlay from './MenuOverlay'
import { useStore } from '@/store/useStore'

export default function Navbar() {
    const { isMenuOpen, toggleMenu, closeMenu } = useStore()

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-40 px-6 py-6 flex items-center justify-between mix-blend-exclusion text-white"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: 'circOut' }}
            >
                <Link href="/" className="text-2xl font-bold font-serif tracking-tighter" onClick={closeMenu}>
                    GRIT<span className="text-neon-blue">.</span>
                </Link>

                <button
                    onClick={toggleMenu}
                    className="group flex flex-col items-end gap-1.5 cursor-pointer"
                >
                    <span className="w-8 h-[2px] bg-white group-hover:bg-neon-blue transition-colors duration-300"></span>
                    <span className="w-4 h-[2px] bg-white group-hover:w-8 group-hover:bg-neon-blue transition-all duration-300"></span>
                </button>
            </motion.nav>

            <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />
        </>
    )
}
