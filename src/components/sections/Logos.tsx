"use client"

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { SECTION_FRAME_MAP, TOTAL_FRAMES } from '@/components/ui/ScrollVideoBackground'

interface Logo {
    name: string
    src: string
}

const logos: Logo[] = [
    { name: "Amazon", src: "/partners/amazon_v3.png" },
    { name: "CRED", src: "/partners/cred.png" },
    { name: "Jio", src: "/partners/jio.png" },
    { name: "Coinshift", src: "/partners/coinshift.png" },
    // Duplicate for variety if needed, or just rely on track duplication
]

import { useSectionInView } from '@/components/ui/EditorialLayout'

export default function Logos() {
    const sectionRef = useSectionInView('logos')
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })

    // Strict Sync: Use Global Scroll Progress
    const { scrollYProgress: globalScroll } = useScroll()

    // Normalized start/end points (0 to 1)
    const startPoint = SECTION_FRAME_MAP.operator.start / TOTAL_FRAMES
    const endPoint = SECTION_FRAME_MAP.operator.end / TOTAL_FRAMES

    const sectionOpacity = useTransform(
        globalScroll,
        [startPoint - 0.02, startPoint, endPoint, endPoint + 0.02],
        [0, 1, 1, 0]
    )

    // Duplicate logos to create a seamless loop
    // We duplicate firmly enough to ensure the track is longer than any reasonable viewport
    const displayLogos = [...logos, ...logos, ...logos]

    return (
        <motion.section
            ref={sectionRef}
            className="editorial-section min-h-screen flex items-center overflow-hidden"
            style={{ opacity: sectionOpacity }}
        >
            <div className="container-editorial w-full">

                <motion.div
                    ref={containerRef}
                    className="text-center py-20 md:py-32"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    {/* Label - wrapped in glass panel */}
                    <div className="glass-panel-dark px-8 py-6 md:px-12 md:py-8 inline-block mb-12">
                        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white flex items-baseline justify-center gap-2 flex-wrap">
                            Built by <span className="font-imperial text-4xl md:text-6xl lg:text-7xl px-1 text-accent-warm">Operators</span> From
                        </h3>
                    </div>

                    {/* Infinite Carousel Container */}
                    <div
                        className="relative w-full max-w-[100vw] overflow-hidden"
                        style={{
                            // Gradient Mask for "Fade Out" effect at edges
                            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        }}
                    >
                        {/* 
                           Animated Track 
                           We animate x from 0 to -50% (if we have 2 sets) or similar.
                           To be perfectly smooth, we generally slide by -100% of ONE set length, then reset.
                           Since we just flattened the array, let's trust Framer's simplicity:
                           We put two identical "tracks" side by side and move validly.
                        */}
                        <div className="flex w-max">
                            {/* Track 1 */}
                            <motion.div
                                className="flex items-center gap-12 md:gap-20 px-6 md:px-10"
                                animate={{ x: ["0%", "-100%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 30 // Reduced speed for elegance
                                }}
                            >
                                {displayLogos.map((logo, i) => (
                                    <LogoItem key={`${logo.name}-${i}-1`} logo={logo} />
                                ))}
                            </motion.div>
                            {/* Track 2 (Duplicate) for seamless loop */}
                            <motion.div
                                className="flex items-center gap-12 md:gap-20 px-6 md:px-10"
                                animate={{ x: ["0%", "-100%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 30 // Must match above
                                }}
                            >
                                {displayLogos.map((logo, i) => (
                                    <LogoItem key={`${logo.name}-${i}-2`} logo={logo} />
                                ))}
                            </motion.div>
                        </div>
                    </div>

                </motion.div>

            </div>
        </motion.section>
    )
}

function LogoItem({ logo }: { logo: Logo }) {
    return (
        <div
            className="relative h-10 md:h-12 w-32 md:w-40 opacity-80 hover:opacity-100 transition-all duration-300 brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer mix-blend-screen"
        >
            <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 160px"
            />
        </div>
    )
}
