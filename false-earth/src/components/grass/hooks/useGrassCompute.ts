import { useThree } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { DEFAULT_LOD_SEGMENTS_CONFIG, drawIndirectStructure, LODBufferConfig } from '../core/config'
import { createBladeGeometry, createVisibleIndicesBuffer } from '../core/grassGeometry'
import { DEFAULT_BLADES_PER_AXIS } from '../core/config'
import { storage } from 'three/tsl'
import { createGrassData } from '../core/grassGeometry'
import { createGrassCompute, createResetDrawBufferCompute } from '../core/grassCompute'
import { WebGPURenderer } from 'three/webgpu'

export function useGrassCompute(
    uniforms: any,
    cameraToUse: THREE.Camera
) {
    const { gl } = useThree()
    const [lodBuffers, setLodBuffers] = useState<LODBufferConfig[]>([])

    const computeRefs = useRef<{ main: any, reset: any } | null>(null)
    const grassDataRef = useRef<ReturnType<typeof createGrassData> | null>(null)

    // Throttle: track previous camera pos to skip compute when idle
    const prevCamPos = useRef(new THREE.Vector3(Infinity, Infinity, Infinity))
    const frameCount = useRef(0)
    // Minimum camera movement (world units) to trigger a compute dispatch
    const MIN_MOVE_SQ = 0.05 * 0.05
    // Force-refresh every N frames even when idle (keeps culling accurate)
    const FORCE_INTERVAL = 4  // every 4th frame — more responsive than 6

    useEffect(() => {
        const grassBlades = DEFAULT_BLADES_PER_AXIS * DEFAULT_BLADES_PER_AXIS
        const grassData = createGrassData(grassBlades)
        grassDataRef.current = grassData

        // Generate LOD buffers from segments config
        const configs: LODBufferConfig[] = DEFAULT_LOD_SEGMENTS_CONFIG.map((cfg) => {
            const geo = createBladeGeometry(cfg.segments)
            const count = geo.index ? geo.index.count : geo.attributes.position.count
            const drawBuffer = new THREE.IndirectStorageBufferAttribute(new Uint32Array(5), 5)
            const drawStorage = storage(drawBuffer, drawIndirectStructure, 1)
            geo.dispose()

            return {
                ...cfg,
                indices: createVisibleIndicesBuffer(grassBlades),
                drawBuffer,
                drawStorage,
                vertexCount: count,
            }
        })
        setLodBuffers(configs)

        computeRefs.current = {
            main: createGrassCompute(grassData, configs, uniforms.compute).computeFn().compute(grassBlades).setName('GrassUpdate'),
            reset: createResetDrawBufferCompute(configs).setName('GrassReset'),
        }

        return () => {
            computeRefs.current = null
            grassDataRef.current = null
        }
    }, [])

    useFrame(() => {
        if (!computeRefs.current) return
        const renderer = gl as unknown as WebGPURenderer

        frameCount.current++

        // Check if camera moved enough to warrant a new dispatch
        const moved = cameraToUse
            ? prevCamPos.current.distanceToSquared(cameraToUse.position) > MIN_MOVE_SQ
            : false
        const forceFrame = frameCount.current % FORCE_INTERVAL === 0

        if (!moved && !forceFrame) return   // skip — nothing meaningful changed

        if (cameraToUse) {
            prevCamPos.current.copy(cameraToUse.position)
            cameraToUse.updateMatrixWorld()
            uniforms.compute.uViewProjectionMatrix.value.multiplyMatrices(
                cameraToUse.projectionMatrix,
                cameraToUse.matrixWorldInverse
            )
            uniforms.compute.uCameraPosition.value.copy(cameraToUse.position)
        }

        renderer.compute(computeRefs.current.reset)
        renderer.compute(computeRefs.current.main)
    }, -1) // priority -1 = runs before render pass

    return {
        lodBuffers,
        grassData: grassDataRef.current,
    }
}