"use client"

import { ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import ScrollVideoBackground from './ScrollVideoBackground'
import { useHeroLoading } from '@/contexts/HeroLoadingContext'

// Section configuration
const SECTIONS = [
    { id: 'hero', label: 'Intro', numeral: 'I' },
    { id: 'services', label: 'Services', numeral: 'II' },
    { id: 'logos', label: 'Team', numeral: 'III' },
    { id: 'process', label: 'Process', numeral: 'IV' },
    { id: 'work', label: 'Work', numeral: 'V' },
    { id: 'contact', label: 'Contact', numeral: 'VI' },
]

// Context for tracking active section
const ActiveSectionContext = createContext<{
    activeSection: string
    setActiveSection: (id: string) => void
}>({
    activeSection: 'hero',
    setActiveSection: () => { },
})

export function useActiveSection() {
    return useContext(ActiveSectionContext)
}

// Hook for sections to register themselves as active when in view
export function useSectionInView(sectionId: string) {
    const ref = useRef<HTMLElement>(null)
    const { setActiveSection } = useActiveSection()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                        setActiveSection(sectionId)
                    }
                })
            },
            { threshold: 0.3 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [sectionId, setActiveSection])

    return ref
}

interface EditorialLayoutProps {
    children: ReactNode
}

export default function EditorialLayout({ children }: EditorialLayoutProps) {
    const [activeSection, setActiveSection] = useState('hero')
    const { isComplete } = useHeroLoading()

    // Block scroll during loading
    useEffect(() => {
        if (!isComplete) {
            // Prevent scrolling during load
            document.body.style.overflow = 'hidden'
            document.body.style.height = '100vh'
        } else {
            // Re-enable scrolling after load
            document.body.style.overflow = ''
            document.body.style.height = ''
        }

        return () => {
            // Cleanup on unmount
            document.body.style.overflow = ''
            document.body.style.height = ''
        }
    }, [isComplete])

    return (
        <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
            {/* Fixed video/image background */}
            <ScrollVideoBackground />

            {/* Main content - flows over the background */}
            <main className="relative z-10">
                {children}
            </main>
        </ActiveSectionContext.Provider>
    )
}
