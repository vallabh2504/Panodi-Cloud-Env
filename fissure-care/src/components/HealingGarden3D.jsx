import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ── Palette ── */
const GRASS_TOP   = '#6DC05E'
const GRASS_DARK  = '#5AAA4C'
const EARTH       = '#A0724A'
const EARTH_DARK  = '#7A5233'
const TRUNK       = '#7B5A3A'
const TRUNK_DARK  = '#5C3D20'
const BLOSSOM_A   = '#FFB7C5'
const BLOSSOM_B   = '#FF92A5'
const BLOSSOM_C   = '#FFCCD5'
const ROCK_COLOR  = '#9E9E9E'
const ROCK_DARK   = '#757575'
const PETAL_COLOR = '#FFB7C5'

/* ── Island platform ── */
function Island() {
  return (
    <group>
      {/* Grass top face */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.22, 6]} />
        <meshLambertMaterial color={GRASS_TOP} />
      </mesh>
      {/* Darker grass edge ring */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[3.25, 3.4, 0.14, 6]} />
        <meshLambertMaterial color={GRASS_DARK} />
      </mesh>
      {/* Earth side — upper */}
      <mesh position={[0, -0.38, 0]}>
        <cylinderGeometry args={[3.4, 3.1, 0.52, 6]} />
        <meshLambertMaterial color={EARTH} />
      </mesh>
      {/* Earth side — lower taper */}
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[3.1, 2.2, 0.52, 6]} />
        <meshLambertMaterial color={EARTH_DARK} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[2.2, 2.0, 0.12, 6]} />
        <meshLambertMaterial color={EARTH_DARK} />
      </mesh>
    </group>
  )
}

/* ── Single cherry blossom tree ── */
function BlossomTree({ x, z, scale = 1, variant = 0 }) {
  const groupRef = useRef()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    // gentle sway
    groupRef.current.rotation.z = Math.sin(t * 0.6 + phase) * 0.025
    groupRef.current.rotation.x = Math.cos(t * 0.5 + phase) * 0.015
  })

  const trunkHeight = 0.7 * scale
  const trunkR = 0.09 * scale
  const canopyR1 = 0.58 * scale
  const canopyR2 = 0.45 * scale
  const canopyR3 = 0.38 * scale
  const blossomColor = variant % 3 === 0 ? BLOSSOM_A : variant % 3 === 1 ? BLOSSOM_B : BLOSSOM_C

  return (
    <group ref={groupRef} position={[x, 0.11, z]}>
      {/* Trunk */}
      <mesh castShadow position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[trunkR * 0.7, trunkR, trunkHeight, 5]} />
        <meshLambertMaterial color={TRUNK} />
      </mesh>
      {/* Trunk dark side */}
      <mesh position={[trunkR * 0.3, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[trunkR * 0.35, trunkR * 0.5, trunkHeight, 5]} />
        <meshLambertMaterial color={TRUNK_DARK} />
      </mesh>

      {/* Main canopy sphere */}
      <mesh castShadow position={[0, trunkHeight + canopyR1 * 0.65, 0]}>
        <sphereGeometry args={[canopyR1, 7, 5]} />
        <meshLambertMaterial color={blossomColor} />
      </mesh>
      {/* Secondary puff — left */}
      <mesh castShadow position={[-canopyR1 * 0.55, trunkHeight + canopyR2 * 0.5, canopyR1 * 0.1]}>
        <sphereGeometry args={[canopyR2, 6, 5]} />
        <meshLambertMaterial color={variant % 2 === 0 ? BLOSSOM_B : BLOSSOM_A} />
      </mesh>
      {/* Secondary puff — right */}
      <mesh castShadow position={[canopyR1 * 0.5, trunkHeight + canopyR3 * 0.6, -canopyR1 * 0.2]}>
        <sphereGeometry args={[canopyR3, 6, 5]} />
        <meshLambertMaterial color={BLOSSOM_C} />
      </mesh>
      {/* Top accent puff */}
      <mesh position={[0, trunkHeight + canopyR1 * 1.3, 0]}>
        <sphereGeometry args={[canopyR3 * 0.8, 6, 5]} />
        <meshLambertMaterial color={BLOSSOM_C} />
      </mesh>
    </group>
  )
}

