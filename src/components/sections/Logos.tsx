"use client"

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

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

export default function Logos() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })

    // Duplicate logos to create a seamless loop
    // We duplicate firmly enough to ensure the track is longer than any reasonable viewport
    const displayLogos = [...logos, ...logos, ...logos]

    return (
        <section className="bg-background border-t border-b border-border overflow-hidden">
            <div className="container-editorial">

                <motion.div
                    ref={containerRef}
                    className="text-center pt-20 md:pt-32 pb-12 md:pb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    {/* Label */}
                    <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-12 flex items-baseline justify-center gap-2 flex-wrap">
                        Built by <span className="font-imperial text-4xl md:text-6xl lg:text-7xl px-1 text-accent-jewel">Operators</span> From
                    </h3>

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
                                {logos.map((logo, i) => (
                                    <LogoItem key={`${logo.name}-${i}-1`} logo={logo} />
                                ))}
                            </motion.div>

                            {/* Track 2 (Duplicate for seamless loop) */}
                            <motion.div
                                className="flex items-center gap-12 md:gap-20 px-6 md:px-10"
                                animate={{ x: ["0%", "-100%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 30
                                }}
                            >
                                {logos.map((logo, i) => (
                                    <LogoItem key={`${logo.name}-${i}-2`} logo={logo} />
                                ))}
                            </motion.div>
                            {/* Track 3 (Duplicate for safety on huge screens) */}
                            <motion.div
                                className="flex items-center gap-12 md:gap-20 px-6 md:px-10"
                                animate={{ x: ["0%", "-100%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 30
                                }}
                            >
                                {logos.map((logo, i) => (
                                    <LogoItem key={`${logo.name}-${i}-3`} logo={logo} />
                                ))}
                            </motion.div>
                        </div>
                    </div>

                </motion.div>

            </div>
        </section>
    )
}

function LogoItem({ logo }: { logo: Logo }) {
    return (
        <div
            className="relative h-10 md:h-12 w-32 md:w-40 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-pointer"
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
