"use client"

import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { useGLTF, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { FLUID_MASK_CONFIG, MODEL_PATHS } from '@/lib/heroConstants'

// --- SHADER UTILITIES ---
const createDummyTexture = () => {
    const data = new Uint8Array([255, 255, 255, 255])
    const t = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat)
    t.needsUpdate = true
    return t
}

const { tail: TRAIL_LENGTH, edgeColor } = FLUID_MASK_CONFIG

// --- SIMPLEX NOISE GLSL (shared between both shaders) ---
const NOISE_GLSL = `
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
`

// --- TRAIL DISTANCE CALCULATION GLSL (shared) ---
const TRAIL_DISTANCE_GLSL = `
    float calcTrailDistance(vec2 aspectCorrectedUV, vec2 trail[${TRAIL_LENGTH}], float aspect) {
        float minDist = 100.0;
        for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
            vec2 pos = vec2(trail[i].x * aspect, trail[i].y);
            float d = distance(aspectCorrectedUV, pos);
            float influence = 1.0 - (float(i) / float(${TRAIL_LENGTH} - 1));
            influence = pow(influence, 1.5);
            if(influence > 0.01) {
                minDist = min(minDist, d / influence);
            }
        }
        return minDist;
    }
`

// --- MARBLE REVEAL MATERIAL (Foreground - becomes transparent in mask) ---
const MarbleRevealMaterial = shaderMaterial(
    {
        uTrail: new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector2(99, 99)),
        uTime: 0,
        uResolution: new THREE.Vector2(1, 1),
        uMap: createDummyTexture(),
        uColor: new THREE.Color(1, 1, 1),
        uHasTexture: 0.0,
        uMaskRadius: FLUID_MASK_CONFIG.maskRadius,
        uSoftness: FLUID_MASK_CONFIG.softness,
        uNoiseScale: FLUID_MASK_CONFIG.noiseScale,
        uEdgeWidth: FLUID_MASK_CONFIG.edgeWidth,
        uEdgeColor: new THREE.Color(...edgeColor),
        uIsReducedMotion: 0.0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform vec2 uTrail[${TRAIL_LENGTH}];
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform float uHasTexture;
    uniform float uMaskRadius;
    uniform float uSoftness;
    uniform float uNoiseScale;
    uniform float uEdgeWidth;
    uniform vec3 uEdgeColor;
    uniform float uIsReducedMotion;

    varying vec2 vUv;
    varying vec3 vNormal;

    ${NOISE_GLSL}
    ${TRAIL_DISTANCE_GLSL}

    void main() {
        // CRITICAL: If trail is off-screen, render marble as fully opaque
        // This prevents the cyber bust from showing through when not hovering
        if (uTrail[0].x > 2.0 || uTrail[0].y > 2.0 || uTrail[0].x < -1.0 || uTrail[0].y < -1.0) {
            vec4 texColor = texture2D(uMap, vUv);
            vec3 baseColor = mix(uColor, texColor.rgb, uHasTexture);
            vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            vec3 marble = baseColor * (0.6 + 0.4 * diff);
            gl_FragColor = vec4(marble, 1.0);
            return;
        }

        // Screen UVs with aspect correction
        vec2 screenUV = gl_FragCoord.xy / uResolution;
        float aspect = uResolution.x / uResolution.y;
        vec2 aspectCorrectedUV = vec2(screenUV.x * aspect, screenUV.y);

        // Calculate trail distance
        float minDist = calcTrailDistance(aspectCorrectedUV, uTrail, aspect);

        // Fluid noise (reduced when prefers-reduced-motion)
        float noise = 0.0;
        if (uIsReducedMotion < 0.5) {
            noise = snoise(screenUV * uNoiseScale + uTime * 0.5) * 0.02;
        }

        float liquidDist = minDist + noise;

        // Alpha: 0 inside trail (hole), 1 far away
        float alpha = smoothstep(uMaskRadius, uMaskRadius + uSoftness, liquidDist);

        // Texture & Color
        vec4 texColor = texture2D(uMap, vUv);
        vec3 baseColor = mix(uColor, texColor.rgb, uHasTexture);

        // Lighting (3-point approximation in shader)
        vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 marble = baseColor * (0.6 + 0.4 * diff);

        // Edge glow
        float edge = 1.0 - smoothstep(uMaskRadius + uSoftness, uMaskRadius + uSoftness + uEdgeWidth, liquidDist);

        // Force opacity at boundaries
        if (alpha > 0.99) alpha = 1.0;

        // Apply edge color
        if (alpha > 0.01 && alpha < 0.99) {
            marble = mix(marble, uEdgeColor, edge * 0.95);
        }

        // Discard fully transparent pixels for performance
        if (alpha < 0.01) discard;

        gl_FragColor = vec4(marble, alpha);
    }
    `
)

// --- CYBER REVEAL MATERIAL (Background - visible only inside mask) ---
const CyberRevealMaterial = shaderMaterial(
    {
        uTrail: new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector2(99, 99)),
        uTime: 0,
        uResolution: new THREE.Vector2(1, 1),
        uMap: createDummyTexture(),
        uHasTexture: 0.0,
        uMaskRadius: FLUID_MASK_CONFIG.maskRadius,
        uNoiseScale: FLUID_MASK_CONFIG.noiseScale,
        uIsReducedMotion: 0.0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform vec2 uTrail[${TRAIL_LENGTH}];
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uHasTexture;
    uniform float uMaskRadius;
    uniform float uNoiseScale;
    uniform float uIsReducedMotion;

    varying vec2 vUv;
    varying vec3 vNormal;

    ${NOISE_GLSL}
    ${TRAIL_DISTANCE_GLSL}

    void main() {
        // CRITICAL: If trail is off-screen (at 99,99), completely hide cyber bust
        // This prevents the black patch when not hovering
        if (uTrail[0].x > 2.0 || uTrail[0].y > 2.0 || uTrail[0].x < -1.0 || uTrail[0].y < -1.0) {
            discard;
        }

        // Screen UVs with aspect correction
        vec2 screenUV = gl_FragCoord.xy / uResolution;
        float aspect = uResolution.x / uResolution.y;
        vec2 aspectCorrectedUV = vec2(screenUV.x * aspect, screenUV.y);

        // Calculate trail distance
        float minDist = calcTrailDistance(aspectCorrectedUV, uTrail, aspect);

        // Fluid noise
        float noise = 0.0;
        if (uIsReducedMotion < 0.5) {
            noise = snoise(screenUV * uNoiseScale + uTime * 0.5) * 0.02;
        }

        float liquidDist = minDist + noise;

        // INVERSE reveal: discard everything OUTSIDE the trail
        if (liquidDist > (uMaskRadius - 0.01)) discard;

        // Texture & Color
        vec4 texColor = texture2D(uMap, vUv);
        vec3 finalColor = texColor.rgb;

        // Simple lighting
        vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        finalColor = finalColor * (0.4 + 0.6 * diff);

        gl_FragColor = vec4(finalColor, 1.0);
    }
    `
)

