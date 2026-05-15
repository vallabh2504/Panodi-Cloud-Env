import { useEffect, useId } from 'react'
import { motion } from 'framer-motion'

/* 1. FlameIcon — animated organic flame */
export function FlameIcon({ size = 28, color = '#E8705A', style = {} }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 24 32" fill="none" style={style}>
      <g style={{ transformOrigin: '12px 28px', animation: 'svgFlameDance 1.8s ease-in-out infinite' }}>
        <path d="M12 2C12 2 4 9 4 17C4 22 7.6 27 12 27C16.4 27 20 22 20 17C20 9 12 2 12 2Z"
          fill={color} opacity="0.9" />
        <path d="M12 10C12 10 8 14 8 18C8 21 9.8 24 12 24C14.2 24 16 21 16 18C16 14 12 10 12 10Z"
          fill="#fff" opacity="0.35" />
      </g>
    </svg>
  )
}

/* 2. SunIcon — spinning sun rays */
export function SunIcon({ size = 32, color = '#F5C67A', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <circle cx="16" cy="16" r="6.5" fill={color} />
      <g style={{ transformOrigin: '16px 16px', animation: 'svgSunSpin 12s linear infinite' }}>
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a}
            x1="16" y1="3.5" x2="16" y2="1"
            stroke={color} strokeWidth="2.2" strokeLinecap="round"
            style={{ transformOrigin: '16px 16px', transform: `rotate(${a}deg)` }}
          />
        ))}
      </g>
    </svg>
  )
}

/* 3. MoonIcon — glowing crescent */
export function MoonIcon({ size = 28, color = '#C9A8F5', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ animation: 'svgMoonGlow 3s ease-in-out infinite', ...style }}>
      <path d="M14 4C9 4 5 8.5 5 14C5 19.5 9 24 14 24C11.5 22 10 18.5 10 14C10 9.5 11.5 6 14 4Z"
        fill={color} />
      <circle cx="19" cy="8" r="1.5" fill={color} opacity="0.5" />
      <circle cx="22" cy="14" r="1" fill={color} opacity="0.4" />
      <circle cx="18" cy="19" r="1.2" fill={color} opacity="0.45" />
    </svg>
  )
}

/* 4. WaterDropFill — drop that fills upward with SMIL */
export function WaterDropFill({ size = 32, color = '#A8D5A2', filled = true, style = {} }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 28 34" fill="none" style={style}>
      <defs>
        <clipPath id={`wdc-${id}`}>
          <rect x="0" width="28" height="34">
            {filled && (
              <animate attributeName="y" from="34" to="0" dur="1.2s" fill="freeze" />
            )}
          </rect>
        </clipPath>
      </defs>
      <path d="M14 1C14 1 2 14 2 21C2 28 7.4 33 14 33C20.6 33 26 28 26 21C26 14 14 1 14 1Z"
        fill={color} opacity="0.2" />
      <path d="M14 1C14 1 2 14 2 21C2 28 7.4 33 14 33C20.6 33 26 28 26 21C26 14 14 1 14 1Z"
        fill={color} clipPath={`url(#wdc-${id})`} opacity="0.85" />
      <path d="M14 1C14 1 2 14 2 21C2 28 7.4 33 14 33C20.6 33 26 28 26 21C26 14 14 1 14 1Z"
        fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

/* 5. HeartPulse — beating heart */
export function HeartPulse({ size = 56, color = '#E8705A', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={style}>
      <motion.path
        d="M28 44C28 44 8 31 8 19C8 13 12.5 8 18 8C22 8 25.5 10 28 14C30.5 10 34 8 38 8C43.5 8 48 13 48 19C48 31 28 44 28 44Z"
        fill={color}
        animate={{ scale: [1, 1.13, 0.97, 1.06, 1] }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
        style={{ transformOrigin: '28px 28px' }}
      />
      <motion.path
        d="M28 37C28 37 14 27 14 19C14 15.7 16.5 13 20 13C23 13 26 15 28 19C30 15 33 13 36 13C39.5 13 42 15.7 42 19C42 27 28 37 28 37Z"
        fill="#fff"
        opacity="0.25"
        animate={{ scale: [1, 1.13, 0.97, 1.06, 1] }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
        style={{ transformOrigin: '28px 28px' }}
      />
    </svg>
  )
}

/* 6. BloomFlower — petals opening */
export function BloomFlower({ size = 80, color = '#E8705A', style = {} }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
      {petals.map((angle, i) => (
        <motion.ellipse key={i}
          cx="40" cy="22" rx="8" ry="16"
          fill={color} opacity="0.82"
          style={{ transformOrigin: '40px 40px', transform: `rotate(${angle}deg)` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.82 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 220, damping: 16 }}
        />
      ))}
      <motion.circle cx="40" cy="40" r="10" fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 300, damping: 18 }}
      />
      <motion.circle cx="40" cy="40" r="5" fill="#fff" opacity="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 18 }}
      />
    </svg>
  )
}