/* ── Small decorative rock ── */
function Rock({ x, z }) {
  return (
    <group position={[x, 0.11, z]}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshLambertMaterial color={ROCK_COLOR} />
      </mesh>
      <mesh position={[0.08, -0.04, 0.05]} scale={[0.7, 0.6, 0.8]}>
        <dodecahedronGeometry args={[0.14, 0]} />
        <meshLambertMaterial color={ROCK_DARK} />
      </mesh>
    </group>
  )
}

/* ── Tiny grass tufts scattered on island ── */
function GrassTuft({ x, z }) {
  return (
    <group position={[x, 0.14, z]}>
      {[0, 0.12, -0.1].map((ox, i) => (
        <mesh key={i} position={[ox, 0.06, i * 0.05]} rotation={[0, i * 1.2, 0.2]}>
          <coneGeometry args={[0.04, 0.14, 4]} />
          <meshLambertMaterial color={GRASS_DARK} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Falling petals ── */
function FallingPetals({ count }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const petals = useMemo(() => Array.from({ length: count }, (_, i) => ({
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
      <meshLambertMaterial color={PETAL_COLOR} transparent opacity={0.8} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

/* ── Seedling (0 days) ── */
function Seedling() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.4
  })
  return (
    <group ref={ref} position={[0, 0.11, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 5]} />
        <meshLambertMaterial color={TRUNK} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.18, 6, 5]} />
        <meshLambertMaterial color={BLOSSOM_A} />
      </mesh>
      <mesh position={[0.12, 0.34, 0]}>
        <sphereGeometry args={[0.12, 6, 5]} />
        <meshLambertMaterial color={BLOSSOM_C} />
      </mesh>
    </group>
  )
}

/* ── Tree layout — deterministic scatter across island ── */
const TREE_POSITIONS = [
  { x: 0,     z: -1.2,  scale: 1.15, variant: 0 },
  { x: -1.1,  z: -0.5,  scale: 0.95, variant: 1 },
  { x:  1.2,  z: -0.4,  scale: 1.0,  variant: 2 },
  { x: -0.4,  z:  0.8,  scale: 1.05, variant: 1 },
  { x:  0.9,  z:  0.9,  scale: 0.88, variant: 0 },
  { x: -1.6,  z:  0.4,  scale: 0.78, variant: 2 },
  { x:  1.8,  z: -1.0,  scale: 0.82, variant: 1 },
  { x: -0.9,  z: -1.6,  scale: 0.9,  variant: 0 },
  { x:  0.3,  z:  1.8,  scale: 0.75, variant: 2 },
  { x:  1.5,  z:  1.5,  scale: 0.7,  variant: 1 },
  { x: -1.8,  z: -1.2,  scale: 0.72, variant: 0 },
  { x: -0.2,  z: -2.2,  scale: 0.68, variant: 2 },
  { x:  2.1,  z:  0.2,  scale: 0.65, variant: 1 },
  { x: -2.1,  z:  1.0,  scale: 0.62, variant: 0 },
  { x:  1.0,  z: -2.1,  scale: 0.6,  variant: 2 },
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

      {GRASS_TUFTS.map((g, i) => (
        <GrassTuft key={i} x={g.x} z={g.z} />
      ))}

      <Rock x={-0.6} z={0.3} />
      <Rock x={1.7} z={-1.6} />

      {bloodFreeDays > 2 && <FallingPetals count={Math.min(bloodFreeDays * 2, 30)} />}

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.3} intensity={0.4} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  )
}

/* ── Export ── */
export default function HealingGarden3D({ bloodFreeDays = 0, theme = {} }) {
  return (
    <div style={{ width: '100%', height: 240, borderRadius: 16, overflow: 'hidden' }}>
      <Canvas
        shadows
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [5.5, 6.5, 5.5], fov: 38 }}
        gl={{ alpha: false, antialias: true }}
        frameloop="always"
      >
        <GardenScene bloodFreeDays={bloodFreeDays} />
      </Canvas>
    </div>
  )
}