extend({ MarbleRevealMaterial, CyberRevealMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        marbleRevealMaterial: any
        cyberRevealMaterial: any
    }
}

// --- COMPONENT PROPS ---
interface HeroBustProps {
    mouseRef?: React.MutableRefObject<{ x: number; y: number }>
    isHovering?: boolean
    isReducedMotion?: boolean
}

// --- MAIN COMPONENT ---
export default function HeroBust({ mouseRef, isHovering, isReducedMotion = false }: HeroBustProps) {
    const marbleGltf = useGLTF(MODEL_PATHS.marble) as any
    const cyberGltf = useGLTF(MODEL_PATHS.cyber) as any

    const marbleMatRef = useRef<any>(null)
    const cyberMatRef = useRef<any>(null)
    const marbleTexRef = useRef<THREE.Texture | null>(null)
    const cyberTexRef = useRef<THREE.Texture | null>(null)

    const { size, gl } = useThree()

    // Smooth mouse & trail state
    const currentMouse = useRef(new THREE.Vector2(99, 99))
    const trailRef = useRef<THREE.Vector2[]>(
        new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector2(99, 99))
    )

    // Extract textures from models
    useEffect(() => {
        if (marbleGltf.scene) {
            marbleGltf.scene.traverse((child: any) => {
                if (child.isMesh && child.material?.map) {
                    marbleTexRef.current = child.material.map
                }
            })
        }
    }, [marbleGltf])

    useEffect(() => {
        if (cyberGltf.scene) {
            cyberGltf.scene.traverse((child: any) => {
                if (child.isMesh && child.material?.map) {
                    cyberTexRef.current = child.material.map
                }
            })
        }
    }, [cyberGltf])

    // Animation loop
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()
        const dpr = gl.getPixelRatio()

        // 1. Update smooth mouse position
        let targetX = 99.0
        let targetY = 99.0

        if (isHovering && mouseRef?.current) {
            targetX = mouseRef.current.x
            targetY = mouseRef.current.y
        }

        // Lerp mouse position
        const lerpFactor = FLUID_MASK_CONFIG.cursorLerpSpeed * delta
        currentMouse.current.x = THREE.MathUtils.lerp(currentMouse.current.x, targetX, lerpFactor)
        currentMouse.current.y = THREE.MathUtils.lerp(currentMouse.current.y, targetY, lerpFactor)

        // 2. Update trail (shift buffer)
        const trail = trailRef.current
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
            // Apply dissipation by lerping towards off-screen
            const dissipation = FLUID_MASK_CONFIG.dissipation
            trail[i].x = THREE.MathUtils.lerp(trail[i].x, trail[i - 1].x, dissipation)
            trail[i].y = THREE.MathUtils.lerp(trail[i].y, trail[i - 1].y, dissipation)
        }
        trail[0].x = currentMouse.current.x
        trail[0].y = currentMouse.current.y

        // 3. Update marble material uniforms
        if (marbleMatRef.current) {
            marbleMatRef.current.uTime = time
            marbleMatRef.current.uResolution.set(size.width * dpr, size.height * dpr)
            marbleMatRef.current.uTrail = trail
            marbleMatRef.current.uIsReducedMotion = isReducedMotion ? 1.0 : 0.0

            if (marbleTexRef.current) {
                marbleMatRef.current.uMap = marbleTexRef.current
                marbleMatRef.current.uHasTexture = 1.0
            }
        }

        // 4. Update cyber material uniforms
        if (cyberMatRef.current) {
            cyberMatRef.current.uTime = time
            cyberMatRef.current.uResolution.set(size.width * dpr, size.height * dpr)
            cyberMatRef.current.uTrail = trail
            cyberMatRef.current.uIsReducedMotion = isReducedMotion ? 1.0 : 0.0

            if (cyberTexRef.current) {
                cyberMatRef.current.uMap = cyberTexRef.current
                cyberMatRef.current.uHasTexture = 1.0
            }
        }
    })

    // Get geometry from models - use named node 'model' like original components
    const marbleGeometry = useMemo(() => {
        return marbleGltf.nodes?.model?.geometry || null
    }, [marbleGltf])

    const cyberGeometry = useMemo(() => {
        return cyberGltf.nodes?.model?.geometry || null
    }, [cyberGltf])

    if (!marbleGeometry || !cyberGeometry) return null

    return (
        <group dispose={null}>
            {/* Cyber bust (background layer) - rendered first, no depthWrite to avoid black overlap */}
            <mesh
                geometry={cyberGeometry}
                scale={1.20}
                position={[0, 0, 0]}
                renderOrder={1}
            >
                <cyberRevealMaterial
                    ref={cyberMatRef}
                    key={CyberRevealMaterial.key}
                    depthWrite={true}
                />
            </mesh>

            {/* Marble bust (foreground layer with reveal hole) - rendered second */}
            <mesh
                geometry={marbleGeometry}
                scale={1.20}
                position={[0, 0, 0]}
                renderOrder={2}
            >
                <marbleRevealMaterial
                    ref={marbleMatRef}
                    key={MarbleRevealMaterial.key}
                    transparent={true}
                    depthWrite={true}
                    depthTest={true}
                    side={THREE.DoubleSide}
                    polygonOffset={true}
                    polygonOffsetFactor={-10}
                />
            </mesh>
        </group>
    )
}

// Preload optimized models
useGLTF.preload(MODEL_PATHS.marble)
useGLTF.preload(MODEL_PATHS.cyber)