/* 7. CheckDrawn — stroke path draws itself */
export function CheckDrawn({ size = 32, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <motion.circle cx="16" cy="16" r="14" fill={color} opacity="0.15"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      />
      <motion.path
        d="M7 16.5L12.5 22L25 9"
        stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
      />
    </svg>
  )
}

/* 8. SteamWisps — 3 rising wisps */
export function SteamWisps({ size = 44, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 48" fill="none" style={style}>
      <g opacity="0.75">
        <path d="M14 44C14 44 16 38 14 34C12 30 14 26 14 22"
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          style={{ animation: 'svgSteam1 1.8s ease-out infinite' }} />
        <path d="M22 44C22 44 24 37 22 33C20 29 22 25 22 20"
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          style={{ animation: 'svgSteam2 2s ease-out infinite 0.3s' }} />
        <path d="M30 44C30 44 32 38 30 34C28 30 30 26 30 22"
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          style={{ animation: 'svgSteam3 1.9s ease-out infinite 0.6s' }} />
      </g>
    </svg>
  )
}

/* 9. StarField — twinkling star cluster */
export function StarField({ size = 60, color = '#F5C67A', style = {} }) {
  const stars = [
    { x: 30, y: 12, r: 5, anim: 'svgStarA 1.4s ease-in-out infinite' },
    { x: 10, y: 28, r: 3, anim: 'svgStarB 1.8s ease-in-out infinite 0.3s' },
    { x: 50, y: 26, r: 4, anim: 'svgStarA 1.6s ease-in-out infinite 0.5s' },
    { x: 20, y: 48, r: 3.5, anim: 'svgStarB 2s ease-in-out infinite 0.2s' },
    { x: 48, y: 48, r: 3, anim: 'svgStarA 1.5s ease-in-out infinite 0.7s' },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style}>
      {stars.map((s, i) => (
        <polygon key={i}
          points={`${s.x},${s.y - s.r} ${s.x + s.r * 0.35},${s.y - s.r * 0.35} ${s.x + s.r},${s.y} ${s.x + s.r * 0.35},${s.y + s.r * 0.35} ${s.x},${s.y + s.r} ${s.x - s.r * 0.35},${s.y + s.r * 0.35} ${s.x - s.r},${s.y} ${s.x - s.r * 0.35},${s.y - s.r * 0.35}`}
          fill={color}
          style={{ transformOrigin: `${s.x}px ${s.y}px`, animation: s.anim }}
        />
      ))}
    </svg>
  )
}

/* 10. WaveBar — flowing horizontal wave */
export function WaveBar({ width = '100%', color = '#E8705A', opacity = 0.3, style = {} }) {
  return (
    <div style={{ overflow: 'hidden', height: 18, ...style }}>
      <svg width="200%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none"
        style={{ animation: 'svgWaveShift 4s linear infinite' }}>
        <path d="M0 9C25 3 50 15 75 9S125 3 150 9S175 15 200 9S225 3 250 9S275 15 300 9S325 3 350 9S375 15 400 9V18H0Z"
          fill={color} opacity={opacity} />
      </svg>
    </div>
  )
}

