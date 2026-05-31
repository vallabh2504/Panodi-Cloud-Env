import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ── Palette ── */
const GRASS_TOP  = '#6DC05E'
const GRASS_DARK = '#5AAA4C'
const EARTH      = '#A0724A'
const EARTH_DARK = '#7A5233'
const TRUNK      = '#7B5A3A'
const TRUNK_DARK = '#5C3D20'
const ROCK_COLOR = '#9E9E9E'
const ROCK_DARK  = '#757575'

/* 5 tree palettes: pink · lavender · golden · sage · peach */
const PALETTES = [
  { a: '#FFB7C5', b: '#FF92A5', c: '#FFCCD5' }, // 0 cherry pink
  { a: '#C8A4DC', b: '#9B6FBF', c: '#DCC0F0' }, // 1 wisteria lavender
  { a: '#FFD060', b: '#FFAA00', c: '#FFE9A0' }, // 2 golden marigold
  { a: '#7CC870', b: '#55A84A', c: '#AADE9F' }, // 3 spring sage
  { a: '#FF9F6A', b: '#FF6B35', c: '#FFBF9C' }, // 4 peach coral
]
const PETAL_COLORS = ['#FFB7C5', '#C8A4DC', '#FFD060', '#AADE9F', '#FFBF9C']

/* ── Island platform ── */
function Island() {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.22, 6]} />
        <meshStandardMaterial color={GRASS_TOP} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[3.25, 3.4, 0.14, 6]} />
        <meshStandardMaterial color={GRASS_DARK} />
      </mesh>
      <mesh position={[0, -0.38, 0]}>
        <cylinderGeometry args={[3.4, 3.1, 0.52, 6]} />
        <meshStandardMaterial color={EARTH} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[3.1, 2.2, 0.52, 6]} />
        <meshStandardMaterial color={EARTH_DARK} />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[2.2, 2.0, 0.12, 6]} />
        <meshStandardMaterial color={EARTH_DARK} />
      </mesh>
    </group>
  )
}

/* ── Cherry Blossom (variant 0) — round puffy crown ── */
function CherryTree({ x, z, scale, phase }) {
  const ref = useRef()
  const { a, b, c } = PALETTES[0]
  const th = 0.7 * scale, tr = 0.09 * scale
  const r1 = 0.58 * scale, r2 = 0.45 * scale, r3 = 0.38 * scale
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.6 + phase) * 0.025
    ref.current.rotation.x = Math.cos(t * 0.5 + phase) * 0.015
  })
  return (
    <group ref={ref} position={[x, 0.11, z]}>
      <mesh castShadow position={[0, th / 2, 0]}>
        <cylinderGeometry args={[tr * 0.7, tr, th, 5]} />
        <meshStandardMaterial color={TRUNK} />
      </mesh>
      <mesh position={[tr * 0.3, th / 2, 0]}>
        <cylinderGeometry args={[tr * 0.35, tr * 0.5, th, 5]} />
        <meshStandardMaterial color={TRUNK_DARK} />
      </mesh>
      <mesh castShadow position={[0, th + r1 * 0.65, 0]}>
        <sphereGeometry args={[r1, 7, 5]} />
        <meshStandardMaterial color={a} roughness={0.55} emissive={a} emissiveIntensity={0.22} />
      </mesh>
      <mesh castShadow position={[-r1 * 0.55, th + r2 * 0.5, r1 * 0.1]}>
        <sphereGeometry args={[r2, 6, 5]} />
        <meshStandardMaterial color={b} roughness={0.55} emissive={b} emissiveIntensity={0.18} />
      </mesh>
      <mesh castShadow position={[r1 * 0.5, th + r3 * 0.6, -r1 * 0.2]}>
        <sphereGeometry args={[r3, 6, 5]} />
        <meshStandardMaterial color={c} roughness={0.55} emissive={c} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, th + r1 * 1.3, 0]}>
        <sphereGeometry args={[r3 * 0.8, 6, 5]} />
        <meshStandardMaterial color={c} roughness={0.55} emissive={c} emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

