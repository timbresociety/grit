"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import ParticleOverlay from './ParticleOverlay'
import { useHeroLoading } from '@/contexts/HeroLoadingContext'

// Total number of frames in the video sequence
export const TOTAL_FRAMES = 1032

// Section-to-frame mapping (user-defined ranges)
// Frame numbers are 1-indexed
export const SECTION_FRAME_MAP = {
    hero: { start: 1, end: 204 },           // Frame 1-204
    services: { start: 205, end: 389 },     // Frame 205-389
    operator: { start: 390, end: 500 },     // Frame 390-500 (Logos section)
    process: { start: 501, end: 800 },      // Frame 501-800 (Extended for 5 cards)
    work: { start: 801, end: 950 },         // Frame 801-950
    contact: { start: 951, end: 1032 },     // Frame 951-1032
} as const

// Calculate scroll height for each section based on frame count
// Total page height = (viewport height) * (total frames / frames per viewport)
// We use CSS variables to allow responsive tuning (lower frames-per-vh on mobile = taller sections)

export function getSectionScrollHeight(sectionId: keyof typeof SECTION_FRAME_MAP): string {
    const range = SECTION_FRAME_MAP[sectionId]
    const frameCount = range.end - range.start + 1

    // Contact section exception: allow it to be shorter for better footer integration
    // Logic: calc( (frameCount / var(--frames-per-vh)) * 100vh )
    // We use CSS max/min to handle the contact exception

    if (sectionId === 'contact') {
        // Allow it to shrink to 60vh minimum, but otherwise follow frame logic
        return `calc(max((${frameCount} / var(--frames-per-vh, 100)) * 100vh, 60vh))`
    }

    // Standard sections: Minimum 100vh
    return `calc(max((${frameCount} / var(--frames-per-vh, 100)) * 100vh, 100vh))`
}

// Generate frame path
function getFramePath(index: number): string {
    const frameNumber = String(index).padStart(5, '0')
    return `/frames_webp/frame_${frameNumber}.webp`
}

interface ScrollVideoBackgroundProps {
    className?: string
}

// Batch size for parallel frame loading
const BATCH_SIZE = 20

