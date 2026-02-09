"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

// Loading phases:
// 0: Initial - loading screen visible, assets loading
// 1: Assets loaded - transition animation
// 2: UI reveal - panels and navbar fade in
// 3: Complete - normal interaction mode

export type LoadingPhase = 0 | 1 | 2 | 3

interface HeroLoadingContextValue {
    phase: LoadingPhase
    progress: number // 0-1 progress of frame loading
    isComplete: boolean
    framesLoaded: number
    totalFrames: number
    reportFrameLoaded: () => void
    setTotalFrames: (total: number) => void
    markLoadingComplete: () => void
}

const HeroLoadingContext = createContext<HeroLoadingContextValue>({
    phase: 0,
    progress: 0,
    isComplete: false,
    framesLoaded: 0,
    totalFrames: 1032,
    reportFrameLoaded: () => { },
    setTotalFrames: () => { },
    markLoadingComplete: () => { },
})

export function useHeroLoading() {
    return useContext(HeroLoadingContext)
}

interface HeroLoadingProviderProps {
    children: ReactNode
}

// Transition durations after assets are loaded
const TRANSITION_DURATIONS = {
    1: 800,   // Transition animation after load
    2: 600,   // UI fade in
}

export function HeroLoadingProvider({ children }: HeroLoadingProviderProps) {
    const [phase, setPhase] = useState<LoadingPhase>(0)
    const [framesLoaded, setFramesLoaded] = useState(0)
    const [totalFrames, setTotalFrames] = useState(1032)
    const [assetsReady, setAssetsReady] = useState(false)

    const progress = totalFrames > 0 ? framesLoaded / totalFrames : 0
    const isComplete = phase === 3

    // Called by ScrollVideoBackground when a frame is loaded
    const reportFrameLoaded = useCallback(() => {
        setFramesLoaded(prev => prev + 1)
    }, [])

    // Called when all frames are loaded
    const markLoadingComplete = useCallback(() => {
        setAssetsReady(true)
    }, [])

    // Transition through phases after assets are ready
    useEffect(() => {
        if (!assetsReady) return
        if (phase >= 3) return

        // Move to next phase immediately when assets ready
        if (phase === 0) {
            setPhase(1)
            return
        }

        const duration = TRANSITION_DURATIONS[phase as keyof typeof TRANSITION_DURATIONS] || 500

        const timer = setTimeout(() => {
            const nextPhase = (phase + 1) as LoadingPhase
            setPhase(nextPhase)
        }, duration)

        return () => clearTimeout(timer)
    }, [assetsReady, phase])

    return (
        <HeroLoadingContext.Provider value={{
            phase,
            progress,
            isComplete,
            framesLoaded,
            totalFrames,
            reportFrameLoaded,
            setTotalFrames,
            markLoadingComplete,
        }}>
            {children}
        </HeroLoadingContext.Provider>
    )
}
