import { create } from 'zustand'

interface UIState {
    isMenuOpen: boolean
    toggleMenu: () => void
    closeMenu: () => void
}

interface PerformanceState {
    isLowPowerMode: boolean
    isReducedMotion: boolean
    setLowPowerMode: (isLow: boolean) => void
    setReducedMotion: (isReduced: boolean) => void
}

interface MotionState {
    isScrollLocked: boolean
    isSmoothScrollEnabled: boolean
    activeSection: string
    setScrollLocked: (isLocked: boolean) => void
    setSmoothScrollEnabled: (isEnabled: boolean) => void
    setActiveSection: (section: string) => void
}

interface AppState extends UIState, PerformanceState, MotionState { }

export const useStore = create<AppState>((set) => ({
    // UI State
    isMenuOpen: false,
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    closeMenu: () => set({ isMenuOpen: false }),

    // Performance State
    isLowPowerMode: false,
    isReducedMotion: false,
    setLowPowerMode: (isLow) => set({ isLowPowerMode: isLow }),
    setReducedMotion: (isReduced) => set({ isReducedMotion: isReduced }),

    // Motion State
    isScrollLocked: false,
    isSmoothScrollEnabled: true,
    activeSection: 'hero',
    setScrollLocked: (isLocked) => set({ isScrollLocked: isLocked }),
    setSmoothScrollEnabled: (isEnabled) => set({ isSmoothScrollEnabled: isEnabled }),
    setActiveSection: (section) => set({ activeSection: section }),
}))
