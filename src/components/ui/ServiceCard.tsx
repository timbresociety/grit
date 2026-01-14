"use client"

import { useRef, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import LottieIcon from './LottieIcon'

interface ServiceCardProps {
    title: string
    description: string
    bullets: string[]
    icon: LucideIcon
    lottieIcon?: string
}

export default function ServiceCard({ title, description, bullets, icon: Icon, lottieIcon }: ServiceCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Spotlight Logic
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 })
    const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
    const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    return (
        <div
            className="group relative w-full h-[320px] perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => {
                setIsFlipped(false)
                x.set(0)
                y.set(0)
            }}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden bg-[#0a0a0a] border border-white/10 p-8 flex flex-col justify-between overflow-hidden">
                    {/* Spotlight */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at ${spotlightX.get()} ${spotlightY.get()}, rgba(255,255,255,0.4), transparent 80%)`
                        }}
                    />

                    <div className="text-neon-blue/80">
                        {lottieIcon ? (
                            <LottieIcon src={lottieIcon} className="w-16 h-16" />
                        ) : (
                            <Icon size={48} strokeWidth={1} />
                        )}
                    </div>

                    <div>
                        <div className="w-8 h-[1px] bg-white/20 mb-4"></div>
                        <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider leading-tight">
                            {title}
                        </h3>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0 backface-hidden bg-white text-black p-8 flex flex-col justify-center overflow-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <p className="text-sm font-medium leading-relaxed mb-6 opacity-90">
                        {description}
                    </p>
                    <ul className="space-y-2">
                        {bullets.map((bullet, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                                <span className="w-1.5 h-1.5 bg-neon-blue rounded-full"></span>
                                {bullet}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </div>
    )
}

