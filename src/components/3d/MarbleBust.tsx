"use client"

import { useRef, useEffect } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { useGLTF, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// --- SHADER DEFINITION ---
// Helper to create dummy texture
const createDummyTexture = () => {
    const data = new Uint8Array([255, 255, 255, 255]);
    const t = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    t.needsUpdate = true;
    return t;
}

const TRAIL_LENGTH = 20;

const LiquidRevealMaterial = shaderMaterial(
    {
        uMouse: new THREE.Vector2(99, 99),
        uTrail: new Array(TRAIL_LENGTH).fill(new THREE.Vector2(99, 99)), // Trail array
        uTime: 0,
        uResolution: new THREE.Vector2(1, 1),
        uMap: createDummyTexture(),
        uColor: new THREE.Color(1, 1, 1),
        uHasTexture: 0.0,
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
    uniform vec2 uMouse;
    uniform vec2 uTrail[${TRAIL_LENGTH}]; // Array of trail points
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform float uHasTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;

    // NOISE FUNCTION
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
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

    void main() {
      // 1. Screen UVs
      vec2 screenUV = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 aspectCorrectedUV = vec2(screenUV.x * aspect, screenUV.y);
      
      // 2. Liquid Trail Logic
      float minDist = 100.0;
      float radius = 0.10;
      
      // Calculate weighting/distance influence from trail
      // Iterate through trail points
      for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
        vec2 pos = vec2(uTrail[i].x * aspect, uTrail[i].y);
        float d = distance(aspectCorrectedUV, pos);
        
        // Influence factor: 1.0 at head (i=0), fades to 0.0 by end
        float influence = 1.0 - (float(i) / float(${TRAIL_LENGTH} - 1));
        influence = pow(influence, 1.5); // Tune falloff
        
        // Effective distance calculation:
        // We want 'd' to count as 'small' if it is within the scaled radius.
        // d / influence < radius  <==>  d < radius * influence
        
        // Prevent division by zero
        if(influence > 0.01) {
            minDist = min(minDist, d / influence);
        }
      }
      
      // 3. Noise
      float noise = snoise(screenUV * 6.0 + uTime * 0.5) * 0.02; 
      
      // 4. Reveal Logic
      // minDist acts as our master 'dist'. If small, we are in the liquid trail.
      float liquidDist = minDist + noise; 
      
      float edgeSoftness = 0.05;
      
      // Alpha: 0 inside trail (hole), 1 far away
      float alpha = smoothstep(radius, radius + edgeSoftness, liquidDist);

      // 5. Texture & Color
      vec4 texColor = texture2D(uMap, vUv);
      vec3 baseColor = mix(uColor, texColor.rgb, uHasTexture);
      
      // 6. Lighting (Simple PBR approx)
      vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
      float diff = max(dot(vNormal, lightDir), 0.0);
      vec3 marble = baseColor * (0.6 + 0.4 * diff); 

      // 7. Edge (Gold Rim)
      float edge = 1.0 - smoothstep(radius + edgeSoftness, radius + edgeSoftness + 0.04, liquidDist); 
      vec3 edgeColor = vec3(0.0, 0.95, 1.0); // Cyan
      
      // FORCE OPACITY
      if (alpha > 0.99) alpha = 1.0; 

      // Apply edge
      if(alpha > 0.01 && alpha < 0.99) {
          marble = mix(marble, edgeColor, edge * 0.95);
      }

      if (alpha < 0.01) discard;
      gl_FragColor = vec4(marble, alpha);
    }
  `
)

extend({ LiquidRevealMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        liquidRevealMaterial: any
    }
}

// --- COMPONENT ---
export default function MarbleBust({ mouseRef, isHovering }: { mouseRef?: React.MutableRefObject<{ x: number, y: number }>, isHovering?: boolean }) {
    const gltf = useGLTF('/assets/bust/marble/base_basic_pbr.glb') as any
    const matRef = useRef<any>(null)
    const texRef = useRef<THREE.Texture | null>(null)
    const { size, gl } = useThree()

    // Smooth Mouse & Trail
    const currentMouse = useRef(new THREE.Vector2(0, 0))
    // Initialize trail with off-screen points
    const trailRef = useRef<THREE.Vector2[]>(new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector2(99, 99)))

    // Extract Texture
    useEffect(() => {
        if (gltf.scene) {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh && child.material && child.material.map) {
                    console.log("MarbleBust: Found Texture on", child.name)
                    texRef.current = child.material.map
                }
            })
        }
    }, [gltf])

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()
        const dpr = gl.getPixelRatio()

        // 1. Update Smooth Mouse
        let targetX = 99.0;
        let targetY = 99.0;

        if (isHovering && mouseRef && mouseRef.current) {
            targetX = mouseRef.current.x;
            targetY = mouseRef.current.y;
        }

        // Lerp Main Mouse
        const lerpFactor = 10.0 * delta
        currentMouse.current.x = THREE.MathUtils.lerp(currentMouse.current.x, targetX, lerpFactor)
        currentMouse.current.y = THREE.MathUtils.lerp(currentMouse.current.y, targetY, lerpFactor)

        // 2. Update Trail History
        // If we are hovering (or mouse is active), we shift the trail
        // We use the SMOOTHED mouse for the head of the trail to keep it connected to the cursor hole

        // Manual implementation of a shift-right buffer
        const trail = trailRef.current;
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
            trail[i].x = trail[i - 1].x;
            trail[i].y = trail[i - 1].y;
        }
        // Head is current position
        trail[0].x = currentMouse.current.x;
        trail[0].y = currentMouse.current.y;

        // If not hovering, we might want to let the trail disappear? 
        // With current logic, target is 99, so trail will fly off screen eventually.

        if (matRef.current) {
            matRef.current.uTime = time
            matRef.current.uResolution.set(size.width * dpr, size.height * dpr)
            matRef.current.uMouse.set(currentMouse.current.x, currentMouse.current.y)

            // Pass the trail array
            matRef.current.uTrail = trail;

            // Apply Texture
            if (texRef.current) {
                matRef.current.uMap = texRef.current
                matRef.current.uHasTexture = 1.0
            }
        }
    })

    return (
        <group name="MarbleContainer" renderOrder={2}>
            <mesh
                geometry={gltf.nodes.model.geometry}
                scale={1.20}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
            >
                <liquidRevealMaterial
                    ref={matRef}
                    key={LiquidRevealMaterial.key}
                    transparent
                    depthWrite
                    side={THREE.DoubleSide}
                    polygonOffset={true}
                    polygonOffsetFactor={-10} // Stronger pull forward to win Z-fight
                />
            </mesh>
        </group>
    )
}

useGLTF.preload('/assets/bust/marble/base_basic_pbr.glb')
