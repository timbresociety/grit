"use client"

import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy Load 3D Scene - Critical for LCP
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-neutral-900/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
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
        <section ref={containerRef} className="relative min-h-screen flex flex-col pt-32 md:pt-0 md:justify-center overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[#050505] z-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                {/* Static Poster for LCP - this div acts as the immediate visual before 3D loads */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] z-10"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col md:flex-row items-center">

                {/* Left Column: Content */}
                <motion.div
                    style={{ y, opacity }}
                    className="w-full md:w-1/2 flex flex-col justify-center items-start text-left mb-12 md:mb-0"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-mono mb-8 uppercase tracking-wider backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                        </span>
                        System Operational
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-bold text-white leading-[0.9] tracking-tighter mb-6">
                        PRECISION<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            ENGINEERED.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg mb-10 leading-relaxed">
                        Bespoke AI + Blockchain infrastructure. <br />
                        Built by senior operators for enterprise scale.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="group relative px-8 py-4 bg-neon-blue text-black font-bold text-sm uppercase tracking-widest overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Book a build sprint <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                        </button>

                        <button className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-colors">
                            See capabilities
                        </button>
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

                {/* Right Column: 3D Scene */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative md:absolute md:right-0 md:top-0">
                    {/* Hint overlay for Mobile */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden z-20 pointer-events-none text-white/30 text-xs uppercase tracking-widest animate-pulse">
                        Tap bust to inspect
                    </div>

                    <Suspense fallback={null}>
                        <HeroScene />
                    </Suspense>
                </div>

            </div>
        </section>
    )
}
