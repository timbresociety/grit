"use client"

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export default function PerformanceGate({ children }: { children: React.ReactNode }) {
    const { setLowPowerMode, setReducedMotion } = useStore()

    useEffect(() => {
        // Detect Reduced Motion Preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReducedMotion(mediaQuery.matches)

        const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
        mediaQuery.addEventListener('change', handleMotionChange)

        // Detect Low Power Mode (Heuristic: Low concurrency or battery API if available)
        // Note: Battery API is deprecated/inconsistent, so we use hardwareConcurrency as a proxy for simpler "mobile-like" or "weak" devices
        // Real "Low Power Mode" detection is limited in browsers for privacy.
        const isWeakDevice = navigator.hardwareConcurrency <= 4 || /Mobi|Android/i.test(navigator.userAgent)

        // We can also try to infer from frame rate drops, but for now, static heuristics are safer for initial load.
        if (isWeakDevice) {
            console.log("Grit Labs: Optimization enabled for device constraints.")
            setLowPowerMode(true)
        }

        return () => {
            mediaQuery.removeEventListener('change', handleMotionChange)
        }
    }, [setLowPowerMode, setReducedMotion])

    return <>{children}</>
}
