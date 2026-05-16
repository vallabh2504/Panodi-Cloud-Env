import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ── Flower mesh geometry constants ── */
const TORUS_ARGS = [0.13, 0.055, 8, 6]
const CYLINDER_ARGS = [0.02, 0.03, 0.6, 6]

/* ── Particle system for newest flower burst ── */
function FlowerBurst({ position, active }) {
  const meshRef = useRef(null)
  const stateRef = useRef({ particles: [], t: 0 })
  const dummyRef = useRef(new THREE.Object3D())

  // Initialize particles on mount
  useMemo(() => {
    stateRef.current.particles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      return {
        vx: Math.cos(angle) * 0.04,
        vy: 0.03 + Math.random() * 0.02,
        vz: Math.sin(angle) * 0.04,
        x: position[0], y: position[1], z: position[2],
        life: 1,
      }
    })
    stateRef.current.t = 0
  }, [position[0], position[1], position[2]])

  const { invalidate: invalidateBurst } = useThree()

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return
    const state = stateRef.current
    state.t += delta
    if (state.t > 0.8) return

    const dummy = dummyRef.current
    state.particles.forEach((p, i) => {
      p.x += p.vx
      p.y += p.vy
      p.z += p.vz
      p.vy -= 0.002
      p.life = 1 - state.t / 0.8
      dummy.position.set(p.x, p.y, p.z)
      const s = p.life * 0.12
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.material.opacity = stateRef.current.particles[0]?.life ?? 0
    invalidateBurst()
  })

  if (!active) return null

  return (
    <instancedMesh ref={meshRef} args={[null, null, 12]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#FFD700" transparent opacity={1} />
    </instancedMesh>
  )
}

