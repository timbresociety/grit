"use client"

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    fadeDirection: number
    color: string
}

export default function ParticleOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animationRef = useRef<number | null>(null)
    const isInitializedRef = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Colors for particles
        const colors = [
            'rgba(255, 255, 255,',
            'rgba(193, 127, 89,',  // Terracotta accent
            'rgba(30, 58, 95,',    // Deep sapphire
        ]

        const PARTICLE_COUNT = 120

        // Initialize particles
        const initParticles = (width: number, height: number) => {
            const particles: Particle[] = []
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5 - 0.2,
                    opacity: Math.random() * 0.5 + 0.2,
                    fadeDirection: Math.random() > 0.5 ? 1 : -1,
                    color: colors[Math.floor(Math.random() * colors.length)]
                })
            }
            particlesRef.current = particles
        }

        // Set canvas size with DPR support
        const setupCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const width = window.innerWidth
            const height = window.innerHeight

            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.scale(dpr, dpr)

            if (!isInitializedRef.current) {
                initParticles(width, height)
                isInitializedRef.current = true
            }

            return { width, height }
        }

        // Initial setup
        const { width, height } = setupCanvas()

        // Handle resize
        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight

            canvas.width = newWidth * dpr
            canvas.height = newHeight * dpr
            canvas.style.width = `${newWidth}px`
            canvas.style.height = `${newHeight}px`

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)
        }

        window.addEventListener('resize', handleResize)

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)

        // Touch tracking for mobile
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
            }
        }
        window.addEventListener('touchmove', handleTouchMove)

        // Animation loop
        const animate = () => {
            const currentWidth = window.innerWidth
            const currentHeight = window.innerHeight

            ctx.clearRect(0, 0, currentWidth, currentHeight)

            const mouse = mouseRef.current
            const MOUSE_RADIUS = 120
            const PUSH_STRENGTH = 50

            particlesRef.current.forEach(particle => {
                // Calculate distance from mouse
                const dx = mouse.x - particle.x
                const dy = mouse.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                // Repel particles from cursor
                if (distance < MOUSE_RADIUS && distance > 0) {
                    const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS
                    const angle = Math.atan2(dy, dx)
                    particle.x -= Math.cos(angle) * force * PUSH_STRENGTH * 0.08
                    particle.y -= Math.sin(angle) * force * PUSH_STRENGTH * 0.08
                } else {
                    particle.x += particle.speedX
                    particle.y += particle.speedY
                }

                // Update opacity (pulsing)
                particle.opacity += particle.fadeDirection * 0.01
                if (particle.opacity >= 0.7) particle.fadeDirection = -1
                else if (particle.opacity <= 0.2) particle.fadeDirection = 1

                // Wrap around screen
                if (particle.x < -10) particle.x = currentWidth + 10
                if (particle.x > currentWidth + 10) particle.x = -10
                if (particle.y < -10) particle.y = currentHeight + 10
                if (particle.y > currentHeight + 10) particle.y = -10

                // Draw glow
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 4
                )
                gradient.addColorStop(0, `${particle.color}${particle.opacity})`)
                gradient.addColorStop(1, `${particle.color}0)`)

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                // Draw core
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = `${particle.color}${Math.min(particle.opacity + 0.3, 1)})`
                ctx.fill()
            })

            // Cursor glow
            if (mouse.x > 0 && mouse.y > 0) {
                const cursorGradient = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 80
                )
                cursorGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
                cursorGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

                ctx.beginPath()
                ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2)
                ctx.fillStyle = cursorGradient
                ctx.fill()
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouchMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[5] pointer-events-none"
            style={{
                width: '100vw',
                height: '100vh',
                mixBlendMode: 'screen'
            }}
        />
    )
}
