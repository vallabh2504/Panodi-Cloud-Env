import { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'

// GLSL simplex noise + animated color field shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.18;

    float n1 = snoise(uv * 2.2 + vec2(t * 0.6, t * 0.4)) * 0.5 + 0.5;
    float n2 = snoise(uv * 3.8 + vec2(-t * 0.3, t * 0.7)) * 0.5 + 0.5;
    float n3 = snoise(uv * 1.5 + vec2(t * 0.2, -t * 0.5)) * 0.5 + 0.5;

    float blend1 = smoothstep(0.3, 0.7, n1 * 0.6 + n2 * 0.4);
    float blend2 = smoothstep(0.2, 0.8, n2 * 0.5 + n3 * 0.5);

    vec3 color = mix(uColorA, uColorB, blend1);
    color = mix(color, uColorC, blend2 * 0.45);

    // Subtle vignette to push edges darker
    float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - 0.5) * 1.4);
    color = mix(color * 0.88, color, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`

function ShaderPlane({ colorA, colorB, colorC }) {
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
    uColorC: { value: new THREE.Color(colorC) },
  }), [colorA, colorB, colorC])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function NoiseShaderHero({ theme, style }) {
  // Derive 3 colors from theme for the noise field
  const colorA = theme?.primaryLight || '#FFD6E0'
  const colorB = theme?.secondary || '#F9C5D1'
  const colorC = theme?.background || '#FFF5F7'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }}>
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: false, alpha: false }}
        frameloop="always"
      >
        <ShaderPlane colorA={colorA} colorB={colorB} colorC={colorC} />
      </Canvas>
    </div>
  )
}