/* ── Wisteria (variant 1) — tall narrow with drooping accent ── */
function WisteriaTree({ x, z, scale, phase }) {
  const ref = useRef()
  const { a, b, c } = PALETTES[1]
  const th = 0.9 * scale, tr = 0.09 * scale
  const r1 = 0.5 * scale, r2 = 0.38 * scale, r3 = 0.3 * scale
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.55 + phase) * 0.022
    ref.current.rotation.x = Math.cos(t * 0.45 + phase) * 0.014
  })
  return (
    <group ref={ref} position={[x, 0.11, z]}>
      <mesh castShadow position={[0, th / 2, 0]}>
        <cylinderGeometry args={[tr * 0.65, tr, th, 5]} />
        <meshStandardMaterial color={TRUNK} />
      </mesh>
      <mesh castShadow position={[0, th + r1 * 0.55, 0]}>
        <sphereGeometry args={[r1, 7, 5]} />
        <meshStandardMaterial color={a} roughness={0.5} emissive={a} emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[-r1 * 0.42, th + r2 * 0.25, r1 * 0.3]}>
        <sphereGeometry args={[r2, 6, 5]} />
        <meshStandardMaterial color={b} roughness={0.5} emissive={b} emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[r1 * 0.38, th + r3 * 0.15, -r1 * 0.28]}>
        <sphereGeometry args={[r3, 6, 5]} />
        <meshStandardMaterial color={c} roughness={0.5} emissive={c} emissiveIntensity={0.18} />
      </mesh>
      {/* drooping accent below canopy */}
      <mesh position={[0.05, th - r1 * 0.3, r1 * 0.42]}>
        <sphereGeometry args={[r3 * 0.85, 6, 5]} />
        <meshStandardMaterial color={a} roughness={0.5} emissive={a} emissiveIntensity={0.2} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, th + r1 * 1.18, 0]}>
        <sphereGeometry args={[r3 * 0.65, 6, 5]} />
        <meshStandardMaterial color={c} roughness={0.5} emissive={c} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

/* ── Golden Umbrella (variant 2) — wide flat canopy ── */
function GoldenTree({ x, z, scale, phase }) {
  const ref = useRef()
  const { a, b, c } = PALETTES[2]
  const th = 0.65 * scale, tr = 0.10 * scale
  const r1 = 0.7 * scale, r2 = 0.5 * scale, r3 = 0.36 * scale
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.5 + phase) * 0.02
    ref.current.rotation.x = Math.cos(t * 0.42 + phase) * 0.012
  })
  return (
    <group ref={ref} position={[x, 0.11, z]}>
      <mesh castShadow position={[0, th / 2, 0]}>
        <cylinderGeometry args={[tr * 0.8, tr * 1.1, th, 5]} />
        <meshStandardMaterial color={TRUNK_DARK} />
      </mesh>
      {/* wide flat main canopy */}
      <mesh castShadow position={[0, th + r1 * 0.38, 0]} scale={[1.45, 0.65, 1.45]}>
        <sphereGeometry args={[r1, 8, 6]} />
        <meshStandardMaterial color={a} roughness={0.45} emissive={a} emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[-r1 * 0.52, th + r2 * 0.28, 0.1]} scale={[1.3, 0.6, 1.3]}>
        <sphereGeometry args={[r2, 6, 5]} />
        <meshStandardMaterial color={b} roughness={0.48} emissive={b} emissiveIntensity={0.26} />
      </mesh>
      <mesh position={[r1 * 0.48, th + r3 * 0.28, -r1 * 0.28]} scale={[1.2, 0.6, 1.2]}>
        <sphereGeometry args={[r3, 6, 5]} />
        <meshStandardMaterial color={c} roughness={0.48} emissive={c} emissiveIntensity={0.22} />
      </mesh>
    </group>
  )
}

