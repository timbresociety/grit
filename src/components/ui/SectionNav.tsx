"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Section {
    id: string
    label: string
    numeral: string
}

interface SectionNavProps {
    sections: Section[]
    activeSection: string
}

export default function SectionNav({ sections, activeSection }: SectionNavProps) {
    return (
        <motion.nav
            className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden lg:block pointer-events-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-sm rounded-lg p-2">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`pointer-events-auto group flex items-center gap-2 px-2 py-1.5 rounded transition-all duration-300 ${activeSection === section.id
                            ? 'opacity-100 bg-white/10'
                            : 'opacity-50 hover:opacity-80 hover:bg-white/5'
                            }`}
                    >
                        {/* Roman numeral */}
                        <span className="text-[10px] font-serif text-white/80 w-4 text-right">
                            {section.numeral}
                        </span>
                        {/* Indicator line */}
                        <motion.div
                            className="h-px bg-white/60"
                            animate={{
                                width: activeSection === section.id ? 16 : 8,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        {/* Label - visible on hover or when active */}
                        <span
                            className={`text-[10px] uppercase tracking-wider text-white transition-opacity duration-300 ${activeSection === section.id
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
                                }`}
                        >
                            {section.label}
                        </span>
                    </a>
                ))}
            </div>
        </motion.nav>
    )
}
