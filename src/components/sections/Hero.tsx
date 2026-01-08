"use client"

import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy Load 3D Scene - Critical for LCP
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
    ssr: false,
    loading: () => null
})

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#050505]">

            {/* Background Ambience (Global) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] z-10"></div>
            </div>

            {/* Left Column: Content */}
            <div className="w-full md:w-1/2 relative z-10 flex items-center justify-center p-6 md:p-12 lg:p-20 pt-32 md:pt-0">
                <motion.div
                    style={{ y, opacity }}
                    className="w-full max-w-xl flex flex-col justify-center items-start text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-mono mb-8 uppercase tracking-wider backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                        </span>
                        System Operational
                    </div>

                    <h1 className="text-4xl md:text-7xl lg:text-[6rem] font-serif font-bold text-white leading-[0.9] tracking-tighter mb-6">
                        ENGINEERED<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            TO ENDURE.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg mb-10 leading-relaxed">
                        We build bespoke AI and Blockchain software for teams that think long term.
                        <br /><span className="text-white">Enterprise grade. Operator led.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a
                            href="https://calendly.com/gritlabsinit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-4 bg-neon-blue text-black font-bold text-sm uppercase tracking-widest overflow-hidden inline-block text-center"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Book a build sprint <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                        </a>
                    </div>

                    <div className="mt-12 flex items-center gap-8 text-xs text-gray-500 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-neon-blue" /> 8–12 week delivery cycles
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-neon-blue" /> Security-first, audit-ready
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: 3D Scene */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative z-10">
                {/* Hint overlay for Mobile */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden z-20 pointer-events-none text-white/30 text-xs uppercase tracking-widest animate-pulse">
                    Tap bust to inspect
                </div>

                <Suspense fallback={null}>
                    <HeroScene />
                </Suspense>
            </div>

        </section>
    )
}
