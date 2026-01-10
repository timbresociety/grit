"use client"

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, PerspectiveCamera, Float } from '@react-three/drei'
import HeroBust from './HeroBust'
import { useStore } from '@/store/useStore'
import { useHeroMouseTracker } from '@/hooks/useHeroMouseTracker'
import { HERO_PERFORMANCE } from '@/lib/heroConstants'
import { useRef, useEffect, useState, Suspense } from 'react'

// Loading skeleton for Suspense fallback
function LoadingSkeleton() {
    return (
        <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial color="#1a1a1a" wireframe />
        </mesh>
    )
}

// 3-point studio lighting for professional bust rendering
function StudioLighting() {
    return (
        <>
            {/* Key Light - Warm spotlight from front-right */}
            <spotLight
                position={[3, 4, 4]}
                angle={0.4}
                penumbra={0.5}
                intensity={1.2}
                color="#fff5e6"
                castShadow={false}
            />

            {/* Fill Light - Softer from left side */}
            <pointLight
                position={[-4, 2, 2]}
                intensity={0.4}
                color="#e6f0ff"
            />

            {/* Rim Light - Subtle backlight for depth separation */}
            <pointLight
                position={[0, 2, -4]}
                intensity={0.6}
                color="#00f3ff"
            />

            {/* Ambient base */}
            <ambientLight intensity={0.3} color="#ffffff" />
        </>
    )
}

// Responsive camera based on container size
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

export default function HeroScene() {
    const { isLowPowerMode, isReducedMotion } = useStore()
    const [dpr, setDpr] = useState<[number, number]>(HERO_PERFORMANCE.dprDefault)
    const containerRef = useRef<HTMLDivElement>(null)
    const { mouseRef, isHovering } = useHeroMouseTracker(containerRef)

    // Adjust DPR based on power mode
    useEffect(() => {
        if (isLowPowerMode || (typeof window !== 'undefined' && window.devicePixelRatio > 2)) {
            setDpr(HERO_PERFORMANCE.dprLowPower)
        } else {
            setDpr(HERO_PERFORMANCE.dprDefault)
        }
    }, [isLowPowerMode])

    // Float animation settings
    const floatSpeed = isReducedMotion ? HERO_PERFORMANCE.floatSpeedReduced : HERO_PERFORMANCE.floatSpeed
    const rotationIntensity = isReducedMotion ? HERO_PERFORMANCE.rotationIntensityReduced : HERO_PERFORMANCE.rotationIntensity

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ background: 'transparent' }}>
            <Canvas
                dpr={dpr}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: true
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0) // Fully transparent background
                }}
                className="w-full h-full block"
            >
                <ResponsiveCamera />
                <StudioLighting />

                <Suspense fallback={<LoadingSkeleton />}>
                    <Environment preset="city" />
                    <Float
                        speed={floatSpeed}
                        rotationIntensity={rotationIntensity}
                        floatIntensity={rotationIntensity}
                    >
                        {/* Center the bust in the new 50% container */}
                        <group position={[0, 0.1, 0]}>
                            <HeroBust
                                mouseRef={mouseRef}
                                isHovering={isHovering}
                                isReducedMotion={isReducedMotion}
                            />
                        </group>
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    )
}
