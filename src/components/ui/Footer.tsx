"use client"

import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

export default function Footer() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    })
    const y = useTransform(scrollYProgress, [0, 1], [-100, 0])

    return (
        <footer ref={container} className="bg-[#050505] text-white py-12 border-t border-white/10 relative overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                <div className="md:w-1/3">
                    <h3 className="font-serif font-bold text-2xl mb-2">GRIT LABS</h3>
                    <p className="text-white/40 text-sm">
                        Built by builders, for builders. <br />
                        Precision engineering for the decentralized era.
                    </p>
                </div>

                <div className="md:w-1/3 flex justify-center gap-8 text-sm font-mono uppercase tracking-widest text-white/60">
                    <a href="#" className="hover:text-neon-blue transition-colors">Twitter</a>
                    <a href="#" className="hover:text-neon-blue transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-neon-blue transition-colors">Github</a>
                </div>

                <div className="md:w-1/3 flex flex-col items-end gap-2">
                    <a href="mailto:hello@grit.cool" className="text-lg hover:text-neon-blue transition-colors">hello@grit.cool</a>
                    <div className="text-xs text-white/30">© 2026 Grit Labs Inc.</div>
                </div>

            </div>

            {/* Background Text */}
            <div className="absolute bottom-[-10%] left-0 w-full text-center pointer-events-none select-none overflow-hidden">
                <motion.h1 style={{ y }} className="text-[15vw] font-bold text-white/5 leading-none">
                    GRIT LABS
                </motion.h1>
            </div>
        </footer>
    )
}
