"use client"

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Preload, PerspectiveCamera, Float } from '@react-three/drei'
import LiquidBust from './LiquidBust'
import { useStore } from '@/store/useStore'
import { useHeroMouseTracker } from '@/hooks/useHeroMouseTracker'
import { useRef, useEffect, useState, Suspense } from 'react'

export default function HeroScene() {
    const { isLowPowerMode, isReducedMotion } = useStore()
    const [dpr, setDpr] = useState([1, 2])
    const containerRef = useRef(null) // Define containerRef
    const { mouseRef, isHovering } = useHeroMouseTracker(containerRef) // Destructure isHovering

    useEffect(() => {
        // Cap DPR to 1.5 on low power or generic mobile to save battery
        if (isLowPowerMode || (typeof window !== 'undefined' && window.devicePixelRatio > 2)) {
            setDpr([1, 1.5])
        } else {
            setDpr([1, 2])
        }
    }, [isLowPowerMode])

    return (
        <div ref={containerRef} className="w-full h-full relative"> {/* Attach containerRef */}
            <Canvas
                dpr={dpr as any} // Explicit cast for R3F types
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: true
                }}
                className="w-full h-full block"
            >
                <ResponsiveCamera />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />

                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <Float
                        speed={isReducedMotion ? 0 : 2}
                        rotationIntensity={isReducedMotion ? 0 : 0.5}
                        floatIntensity={isReducedMotion ? 0 : 0.5}
                    >
                        {/* Center the bust in the new 50% container */}
                        <group position={[0, -1.0, 0]}>
                            <LiquidBust mouseRef={mouseRef} isHovering={isHovering} />
                        </group>
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    )
}

function ResponsiveCamera() {
    const { size } = useThree()
    // We are now in a 50% width container on desktop, or 100% on mobile
    const isMobile = size.width < 768

    // Desktop: Container is narrower (50vw), so we can pull camera back slightly to fit shoulders contextually
    // Mobile: 100vw, but shorter height.

    // Z = 4.5 seem solid for half-width container to fill it well.
    const targetZ = isMobile ? 5.2 : 4.5

    return <PerspectiveCamera makeDefault position={[0, 0, targetZ]} fov={35} />
}