export default function ScrollVideoBackground({ className }: ScrollVideoBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
    const currentFrameRef = useRef(1)
    const prefersReducedMotion = useReducedMotion()
    const rafRef = useRef<number | null>(null)
    const pendingFrameRef = useRef<number | null>(null)
    const [allFramesLoaded, setAllFramesLoaded] = useState(false)

    const { reportFrameLoaded, markLoadingComplete, isComplete, setTotalFrames } = useHeroLoading()

    // Draw image to COVER canvas (object-fit: cover) with slight scale-up for edge-to-edge fit
    const drawImageCover = useCallback((
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        canvasWidth: number,
        canvasHeight: number
    ) => {
        const imgRatio = img.width / img.height
        const canvasRatio = canvasWidth / canvasHeight

        // Scale factor - slightly larger than screen to ensure no gaps
        const SCALE_FACTOR = 1.15

        let drawWidth, drawHeight, offsetX, offsetY

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image - scale to width (crops top/bottom)
            drawWidth = canvasWidth * SCALE_FACTOR
            drawHeight = drawWidth / imgRatio
        } else {
            // Canvas is taller than image - scale to height (crops sides)
            drawHeight = canvasHeight * SCALE_FACTOR
            drawWidth = drawHeight * imgRatio
        }

        // Center the scaled image
        offsetX = (canvasWidth - drawWidth) / 2
        offsetY = (canvasHeight - drawHeight) / 2

        // Fill background with dark color first (safety)
        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Draw the image scaled and centered
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }, [])

    // Load a single frame (without reporting progress - used for individual loads)
    const loadFrameSilent = useCallback((index: number): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            if (index < 1 || index > TOTAL_FRAMES) {
                reject(new Error(`Invalid frame index: ${index}`))
                return
            }

            if (imagesRef.current.has(index)) {
                resolve(imagesRef.current.get(index)!)
                return
            }

            const img = new Image()
            img.src = getFramePath(index)
            img.onload = () => {
                imagesRef.current.set(index, img)
                resolve(img)
            }
            img.onerror = () => reject(new Error(`Failed to load frame ${index}`))
        })
    }, [])

    // Load a single frame with progress reporting
    const loadFrameWithProgress = useCallback((index: number): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            if (index < 1 || index > TOTAL_FRAMES) {
                reject(new Error(`Invalid frame index: ${index}`))
                return
            }

            if (imagesRef.current.has(index)) {
                // Already loaded - still report progress
                reportFrameLoaded()
                resolve(imagesRef.current.get(index)!)
                return
            }

            const img = new Image()
            img.src = getFramePath(index)
            img.onload = () => {
                imagesRef.current.set(index, img)
                reportFrameLoaded()
                resolve(img)
            }
            img.onerror = () => {
                // Still report progress even on error to prevent hanging
                reportFrameLoaded()
                reject(new Error(`Failed to load frame ${index}`))
            }
        })
    }, [reportFrameLoaded])

    // Render a specific frame
    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const img = imagesRef.current.get(index)

        if (ctx && canvas && img) {
            const width = window.innerWidth
            const height = window.innerHeight
            drawImageCover(ctx, img, width, height)
            currentFrameRef.current = index
        }
    }, [drawImageCover])

    // Schedule frame render with RAF batching
    const scheduleRender = useCallback((index: number) => {
        pendingFrameRef.current = index

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                if (pendingFrameRef.current !== null) {
                    const frameToRender = pendingFrameRef.current
                    pendingFrameRef.current = null
                    rafRef.current = null

                    if (imagesRef.current.has(frameToRender)) {
                        renderFrame(frameToRender)
                    } else {
                        // All frames should be preloaded, but fallback just in case
                        loadFrameSilent(frameToRender).then(() => renderFrame(frameToRender)).catch(() => { })
                    }
                }
            })
        }
    }, [renderFrame, loadFrameSilent])

    // Calculate frame based on global scroll progress
    const getFrameForScroll = useCallback((): number => {
        const scrollY = window.scrollY
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight

        if (maxScroll <= 0) return 1

        // Global progress 0-1
        const progress = Math.max(0, Math.min(1, scrollY / maxScroll))

        // Map to frame number (1 to TOTAL_FRAMES)
        const frame = Math.round(1 + progress * (TOTAL_FRAMES - 1))

        return Math.max(1, Math.min(TOTAL_FRAMES, frame))
    }, [])

    // Handle scroll - only active after all frames are loaded
    const handleScroll = useCallback(() => {
        if (!allFramesLoaded) return

        const frame = getFrameForScroll()

        if (frame !== currentFrameRef.current) {
            scheduleRender(frame)
        }
    }, [getFrameForScroll, scheduleRender, allFramesLoaded])

    // Preload ALL frames on mount
    useEffect(() => {
        // Reset scroll on hard refresh or initial load to prevent mismatch
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual'
        }
        window.scrollTo(0, 0)

        // Set total frames for progress tracking
        setTotalFrames(TOTAL_FRAMES)

        // Set up canvas dimensions FIRST before any drawing
        const setupCanvas = () => {
            if (!canvasRef.current) return null

            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const width = window.innerWidth
            const height = window.innerHeight

            canvasRef.current.width = width * dpr
            canvasRef.current.height = height * dpr
            canvasRef.current.style.width = `${width}px`
            canvasRef.current.style.height = `${height}px`

            const ctx = canvasRef.current.getContext('2d')
            if (ctx) {
                ctx.scale(dpr, dpr)
            }
            return ctx
        }

        const ctx = setupCanvas()

        const loadAllFrames = async () => {
            try {
                // Phase 1: Load first frame immediately and display it
                const firstImg = await loadFrameWithProgress(1)
                if (canvasRef.current && ctx) {
                    drawImageCover(ctx, firstImg, window.innerWidth, window.innerHeight)
                }

                // Phase 2: Load priority frames (section starts) first
                const sectionStarts = Object.values(SECTION_FRAME_MAP).map(range => range.start)
                const priorityFrames = sectionStarts.filter(f => f !== 1)
                await Promise.all(priorityFrames.map(frame => loadFrameWithProgress(frame).catch(() => { })))

                // Phase 3: Load remaining frames in parallel batches
                const remainingFrames: number[] = []
                const sectionStartSet = new Set<number>(sectionStarts as number[])
                for (let i = 2; i <= TOTAL_FRAMES; i++) {
                    if (!sectionStartSet.has(i) && !imagesRef.current.has(i)) {
                        remainingFrames.push(i)
                    }
                }

                // Load in batches to avoid overwhelming the browser
                for (let i = 0; i < remainingFrames.length; i += BATCH_SIZE) {
                    const batch = remainingFrames.slice(i, i + BATCH_SIZE)
                    await Promise.all(batch.map(frame => loadFrameWithProgress(frame).catch(() => { })))
                }

                // All frames loaded!
                setAllFramesLoaded(true)
                markLoadingComplete()
            } catch (err) {
                console.error('Failed to preload frames:', err)
                // Mark complete anyway to unblock the page
                setAllFramesLoaded(true)
                markLoadingComplete()
            }
        }

        loadAllFrames()
    }, [loadFrameWithProgress, drawImageCover, markLoadingComplete, setTotalFrames])

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const dpr = Math.min(window.devicePixelRatio || 1, 2)
                const width = window.innerWidth
                const height = window.innerHeight

                canvasRef.current.width = width * dpr
                canvasRef.current.height = height * dpr
                canvasRef.current.style.width = `${width}px`
                canvasRef.current.style.height = `${height}px`

                const ctx = canvasRef.current.getContext('2d')
                if (ctx) {
                    ctx.scale(dpr, dpr)

                    const img = imagesRef.current.get(currentFrameRef.current)
                    if (img) {
                        drawImageCover(ctx, img, width, height)
                    }
                }
            }
        }

        // Don't call handleResize() on mount - initial setup is done in the initial load effect
        // Only listen for actual window resize events
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [drawImageCover])

    // Setup scroll listener - only after loading is complete
    useEffect(() => {
        if (!isComplete || !allFramesLoaded) return

        handleScroll() // Initial frame
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll, isComplete, allFramesLoaded])

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [])

    // Reduced motion: show static gradient
    if (prefersReducedMotion) {
        return (
            <div
                className={`fixed inset-0 z-0 ${className || ''}`}
                style={{
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #0a0a0a 50%, #C17F59 100%)'
                }}
            />
        )
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`fixed inset-0 z-0 ${className || ''}`}
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
            />

            {/* Noise/Grain overlay - masks low resolution */}
            <div
                className="fixed inset-0 z-[1] pointer-events-none opacity-[0.12]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Color dithering layer - adds warmth */}
            <div
                className="fixed inset-0 z-[1] pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='colorNoise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.5' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23colorNoise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Scanline effect - subtle horizontal lines */}
            <div
                className="fixed inset-0 z-[2] pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
                    backgroundSize: '100% 4px',
                }}
            />

            {/* Vignette overlay - darker edges */}
            <div
                className="fixed inset-0 z-[3] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)'
                }}
            />

            {/* Top/Bottom gradient for depth */}
            <div
                className="fixed inset-0 z-[4] pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.35) 100%)'
                }}
            />

            {/* Animated particle overlay */}
            <ParticleOverlay />
        </>
    )
}
