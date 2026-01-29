"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

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

export default function ScrollVideoBackground({ className }: ScrollVideoBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
    const currentFrameRef = useRef(1)
    const prefersReducedMotion = useReducedMotion()
    const rafRef = useRef<number | null>(null)
    const pendingFrameRef = useRef<number | null>(null)

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

    // Load a single frame
    const loadFrame = useCallback((index: number): Promise<HTMLImageElement> => {
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

    // Preload frames around the current frame
    const preloadAroundFrame = useCallback((centerFrame: number) => {
        const PRELOAD_AHEAD = 40
        const PRELOAD_BEHIND = 15

        for (let offset = -PRELOAD_BEHIND; offset <= PRELOAD_AHEAD; offset++) {
            const frameToLoad = centerFrame + offset
            if (frameToLoad >= 1 && frameToLoad <= TOTAL_FRAMES && !imagesRef.current.has(frameToLoad)) {
                loadFrame(frameToLoad).catch(() => { })
            }
        }
    }, [loadFrame])

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

                    preloadAroundFrame(frameToRender)

                    if (imagesRef.current.has(frameToRender)) {
                        renderFrame(frameToRender)
                    } else {
                        loadFrame(frameToRender).then(() => renderFrame(frameToRender)).catch(() => { })
                    }
                }
            })
        }
    }, [preloadAroundFrame, renderFrame, loadFrame])

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

    // Handle scroll
    const handleScroll = useCallback(() => {
        const frame = getFrameForScroll()

        if (frame !== currentFrameRef.current) {
            scheduleRender(frame)
        }
    }, [getFrameForScroll, scheduleRender])

    // Initial frame loading
    useEffect(() => {
        const loadInitialFrames = async () => {
            try {
                const firstImg = await loadFrame(1)

                if (canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d')
                    if (ctx) {
                        drawImageCover(ctx, firstImg, window.innerWidth, window.innerHeight)
                    }
                }

                // Preload section start frames
                const sectionStarts = Object.values(SECTION_FRAME_MAP).map(range => range.start)
                for (const frame of sectionStarts) {
                    loadFrame(frame).catch(() => { })
                }

                // Preload first 100 frames for smooth hero
                for (let i = 2; i <= 100; i++) {
                    loadFrame(i).catch(() => { })
                }
            } catch (err) {
                console.error('Failed to load initial frame:', err)
            }
        }

        loadInitialFrames()
    }, [loadFrame, drawImageCover])

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

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [drawImageCover])

    // Setup scroll listener
    useEffect(() => {
        handleScroll() // Initial frame
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

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
            <div
                className="fixed inset-0 z-[1] pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.3) 100%)'
                }}
            />
        </>
    )
}