/* ── Spring Oak (variant 3) — full round leafy canopy ── */
function OakTree({ x, z, scale, phase }) {
  const ref = useRef()
  const { a, b, c } = PALETTES[3]
  const th = 0.7 * scale, tr = 0.11 * scale
  const r1 = 0.65 * scale, r2 = 0.5 * scale, r3 = 0.4 * scale
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.52 + phase) * 0.018
    ref.current.rotation.x = Math.cos(t * 0.44 + phase) * 0.012
  })
  return (
    <group ref={ref} position={[x, 0.11, z]}>
      <mesh castShadow position={[0, th / 2, 0]}>
        <cylinderGeometry args={[tr * 0.75, tr * 1.05, th, 6]} />
        <meshStandardMaterial color={TRUNK_DARK} />
      </mesh>
      <mesh castShadow position={[0, th + r1 * 0.72, 0]}>
        <sphereGeometry args={[r1, 8, 6]} />
        <meshStandardMaterial color={a} roughness={0.65} emissive={a} emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[-r1 * 0.48, th + r2 * 0.62, r1 * 0.22]}>
        <sphereGeometry args={[r2, 7, 5]} />
        <meshStandardMaterial color={b} roughness={0.65} emissive={b} emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[r1 * 0.44, th + r3 * 0.58, -r1 * 0.28]}>
        <sphereGeometry args={[r3, 7, 5]} />
        <meshStandardMaterial color={c} roughness={0.65} emissive={c} emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[0, th + r1 * 1.42, 0]}>
        <sphereGeometry args={[r3 * 0.72, 6, 5]} />
        <meshStandardMaterial color={a} roughness={0.55} emissive={a} emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

