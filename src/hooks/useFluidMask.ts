import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function useFluidMask(mouseRef: React.MutableRefObject<{ x: number, y: number }>) {
    // 1. Setup Offscreen Canvas
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const textureRef = useRef<THREE.CanvasTexture | null>(null)

    // Physics State for Trail
    const lastPos = useRef({ x: 0.5, y: 0.5 })
    const currentPos = useRef({ x: 0.5, y: 0.5 })

    // Init Canvas once
    useEffect(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, 512, 512)
        }

        canvasRef.current = canvas
        contextRef.current = ctx

        // Create Texture
        const texture = new THREE.CanvasTexture(canvas)
        textureRef.current = texture
    }, [])

    useFrame(() => {
        const ctx = contextRef.current
        const texture = textureRef.current
        if (!ctx || !texture) return

        // 1. Dissipation (Fade out old trails)
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)' // 8% fade per frame = ~12 frames to fade half
        ctx.fillRect(0, 0, 512, 512)

        // 2. Update Mouse Position (Lerp for smoothness)
        const targetX = mouseRef.current.x
        const targetY = mouseRef.current.y

        // If mouse is off-screen (negative), don't draw new stamps, just fade
        if (targetX < 0 || targetY < 0) {
            texture.needsUpdate = true
            return
        }

        // Lerp
        currentPos.current.x += (targetX - currentPos.current.x) * 0.15
        currentPos.current.y += (targetY - currentPos.current.y) * 0.15

        // 3. Draw Fluid Stamp
        const cx = currentPos.current.x * 512
        const cy = (1.0 - currentPos.current.y) * 512 // Flip Y for Canvas

        // Variable Radius based on speed? Or static?
        const radius = 60

        // Draw soft circle
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)') // Core
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)') // Edge

        ctx.globalCompositeOperation = 'lighten' // Add to existing white
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()

        // 4. Update Texture
        texture.needsUpdate = true
    })

    return textureRef
}
