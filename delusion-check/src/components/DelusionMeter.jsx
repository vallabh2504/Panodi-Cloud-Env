import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

const SIZE = 280
const STROKE = 18
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R
// We use 270° arc (from 135° to 405°)
const ARC = (270 / 360) * C
const GAP = C - ARC

// Converts score 0–100 → dash offset along the arc
function scoreToOffset(score) {
  const filled = (score / 100) * ARC
  return C - filled
}

const ZONE_COLORS = [
  '#39ff14', // 0–30   grounded (neon green)
  '#fff01f', // 30–55  mild (neon yellow)
  '#ff6b35', // 55–75  spicy (neon orange)
  '#ff2d78', // 75–100 delulu (neon pink)
]

function getGaugeColor(score) {
  if (score < 30) return ZONE_COLORS[0]
  if (score < 55) return ZONE_COLORS[1]
  if (score < 75) return ZONE_COLORS[2]
  return ZONE_COLORS[3]
}

export default function DelusionMeter({ score = 0, label = '', emoji = '🤡', color = '#39ff14' }) {
  const motionScore = useMotionValue(0)
  const displayScore = useMotionValue(0)
  const needleAngle = useTransform(motionScore, [0, 100], [-135, 135])

  const arcRef = useRef(null)
  const scoreDisplayRef = useRef(null)

  useEffect(() => {
    const controls = animate(motionScore, score, {
      duration: 2,
      ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
      onUpdate(v) {
        if (arcRef.current) {
          const offset = scoreToOffset(v)
          arcRef.current.style.strokeDashoffset = offset
          arcRef.current.style.stroke = getGaugeColor(v)
          arcRef.current.style.filter = `drop-shadow(0 0 8px ${getGaugeColor(v)})`
        }
        if (scoreDisplayRef.current) {
          scoreDisplayRef.current.textContent = Math.round(v)
        }
      },
    })
    return () => controls.stop()
  }, [score, motionScore])

  const cx = SIZE / 2
  const cy = SIZE / 2
  // Start angle = 135° (bottom-left), end = 405°
  const startAngle = 135
  const rotation = startAngle

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="drop-shadow-2xl"
        >
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC} ${GAP}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />

          {/* Active arc */}
          <circle
            ref={arcRef}
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="#39ff14"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC} ${GAP}`}
            strokeDashoffset={C}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ transition: 'stroke 0.3s' }}
          />

          {/* Outer glow ring */}
          <circle
            cx={cx}
            cy={cy}
            r={R + STROKE / 2 + 4}
            fill="none"
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.2}
          />

          {/* Tick marks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = ((startAngle + (i / 10) * 270) * Math.PI) / 180
            const inner = R - STROKE / 2 - 6
            const outer = R - STROKE / 2 - 14
            const x1 = cx + inner * Math.cos(angle)
            const y1 = cy + inner * Math.sin(angle)
            const x2 = cx + outer * Math.cos(angle)
            const y2 = cy + outer * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={i % 5 === 0 ? 2 : 1}
              />
            )
          })}

          {/* Center display */}
          <circle cx={cx} cy={cy} r={R - STROKE - 16} fill="#0a0a18" />
          <circle cx={cx} cy={cy} r={R - STROKE - 18} fill="none" stroke="rgba(57,255,20,0.1)" strokeWidth={1} />

          {/* Score number */}
          <text
            ref={scoreDisplayRef}
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="52"
            fontWeight="bold"
            fontFamily="'Courier New', monospace"
            style={{ filter: `drop-shadow(0 0 12px ${color})` }}
          >
            0
          </text>

          {/* /100 */}
          <text
            x={cx}
            y={cy + 26}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="14"
            fontFamily="'Courier New', monospace"
          >
            / 100
          </text>

          {/* Emoji */}
          <text
            x={cx}
            y={cy + 52}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
          >
            {emoji}
          </text>

          {/* Needle */}
          <motion.g style={{ rotate: needleAngle, originX: `${cx}px`, originY: `${cy}px` }}>
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - R + STROKE + 20}
              stroke="#ff2d78"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px #ff2d78)' }}
            />
            <circle cx={cx} cy={cy} r={6} fill="#ff2d78" style={{ filter: 'drop-shadow(0 0 8px #ff2d78)' }} />
          </motion.g>

          {/* Zone labels */}
          <text x={cx - R + 8} y={cy + R - 8} fill="#39ff14" fontSize="9" fontFamily="monospace" opacity={0.7}>REAL</text>
          <text x={cx + R - 28} y={cy + R - 8} fill="#ff2d78" fontSize="9" fontFamily="monospace" opacity={0.7}>DELULU</text>
        </svg>
      </div>

      {/* Label badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
        className="px-5 py-2 rounded-sm font-bold tracking-widest text-sm uppercase"
        style={{
          border: `1px solid ${color}`,
          color: color,
          background: `${color}18`,
          boxShadow: `0 0 20px ${color}40`,
          textShadow: `0 0 10px ${color}`,
        }}
      >
        {label}
      </motion.div>
    </div>
  )
}
