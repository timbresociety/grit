"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useSectionInView } from '@/components/ui/EditorialLayout'

interface Logo {
    name: string
    src: string
    className?: string
}

const logos: Logo[] = [
    {
        name: "Amazon",
        src: "/partners/amazon_new.png",
        className: "h-10 md:h-14 w-auto brightness-0 invert"
    },
    {
        name: "CRED",
        src: "/partners/cred_new.png",
        className: "h-11 md:h-16 w-auto brightness-0 invert"
    },
    {
        name: "Jio",
        src: "/partners/jio_final.png",
        // Increased height significantly to match visual weight of rectangular logos
        className: "h-14 md:h-20 w-auto invert hover:opacity-100 transition-opacity duration-300"
    },
    {
        name: "Coinshift",
        src: "/partners/coinshift_new.png",
        // Increased height for scaling
        className: "h-13 md:h-18 w-auto brightness-0 invert scale-110"
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
        className="flex items-center gap-12 md:gap-24 px-6 md:px-12 flex-shrink-0"
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
                className="relative flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
                <img
                    src={logo.src}
                    alt={logo.name}
                    // Use the specific className from the logo config
                    className={`object-contain ${logo.className}`}
                    loading="lazy"
                />
            </div>
        ))}
    </motion.div>
)
