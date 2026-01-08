"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'

export default function Template({ children }: { children: React.ReactNode }) {
    const { setScrollLocked } = useStore()

    useEffect(() => {
        // Unlock scroll on new page mount
        setScrollLocked(false)
        window.scrollTo(0, 0)
    }, [setScrollLocked])

    return (
        <>
            <motion.div
                className="fixed inset-0 z-[100] bg-neon-blue pointer-events-none"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ originY: 0 }}
            />
            <motion.div
                className="fixed inset-0 z-[100] bg-[#050505] pointer-events-none"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{ originY: 0 }}
            />

            {children}
        </>
    )
}
