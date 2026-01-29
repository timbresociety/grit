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
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex flex-col gap-3">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`group flex items-center gap-3 transition-all duration-300 ${activeSection === section.id
                                ? 'opacity-100'
                                : 'opacity-40 hover:opacity-70'
                            }`}
                    >
                        {/* Roman numeral */}
                        <span className="text-xs font-serif text-white/80 w-6 text-right">
                            {section.numeral}
                        </span>
                        {/* Indicator line */}
                        <motion.div
                            className="h-px bg-white"
                            animate={{
                                width: activeSection === section.id ? 24 : 12,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        {/* Label - visible on hover or when active */}
                        <span
                            className={`text-xs uppercase tracking-wider text-white transition-opacity duration-300 ${activeSection === section.id
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
