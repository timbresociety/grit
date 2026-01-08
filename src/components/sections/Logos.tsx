"use client"

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const logos = [
    { name: "Amazon", label: "AMAZON" },
    { name: "CRED", label: "CRED" },
    { name: "Jio", label: "JIO" },
    { name: "Coinshift", label: "COINSHIFT" },
    { name: "Polygon", label: "POLYGON" },
]

function LogoCard({ label }: { label: string }) {
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
            className="relative group w-[160px] h-[100px] md:w-[200px] md:h-[120px] flex items-center justify-center bg-white/5 border border-white/10 rounded-xl cursor-default perspective-1000"
        >
            {/* Spotlight Overlay */}
            <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${spotlightX.get()} ${spotlightY.get()}, rgba(255,255,255,0.1), transparent 80%)`
                }}
            />

            {/* Logo Check/Text */}
            <span className="text-xl md:text-2xl font-bold tracking-widest text-white/40 group-hover:text-white transition-colors duration-300 font-serif">
                {label}
            </span>
        </motion.div>
    )
}

export default function Logos() {
    return (
        <section className="py-24 bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-6 mb-12 text-center md:text-left">
                <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold">
                    Trusted Partners
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white mt-2">
                    Built by engineering operators from
                </h2>
            </div>

            {/* Mobile: Grid Layout */}
            <div className="md:hidden grid grid-cols-2 gap-4 px-6">
                {logos.map((logo) => (
                    <div key={logo.name} className="flex justify-center">
                        <LogoCard label={logo.label} />
                    </div>
                ))}
                {/* Add one more if odd number or just center last? Let's assume 5 items -> 3 rows */}
            </div>

            {/* Desktop: Infinite Marquee */}
            <div className="hidden md:flex relative w-full overflow-hidden mask-gradient-x">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

                <motion.div
                    className="flex gap-8 px-4"
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
                        <LogoCard key={`${logo.name}-${i}`} label={logo.label} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
