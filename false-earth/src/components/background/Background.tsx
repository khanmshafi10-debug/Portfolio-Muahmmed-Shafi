import * as THREE from 'three'
import { useMemo, useEffect, memo } from 'react'
import { useThree } from '@react-three/fiber'
import { texture, equirectUV, uniform, mx_rotate3d, vec3, positionWorld, mix, clamp, float, smoothstep, length } from 'three/tsl'
import { useKTX2Texture } from '@core'
import { CameraMode, useGameStore } from '../../core/store/gameStore'
import { uTime } from '../../core/shaders/uniforms';

export const Background = memo(function Background({ intensity, axis, speed }: { intensity: number, axis: [number, number, number], speed: number }) {
  const { scene } = useThree()

  const uniforms = useMemo(() => ({
    uIntensity: uniform(0.55),
    uSpeed: uniform(0.05),
    uAxis: uniform(new THREE.Vector3(0, 1, 0)),
  }), [])

  const cameraMode = useGameStore((state) => state.cameraMode);
  const map = useKTX2Texture({ map: './textures/starmap_2020_4k.ktx2' }).map
  map.mapping = THREE.EquirectangularReflectionMapping
  map.colorSpace = THREE.SRGBColorSpace
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping

  useEffect(() => {
    uniforms.uIntensity.value = cameraMode === CameraMode.FPV ? 1.0 : (intensity > 0.1 ? intensity : 0.55)
    uniforms.uAxis.value.set(axis[0], axis[1], axis[2]).normalize()
    uniforms.uSpeed.value = speed
  }, [cameraMode, intensity, axis, speed])

  useEffect(() => {
    if (map) {
      const dir = positionWorld.normalize()
      const angle = uTime.mul(uniforms.uSpeed)
      const rotatedDir = vec3(mx_rotate3d(dir, angle, uniforms.uAxis))
      const finalUVs = equirectUV(rotatedDir)

      // Base cosmic sky color palette (Ultra-deep midnight edge -> Royal Indigo -> Horizon Glow)
      const zenithColor = vec3(0.015, 0.008, 0.04)   // Deep midnight black/violet edge
      const midColor    = vec3(0.05, 0.02, 0.14)    // Royal space indigo
      const horizonColor= vec3(0.16, 0.05, 0.30)    // Glowing magenta/purple horizon aura

      // Height-based interpolation
      const height = clamp(dir.y.add(0.2), float(0.0), float(1.0))
      const horizonGlow = smoothstep(float(0.0), float(0.4), height)
      
      const skyGradient = mix(horizonColor, midColor, horizonGlow)
      const finalGradient = mix(skyGradient, zenithColor, height)

      // Sample starmap texture and multiply by intensity
      const starTex = texture(map, finalUVs).mul(uniforms.uIntensity).mul(vec3(0.95, 0.9, 1.15))

      // Central vibrant purple/magenta radial flare with dark edge attenuation
      const viewDist = length(dir.sub(vec3(0.0, 0.0, -1.0)))
      const coreFlare = smoothstep(float(1.4), float(0.0), viewDist)
      const centerGlow = vec3(0.72, 0.28, 1.0).mul(coreFlare).mul(1.85)
      const innerSpot = vec3(0.92, 0.72, 1.0).mul(smoothstep(float(0.6), float(0.0), viewDist)).mul(1.3)

      // Radial edge darkening to make screen borders deep & dark
      const edgeFade = mix(finalGradient, zenithColor, smoothstep(float(0.2), float(1.2), viewDist).mul(0.55))

      // Combine darkened background, central vibrant purple flare, and starry texture
      const bgNode = edgeFade.add(starTex).add(centerGlow).add(innerSpot)
      scene.backgroundNode = bgNode
    }
    return () => {
      scene.backgroundNode = null
    }
  }, [scene, map, uniforms])

  return null
})


