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
export function getSectionScrollHeight(sectionId: keyof typeof SECTION_FRAME_MAP): string {
    const range = SECTION_FRAME_MAP[sectionId]
    const frameCount = range.end - range.start + 1

    if (sectionId === 'contact') {
        return `calc(max((${frameCount} / var(--frames-per-vh, 100)) * 100vh, 60vh))`
    }

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

// Frame skip interval for initial load phases
const KEYFRAME_INTERVAL = 5 // Load every 5th frame initially

// Batch size for parallel frame loading
const BATCH_SIZE = 50

export default function ScrollVideoBackground({ className }: ScrollVideoBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
    const currentFrameRef = useRef(1)
    const prefersReducedMotion = useReducedMotion()
    const rafRef = useRef<number | null>(null)
    const pendingFrameRef = useRef<number | null>(null)
    const [initialLoadDone, setInitialLoadDone] = useState(false)
    const backgroundLoadingRef = useRef(false)

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

        const SCALE_FACTOR = 1.15

        let drawWidth, drawHeight, offsetX, offsetY

        if (canvasRatio > imgRatio) {
            drawWidth = canvasWidth * SCALE_FACTOR
            drawHeight = drawWidth / imgRatio
        } else {
            drawHeight = canvasHeight * SCALE_FACTOR
            drawWidth = drawHeight * imgRatio
        }

        offsetX = (canvasWidth - drawWidth) / 2
        offsetY = (canvasHeight - drawHeight) / 2

        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }, [])

    // Load a single frame silently (no progress reporting)
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
                reportFrameLoaded()
                reject(new Error(`Failed to load frame ${index}`))
            }
        })
    }, [reportFrameLoaded])

    // Find the nearest loaded frame to the requested one
    const getNearestLoadedFrame = useCallback((targetFrame: number): number => {
        if (imagesRef.current.has(targetFrame)) return targetFrame

        // Search outward from target in both directions
        for (let offset = 1; offset <= KEYFRAME_INTERVAL; offset++) {
            if (imagesRef.current.has(targetFrame - offset)) return targetFrame - offset
            if (imagesRef.current.has(targetFrame + offset)) return targetFrame + offset
        }

        // Fallback: find any loaded frame near target
        let bestFrame = 1
        let bestDistance = Infinity
        for (const key of imagesRef.current.keys()) {
            const distance = Math.abs(key - targetFrame)
            if (distance < bestDistance) {
                bestDistance = distance
                bestFrame = key
            }
        }

        return bestFrame
    }, [])

    // Render a specific frame (with fallback to nearest loaded)
    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')

        // Try exact frame first, then nearest loaded
        let frameToUse = index
        if (!imagesRef.current.has(index)) {
            frameToUse = getNearestLoadedFrame(index)
        }

        const img = imagesRef.current.get(frameToUse)

        if (ctx && canvas && img) {
            const width = window.innerWidth
            const height = window.innerHeight
            drawImageCover(ctx, img, width, height)
            currentFrameRef.current = index
        }
    }, [drawImageCover, getNearestLoadedFrame])

    // Schedule frame render with RAF batching
    const scheduleRender = useCallback((index: number) => {
        pendingFrameRef.current = index

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                if (pendingFrameRef.current !== null) {
                    const frameToRender = pendingFrameRef.current
                    pendingFrameRef.current = null
                    rafRef.current = null
                    renderFrame(frameToRender)
                }
            })
        }
    }, [renderFrame])

    // Calculate frame based on global scroll progress
    const getFrameForScroll = useCallback((): number => {
        const scrollY = window.scrollY
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight

        if (maxScroll <= 0) return 1

        const progress = Math.max(0, Math.min(1, scrollY / maxScroll))
        const frame = Math.round(1 + progress * (TOTAL_FRAMES - 1))

        return Math.max(1, Math.min(TOTAL_FRAMES, frame))
    }, [])

    // Handle scroll - active after initial load
    const handleScroll = useCallback(() => {
        if (!initialLoadDone) return

        const frame = getFrameForScroll()

        if (frame !== currentFrameRef.current) {
            scheduleRender(frame)
        }
    }, [getFrameForScroll, scheduleRender, initialLoadDone])

    // Generate keyframes (every Nth frame) for a range
    const getKeyframes = useCallback((start: number, end: number, interval: number): number[] => {
        const frames: number[] = [start] // Always include first frame of range
        for (let i = start + interval; i <= end; i += interval) {
            frames.push(i)
        }
        if (frames[frames.length - 1] !== end) {
            frames.push(end) // Always include last frame of range
        }
        return frames
    }, [])

    // PROGRESSIVE LOADING: Three-phase approach
    useEffect(() => {
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual'
        }
        window.scrollTo(0, 0)

        // Set up canvas dimensions
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

        const loadProgressively = async () => {
            try {
                // ═══════════════════════════════════════════════════════
                // PHASE 1: Hero keyframes — fast initial load (~4MB)
                // Load frame 1 immediately, then every 5th hero frame
                // ═══════════════════════════════════════════════════════

                const heroRange = SECTION_FRAME_MAP.hero
                const heroKeyframes = getKeyframes(heroRange.start, heroRange.end, KEYFRAME_INTERVAL)

                // Tell the loading context how many frames Phase 1 needs
                setTotalFrames(heroKeyframes.length)

                // Load frame 1 first and display it immediately
                const firstImg = await loadFrameWithProgress(1)
                if (canvasRef.current && ctx) {
                    drawImageCover(ctx, firstImg, window.innerWidth, window.innerHeight)
                }

                // Load remaining hero keyframes in parallel
                const remainingHeroKeyframes = heroKeyframes.filter(f => f !== 1)
                await Promise.all(
                    remainingHeroKeyframes.map(frame =>
                        loadFrameWithProgress(frame).catch(() => { })
                    )
                )

                // ✅ PHASE 1 COMPLETE — Unblock the page!
                setInitialLoadDone(true)
                markLoadingComplete()

                // ═══════════════════════════════════════════════════════
                // PHASE 2: All section keyframes — background load (~17MB)
                // Load every 5th frame across remaining sections
                // ═══════════════════════════════════════════════════════

                if (backgroundLoadingRef.current) return
                backgroundLoadingRef.current = true

                const phase2Frames: number[] = []
                const sections = Object.values(SECTION_FRAME_MAP)
                for (const section of sections) {
                    if (section === heroRange) continue // Already loaded
                    const sectionKeyframes = getKeyframes(section.start, section.end, KEYFRAME_INTERVAL)
                    for (const frame of sectionKeyframes) {
                        if (!imagesRef.current.has(frame)) {
                            phase2Frames.push(frame)
                        }
                    }
                }

                // Load Phase 2 in batches
                for (let i = 0; i < phase2Frames.length; i += BATCH_SIZE) {
                    const batch = phase2Frames.slice(i, i + BATCH_SIZE)
                    await Promise.all(batch.map(frame => loadFrameSilent(frame).catch(() => { })))
                }

                // ═══════════════════════════════════════════════════════
                // PHASE 3: Fill ALL remaining frames — idle background
                // Load every frame not yet loaded, for buttery smooth scroll
                // ═══════════════════════════════════════════════════════

                const phase3Frames: number[] = []
                for (let i = 1; i <= TOTAL_FRAMES; i++) {
                    if (!imagesRef.current.has(i)) {
                        phase3Frames.push(i)
                    }
                }

                // Load in larger batches since this is fully background
                for (let i = 0; i < phase3Frames.length; i += BATCH_SIZE) {
                    const batch = phase3Frames.slice(i, i + BATCH_SIZE)
                    await Promise.all(batch.map(frame => loadFrameSilent(frame).catch(() => { })))

                    // Yield to main thread periodically to avoid jank
                    if (i % (BATCH_SIZE * 3) === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100))
                    }
                }

            } catch (err) {
                console.error('Failed to load frames:', err)
                setInitialLoadDone(true)
                markLoadingComplete()
            }
        }

        loadProgressively()
    }, [loadFrameWithProgress, loadFrameSilent, drawImageCover, markLoadingComplete, setTotalFrames, getKeyframes])

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

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [drawImageCover])

    // Setup scroll listener - active after initial load completes
    useEffect(() => {
        if (!isComplete || !initialLoadDone) return

        handleScroll() // Initial frame
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll, isComplete, initialLoadDone])

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
