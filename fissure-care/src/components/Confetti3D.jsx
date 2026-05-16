import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ConfettiParticles({ count = 60, colors }) {
  const meshRef = useRef()

  const { positions, velocities, rotations, colorArray } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = []
    const rotations = []
    const colorArray = new Float32Array(count * 3)
    const threeColors = colors.map(c => new THREE.Color(c))

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = Math.random() * 2 - 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2

      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: Math.random() * 0.03 + 0.01,
        z: (Math.random() - 0.5) * 0.02,
        rotX: (Math.random() - 0.5) * 0.08,
        rotY: (Math.random() - 0.5) * 0.08,
      })
      rotations.push(Math.random() * Math.PI * 2)

      const color = threeColors[i % threeColors.length]
      colorArray[i * 3] = color.r
      colorArray[i * 3 + 1] = color.g
      colorArray[i * 3 + 2] = color.b
    }
    return { positions, velocities, rotations, colorArray }
  }, [count, colors])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    g.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
    return g
  }, [positions, colorArray])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const v = velocities[i]
      pos.array[i * 3] += v.x
      pos.array[i * 3 + 1] += v.y
      pos.array[i * 3 + 2] += v.z
      // Drift outward
      v.y -= 0.0005 // slight gravity
      if (pos.array[i * 3 + 1] > 4) pos.array[i * 3 + 1] = -2
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial vertexColors size={0.12} transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

export default function Confetti3D({ colors = ['#FFB7C5', '#E8705A', '#F5C67A', '#A8D5A2', '#C4B5FD'] }) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ConfettiParticles count={80} colors={colors} />
    </Canvas>
  )
}
