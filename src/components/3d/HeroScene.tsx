"use client"

import { Canvas } from '@react-three/fiber'
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
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

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
                        <LiquidBust mouseRef={mouseRef} isHovering={isHovering} />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    )
}
