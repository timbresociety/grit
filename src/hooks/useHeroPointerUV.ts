import { useRef, useEffect, RefObject } from 'react'
import * as THREE from 'three'
import { physicsDebug } from '@/lib/debug'

interface Metaball {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
}

// Accepts a reference to the CONTAINER that visually bounds the effect
export function useHeroPointerUV(containerRef: RefObject<HTMLElement | null>) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textureRef = useRef<THREE.CanvasTexture | null>(null)

    useEffect(() => {
        // 1. Setup Simulation Buffer
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        canvasRef.current = canvas

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const texture = new THREE.CanvasTexture(canvas)
        textureRef.current = texture

        // 2. Metaball Simulation State
        const balls: Metaball[] = []
        const trailLength = 15
        const mouse = { x: -1000, y: -1000 }

        // Initialize trail
        for (let i = 0; i < trailLength; i++) {
            balls.push({ x: -1000, y: -1000, vx: 0, vy: 0, radius: 45 - i * 2 })
        }

        const handleMouseMove = (e: MouseEvent) => {
            // 3. Strict Coordinate Mapping from PASSED REF
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()

                // Clamp coordinates to the specific container area
                const localX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
                const localY = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

                // UV Space (0-1)
                const uvX = localX / rect.width
                const uvY = localY / rect.height // Top-down used in HTML canvas

                // Canvas Space (512x512)
                mouse.x = uvX * canvas.width
                mouse.y = uvY * canvas.height

                // Diagnostics
                physicsDebug.hero.rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
                physicsDebug.hero.localX = localX
                physicsDebug.hero.localY = localY
                physicsDebug.hero.uvX = uvX
                physicsDebug.hero.uvY = uvY
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        // 4. Animation Loop
        let animationFrameId: number

        const render = () => {
            // Clear
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Update physics (Head)
            balls[0].x += (mouse.x - balls[0].x) * 0.4
            balls[0].y += (mouse.y - balls[0].y) * 0.4

            // Tail
            for (let i = 1; i < balls.length; i++) {
                const prev = balls[i - 1]
                const curr = balls[i]
                curr.x += (prev.x - curr.x) * 0.4
                curr.y += (prev.y - curr.y) * 0.4
            }

            // Draw
            balls.forEach(ball => {
                const grad = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius * 2)
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
                grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
                ctx.beginPath()
                ctx.fillStyle = grad
                ctx.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2)
                ctx.fill()
            })

            // Update Texture
            if (textureRef.current) textureRef.current.needsUpdate = true

            // Scroll Sync for Diagnostics
            physicsDebug.scroll.y = window.scrollY

            animationFrameId = requestAnimationFrame(render)
        }
        render()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
            texture.dispose()
        }
    }, [])

    return textureRef
}
