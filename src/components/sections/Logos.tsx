"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useSectionInView } from '@/components/ui/EditorialLayout'

interface Logo {
    name: string
    src: string
    className?: string
}

// Per-logo sizing — tuned so all logos appear visually equal.
// Amazon is naturally wide, so it's the baseline. Others are scaled up to match.
const logos: Logo[] = [
    {
        name: "Amazon",
        src: "/partners/amazon_new.png",
        className: "h-10 md:h-14",  // Baseline reference
    },
    {
        name: "CRED",
        src: "/partners/cred_new.png",
        className: "h-14 md:h-20",  // Taller PNG ratio + padding — scale up to match Amazon
    },
    {
        name: "Jio",
        src: "/partners/jio_final.png",
        className: "h-16 md:h-24",  // Square PNG with circular logo — needs more height
    },
    {
        name: "Coinshift",
        src: "/partners/coinshift_new.png",
        className: "h-14 md:h-20",  // Internal padding compensation
    },
]

export default function Logos() {
    const sectionRef = useSectionInView('logos')
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" })

    // Create a dense enough array to ensure loop smoothness
    const displayLogos = [...logos, ...logos, ...logos, ...logos]

    return (
        <section
            ref={sectionRef}
            className="editorial-section h-full flex items-center justify-center overflow-visible py-20 md:py-32"
        >
            <div className="w-full">

                {/* Header */}
                <motion.div
                    ref={containerRef}
                    className="text-center mb-8 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-block glass-panel-dark px-8 py-6 md:px-12 md:py-8">
                        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-4">
                            Built by <span className="font-imperial text-5xl md:text-7xl lg:text-8xl text-accent-warm">Operators</span> From
                        </h2>
                    </div>
                </motion.div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden">
                    <div className="flex w-max">
                        <MarqueeTrack logos={displayLogos} />
                        <MarqueeTrack logos={displayLogos} />
                    </div>
                </div>
            </div>
        </section>
    )
}

const MarqueeTrack = ({ logos }: { logos: Logo[] }) => (
    <motion.div
        className="flex items-center gap-8 md:gap-16 px-4 md:px-8 flex-shrink-0"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 50,
        }}
    >
        {logos.map((logo, idx) => (
            <div
                key={`${logo.name}-${idx}`}
                className="relative flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
            >
                <img
                    src={logo.src}
                    alt={logo.name}
                    className={`object-contain ${logo.className || 'h-10 md:h-14'} w-auto`}
                    style={{
                        filter: `
                            brightness(0) invert(1)
                            drop-shadow(0 0 4px rgba(0,0,0,0.35))
                            drop-shadow(0 0 8px rgba(0,0,0,0.2))
                            drop-shadow(0 0 16px rgba(0,0,0,0.1))
                        `.trim(),
                    }}
                    loading="lazy"
                />
            </div>
        ))}
    </motion.div>
)
