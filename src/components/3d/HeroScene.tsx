"use client"

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

// --- PIXEL DISINTEGRATION REVEAL SHADER ---
const TRAIL_LENGTH = 20

const PixelDisintegrateMaterial = shaderMaterial(
    {
        uMouse: new THREE.Vector2(99, 99),
        uTrail: new Array(TRAIL_LENGTH).fill(new THREE.Vector2(99, 99)),
        uTime: 0,
        uResolution: new THREE.Vector2(1, 1),
        uForeground: null as THREE.Texture | null,
        uBackground: null as THREE.Texture | null,
        uRevealStrength: 0.0, // 0 = closed, 1 = fully open
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform vec2 uMouse;
    uniform vec2 uTrail[${TRAIL_LENGTH}];
    uniform sampler2D uForeground;
    uniform sampler2D uBackground;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uRevealStrength;
    varying vec2 vUv;

    float hash21(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // If reveal is fully closed, just show foreground
      if(uRevealStrength < 0.01) {
          gl_FragColor = texture2D(uForeground, vUv);
          return;
      }
      
      vec2 screenUV = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 aspectCorrectedUV = vec2(screenUV.x * aspect, screenUV.y);
      
      // Calculate distance to trail with influence
      float minDist = 100.0;
      
      for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
        vec2 pos = vec2(uTrail[i].x * aspect, uTrail[i].y);
        float d = distance(aspectCorrectedUV, pos);
        float influence = 1.0 - (float(i) / float(${TRAIL_LENGTH} - 1));
        influence = pow(influence, 1.5);
        if(influence > 0.01 && pos.x < 2.0) { // Only consider valid trail points
            minDist = min(minDist, d / influence);
        }
      }
      
      // Sample textures
      vec4 fgColor = texture2D(uForeground, vUv);
      vec4 bgColor = texture2D(uBackground, vUv);
      
      // Dynamic radius based on reveal strength
      // Open: center→outward, Close: outward→center
      float maxCoreRadius = 0.12;
      float maxDisintegrateEnd = 0.25;
      
      // Scale radii by reveal strength
      float coreRadius = maxCoreRadius * uRevealStrength;
      float disintegrateEnd = maxDisintegrateEnd * uRevealStrength;
      
      // If cursor is off-screen or reveal too small
      if(minDist > 2.0 || disintegrateEnd < 0.01) {
          gl_FragColor = fgColor;
          return;
      }
      
      // Pixel grid
      float pixelScale = 60.0;
      vec2 pixelUV = screenUV * pixelScale;
      vec2 pixelId = floor(pixelUV);
      
      // Random threshold per pixel
      float pixelRandom = hash21(pixelId);
      
      // Pixel breaks when: distance < threshold (scaled by reveal strength)
      // Center pixels break first (low threshold), edge pixels break last (high threshold)
      float pixelThreshold = coreRadius + pixelRandom * (disintegrateEnd - coreRadius);
      
      // Organic variation
      float noise = snoise(screenUV * 8.0 + uTime * 0.3) * 0.02 * uRevealStrength;
      pixelThreshold += noise;
      
      // Time wobble at edges
      float timeWobble = sin(uTime * 2.5 + pixelRandom * 6.28) * 0.01 * uRevealStrength;
      pixelThreshold += timeWobble;
      
      // Show background if distance < threshold
      float showBackground = step(minDist, pixelThreshold);
      
      // Build final color
      vec3 finalColor;
      
      if(minDist < coreRadius * 0.8) {
          // Core: background
          finalColor = bgColor.rgb;
      } else if(minDist > disintegrateEnd) {
          // Outside: foreground
          finalColor = fgColor.rgb;
      } else {
          // Disintegration zone
          finalColor = showBackground > 0.5 ? bgColor.rgb : fgColor.rgb;
      }
      
      // Subtle shimmer
      if(minDist < coreRadius) {
          float shimmer = snoise(screenUV * 20.0 + uTime * 1.2) * 0.5 + 0.5;
          finalColor += vec3(0.3, 0.5, 0.8) * shimmer * 0.05 * uRevealStrength;
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ PixelDisintegrateMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        pixelDisintegrateMaterial: any
    }
}

// --- BACKGROUND PLANE ---
interface BackgroundPlaneProps {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
    isHovering: boolean
}

function BackgroundPlane({ mouseRef, isHovering }: BackgroundPlaneProps) {
    const matRef = useRef<any>(null)
    const { size, gl, viewport } = useThree()

    const [foregroundTex, backgroundTex] = useTexture([
        '/images/hero-bg.jpg',
        '/images/hero-bg-cyber.jpg'
    ])

    // Always track actual mouse position (not lerped off-screen)
    const currentMouse = useRef(new THREE.Vector2(0.5, 0.5))
    const trailRef = useRef<THREE.Vector2[]>(
        new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector2(0.5, 0.5))
    )

    // Smooth reveal strength (0 = closed, 1 = open)
    const revealStrength = useRef(0)

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()
        const dpr = gl.getPixelRatio()

        // Always update mouse position when valid
        if (mouseRef?.current && mouseRef.current.x >= 0 && mouseRef.current.x <= 1) {
            const lerpFactor = 12.0 * delta
            currentMouse.current.x = THREE.MathUtils.lerp(currentMouse.current.x, mouseRef.current.x, lerpFactor)
            currentMouse.current.y = THREE.MathUtils.lerp(currentMouse.current.y, mouseRef.current.y, lerpFactor)
        }

        // Update trail (always, using current position)
        const trail = trailRef.current
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
            trail[i].x = trail[i - 1].x
            trail[i].y = trail[i - 1].y
        }
        trail[0].x = currentMouse.current.x
        trail[0].y = currentMouse.current.y

        // Animate reveal strength: expand when hovering, contract when not
        const targetStrength = isHovering ? 1.0 : 0.0
        const strengthLerp = 4.0 * delta // Speed of open/close
        revealStrength.current = THREE.MathUtils.lerp(revealStrength.current, targetStrength, strengthLerp)

        if (matRef.current) {
            matRef.current.uTime = time
            matRef.current.uResolution.set(size.width * dpr, size.height * dpr)
            matRef.current.uMouse.set(currentMouse.current.x, currentMouse.current.y)
            matRef.current.uTrail = trail
            matRef.current.uForeground = foregroundTex
            matRef.current.uBackground = backgroundTex
            matRef.current.uRevealStrength = revealStrength.current
        }
    })

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <pixelDisintegrateMaterial
                ref={matRef}
                key={PixelDisintegrateMaterial.key}
            />
        </mesh>
    )
}

// --- MAIN SCENE ---
interface HeroSceneProps {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
    isHovering: boolean
}

export default function HeroScene({ mouseRef, isHovering }: HeroSceneProps) {
    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: "high-performance"
                }}
                orthographic
                camera={{ zoom: 1, position: [0, 0, 1] }}
                className="w-full h-full block"
            >
                <Suspense fallback={null}>
                    <BackgroundPlane mouseRef={mouseRef} isHovering={isHovering} />
                </Suspense>
            </Canvas>
        </div>
    )
}
