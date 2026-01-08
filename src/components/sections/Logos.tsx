"use client"

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Logo {
    name: string;
    src: string;
    className?: string;
}

const logos: Logo[] = [
    { name: "Amazon", src: "/partners/amazon_v3.png", className: "opacity-50 group-hover:opacity-100 mix-blend-screen grayscale contrast-150" },
    { name: "CRED", src: "/partners/cred.png" },
    { name: "Jio", src: "/partners/jio.png" },
    { name: "Coinshift", src: "/partners/coinshift.png" },
]

function LogoCard({ src, name, className }: { src: string, name: string, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    // Mouse position state
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Smooth spring animation for tilt
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 })

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["-15deg", "15deg"])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"])

    // Spotlight gradient position
    const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
    const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()

        // Normalized coordinates (-0.5 to 0.5)
        const width = rect.width
        const height = rect.height

        const normalizedX = (e.clientX - rect.left) / width - 0.5
        const normalizedY = (e.clientY - rect.top) / height - 0.5

        x.set(normalizedX)
        y.set(normalizedY)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    // Default: handle white backgrounds (grayscale invert mix-blend-screen)
    // Amazon override: handle black background (mix-blend-screen grayscale contrast-200)
    const imageClasses = className || "opacity-50 group-hover:opacity-100 grayscale invert mix-blend-screen"

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            className="relative group w-[160px] h-[100px] md:w-[200px] md:h-[120px] flex items-center justify-center bg-white/5 border border-white/10 rounded-xl cursor-default perspective-1000 p-6"
        >
            {/* Spotlight Overlay */}
            <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${spotlightX.get()} ${spotlightY.get()}, rgba(255,255,255,0.1), transparent 80%)`
                }}
            />

            {/* Logo Image */}
            <div className="relative w-full h-full flex items-center justify-center">
                <Image
                    src={src}
                    alt={name}
                    fill
                    className={cn("object-contain transition-all duration-300", imageClasses)}
                />
            </div>
        </motion.div>
    )
}

export default function Logos() {
    return (
        <section className="py-12 md:py-24 bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-6 mb-12 text-center md:text-left">
                <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold">
                    Trusted Partners
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white mt-2">
                    Built by engineering operators from
                </h2>
            </div>

            {/* Infinite Marquee (Mobile & Desktop) */}
            <div className="flex relative w-full overflow-hidden mask-gradient-x">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

                <motion.div
                    className="flex gap-4 md:gap-8 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                    style={{ width: "fit-content" }}
                >
                    {/* Double the list for seamless loop */}
                    {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
                        <LogoCard key={`${logo.name}-${i}`} src={logo.src} name={logo.name} className={logo.className} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
