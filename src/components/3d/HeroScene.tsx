"use client"

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

// --- PIXEL LOADING + REVEAL SHADER ---
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
        // Loading uniforms
        uLoadingPhase: 0,     // 0=black, 1=cyber, 2=renaissance, 3+=complete
        uLoadingProgress: 0.0, // 0-1 progress within current phase
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
    uniform int uLoadingPhase;
    uniform float uLoadingProgress;
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
      vec2 screenUV = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      
      // Square pixel grid - consistent across all effects
      // Use aspect-corrected coordinates for square pixels
      float pixelScale = 80.0; // Smaller pixels (higher = smaller)
      vec2 squarePixelUV = vec2(screenUV.x * aspect, screenUV.y) * pixelScale;
      vec2 pixelId = floor(squarePixelUV);
      float pixelRandom = hash21(pixelId);
      
      // Sample textures
      vec4 fgColor = texture2D(uForeground, vUv);  // Renaissance (marble)
      vec4 bgColor = texture2D(uBackground, vUv);  // Cyber
      
      // ═══════════════════════════════════════════════════════════════════════
      // LOADING PHASE LOGIC
      // ═══════════════════════════════════════════════════════════════════════
      
      // Phase 0: Black screen
      if(uLoadingPhase == 0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
      }
      
      // Distance from center for directional reveals (aspect corrected)
      vec2 center = vec2(0.5 * aspect, 0.5);
      vec2 aspectUV = vec2(screenUV.x * aspect, screenUV.y);
      float distFromCenter = distance(aspectUV, center) / (0.707 * aspect);
      
      // Phase 1: Cyber background reveals from EDGES to CENTER
      if(uLoadingPhase == 1) {
          float edgeToCenter = 1.0 - distFromCenter;
          float revealProgress = uLoadingProgress * uLoadingProgress * (3.0 - 2.0 * uLoadingProgress);
          float threshold = edgeToCenter * 0.7 + pixelRandom * 0.3;
          float showPixel = step(threshold, revealProgress * 1.1);
          
          vec3 color = mix(vec3(0.0), bgColor.rgb, showPixel);
          gl_FragColor = vec4(color, 1.0);
          return;
      }
      
      // Phase 2: Renaissance overlays from CENTER to EDGES
      if(uLoadingPhase == 2) {
          float centerToEdge = distFromCenter;
          float overlayRandom = hash21(pixelId + vec2(42.0, 13.0));
          float overlayProgress = uLoadingProgress * uLoadingProgress * (3.0 - 2.0 * uLoadingProgress);
          float threshold = centerToEdge * 0.7 + overlayRandom * 0.3;
          float showOverlay = step(threshold, overlayProgress * 1.1);
          
          vec3 color = mix(bgColor.rgb, fgColor.rgb, showOverlay);
          gl_FragColor = vec4(color, 1.0);
          return;
      }
      
      // ═══════════════════════════════════════════════════════════════════════
      // NORMAL INTERACTIVE MODE (Phase 3+) - Pixel Trail Reveal
      // ═══════════════════════════════════════════════════════════════════════
      
      // If reveal is fully closed, just show foreground (renaissance)
      if(uRevealStrength < 0.01) {
          gl_FragColor = fgColor;
          return;
      }
      
      // Use screenUV directly for position matching (trail is in 0-1 UV space)
      // Get pixel center in screen UV space
      vec2 pixelCenterScreen = (floor(screenUV * pixelScale) + 0.5) / pixelScale;
      
      // Check each trail point to see if this pixel should be revealed
      float showCyber = 0.0;
      
      for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
        vec2 trailPos = uTrail[i];
        
        // Skip invalid trail positions
        if(trailPos.x > 1.5 || trailPos.x < 0.0) continue;
        
        // Trail influence decreases for older points
        float trailAge = float(i) / float(${TRAIL_LENGTH} - 1);
        float influence = 1.0 - trailAge;
        influence = pow(influence, 1.2);
        
        // Reveal radius for this trail point (larger hollow)
        float trailRadius = 0.18 * influence * uRevealStrength;
        
        // Distance from pixel center to trail point (aspect corrected)
        vec2 diff = pixelCenterScreen - trailPos;
        diff.x *= aspect;
        float dist = length(diff);
        
        // Solid core - inner 70% is fully visible
        float coreRadius = trailRadius * 0.7;
        
        // Outer edge - pixelated boundary for imperfect decagon look
        float edgeRadius = trailRadius;
        
        if(dist < coreRadius) {
            // Inside solid core - fully reveal
            showCyber = 1.0;
            break;
        } else if(dist < edgeRadius) {
            // Edge zone - pixelated boundary
            // Use pixel random to create jagged decagon-like edge
            float edgeProgress = (dist - coreRadius) / (edgeRadius - coreRadius);
            float edgeThreshold = 0.3 + pixelRandom * 0.7;
            
            if(edgeProgress < edgeThreshold) {
                showCyber = 1.0;
                break;
            }
        }
      }
      
      // Final color - hard pixel switch, no blending
      vec3 finalColor = showCyber > 0.5 ? bgColor.rgb : fgColor.rgb;

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
    loadingPhase: number
    loadingProgress: number
}

function BackgroundPlane({ mouseRef, isHovering, loadingPhase, loadingProgress }: BackgroundPlaneProps) {
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
        // Only allow reveal interaction after loading is complete (phase 3+)
        const canReveal = loadingPhase >= 3
        const targetStrength = (isHovering && canReveal) ? 1.0 : 0.0
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
            // Loading uniforms
            matRef.current.uLoadingPhase = loadingPhase
            matRef.current.uLoadingProgress = loadingProgress
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
    loadingPhase?: number
    loadingProgress?: number
}

export default function HeroScene({ mouseRef, isHovering, loadingPhase = 4, loadingProgress = 1 }: HeroSceneProps) {
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
                    <BackgroundPlane
                        mouseRef={mouseRef}
                        isHovering={isHovering}
                        loadingPhase={loadingPhase}
                        loadingProgress={loadingProgress}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
