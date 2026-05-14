export default function ProgressRing({ score = 0, size = 130, strokeWidth = 8, dark = true }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference
  const trackColor = dark ? 'rgba(255,255,255,0.18)' : 'var(--color-surface-soft)'
  const ringColor = dark ? 'rgba(255,255,255,0.9)' : 'var(--color-indigo)'
  const textColor = dark ? '#fff' : 'var(--color-text-primary)'
  const subColor = dark ? 'rgba(255,255,255,0.65)' : 'var(--color-text-muted)'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={ringColor} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 700, color: textColor, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.085, color: subColor, marginTop: 2 }}>of 100</span>
      </div>
    </div>
  )
}
