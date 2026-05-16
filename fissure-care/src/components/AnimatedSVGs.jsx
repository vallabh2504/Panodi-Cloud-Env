import { useId } from 'react'
import { motion } from 'framer-motion'

/* 1. FlameIcon — animated organic flame
   FIX: transform-origin moved to element style (not inside @keyframes) */
export function FlameIcon({ size = 28, color = '#E8705A', style = {} }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 24 32" fill="none" style={style}>
      <g style={{
        transformOrigin: '12px 26px',
        transformBox: 'fill-box',
        animation: 'svgFlameDance 1.8s ease-in-out infinite',
      }}>
        <path d="M12 2C12 2 4 9 4 17C4 22 7.6 27 12 27C16.4 27 20 22 20 17C20 9 12 2 12 2Z"
          fill={color} opacity="0.9" />
        <path d="M12 10C12 10 8 14 8 18C8 21 9.8 24 12 24C14.2 24 16 21 16 18C16 14 12 10 12 10Z"
          fill="#fff" opacity="0.35" />
      </g>
    </svg>
  )
}

/* 2. SunIcon — spinning sun rays
   FIX: use SVG transform attribute (not CSS) for static ray rotation so it's
   in SVG coordinate space; CSS animation only on the spinning group */
export function SunIcon({ size = 32, color = '#F5C67A', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <circle cx="16" cy="16" r="6.5" fill={color} />
      <g style={{ transformOrigin: '16px 16px', animation: 'svgSunSpin 12s linear infinite' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <line key={a}
            x1="16" y1="2" x2="16" y2="5"
            stroke={color} strokeWidth="2.2" strokeLinecap="round"
            transform={`rotate(${a} 16 16)`}
          />
        ))}
      </g>
    </svg>
  )
}

/* 3. MoonIcon — glowing crescent */
export function MoonIcon({ size = 28, color = '#C9A8F5', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none"
      style={{ animation: 'svgMoonGlow 3s ease-in-out infinite', ...style }}>
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
        fill="#fff" opacity="0.25"
        animate={{ scale: [1, 1.13, 0.97, 1.06, 1] }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
        style={{ transformOrigin: '28px 28px' }}
      />
    </svg>
  )
}

/* 6. BloomFlower — petals opening
   FIX: use Framer Motion `rotate` shorthand instead of CSS transform string so
   Framer Motion can compose scaleY + rotate without overriding static rotate */
export function BloomFlower({ size = 80, color = '#E8705A', style = {} }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
      {petals.map((angle, i) => (
        <motion.ellipse key={i}
          cx="40" cy="22" rx="8" ry="16"
          fill={color}
          style={{ transformOrigin: '40px 40px' }}
          initial={{ scaleY: 0, opacity: 0, rotate: angle }}
          animate={{ scaleY: 1, opacity: 0.82, rotate: angle }}
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

/* 9. StarField — twinkling star cluster
   FIX: add transformBox fill-box so transformOrigin scales from each star's own center */
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
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: s.anim }}
        />
      ))}
    </svg>
  )
}

/* 10. WaveBar — flowing horizontal wave */
export function WaveBar({ color = '#E8705A', opacity = 0.3, style = {} }) {
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

/* 11. HealingLeaf — gently swaying leaf
   FIX: transformOrigin must be on element style, not inside @keyframes */
export function HealingLeaf({ size = 22, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 22 26" fill="none"
      style={{ transformOrigin: 'bottom center', animation: 'svgLeafSway 3s ease-in-out infinite', ...style }}>
      <path d="M11 2C11 2 3 8 3 15C3 20 6.6 25 11 25C15.4 25 19 20 19 15C19 8 11 2 11 2Z"
        fill={color} opacity="0.85" />
      <path d="M11 4L11 23" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M11 10C9 8 7 9 7 11" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      <path d="M11 15C13 13 15 14 15 16" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

/* 12. SeedlingGrow — sprouting plant path-draw
   FIX: use motion.path for stem instead of motion.line (better pathLength support) */
export function SeedlingGrow({ size = 80, color = '#A8D5A2', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
      <motion.ellipse cx="40" cy="68" rx="24" ry="7" fill={color} opacity="0.2"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ transformOrigin: '40px 68px' }}
      />
      <motion.path d="M40 68 L40 28"
        stroke={color} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      />
      <motion.path d="M40 50C36 44 26 43 24 48C22 53 30 56 40 50Z"
        fill={color} opacity="0.9"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 220, damping: 16 }}
        style={{ transformOrigin: '40px 50px' }}
      />
      <motion.path d="M40 38C44 32 54 31 56 36C58 41 50 44 40 38Z"
        fill={color} opacity="0.9"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 16 }}
        style={{ transformOrigin: '40px 38px' }}
      />
      <motion.circle cx="40" cy="26" r="5" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 14 }}
        style={{ transformOrigin: '40px 26px' }}
      />
    </svg>
  )
}