/* 11. HealingLeaf — gently swaying leaf */
export function HealingLeaf({ size = 22, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 22 26" fill="none"
      style={{ animation: 'svgLeafSway 3s ease-in-out infinite', ...style }}>
      <path d="M11 2C11 2 3 8 3 15C3 20 6.6 25 11 25C15.4 25 19 20 19 15C19 8 11 2 11 2Z"
        fill={color} opacity="0.85" />
      <path d="M11 4L11 23" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M11 10C9 8 7 9 7 11" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      <path d="M11 15C13 13 15 14 15 16" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

/* 12. SeedlingGrow — sprouting plant path-draw */
export function SeedlingGrow({ size = 80, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
      {/* Soil mound */}
      <motion.ellipse cx="40" cy="68" rx="24" ry="7" fill={color} opacity="0.2"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      {/* Stem */}
      <motion.line x1="40" y1="68" x2="40" y2="28"
        stroke={color} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      />
      {/* Left leaf */}
      <motion.path d="M40 50C36 44 26 43 24 48C22 53 30 56 40 50Z"
        fill={color} opacity="0.9"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 220, damping: 16 }}
        style={{ transformOrigin: '40px 50px' }}
      />
      {/* Right leaf */}
      <motion.path d="M40 38C44 32 54 31 56 36C58 41 50 44 40 38Z"
        fill={color} opacity="0.9"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 16 }}
        style={{ transformOrigin: '40px 38px' }}
      />
      {/* Tiny bud */}
      <motion.circle cx="40" cy="26" r="5" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 14 }}
      />
    </svg>
  )
}

/* 13. MoonCrescent — already handled by MoonIcon, this is PulseRings */
export function PulseRings({ size = 44, color = '#E8705A', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none"
      style={{ overflow: 'visible', ...style }}>
      <circle cx="22" cy="22" r="8"
        fill={color} opacity="0.9" />
      <circle cx="22" cy="22" r="8"
        fill="none" stroke={color} strokeWidth="2" opacity="0.6"
        style={{ animation: 'svgRipple1 2.2s ease-out infinite' }} />
      <circle cx="22" cy="22" r="8"
        fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"
        style={{ animation: 'svgRipple2 2.2s ease-out infinite 0.7s' }} />
    </svg>
  )
}

/* 14. BubblesFloat — rising bubbles */
export function BubblesFloat({ size = 36, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 36 50" fill="none" style={style}>
      <circle cx="10" cy="42" r="6"
        fill="none" stroke={color} strokeWidth="1.8"
        style={{ animation: 'svgBubble1 2.2s ease-in-out infinite' }} />
      <circle cx="26" cy="44" r="4.5"
        fill="none" stroke={color} strokeWidth="1.5"
        style={{ animation: 'svgBubble2 2.5s ease-in-out infinite 0.4s' }} />
      <circle cx="18" cy="46" r="5.5"
        fill="none" stroke={color} strokeWidth="1.6"
        style={{ animation: 'svgBubble3 2s ease-in-out infinite 0.8s' }} />
    </svg>
  )
}

/* 15. HealingOrb — morphing blob with orbiting dot */
export function HealingOrb({ size = 44, color = '#C9A8F5', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none"
      style={{ overflow: 'visible', ...style }}>
      <circle cx="22" cy="22" r="14" fill={color} opacity="0.25"
        style={{ animation: 'svgBlobMorph 4s ease-in-out infinite' }} />
      <circle cx="22" cy="22" r="8" fill={color} opacity="0.7" />
      <circle cx="22" cy="22" r="4" fill={color} />
      {/* Orbiting dot */}
      <circle cx="22" cy="8" r="3" fill={color}
        style={{ transformOrigin: '22px 22px', animation: 'svgOrbitDot 2s linear infinite' }} />
    </svg>
  )
}
