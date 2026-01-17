import { useRef, useEffect, useState, useCallback, RefObject } from 'react'

// Accepts a reference to the CONTAINER that visually bounds the effect
// Returns a MutableRefObject containing the current normalized UV coordinates {x, y}
// Also provides mobile tap toggle functionality
export function useHeroMouseTracker(containerRef: RefObject<HTMLElement | null>) {
    const mouseRef = useRef({ x: -1, y: -1 }) // Start off-screen
    const rectRef = useRef<DOMRect | null>(null)
    const observerRef = useRef<ResizeObserver | null>(null)

    // Use ref for high-frequency updates (inside pointermove)
    const isHoveringRef = useRef(false)
    // Use state for React components that need to re-render
    const [isHovering, setIsHovering] = useState(false)

    // Mobile tap toggle state
    const [isTapActive, setIsTapActive] = useState(false)
    const isMobileRef = useRef(false)

    // Detect mobile on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            isMobileRef.current = window.matchMedia('(pointer: coarse)').matches
        }
    }, [])

    // Update rect cache
    useEffect(() => {
        const updateRect = () => {
            if (containerRef.current) {
                rectRef.current = containerRef.current.getBoundingClientRect()
            }
        }

        updateRect()

        if (containerRef.current) {
            observerRef.current = new ResizeObserver(updateRect)
            observerRef.current.observe(containerRef.current)
        }

        window.addEventListener('resize', updateRect, { passive: true })
        window.addEventListener('scroll', updateRect, { passive: true })

        return () => {
            if (observerRef.current) observerRef.current.disconnect()
            window.removeEventListener('resize', updateRect)
            window.removeEventListener('scroll', updateRect)
        }
    }, [containerRef])

    // Helper to calculate UV from event
    const calculateUV = useCallback((clientX: number, clientY: number) => {
        const rect = rectRef.current
        if (!rect || rect.width === 0 || rect.height === 0) return null

        const isInside =
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom

        if (!isInside) return null

        const localX = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const localY = Math.max(0, Math.min(clientY - rect.top, rect.height))

        return {
            x: localX / rect.width,
            y: 1.0 - (localY / rect.height) // Flip Y for GLSL
        }
    }, [])

    // Mouse move handler (desktop)
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Skip on mobile
            if (isMobileRef.current) return

            const uv = calculateUV(e.clientX, e.clientY)

            if (uv) {
                // Update ref directly (no React state in hot path)
                mouseRef.current = uv
                isHoveringRef.current = true

                // Debounced state update for components
                if (!isHovering) setIsHovering(true)
            } else {
                isHoveringRef.current = false
                if (isHovering) setIsHovering(false)
            }
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [calculateUV, isHovering])

    // Touch handlers (mobile)
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Tap to toggle reveal on mobile
        const handleTouchStart = (e: TouchEvent) => {
            if (!isMobileRef.current) return

            const touch = e.touches[0]
            const uv = calculateUV(touch.clientX, touch.clientY)

            if (uv) {
                // Toggle tap state
                setIsTapActive(prev => {
                    const newState = !prev
                    if (newState) {
                        // Center the reveal on tap position
                        mouseRef.current = uv
                        isHoveringRef.current = true
                        setIsHovering(true)
                    } else {
                        // Reset reveal
                        mouseRef.current = { x: -1, y: -1 }
                        isHoveringRef.current = false
                        setIsHovering(false)
                    }
                    return newState
                })
            }
        }

        // Move finger to move reveal (when tap is active)
        const handleTouchMove = (e: TouchEvent) => {
            if (!isMobileRef.current || !isTapActive) return

            const touch = e.touches[0]
            const uv = calculateUV(touch.clientX, touch.clientY)

            if (uv) {
                mouseRef.current = uv
            }
        }

        container.addEventListener('touchstart', handleTouchStart, { passive: true })
        container.addEventListener('touchmove', handleTouchMove, { passive: true })

        return () => {
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchmove', handleTouchMove)
        }
    }, [containerRef, calculateUV, isTapActive])

    return { mouseRef, isHovering, isHoveringRef, isTapActive }
}
