"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useFocusTrap } from '@/hooks/useFocusTrap' // Using our custom hook
import { useStore } from '@/store/useStore'

const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Process", href: "/#process" },
    { label: "Contact", href: "mailto:timbre@grit.cool" },
]

export default function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const containerRef = useFocusTrap(isOpen)
    const overlayRef = useRef<HTMLDivElement>(null)
    const navContainerRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)

    const { isReducedMotion } = useStore()

    useGSAP(() => {
        const tl = gsap.timeline({ paused: true })

        // Initial setup
        gsap.set(overlayRef.current, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            pointerEvents: "none",
            visibility: "hidden"
        })

        // Animation Definition
        tl.to(overlayRef.current, {
            duration: isReducedMotion ? 0.3 : 0.8,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power4.inOut",
            visibility: "visible",
            pointerEvents: "auto"
        })
            .from(bgRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.5")
            .from(".nav-item", {
                y: 100,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.2")

        if (isOpen) {
            tl.play()
        } else {
            tl.reverse()
        }

    }, [isOpen, isReducedMotion])

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    return (
        <div
            ref={containerRef}
            aria-hidden={!isOpen}
            className="fixed inset-0 z-50 pointer-events-none"
        >
            {/* Main Overlay Container with Clip Path */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-[#050505] overflow-hidden flex flex-col items-center justify-center invisible"
            >
                {/* Dynamic Background: Grain + Gradient */}
                <div ref={bgRef} className="absolute inset-0 opacity-50 pointer-events-none">
                    {/* Grain */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-purple/10 blur-3xl"></div>
                    {/* Moving Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-white/5 rounded-full blur-[100px] animate-pulse"></div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/50 hover:text-white uppercase text-xs tracking-[0.2em] transition-colors z-20 cursor-pointer"
                >
                    [ Close ]
                </button>

                {/* Nav Items */}
                <div ref={navContainerRef} className="flex flex-col items-center gap-6 relative z-10 w-full px-6">
                    {navItems.map((item, i) => (
                        <div key={item.label} className="overflow-hidden">
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className="nav-item block text-5xl md:text-8xl font-bold font-serif text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-gray-500 transition-all duration-300"
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-12 text-white/30 text-xs uppercase tracking-widest nav-item">
                    Grit Labs &copy; {new Date().getFullYear()}
                </div>

            </div>
        </div>
    )
}
