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
]

export default function Logos() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })

    return (
        <section className="py-16 md:py-24 bg-background border-t border-b border-border">
            <div className="container-editorial">

                <motion.div
                    ref={containerRef}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    {/* Label */}
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-8 flex items-baseline justify-center gap-2 flex-wrap">
                        Built by <span className="font-imperial text-4xl md:text-5xl px-1 text-accent-jewel">Operators</span> From
                    </h3>

                    {/* Logo Row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 lg:gap-20">
                        {logos.map((logo, i) => (
                            <motion.div
                                key={logo.name}
                                className="relative h-8 md:h-10 w-24 md:w-32 opacity-30 hover:opacity-60 transition-opacity duration-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 0.3, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.name}
                                    fill
                                    className="object-contain grayscale"
                                    sizes="(max-width: 768px) 96px, 128px"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
