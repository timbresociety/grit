"use client"

import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Create a singleton GLTFLoader instance with Meshopt decoder support
// The optimized models use Meshopt compression (from gltf-transform optimize)
let loader: GLTFLoader | null = null

export function getGLTFLoader(): GLTFLoader {
    if (!loader) {
        loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)
    }
    return loader
}

// Preload helper for optimized models
export async function preloadModel(path: string): Promise<void> {
    const gltfLoader = getGLTFLoader()
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            path,
            () => resolve(),
            undefined,
            reject
        )
    })
}
