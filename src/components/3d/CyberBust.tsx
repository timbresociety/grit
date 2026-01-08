"use client"

import { useRef, useEffect } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { useGLTF, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// --- SHADER DEFINITION (INVERSE MASK) ---
// Helper to create dummy texture
const createDummyTexture = () => {
    const data = new Uint8Array([255, 255, 255, 255]);
    const t = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    t.needsUpdate = true;
    return t;
}

const TRAIL_LENGTH = 20;

const CyberRevealMaterial = shaderMaterial(
    {
        uMouse: new THREE.Vector2(99, 99),
        uTrail: new Array(TRAIL_LENGTH).fill(new THREE.Vector2(99, 99)),
        uTime: 0,
        uResolution: new THREE.Vector2(1, 1),
        uMap: createDummyTexture(),
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
    uniform vec2 uTrail[${TRAIL_LENGTH}];
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uHasTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;

    // NOISE FUNCTION (Same as Marble)
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
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
      
      for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
        vec2 pos = vec2(uTrail[i].x * aspect, uTrail[i].y);
        float d = distance(aspectCorrectedUV, pos);
        float influence = 1.0 - (float(i) / float(${TRAIL_LENGTH} - 1));
        influence = pow(influence, 1.5);
        if(influence > 0.01) {
            minDist = min(minDist, d / influence);
        }
      }
      
      // 3. Noise
      float noise = snoise(screenUV * 6.0 + uTime * 0.5) * 0.02; 
      float liquidDist = minDist + noise; 
      
      // 4. INVERSE REVEAL LOGIC
      // If we are OUTSIDE the trail (liquidDist > radius), we DISCARD.
      // We add a tiny buffer to avoid seams matching the marble exactly.
      if (liquidDist > (radius - 0.01)) discard;

      // 5. Texture & Color
      vec4 texColor = texture2D(uMap, vUv);
      vec3 finalColor = texColor.rgb;
      
      // 6. Simple Lighting
      vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
      float diff = max(dot(vNormal, lightDir), 0.0);
      finalColor = finalColor * (0.4 + 0.6 * diff); 

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ CyberRevealMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        cyberRevealMaterial: any
    }
}

export default function CyberBust({ mouseRef, isHovering }: { mouseRef?: React.MutableRefObject<{ x: number, y: number }>, isHovering?: boolean }) {
    const gltf = useGLTF('/assets/bust/cyber/base_basic_pbr.glb') as any
    const matRef = useRef<any>(null)
    const texRef = useRef<THREE.Texture | null>(null)
    const { size, gl } = useThree()

    // Smooth Mouse & Trail (Synced logic)
    const currentMouse = useRef(new THREE.Vector2(0, 0))
    const trailRef = useRef<THREE.Vector2[]>(new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector2(99, 99)))

    // Extract Texture
    useEffect(() => {
        if (gltf.scene) {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh && child.material && child.material.map) {
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

        const lerpFactor = 10.0 * delta
        currentMouse.current.x = THREE.MathUtils.lerp(currentMouse.current.x, targetX, lerpFactor)
        currentMouse.current.y = THREE.MathUtils.lerp(currentMouse.current.y, targetY, lerpFactor)

        // 2. Update Trail History
        const trail = trailRef.current;
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
            trail[i].x = trail[i - 1].x;
            trail[i].y = trail[i - 1].y;
        }
        trail[0].x = currentMouse.current.x;
        trail[0].y = currentMouse.current.y;

        if (matRef.current) {
            matRef.current.uTime = time
            matRef.current.uResolution.set(size.width * dpr, size.height * dpr)
            matRef.current.uMouse.set(currentMouse.current.x, currentMouse.current.y)
            matRef.current.uTrail = trail;

            // Apply Texture
            if (texRef.current) {
                matRef.current.uMap = texRef.current
                matRef.current.uHasTexture = 1.0
            }
        }
    })

    return (
        <group name="CyberContainer">
            <mesh
                geometry={gltf.nodes.model.geometry}
                scale={1.20}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
            >
                <cyberRevealMaterial
                    ref={matRef}
                    key={CyberRevealMaterial.key}
                    depthWrite={true}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload('/assets/bust/cyber/base_basic_pbr.glb')
