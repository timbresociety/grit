"use client"

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Shield, Sparkles } from 'lucide-react'
import { useSectionInView } from '@/components/ui/EditorialLayout'
import { SECTION_FRAME_MAP, TOTAL_FRAMES } from '@/components/ui/ScrollVideoBackground'

const highlights = [
    { icon: Clock, text: '8–12 week cycles' },
    { icon: Shield, text: 'Security-first' },
    { icon: Sparkles, text: 'Audit-ready' },
]

export default function Hero() {
    const sectionRef = useSectionInView('hero')
    const prefersReducedMotion = useReducedMotion()
    const [isLoaded, setIsLoaded] = useState(false)

    // Simulate loading delay for fade-in effect
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 300)
        return () => clearTimeout(timer)
    }, [])

    const [windowHeight, setWindowHeight] = useState(0)

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight)
        requestAnimationFrame(() => handleResize())
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Strict Sync: Use Global Scroll Progress
    const { scrollYProgress: globalScroll } = useScroll()

    // Normalized start/end points (0 to 1)
    const endPoint = SECTION_FRAME_MAP.hero.end / TOTAL_FRAMES

    const sectionOpacity = useTransform(
        globalScroll,
        [0, endPoint - 0.05, endPoint], // Fade out in last 5% of duration
        [1, 1, 0]
    )

    const containerRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"])

    return (
        <motion.section
            ref={(el) => {
                // TypeScript workaround to assign to both refs
                if (sectionRef) (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el
                if (containerRef) (containerRef as React.MutableRefObject<HTMLElement | null>).current = el
            }}
            className="editorial-section relative min-h-screen flex items-center overflow-hidden"
            style={{ opacity: sectionOpacity }}
        >
            {/* Main Content - Centered, overlays the scroll background */}
            <div className="relative z-10 container-editorial w-full">
                <div className="flex flex-col items-center justify-center min-h-screen py-24">

                    {/* Copy & CTA */}
                    <motion.div
                        className="max-w-2xl text-center"
                        style={{
                            opacity: prefersReducedMotion ? 1 : contentOpacity,
                            y: prefersReducedMotion ? 0 : contentY
                        }}
                    >
                        {/* Main Headline - Glass panel with text reveal */}
                        <motion.div
                            className="glass-panel-dark p-6 md:p-8 mb-6 overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1
                                className="text-white"
                                style={{
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                <span className="inline-block overflow-hidden">
                                    <motion.span
                                        className="inline-block font-imperial text-accent-warm"
                                        style={{ paddingRight: '0.2em' }}
                                        initial={{ y: '100%', opacity: 0 }}
                                        animate={isLoaded ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        Engineered
                                    </motion.span>
                                </span>
                                <br />
                                <span className="inline-block overflow-hidden">
                                    <motion.span
                                        className="inline-block"
                                        style={{ fontFamily: 'var(--font-serif)' }}
                                        initial={{ y: '100%', opacity: 0 }}
                                        animate={isLoaded ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        to Endure.
                                    </motion.span>
                                </span>
                            </h1>
                        </motion.div>

                        {/* Glass Panel for subhead, buttons, highlights */}
                        <motion.div
                            className="glass-panel-dark p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Subhead */}
                            <p className="text-base md:text-lg text-white/80 max-w-xl leading-relaxed mb-6">
                                We build bespoke AI and Blockchain software for teams that think long term.
                                <span
                                    className="font-medium block mt-2 text-white text-xl md:text-2xl"
                                    style={{ fontFamily: 'var(--font-serif)' }}
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
                                    Explore A Build Sprint <ArrowRight size={16} />
                                </a>
                                <a
                                    href="#services"
                                    className="btn-secondary"
                                >
                                    Explore Capabilities
                                </a>
                            </div>

                            {/* Highlights */}
                            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/20">
                                {highlights.map(({ icon: Icon, text }) => (
                                    <div
                                        key={text}
                                        className="flex items-center gap-2 text-sm text-white/70"
                                    >
                                        <Icon size={14} className="text-white/60" />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>


        </motion.section>
    )
}
