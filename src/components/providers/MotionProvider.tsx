"use client"

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useStore } from '@/store/useStore'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register globally once
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function MotionProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)
    const pathname = usePathname()
    const rafId = useRef<number | null>(null)

    const {
        isScrollLocked,
        setScrollLocked,
        isSmoothScrollEnabled,
        setActiveSection,
        isMenuOpen
    } = useStore()

    // 1. Initialize Lenis (Single Instance)
    useEffect(() => {
        // Destroy existing if re-initializing
        if (lenisRef.current) lenisRef.current.destroy()

        if (!isSmoothScrollEnabled) {
            document.documentElement.style.scrollBehavior = 'auto'
            return
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        // Sync Lenis scroll with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update)

        // Add to GSAP Ticker for perfect sync
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        // Critical: Disable GSAP lag smoothing to prevent stutter with Lenis
        gsap.ticker.lagSmoothing(0)

        // Loop for manual RAF if needed, but GSAP ticker usually handles it
        // keeping this as backup/alternative if GSAP sync fails, but for now relying on GSAP ticker
        // const animate = (time: number) => {
        //   lenis.raf(time)
        //   rafId.current = requestAnimationFrame(animate)
        // }
        // rafId.current = requestAnimationFrame(animate)

        return () => {
            lenis.destroy()
            lenisRef.current = null
            gsap.ticker.remove(lenis.raf)
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [isSmoothScrollEnabled])

    // 2. Handle Scroll Locking (Centralized)
    useEffect(() => {
        const locked = isScrollLocked || isMenuOpen
        const lenis = lenisRef.current

        if (locked) {
            if (lenis) lenis.stop()
            document.body.style.overflow = 'hidden'
            // Prevent width jump by adding padding-right if needed, but 'overflow: hidden' usually suffices
        } else {
            if (lenis) lenis.start()
            document.body.style.overflow = ''
        }

        return () => {
            // Safety cleanup
            document.body.style.overflow = ''
            if (lenis) lenis.start()
        }
    }, [isScrollLocked, isMenuOpen])

    // 3. Global Unlock Triggers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setScrollLocked(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setScrollLocked])

    // 4. Route Change Handling
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true })
        } else {
            window.scrollTo(0, 0)
        }

        setScrollLocked(false)

        // Give heavy assets a moment to settle, then refresh ST
        const timer = setTimeout(() => {
            ScrollTrigger.refresh()
        }, 100)

        return () => clearTimeout(timer)
    }, [pathname, setScrollLocked])

    // 5. Section Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { threshold: 0.5 }
        )

        const sections = document.querySelectorAll('section[id]')
        sections.forEach((section) => observer.observe(section))

        return () => {
            sections.forEach((section) => observer.unobserve(section))
        }
    }, [pathname, setActiveSection])

    return <>{children}</>
}
