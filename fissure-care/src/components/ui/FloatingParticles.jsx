// Renders 8 floating blobs/particles that drift around the screen
// Uses CSS classes defined in index.css: .particle, .particle-1 through .particle-8
// Pass variant='hero' for the hero variant (light particles on dark bg)
// Pass variant='page' for the page variant (subtle colored blobs on light bg)

export default function FloatingParticles({ variant = 'page' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className={`particle particle-${i + 1} particle--${variant}`} />
      ))}
    </div>
  )
}
