import { useRef, useEffect, useState, RefObject } from 'react'
import { physicsDebug } from '@/lib/debug'

// Accepts a reference to the CONTAINER that visually bounds the effect
// Returns a MutableRefObject containing the current normalized UV coordinates {x, y}
export function useHeroMouseTracker(containerRef: RefObject<HTMLElement | null>) {
    const mouseRef = useRef({ x: -1, y: -1 }) // Start off-screen
    const rectRef = useRef<DOMRect | null>(null)
    const observerRef = useRef<ResizeObserver | null>(null)

    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        // Function to update the cached rect
        const updateRect = () => {
            if (containerRef.current) {
                rectRef.current = containerRef.current.getBoundingClientRect()
            }
        }

        // 1. Initial Call
        updateRect()

        // 2. ResizeObserver (Handles container resize, hydration, layout shifts)
        if (containerRef.current) {
            observerRef.current = new ResizeObserver(updateRect)
            observerRef.current.observe(containerRef.current)
        }

        // 3. Native Window Events (Backup)
        window.addEventListener('resize', updateRect, { passive: true })
        window.addEventListener('scroll', updateRect, { passive: true })

        return () => {
            if (observerRef.current) observerRef.current.disconnect()
            window.removeEventListener('resize', updateRect)
            window.removeEventListener('scroll', updateRect)
        }
    }, [containerRef])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Use Cached Rect
            if (rectRef.current) {
                const rect = rectRef.current

                // Safety check for zero-size rects (invisible/unmounted)
                if (rect.width === 0 || rect.height === 0) return

                // Check intersection
                const isInside =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom

                setIsHovering(isInside)

                if (isInside) {
                    // Clamp coordinates to the specific container area
                    const localX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
                    const localY = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

                    // UV Space (0-1)
                    const uvX = localX / rect.width
                    const uvY = 1.0 - (localY / rect.height) // Flip Y for GLSL (0 at bottom)

                    // Update Ref
                    mouseRef.current = { x: uvX, y: uvY }

                    // Diagnostics
                    physicsDebug.hero.localX = localX
                    physicsDebug.hero.localY = localY
                    physicsDebug.hero.uvX = uvX
                    physicsDebug.hero.uvY = uvY
                } else {
                    // meaningful off-screen default?
                    // mouseRef.current = { x: -1, y: -1 } // Optional: reset or keep last known
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return { mouseRef, isHovering }
}
