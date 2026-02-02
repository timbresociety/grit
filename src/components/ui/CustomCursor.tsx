"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [isMobile, setIsMobile] = useState(true)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 400 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        // Check if device has fine pointer (mouse)
        const hasFingerPointer = window.matchMedia('(pointer: fine)').matches
        const isTouchDevice = 'ontouchstart' in window

        if (!hasFingerPointer || isTouchDevice) {
            setIsMobile(true)
            return
        }

        setIsMobile(false)

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)
        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        // Detect hoverable elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]')
            setIsHovering(!!interactive)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousemove', handleElementHover)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousemove', handleElementHover)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
        }
    }, [cursorX, cursorY, isVisible])

    // Don't render on mobile/touch devices
    if (isMobile) return null

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    zIndex: 99999,
                    opacity: isVisible ? 1 : 0,
                }}
            >
                <motion.div
                    className="rounded-full bg-white"
                    style={{
                        marginLeft: '-50%',
                        marginTop: '-50%',
                    }}
                    animate={{
                        width: isHovering ? 50 : isClicking ? 6 : 10,
                        height: isHovering ? 50 : isClicking ? 6 : 10,
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
            </motion.div>

            {/* Trailing ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    x: cursorX,
                    y: cursorY,
                    zIndex: 99998,
                    opacity: isVisible ? 0.4 : 0,
                }}
            >
                <motion.div
                    className="rounded-full border border-white/50"
                    style={{
                        marginLeft: '-50%',
                        marginTop: '-50%',
                    }}
                    animate={{
                        width: isHovering ? 70 : 35,
                        height: isHovering ? 70 : 35,
                        opacity: isClicking ? 0.2 : 0.4,
                    }}
                    transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                />
            </motion.div>
        </>
    )
}