/* ── Flower field: instanced heads + stems ── */
function FlowerField({ count, theme, burstIndex }) {
  const headRef = useRef(null)
  const stemRef = useRef(null)
  const centerRef = useRef(null)
  const clockRef = useRef(0)
  const dummyRef = useRef(new THREE.Object3D())

  // Pre-compute flower positions and colors
  const flowers = useMemo(() => {
    const primary = theme.primary || '#E57BA4'
    const accent = theme.accent || theme.primaryLight || '#C9A8F5'
    return Array.from({ length: count }, (_, i) => {
      const x = (i - count / 2) * 0.7
      const z = Math.sin(i * 0.5) * 0.5 - 1
      const y = 0
      const stemHeight = 0.6 + i * 0.008
      const color = i % 2 === 0 ? primary : accent
      return { x, y, z, stemHeight, color }
    })
  }, [count, theme.primary, theme.accent, theme.primaryLight])

  // Set initial matrices and colors once
  useEffect(() => {
    if (!headRef.current || !stemRef.current) return
    const dummy = new THREE.Object3D()

    flowers.forEach((f, i) => {
      // Flower head
      dummy.position.set(f.x, f.y + f.stemHeight + 0.18, f.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      headRef.current.setMatrixAt(i, dummy.matrix)
      headRef.current.setColorAt(i, new THREE.Color(f.color))

      // Stem
      dummy.position.set(f.x, f.y + f.stemHeight / 2, f.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(1, f.stemHeight / 0.6, 1)
      dummy.updateMatrix()
      stemRef.current.setMatrixAt(i, dummy.matrix)
    })

    headRef.current.instanceMatrix.needsUpdate = true
    headRef.current.instanceColor.needsUpdate = true
    stemRef.current.instanceMatrix.needsUpdate = true
  }, [flowers])

  // Wind animation
  const { invalidate } = useThree()

  useFrame(({ clock }) => {
    if (!headRef.current || !stemRef.current) return
    const t = clock.elapsedTime
    const dummy = dummyRef.current

    flowers.forEach((f, i) => {
      const sway = Math.sin(t * 0.7 + i * 0.4) * 0.06

      // Head sways
      dummy.position.set(
        f.x + sway * (f.stemHeight + 0.18),
        f.y + f.stemHeight + 0.18,
        f.z
      )
      dummy.rotation.set(0, 0, sway)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      headRef.current.setMatrixAt(i, dummy.matrix)
      if (centerRef.current) centerRef.current.setMatrixAt(i, dummy.matrix)

      // Stem sways
      dummy.position.set(
        f.x + sway * (f.stemHeight / 2),
        f.y + f.stemHeight / 2,
        f.z
      )
      dummy.rotation.set(0, 0, sway * 0.5)
      dummy.scale.set(1, f.stemHeight / 0.6, 1)
      dummy.updateMatrix()
      stemRef.current.setMatrixAt(i, dummy.matrix)
    })

    headRef.current.instanceMatrix.needsUpdate = true
    stemRef.current.instanceMatrix.needsUpdate = true
    if (centerRef.current) centerRef.current.instanceMatrix.needsUpdate = true
    invalidate()
  })

  // Newest flower position for burst
  const newestFlower = flowers[count - 1]
  const burstPos = newestFlower
    ? [newestFlower.x, newestFlower.y + newestFlower.stemHeight + 0.18, newestFlower.z]
    : [0, 0.78, -1]

  return (
    <>
      <instancedMesh ref={headRef} args={[null, null, count]} frustumCulled={false}>
        <torusGeometry args={TORUS_ARGS} />
        <meshStandardMaterial metalness={0.1} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={centerRef} args={[null, null, count]} frustumCulled={false}>
        <circleGeometry args={[0.06, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.2} roughness={0.4} />
      </instancedMesh>
      <instancedMesh ref={stemRef} args={[null, null, count]}>
        <cylinderGeometry args={CYLINDER_ARGS} />
        <meshStandardMaterial color="#4CAF50" metalness={0.1} roughness={0.5} />
      </instancedMesh>
      <FlowerBurst position={burstPos} active={burstIndex > 0} />
    </>
  )
}

/* ── Ground plane ── */
function Ground({ theme }) {
  const color = theme.tipBg || '#F0FFF4'
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  )
}

/* ── Zero state sprout cone ── */
function Sprout({ theme }) {
  return (
    <mesh position={[0, 0.4, -1]}>
      <coneGeometry args={[0.2, 0.8, 8]} />
      <meshStandardMaterial color={theme.primary || '#E57BA4'} roughness={0.6} />
    </mesh>
  )
}

/* ── Scene wrapper ── */
function GardenScene({ bloodFreeDays, theme, burstIndex }) {
  const count = Math.min(bloodFreeDays, 30)

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <Ground theme={theme} />
      {count === 0
        ? <Sprout theme={theme} />
        : <FlowerField count={count} theme={theme} burstIndex={burstIndex} />
      }
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  )
}

/* ── Main export ── */
export default function HealingGarden3D({ bloodFreeDays = 0, theme = {} }) {
  const [burstIndex, setBurstIndex] = useState(bloodFreeDays)
  const prevDaysRef = useRef(bloodFreeDays)

  useEffect(() => {
    if (bloodFreeDays !== prevDaysRef.current) {
      prevDaysRef.current = bloodFreeDays
      setBurstIndex(b => b + 1)
    }
  }, [bloodFreeDays])

  return (
    <div style={{ position: 'relative', width: '100%', height: 200 }}>
      <Canvas
        style={{ width: '100%', height: 200, borderRadius: 16 }}
        camera={{ position: [0, 2.5, 5], fov: 45 }}
        gl={{ alpha: true }}
        frameloop="demand"
      >
        <GardenScene bloodFreeDays={bloodFreeDays} theme={theme} burstIndex={burstIndex} />
      </Canvas>
      {bloodFreeDays === 0 && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 0,
          right: 0,
          textAlign: 'center',
          pointerEvents: 'none',
          fontSize: 12,
          color: theme.textMuted || '#888',
          fontWeight: 600,
        }}>
          Plant your first flower — log a blood-free day
        </div>
      )}
    </div>
  )
}
