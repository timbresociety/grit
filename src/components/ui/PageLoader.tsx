"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useHeroLoading } from '@/contexts/HeroLoadingContext'
import Image from 'next/image'

export default function PageLoader() {
    const { phase, progress } = useHeroLoading()

    // The loader only appears if the app ever re-enters phase 0.
    const isVisible = phase === 0

    // Calculate percentage
    const percentage = Math.round(progress * 100)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />

                    {/* Animated logo */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center gap-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        {/* Logo with pulse animation */}
                        <motion.div
                            className="relative"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Image
                                src="/images/logo.png"
                                alt="GRIT Labs"
                                width={80}
                                height={80}
                                className="brightness-100"
                                priority
                            />

                            {/* Glow effect behind logo */}
                            <motion.div
                                className="absolute inset-0 blur-2xl opacity-40"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}
                                animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>

                        {/* Loading progress bar */}
                        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/80 rounded-full"
                                style={{
                                    width: `${percentage}%`
                                }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Loading percentage */}
                        <motion.p
                            className="text-white/60 text-sm font-mono tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {percentage}%
                        </motion.p>

                        {/* Subtle tagline */}
                        <motion.p
                            className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Loading Experience
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