/* 13. PulseRings — ripple rings emanating outward
   FIX: add transformBox fill-box + transformOrigin center so scale goes from circle's center */
export function PulseRings({ size = 44, color = '#E8705A', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none"
      style={{ overflow: 'visible', ...style }}>
      <circle cx="22" cy="22" r="8" fill={color} opacity="0.9" />
      <circle cx="22" cy="22" r="8"
        fill="none" stroke={color} strokeWidth="2" opacity="0.6"
        style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'svgRipple1 2.2s ease-out infinite' }} />
      <circle cx="22" cy="22" r="8"
        fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"
        style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'svgRipple2 2.2s ease-out infinite 0.7s' }} />
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

/* 15. HealingOrb — pulsing orb with orbiting dot
   FIX: border-radius has no effect on SVG circles. Use Framer Motion scale+opacity
   pulse for the blob effect instead */
export function HealingOrb({ size = 44, color = '#C9A8F5', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none"
      style={{ overflow: 'visible', ...style }}>
      <motion.circle cx="22" cy="22" r="18" fill={color} opacity="0.2"
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.08, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '22px 22px' }}
      />
      <motion.circle cx="22" cy="22" r="11" fill={color} opacity="0.5"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        style={{ transformOrigin: '22px 22px' }}
      />
      <circle cx="22" cy="22" r="6" fill={color} />
      <circle cx="22" cy="8" r="3" fill={color}
        style={{ transformOrigin: '22px 22px', animation: 'svgOrbitDot 2s linear infinite' }} />
    </svg>
  )
}

/* 16. WaterRipple — expanding ripple rings with pulsing center dot */
export function WaterRipple({ size = 48, color = '#3B82F4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {[0, 1, 2].map(i => (
        <circle key={i} cx="24" cy="24" r={8 + i * 7} stroke={color} strokeWidth="2" strokeOpacity={0.7 - i * 0.2} fill="none">
          <animate attributeName="r" values={`${6 + i * 6};${14 + i * 7};${6 + i * 6}`} dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values={`${0.8 - i * 0.2};0;${0.8 - i * 0.2}`} dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="24" cy="24" r="5" fill={color} opacity="0.9">
        <animate attributeName="r" values="5;6;5" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/* 17. FoodPop — bouncing food emoji with sparkle accents */
export function FoodPop({ size = 48, color = '#A8D5A2' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" fill={color} opacity="0.2">
        <animate attributeName="r" values="14;17;14" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x="24" y="30" textAnchor="middle" fontSize="22">🍎</text>
      <g opacity="0">
        {['✦','✦','✦'].map((s, i) => (
          <text key={i} x={24 + Math.cos(i * 2.1) * 18} y={24 + Math.sin(i * 2.1) * 18}
            textAnchor="middle" fontSize="10" fill={color}>
            {s}
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </text>
        ))}
      </g>
    </svg>
  )
}

/* 18. WarningWiggle — wiggling warning triangle */
export function WarningWiggle({ size = 48, color = '#F5C67A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0 24 24;-5 24 24;5 24 24;-3 24 24;3 24 24;0 24 24"
          dur="2.5s" repeatCount="indefinite" />
        <polygon points="24,8 42,38 6,38" fill={color} opacity="0.9" />
        <text x="24" y="35" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">!</text>
      </g>
    </svg>
  )
}

/* 19. FlowerBloom — petal ellipses blooming with golden center */
export function FlowerBloom({ size = 48, color = '#E8705A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse key={i} cx={24 + Math.cos(angle * Math.PI / 180) * 10}
          cy={24 + Math.sin(angle * Math.PI / 180) * 10}
          rx="7" ry="4"
          fill={color} opacity="0.85"
          transform={`rotate(${angle} ${24 + Math.cos(angle * Math.PI / 180) * 10} ${24 + Math.sin(angle * Math.PI / 180) * 10})`}>
          <animate attributeName="rx" values="5;8;5" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      <circle cx="24" cy="24" r="6" fill="#FFD700">
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
