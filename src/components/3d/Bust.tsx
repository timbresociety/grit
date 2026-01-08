"use client"

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

export default function Bust() {
    const meshRef = useRef<THREE.Mesh>(null)
    const { isReducedMotion, isLowPowerMode, setScrollLocked } = useStore()

    // Simplified logic if performance is constrained
    const shouldSimplify = isReducedMotion || isLowPowerMode

    useFrame((state) => {
        if (meshRef.current && !isReducedMotion) {
            // Gentle rotation
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
            if (!isLowPowerMode) {
                meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
            }
        }
    })

    const handlePointerOver = () => {
        document.body.style.cursor = 'none'
        setScrollLocked(true) // Lock scroll on hover for "focus" mode
    }

    const handlePointerOut = () => {
        // defaults handled by global cursor
        setScrollLocked(false) // Unlock on exit
    }

    return (
        <group>
            {/* Main "Bust" Representation - Abstract Cyber Form */}
            <Icosahedron
                ref={meshRef}
                args={[1, shouldSimplify ? 16 : 64]} // Lower detail on low power
                scale={1.5}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {shouldSimplify ? (
                    <meshStandardMaterial color="#e0e0e0" roughness={0.2} metalness={0.8} />
                ) : (
                    <MeshDistortMaterial
                        color="#e0e0e0"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0.2}
                        metalness={0.9}
                        bumpScale={0.005}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        radius={1}
                    />
                )}
            </Icosahedron>

            {/* Wireframe Overlay - Disable on low power to save draw calls */}
            {!isLowPowerMode && (
                <Icosahedron args={[1.01, 16]} scale={1.5}>
                    <meshStandardMaterial
                        wireframe
                        color="#00f0ff"
                        transparent
                        opacity={0.1}
                    />
                </Icosahedron>
            )}
        </group>
    )
}
