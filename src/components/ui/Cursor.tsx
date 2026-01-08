"use client"

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { physicsDebug } from '@/lib/debug'

export default function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        // Module-level tracking variables (persistent across re-renders of effect)
        let mouseX = 0
        let mouseY = 0
        let currentX = 0
        let currentY = 0
        let rafId: number

        // 1. Native Event Listener (Low Latency)
        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY

            // Diagnostics
            physicsDebug.cursor.nativeX = mouseX
            physicsDebug.cursor.nativeY = mouseY
        }

        // 2. rAF Loop (Sync with screen refresh)
        const loop = () => {
            // No Lerp / Smoothing -> Direct 1:1 check first
            currentX = mouseX
            currentY = mouseY

            if (cursorRef.current) {
                // Apply Transform
                // translate(-50%, -50%) centers the 24px cursor on the point
                cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`

                // Diagnostics
                physicsDebug.cursor.renderX = currentX
                physicsDebug.cursor.renderY = currentY
                physicsDebug.cursor.deltaX = currentX - mouseX
                physicsDebug.cursor.deltaY = currentY - mouseY
            }
            rafId = requestAnimationFrame(loop)
        }

        // Start
        window.addEventListener('mousemove', onMouseMove)
        loop()

        // 3. Hover Handler (React State ok here, less freq)
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isClickable = (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.dataset.cursor === 'hover'
            )
            setIsHovering(!!isClickable)
        }
        window.addEventListener('mouseover', onMouseOver)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseover', onMouseOver)
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <div
            ref={cursorRef}
            className={cn(
                "fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] flex items-center justify-center will-change-transform",
            )}
        >
            <div className={cn(
                "w-full h-full border border-neon-blue rounded-full transition-[transform,background-color,border] duration-200 ease-out flex items-center justify-center",
                isHovering ? "scale-[2.5] bg-neon-blue/20 border-neon-blue/50" : "scale-100"
            )}>
                {/* Crosshair inside - fades out on hover */}
                <div className={cn(
                    "w-[2px] h-[2px] bg-neon-blue rounded-full transition-opacity duration-200",
                    isHovering ? "opacity-0" : "opacity-100"
                )} />
            </div>
        </div>
    )
}
