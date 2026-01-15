"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

// Loading phases:
// 0: Initial black screen
// 1: Cyber background reveals pixel-by-pixel
// 2: Renaissance image overlays pixel-by-pixel
// 3: UI elements (panels, navbar) fade in
// 4: Complete (normal interaction mode)

export type LoadingPhase = 0 | 1 | 2 | 3 | 4

interface HeroLoadingContextValue {
    phase: LoadingPhase
    progress: number // 0-1 progress within current phase
    isComplete: boolean
}

const HeroLoadingContext = createContext<HeroLoadingContextValue>({
    phase: 0,
    progress: 0,
    isComplete: false,
})

export function useHeroLoading() {
    return useContext(HeroLoadingContext)
}

interface HeroLoadingProviderProps {
    children: ReactNode
}

// Phase durations in ms
const PHASE_DURATIONS = {
    0: 300,   // Brief black screen
    1: 1000,  // Cyber reveal (edge to center)
    2: 1000,  // Renaissance overlay (center to edge)
    3: 800,   // UI fade in
}

export function HeroLoadingProvider({ children }: HeroLoadingProviderProps) {
    const [phase, setPhase] = useState<LoadingPhase>(0)
    const [progress, setProgress] = useState(0)
    const [startTime, setStartTime] = useState<number | null>(null)

    const isComplete = phase === 4

    useEffect(() => {
        if (phase >= 4) return

        const phaseDuration = PHASE_DURATIONS[phase as keyof typeof PHASE_DURATIONS] || 1000

        if (startTime === null) {
            setStartTime(performance.now())
        }

        let animationId: number

        const animate = (currentTime: number) => {
            const elapsed = currentTime - (startTime ?? currentTime)
            const phaseProgress = Math.min(elapsed / phaseDuration, 1)

            setProgress(phaseProgress)

            if (phaseProgress >= 1) {
                // Move to next phase
                const nextPhase = (phase + 1) as LoadingPhase
                setPhase(nextPhase)
                setStartTime(null)
                setProgress(0)
            } else {
                animationId = requestAnimationFrame(animate)
            }
        }

        animationId = requestAnimationFrame(animate)

        return () => {
            if (animationId) cancelAnimationFrame(animationId)
        }
    }, [phase, startTime])

    return (
        <HeroLoadingContext.Provider value={{ phase, progress, isComplete }}>
            {children}
        </HeroLoadingContext.Provider>
    )
}