/* ── Peach Tower (variant 4) — stacked columnar puffs ── */
function TowerTree({ x, z, scale, phase }) {
  const ref = useRef()
  const { a, b, c } = PALETTES[4]
  const th = 0.85 * scale, tr = 0.08 * scale
  const r1 = 0.48 * scale, r2 = 0.38 * scale, r3 = 0.3 * scale
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.62 + phase) * 0.02
    ref.current.rotation.x = Math.cos(t * 0.5 + phase) * 0.013
  })
  return (
    <group ref={ref} position={[x, 0.11, z]}>
      <mesh castShadow position={[0, th / 2, 0]}>
        <cylinderGeometry args={[tr * 0.7, tr, th, 5]} />
        <meshStandardMaterial color={TRUNK} />
      </mesh>
      {/* stacked column puffs */}
      <mesh castShadow position={[0, th + r1 * 0.58, 0]}>
        <sphereGeometry args={[r1, 7, 5]} />
        <meshStandardMaterial color={a} roughness={0.5} emissive={a} emissiveIntensity={0.26} />
      </mesh>
      <mesh castShadow position={[0.04, th + r1 * 0.58 + r1 + r2 * 0.5, 0]}>
        <sphereGeometry args={[r2, 7, 5]} />
        <meshStandardMaterial color={b} roughness={0.5} emissive={b} emissiveIntensity={0.22} />
      </mesh>
      <mesh castShadow position={[0, th + r1 * 0.58 + r1 + r2 + r3 * 0.42, 0]}>
        <sphereGeometry args={[r3, 6, 5]} />
        <meshStandardMaterial color={c} roughness={0.5} emissive={c} emissiveIntensity={0.18} />
      </mesh>
      {/* side accent puff */}
      <mesh position={[r1 * 0.55, th + r1 * 0.58 + r2 * 0.3, 0.05]}>
        <sphereGeometry args={[r3 * 0.78, 6, 5]} />
        <meshStandardMaterial color={a} roughness={0.5} emissive={a} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

/* ── Dispatch by variant ── */
function BlossomTree({ x, z, scale = 1, variant = 0 }) {
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const v = variant % 5
  if (v === 1) return <WisteriaTree x={x} z={z} scale={scale} phase={phase} />
  if (v === 2) return <GoldenTree   x={x} z={z} scale={scale} phase={phase} />
  if (v === 3) return <OakTree      x={x} z={z} scale={scale} phase={phase} />
  if (v === 4) return <TowerTree    x={x} z={z} scale={scale} phase={phase} />
  return <CherryTree x={x} z={z} scale={scale} phase={phase} />
}

/* ── Small decorative rock ── */
function Rock({ x, z }) {
  return (
    <group position={[x, 0.11, z]}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={ROCK_COLOR} />
      </mesh>
      <mesh position={[0.08, -0.04, 0.05]} scale={[0.7, 0.6, 0.8]}>
        <dodecahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color={ROCK_DARK} />
      </mesh>
    </group>
  )
}

/* ── Tiny grass tufts ── */
function GrassTuft({ x, z }) {
  return (
    <group position={[x, 0.14, z]}>
      {[0, 0.12, -0.1].map((ox, i) => (
        <mesh key={i} position={[ox, 0.06, i * 0.05]} rotation={[0, i * 1.2, 0.2]}>
          <coneGeometry args={[0.04, 0.14, 4]} />
          <meshStandardMaterial color={GRASS_DARK} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Falling petals (color-aware) ── */
function FallingPetals({ count, color = '#FFB7C5' }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const petals = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 5,
    y: 2 + Math.random() * 3,
    z: (Math.random() - 0.5) * 5,
    vx: (Math.random() - 0.5) * 0.004,
    vy: -(0.006 + Math.random() * 0.006),
    vz: (Math.random() - 0.5) * 0.004,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    phase: Math.random() * Math.PI * 2,
  })), [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    petals.forEach((p, i) => {
      p.y += p.vy
      p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.002
      p.rot += p.rotSpeed
      if (p.y < -1.5) { p.y = 4; p.x = (Math.random() - 0.5) * 5; p.z = (Math.random() - 0.5) * 5 }
      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rot, p.rot * 0.5, 0)
      dummy.scale.setScalar(0.08)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <circleGeometry args={[1, 5]} />
      <meshStandardMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} emissive={color} emissiveIntensity={0.15} />
    </instancedMesh>
  )
}

/* ── Seedling (day 0) ── */
function Seedling() {
  const ref = useRef()
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.4 })
  return (
    <group ref={ref} position={[0, 0.11, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 5]} />
        <meshStandardMaterial color={TRUNK} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.18, 6, 5]} />
        <meshStandardMaterial color={PALETTES[0].a} />
      </mesh>
      <mesh position={[0.12, 0.34, 0]}>
        <sphereGeometry args={[0.12, 6, 5]} />
        <meshStandardMaterial color={PALETTES[0].c} roughness={0.55} emissive={PALETTES[0].c} emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

/* ── Mini pond ── */
function Pond() {
  return (
    <group position={[1.1, 0.12, 0.6]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 10]} />
        <meshStandardMaterial color="#74B8E8" transparent opacity={0.85} roughness={0.1} metalness={0.25} emissive="#74B8E8" emissiveIntensity={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.01]}>
        <ringGeometry args={[0.38, 0.46, 10]} />
        <meshStandardMaterial color="#5A8FA0" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.06, 0.06, 0.01]} scale={[1, 0.6, 1]}>
        <circleGeometry args={[0.1, 8]} />
        <meshStandardMaterial color="#BFDFFF" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ── Floating cloud ── */
