"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const chapters = [
    { id: 'hero', label: 'Overview' },
    { id: 'services-blockchain', label: 'Blockchain' },
    { id: 'services-ai', label: 'AI' },
    { id: 'process', label: 'Process' },
    { id: 'work', label: 'Work' },
    { id: 'contact', label: 'Contact' },
]

export default function ChapterNav() {
    const [activeChapter, setActiveChapter] = useState('hero')
    const [isVisible, setIsVisible] = useState(false)
    const navRef = useRef<HTMLElement>(null)

    useEffect(() => {
        // Show nav after scrolling past hero
        const handleScroll = () => {
            setIsVisible(window.scrollY > 200)
        }

        // IntersectionObserver for active chapter detection
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        }

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveChapter(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        // Observe all chapter sections
        chapters.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial check

        return () => {
            observer.disconnect()
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 120 // Account for sticky headers
            const top = element.getBoundingClientRect().top + window.scrollY - offset
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    ref={navRef}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border"
                >
                    <div className="container-editorial">
                        <div
                            className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {chapters.map(({ id, label }) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    className={`
                    relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full
                    transition-all duration-200 snap-start
                    ${activeChapter === id
                                            ? 'text-foreground'
                                            : 'text-muted hover:text-foreground'
                                        }
                  `}
                                >
                                    {activeChapter === id && (
                                        <motion.div
                                            layoutId="chapter-pill"
                                            className="absolute inset-0 bg-foreground/5 border border-border rounded-full"
                                            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                                        />
                                    )}
                                    <span className="relative z-10">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    )
}
