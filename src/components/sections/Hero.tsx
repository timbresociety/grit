"use client"

import { useRef, useState, useCallback, Suspense, ComponentType } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Shield, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useHeroMouseTracker } from '@/hooks/useHeroMouseTracker'
import { useHeroLoading } from '@/contexts/HeroLoadingContext'

// HeroScene props type
interface HeroSceneProps {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
    isHovering: boolean
    loadingPhase?: number
    loadingProgress?: number
}

// Lazy Load 3D Background Scene with proper typing
const HeroScene = dynamic<HeroSceneProps>(
    () => import('@/components/3d/HeroScene').then(mod => mod.default as ComponentType<HeroSceneProps>),
    {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 bg-black" />
        )
    }
)

const highlights = [
    { icon: Clock, text: '8–12 week cycles' },
    { icon: Shield, text: 'Security-first' },
    { icon: Sparkles, text: 'Audit-ready' },
]

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()

    // Track if cursor is over a glass panel (text frame)
    const [isOverPanel, setIsOverPanel] = useState(false)

    // Mouse tracker for reveal effect
    const { mouseRef, isHovering } = useHeroMouseTracker(containerRef)

    // Loading state
    const { phase, progress, isComplete } = useHeroLoading()

    // Reveal should be active only when hovering AND not over a panel
    const isRevealActive = isHovering && !isOverPanel

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"])

    // Panel hover handlers
    const handlePanelEnter = useCallback(() => setIsOverPanel(true), [])
    const handlePanelLeave = useCallback(() => setIsOverPanel(false), [])

    // UI should only show after phase 3
    const showUI = phase >= 3

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-black"
            style={{ cursor: isOverPanel ? 'auto' : 'none' }}
        >
            {/* WebGL Background with Reveal Effect */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: prefersReducedMotion ? 0 : backgroundY }}
            >
                <HeroScene
                    mouseRef={mouseRef}
                    isHovering={isRevealActive}
                    loadingPhase={phase}
                    loadingProgress={progress}
                />
                {/* Bottom fade - only show after loading */}
                {showUI && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                )}
            </motion.div>

            {/* Main Content - Centered */}
            <div className="relative z-10 container-editorial w-full pointer-events-none">
                <div className="flex flex-col items-center justify-center min-h-screen py-24">

                    {/* Copy & CTA */}
                    <motion.div
                        className="max-w-2xl pointer-events-auto text-center"
                        style={{
                            opacity: prefersReducedMotion ? 1 : contentOpacity,
                            y: prefersReducedMotion ? 0 : contentY
                        }}
                    >
                        {/* Main Headline - Glass panel with hover detection */}
                        <motion.div
                            className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 mb-6 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                            initial={{ opacity: 0, y: 30 }}
                            animate={showUI ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            onMouseEnter={handlePanelEnter}
                            onMouseLeave={handlePanelLeave}
                        >
                            <h1
                                className="text-black"
                                style={{
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-imperial)', paddingRight: '0.2em' }}>Engineered</span><br />
                                <span style={{ fontFamily: 'var(--font-serif)' }}>to Endure.</span>
                            </h1>
                        </motion.div>

                        {/* Glass Panel for subhead, buttons, highlights - with hover detection */}
                        <motion.div
                            className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={showUI ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            onMouseEnter={handlePanelEnter}
                            onMouseLeave={handlePanelLeave}
                        >
                            {/* Subhead */}
                            <p className="text-base md:text-lg text-neutral-800 max-w-xl leading-relaxed mb-6">
                                We build bespoke AI and Blockchain software for teams that think long term.
                                <span
                                    className="font-medium block mt-2"
                                    style={{ fontFamily: 'var(--font-serif)', color: '#1A1A1A' }}
                                > Enterprise grade. Operator led.</span>
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                                <a
                                    href="https://calendly.com/gritlabsinit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    Book a Build Sprint <ArrowRight size={16} />
                                </a>
                                <a
                                    href="#services-blockchain"
                                    className="btn-secondary"
                                >
                                    Explore Capabilities
                                </a>
                            </div>

                            {/* Highlights */}
                            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-neutral-300/50">
                                {highlights.map(({ icon: Icon, text }) => (
                                    <div
                                        key={text}
                                        className="flex items-center gap-2 text-sm text-neutral-700"
                                    >
                                        <Icon size={14} className="text-neutral-800" />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>

            {/* Bottom Gradient Fade - only show after loading */}
            {
                showUI && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
                )
            }
        </section >
    )
}