function Cloud({ x, y, z, speed = 0.15, scale = 1 }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.x = x + Math.sin(clock.elapsedTime * speed + offset) * 0.6
    ref.current.position.y = y + Math.cos(clock.elapsedTime * speed * 0.7 + offset) * 0.1
  })
  return (
    <group ref={ref} position={[x, y, z]} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.38, 7, 5]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.92} />
      </mesh>
      <mesh position={[-0.3, -0.1, 0]}>
        <sphereGeometry args={[0.28, 6, 5]} />
        <meshStandardMaterial color="#F5F5F5" transparent opacity={0.88} />
      </mesh>
      <mesh position={[0.3, -0.1, 0]}>
        <sphereGeometry args={[0.24, 6, 5]} />
        <meshStandardMaterial color="#F5F5F5" transparent opacity={0.88} />
      </mesh>
      <mesh position={[0.1, 0.2, 0]}>
        <sphereGeometry args={[0.22, 6, 5]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

/* ── Butterfly ── */
function Butterfly({ radius = 2.2, height = 1.6, speed = 0.5, wingColor = '#FF92A5' }) {
  const ref = useRef()
  const wingRef1 = useRef()
  const wingRef2 = useRef()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ref.current) {
      const angle = t * speed + phase
      ref.current.position.x = Math.cos(angle) * radius
      ref.current.position.z = Math.sin(angle) * radius * 0.6
      ref.current.position.y = height + Math.sin(t * 1.8) * 0.3
      ref.current.rotation.y = -angle + Math.PI / 2
    }
    const flap = Math.abs(Math.sin(t * 6)) * 0.7
    if (wingRef1.current) wingRef1.current.rotation.y = -flap
    if (wingRef2.current) wingRef2.current.rotation.y = flap
  })
  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.018, 0.025, 0.11, 6]} />
        <meshStandardMaterial color="#3D2B2B" />
      </mesh>
      <group ref={wingRef1} position={[-0.02, 0, 0]}>
        <mesh rotation={[0, 0, 0.3]} position={[-0.1, 0.02, 0]} scale={[1.4, 1, 1]}>
          <circleGeometry args={[0.1, 8]} />
          <meshStandardMaterial color={wingColor} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, 0.5]} position={[-0.08, -0.07, 0]} scale={[1.4, 1, 1]}>
          <circleGeometry args={[0.07, 8]} />
          <meshStandardMaterial color={wingColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={wingRef2} position={[0.02, 0, 0]}>
        <mesh rotation={[0, 0, -0.3]} position={[0.1, 0.02, 0]} scale={[1.4, 1, 1]}>
          <circleGeometry args={[0.1, 8]} />
          <meshStandardMaterial color={wingColor} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, -0.5]} position={[0.08, -0.07, 0]} scale={[1.4, 1, 1]}>
          <circleGeometry args={[0.07, 8]} />
          <meshStandardMaterial color={wingColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

/* ── Tree layout: 15 positions cycling through all 5 variant types ── */
const TREE_POSITIONS = [
  { x: 0,     z: -1.2,  scale: 1.15, variant: 0 }, // cherry
  { x: -1.1,  z: -0.5,  scale: 0.95, variant: 1 }, // wisteria
  { x:  1.2,  z: -0.4,  scale: 1.0,  variant: 2 }, // golden
  { x: -0.4,  z:  0.8,  scale: 1.05, variant: 3 }, // oak
  { x:  0.9,  z:  0.9,  scale: 0.88, variant: 4 }, // tower
  { x: -1.6,  z:  0.4,  scale: 0.78, variant: 0 }, // cherry
  { x:  1.8,  z: -1.0,  scale: 0.82, variant: 1 }, // wisteria
  { x: -0.9,  z: -1.6,  scale: 0.9,  variant: 2 }, // golden
  { x:  0.3,  z:  1.8,  scale: 0.75, variant: 3 }, // oak
  { x:  1.5,  z:  1.5,  scale: 0.7,  variant: 4 }, // tower
  { x: -1.8,  z: -1.2,  scale: 0.72, variant: 0 },
  { x: -0.2,  z: -2.2,  scale: 0.68, variant: 1 },
  { x:  2.1,  z:  0.2,  scale: 0.65, variant: 2 },
  { x: -2.1,  z:  1.0,  scale: 0.62, variant: 3 },
  { x:  1.0,  z: -2.1,  scale: 0.6,  variant: 4 },
]

const GRASS_TUFTS = [
  { x: 0.5, z: 0.3 }, { x: -0.7, z: 1.1 }, { x: 1.4, z: 0.5 },
  { x: -1.2, z: -0.9 }, { x: 0.2, z: -1.8 }, { x: -2.0, z: -0.1 },
  { x: 2.2, z: -0.6 }, { x: -0.4, z: 2.1 },
]

/* ── Main scene ── */
function GardenScene({ bloodFreeDays }) {
  const treeCount = Math.min(bloodFreeDays, TREE_POSITIONS.length)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(5.5, 6.5, 5.5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  // Petal colors scale with unique trees added
  const petalColors = PETAL_COLORS.filter((_, i) => treeCount > i * 3)

  return (
    <>
      <color attach="background" args={['#FFF5F7']} />
      <ambientLight intensity={0.9} color="#FFF8F0" />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.4}
        color="#FFF0D0"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.4} color="#D0E8FF" />
      <pointLight position={[0, -0.5, 0]} intensity={0.3} color="#FFD6A0" />

      <Island />

      {bloodFreeDays === 0 ? (
        <Seedling />
      ) : (
        TREE_POSITIONS.slice(0, treeCount).map((t, i) => (
          <BlossomTree key={i} x={t.x} z={t.z} scale={t.scale} variant={t.variant} />
        ))
      )}

      {GRASS_TUFTS.map((g, i) => <GrassTuft key={i} x={g.x} z={g.z} />)}

      <Rock x={-0.6} z={0.3} />
      <Rock x={1.7} z={-1.6} />
      <Pond />

      <Cloud x={-3.5} y={4.2} z={-2.0} speed={0.12} scale={0.9} />
      <Cloud x={3.0}  y={4.8} z={1.5}  speed={0.09} scale={0.7} />
      <Cloud x={0.5}  y={5.2} z={-3.5} speed={0.14} scale={1.1} />

      {/* Multi-colored petals unlock progressively */}
      {bloodFreeDays > 1 && <FallingPetals count={Math.min(bloodFreeDays * 2, 18)} color={PETAL_COLORS[0]} />}
      {bloodFreeDays > 5 && <FallingPetals count={Math.min((bloodFreeDays - 5) * 2, 14)} color={PETAL_COLORS[1]} />}
      {bloodFreeDays > 10 && <FallingPetals count={Math.min((bloodFreeDays - 10) * 2, 10)} color={PETAL_COLORS[2]} />}

      {/* Butterflies unlock at milestones */}
      {bloodFreeDays > 1  && <Butterfly radius={2.0} height={1.8} speed={0.45} wingColor={PALETTES[0].b} />}
      {bloodFreeDays > 5  && <Butterfly radius={2.8} height={2.4} speed={0.3}  wingColor={PALETTES[1].a} />}
      {bloodFreeDays > 10 && <Butterfly radius={2.2} height={2.0} speed={0.55} wingColor={PALETTES[2].a} />}

      <EffectComposer>
        <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.4} intensity={0.6} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.8}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  )
}

/* ── Export ── */
export default function HealingGarden3D({ bloodFreeDays = 0, theme = {} }) {
  const [showHint, setShowHint] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
      <Canvas
        shadows
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [5.5, 6.5, 5.5], fov: 38 }}
        gl={{ alpha: false, antialias: true }}
        frameloop="always"
      >
        <GardenScene bloodFreeDays={bloodFreeDays} />
      </Canvas>

      {bloodFreeDays > 0 && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(6px)',
          borderRadius: 20, padding: '4px 10px',
          fontSize: 11, fontWeight: 700, color: '#E8705A',
          pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          🌸 Day {bloodFreeDays}
        </div>
      )}

      {showHint && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.45)',
          color: '#fff', fontSize: 10, fontWeight: 600,
          borderRadius: 12, padding: '4px 12px',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          opacity: showHint ? 1 : 0,
          transition: 'opacity 0.5s',
        }}>
          Pinch or scroll to zoom · drag to rotate
        </div>
      )}
    </div>
  )
}
