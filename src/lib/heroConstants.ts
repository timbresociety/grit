"use client"

// Configurable constants for the fluid mask reveal effect
// Adjust these to tune the behavior of the Lando Norris-style fluid reveal

export const FLUID_MASK_CONFIG = {
    // Reveal hole radius (0.0 to 1.0 in UV space)
    maskRadius: 0.10,

    // Edge blur/softness for the reveal hole
    softness: 0.05,

    // Number of trail points for the fluid tail
    tail: 20,

    // Trail fade per frame (0.0-1.0, higher = slower dissipation)
    dissipation: 0.92,

    // Simplex noise frequency for organic wobble
    noiseScale: 6.0,

    // Mouse position interpolation speed (higher = more responsive)
    cursorLerpSpeed: 10.0,

    // Edge glow width
    edgeWidth: 0.04,

    // Edge color (neon cyan to match brand)
    edgeColor: [0.0, 0.95, 1.0] as readonly [number, number, number],
} as const

// Model paths - using optimized compressed versions
export const MODEL_PATHS = {
    marble: '/assets/bust/marble/marble_optimized.glb',
    cyber: '/assets/bust/cyber/cyber_optimized.glb',
} as const

// Performance settings
export const HERO_PERFORMANCE = {
    // DPR caps for different power modes
    dprDefault: [1, 2] as [number, number],
    dprLowPower: [1, 1.5] as [number, number],

    // Reduced motion settings
    floatSpeed: 2,
    floatSpeedReduced: 0,
    rotationIntensity: 0.5,
    rotationIntensityReduced: 0,
} as const
