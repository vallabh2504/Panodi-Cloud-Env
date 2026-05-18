/**
 * FissureCare Icon Library
 * SVG-based icon components replacing emojis throughout the app.
 * All icons: 24×24 viewBox, currentColor stroke, strokeWidth 1.8,
 * strokeLinecap="round" strokeLinejoin="round" — matches Lucide style exactly.
 *
 * Usage: <WaterDrop size={22} color={theme.primary} />
 */

const base = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// ─── Health / Medical ────────────────────────────────────────────────────────

export function WaterDrop({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

export function WaterGlass({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M5 3h14l-2 16H7L5 3z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M5 9h14" />
    </svg>
  )
}

export function Bathtub({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M7 8V5a2 2 0 0 1 4 0v3" />
      <rect {...base} stroke={color} strokeWidth={1.8} x="2" y="8" width="20" height="8" rx="3" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4 16v2m16-2v2" />
    </svg>
  )
}

export function BloodDrop({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 2L7 9a7 7 0 1 0 10 0L12 2z" />
      <path {...base} stroke={color} strokeWidth={1.4} strokeOpacity={0.5}
        d="M9 14a3 3 0 0 0 3 3" />
    </svg>
  )
}

export function Pill({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <rect {...base} stroke={color} strokeWidth={1.8}
        x="3" y="10" width="18" height="7" rx="3.5" transform="rotate(-45 12 13.5)" />
      <line {...base} stroke={color} strokeWidth={1.8}
        x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  )
}

export function Thermometer({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  )
}

export function HeartPulse({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 12h4l2-4 3 8 2-4h5" />
    </svg>
  )
}

export function Heart({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function Stethoscope({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8 15a6 6 0 0 0 6 6h0a6 6 0 0 0 0-12h-.5" />
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="19.5" cy="16.5" r="2.5" />
    </svg>
  )
}

export function Microscope({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 18h8M3 21h18" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 9l1.5-4 3 1-1.5 4" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M11 9l1 2.5a6 6 0 0 1-6 8.5h0a6 6 0 0 1-3-1" />
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="14" cy="5.5" r="2.5" />
    </svg>
  )
}

export function Journal({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line {...base} stroke={color} strokeWidth={1.8} x1="9" y1="7" x2="15" y2="7" />
      <line {...base} stroke={color} strokeWidth={1.8} x1="9" y1="11" x2="15" y2="11" />
    </svg>
  )
}

// ─── Nature / Healing ────────────────────────────────────────────────────────

export function CherryBlossom({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="2" />
      <ellipse {...base} stroke={color} strokeWidth={1.6} cx="12" cy="7" rx="2" ry="3" />
      <ellipse {...base} stroke={color} strokeWidth={1.6} cx="12" cy="17" rx="2" ry="3" />
      <ellipse {...base} stroke={color} strokeWidth={1.6} cx="7" cy="12" rx="3" ry="2" />
      <ellipse {...base} stroke={color} strokeWidth={1.6} cx="17" cy="12" rx="3" ry="2" />
      <ellipse {...base} stroke={color} strokeWidth={1.4} cx="8.5" cy="8.5" rx="1.8" ry="2.5"
        transform="rotate(45 8.5 8.5)" />
      <ellipse {...base} stroke={color} strokeWidth={1.4} cx="15.5" cy="8.5" rx="1.8" ry="2.5"
        transform="rotate(-45 15.5 8.5)" />
      <ellipse {...base} stroke={color} strokeWidth={1.4} cx="8.5" cy="15.5" rx="1.8" ry="2.5"
        transform="rotate(-45 8.5 15.5)" />
      <ellipse {...base} stroke={color} strokeWidth={1.4} cx="15.5" cy="15.5" rx="1.8" ry="2.5"
        transform="rotate(45 15.5 15.5)" />
    </svg>
  )
}

export function Seedling({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 22V12" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 12C12 12 8 10 8 6a4 4 0 0 1 8 0c0 4-4 6-4 6z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 16c0 0-4-1-5-5" />
    </svg>
  )
}

export function Leaf({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 8-8 8" />
    </svg>
  )
}

export function Wave({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}

export function Flower({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="2.5" />
      <path {...base} stroke={color} strokeWidth={1.6}
        d="M12 2a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path {...base} stroke={color} strokeWidth={1.6}
        d="M12 22a3 3 0 0 1-3-3v-4a3 3 0 0 1 6 0v4a3 3 0 0 1-3 3z" />
      <path {...base} stroke={color} strokeWidth={1.6}
        d="M2 12a3 3 0 0 1 3-3h4a3 3 0 0 1 0 6H5a3 3 0 0 1-3-3z" />
      <path {...base} stroke={color} strokeWidth={1.6}
        d="M22 12a3 3 0 0 1-3 3h-4a3 3 0 0 1 0-6h4a3 3 0 0 1 3 3z" />
    </svg>
  )
}

export function Sparkle({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" />
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="4" />
    </svg>
  )
}

export function Flame({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8.5 14.5A2.5 2.5 0 0 0 11 17v0a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.56-2.63-1.5-3.5-.94 1.02-1.5 2-2.5 3.5z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-2.5-5.5C15 11 14 12 12 12c0-2-1-4-3-6-1 3-3 4-3 7a7 7 0 0 0 6 6.93" />
    </svg>
  )
}

export function Moon({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function Sun({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="5" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export function StarIcon({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <polygon {...base} stroke={color} strokeWidth={1.8}
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export function Trophy({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 2h12v10a6 6 0 0 1-12 0V2z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 22v-2h6v2M7 22h10" />
    </svg>
  )
}

export function Celebration({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M5.8 11.3L2 22l10.7-3.79" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M22 2l-2.24 2.24M20 8l2-2M15 7l-1-5" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 12l5-5 5 5-5 5-5-5z" />
    </svg>
  )
}

// ─── Activity / Fitness ──────────────────────────────────────────────────────

export function Running({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="13" cy="4" r="2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M7 22l2-5 3 3 2-8 3 4h3" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8.5 13.5L11 8l4 2 2-4" />
    </svg>
  )
}

export function Walking({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="13" cy="4" r="2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M7 22l2-6m0 0l2-6 4 2 2-5M9 16l-3-2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M13 10l2.5 2L18 8" />
    </svg>
  )
}

export function Yoga({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="4" r="2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 6v6M8 12H4l4 4M16 12h4l-4 4M8 20l4-4 4 4" />
    </svg>
  )
}

export function Sleep({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M17 21H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 10h6l-6 4h6" />
    </svg>
  )
}

export function Footprint({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8 4c0-1 .5-2 2-2s2 1 2 2v4c0 2-1 3-2 4-1-1-2-2-2-4V4z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M16 7c0-1 .5-2 2-2s2 1 2 2v3c0 2-1 3-2 3s-2-1-2-3V7z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 14c-1 0-2 1-2 3s1 5 4 5h1c1 0 2-1 2-3 0-3-2-5-5-5z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M14 17c-1 0-2 1-2 2s1 3 3 3h1c1 0 2-1 2-2 0-2-2-3-4-3z" />
    </svg>
  )
}

export function Watch({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <rect {...base} stroke={color} strokeWidth={1.8} x="6" y="6" width="12" height="12" rx="2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 4h6M9 20h6M12 9v3l2 2" />
    </svg>
  )
}

export function Battery({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <rect {...base} stroke={color} strokeWidth={1.8} x="2" y="7" width="16" height="10" rx="2" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M22 11v2" />
      <line stroke={color} strokeWidth={1.8} x1="5" y1="12" x2="13" y2="12" />
    </svg>
  )
}

// ─── Pain Faces ──────────────────────────────────────────────────────────────

export function FaceRelieved({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="10" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path {...base} stroke={color} strokeWidth={1.4} d="M9 9.5c0-.83.67-1.5 1.5-1.5S12 8.67 12 9.5" />
      <path {...base} stroke={color} strokeWidth={1.4} d="M12 9.5c0-.83.67-1.5 1.5-1.5S15 8.67 15 9.5" />
    </svg>
  )
}

export function FaceNeutral({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="10" />
      <line stroke={color} strokeWidth={1.8} x1="8" y1="15" x2="16" y2="15" />
      <circle fill={color} cx="9" cy="9.5" r="1.2" />
      <circle fill={color} cx="15" cy="9.5" r="1.2" />
    </svg>
  )
}

export function FaceDiscomfort({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="10" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M16 16.5c-.5-1.5-2-2-4-2s-3.5.5-4 2" />
      <path {...base} stroke={color} strokeWidth={1.4} d="M9 9l1 1M15 9l-1 1" />
    </svg>
  )
}

export function FacePain({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="10" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M16 17c-.5-2-2.5-3-4-3s-3.5 1-4 3" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M9 8l2 2-2 2M15 8l-2 2 2 2" />
    </svg>
  )
}

export function FaceSevere({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="10" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M8 18s1-3 4-3 4 3 4 3" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M7 9l3 2M17 9l-3 2" />
      <path {...base} stroke={color} strokeWidth={1.4} d="M9 7l1 1M14 7l1-1" />
    </svg>
  )
}

// ─── Food / Nutrition ────────────────────────────────────────────────────────

export function Apple({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 3c-1 0-2.5 1-2.5 1S6 3 4.5 6c-1.5 3-1 7 1 10s3.5 4 5.5 4h2c2 0 3.5-1 5.5-4s2.5-7 1-10C18 3 16 3 14.5 4c0 0-1.5-1-2.5-1z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 3V1M12 1c1 0 2 1 2 1" />
    </svg>
  )
}

export function Banana({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4 13c.5-4 3.3-8 8-8 5 0 8 4 8 8" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4 13c3 4 7 6 10 6 2 0 3-1 4-3" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 5c0 0-2-2-1-4" />
    </svg>
  )
}

export function Grapes({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.6} fill="none" cx="8" cy="10" r="2.5" />
      <circle stroke={color} strokeWidth={1.6} fill="none" cx="16" cy="10" r="2.5" />
      <circle stroke={color} strokeWidth={1.6} fill="none" cx="12" cy="7" r="2.5" />
      <circle stroke={color} strokeWidth={1.6} fill="none" cx="9" cy="15" r="2.5" />
      <circle stroke={color} strokeWidth={1.6} fill="none" cx="15" cy="15" r="2.5" />
      <circle stroke={color} strokeWidth={1.6} fill="none" cx="12" cy="19.5" r="2.5" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M12 4.5V2.5M12 2.5c1 0 2.5.5 3 1.5" />
    </svg>
  )
}

export function Carrot({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 20L18 4M6 20c2 0 6-2 8-8" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M10 4c0 0 0 4-4 4M12 2c0 0 2 3 0 6M14 4c0 0 2 3 0 6" />
    </svg>
  )
}

export function LeafyGreen({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 22L12 12M12 12C12 6 16 2 22 2c0 6-4 10-10 10z" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M12 12c-2-2-6-3-9-1" />
    </svg>
  )
}

export function Grain({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 22V10M12 10c0-4 4-8 8-8M12 10c0-4-4-8-8-8" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M12 14c0 0 3-2 5-1M12 14c0 0-3-2-5-1" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M12 18c0 0 2-2 4-1M12 18c0 0-2-2-4-1" />
    </svg>
  )
}

export function Coffee({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line stroke={color} strokeWidth={1.8} x1="6" y1="1" x2="6" y2="4" />
      <line stroke={color} strokeWidth={1.8} x1="10" y1="1" x2="10" y2="4" />
      <line stroke={color} strokeWidth={1.8} x1="14" y1="1" x2="14" y2="4" />
    </svg>
  )
}

export function BeerGlass({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M17 11h1a3 3 0 0 1 0 6h-1" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M5 4h12l-1.5 14a1 1 0 0 1-1 .9H7.5a1 1 0 0 1-1-.9L5 4z" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M5 9h12" />
    </svg>
  )
}

export function Bread({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M3 11a4 4 0 0 1 4-4h10a4 4 0 0 1 0 8H7L3 19V11z" />
      <line stroke={color} strokeWidth={1.4} x1="8" y1="11" x2="8" y2="15" />
      <line stroke={color} strokeWidth={1.4} x1="12" y1="11" x2="12" y2="15" />
      <line stroke={color} strokeWidth={1.4} x1="16" y1="11" x2="16" y2="15" />
    </svg>
  )
}

export function FruitGeneric({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="13" r="8" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 5V3M12 3c1.5 0 3 1 3 1" />
    </svg>
  )
}

export function SaladBowl({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 10h20M4 10a8 8 0 0 0 16 0" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M7 6c1-2 3-3 5-3s4 1 5 3" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M9 7c.5-1 1.5-2 3-2" />
    </svg>
  )
}

export function IceCube({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 12L12 2l10 10-10 10L2 12z" />
      <path {...base} stroke={color} strokeWidth={1.2}
        d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function Meat({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M15 7C11 3 4 5 4 11c0 2 1 4 3 5l-3 3 2 2 3-3c3 2 7 1 9-2 2-3 1-7-3-9z" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
  )
}

export function Milk({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8 2h8l1 4-2 2v12a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V8L7 6l1-4z" />
      <line stroke={color} strokeWidth={1.4} x1="8" y1="11" x2="16" y2="11" />
    </svg>
  )
}

export function HotDish({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 15h20M4 15a8 8 0 0 1 16 0" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M2 19h20" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M8 6c0-2 1.5-3 1.5-3S8 4 9 5M12 5c0-2 1.5-3 1.5-3S11 4 12 5M16 6c0-2 1.5-3 1.5-3S15 4 16 5" />
    </svg>
  )
}

export function Blueberry({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="14" r="6" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 8V6M10 6c0-1 1-2 2-2s2 1 2 2" />
      <path {...base} stroke={color} strokeWidth={1.2}
        d="M9 14c0-1.7 1.3-3 3-3" />
    </svg>
  )
}

export function Watermelon({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M3 10a9 9 0 0 1 18 0H3z" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M5 10l3 8M12 10v8M19 10l-3 8" />
    </svg>
  )
}

export function Chili({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M17 4c0 0-1 1-1 3 0 3 2 5 2 8a5 5 0 0 1-10 0c0-5 3-7 3-11" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M11 4c1-1 3-2 5-2" />
    </svg>
  )
}

export function Coconut({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 3c-5 0-8 4-8 9s3 9 8 9 8-4 8-9-3-9-8-9z" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M7 12c0-3 2.5-5 5-5" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8 3c1-1.5 3-3 4-3M12 3c1 0 2 1 2 1" />
    </svg>
  )
}

export function Kiwi({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="9" />
      <circle stroke={color} strokeWidth={1.4} fill="none" cx="12" cy="12" r="3" />
      <line stroke={color} strokeWidth={1.2} x1="12" y1="3" x2="12" y2="9" />
      <line stroke={color} strokeWidth={1.2} x1="12" y1="15" x2="12" y2="21" />
      <line stroke={color} strokeWidth={1.2} x1="3" y1="12" x2="9" y2="12" />
      <line stroke={color} strokeWidth={1.2} x1="15" y1="12" x2="21" y2="12" />
      <line stroke={color} strokeWidth={1.2} x1="5.6" y1="5.6" x2="9.9" y2="9.9" />
      <line stroke={color} strokeWidth={1.2} x1="14.1" y1="14.1" x2="18.4" y2="18.4" />
      <line stroke={color} strokeWidth={1.2} x1="18.4" y1="5.6" x2="14.1" y2="9.9" />
      <line stroke={color} strokeWidth={1.2} x1="9.9" y1="14.1" x2="5.6" y2="18.4" />
    </svg>
  )
}

export function Pear({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 2c1 0 3 2 3 4 2 1 4 3 4 7a7 7 0 0 1-14 0c0-4 2-6 4-7 0-2 2-4 3-4z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 2c-1 0 0-1 1-1" />
    </svg>
  )
}

export function Mango({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 21a8 8 0 0 0 8-8c0-6-5-11-8-11S4 7 4 13a8 8 0 0 0 8 8z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 2c1-1 3-1 4 0" />
    </svg>
  )
}

export function FrenchFries({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 11V5M9 11V3M12 11V5M15 11V3M18 11V5" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M4 11h16l-2 10H6L4 11z" />
    </svg>
  )
}

export function Beans({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M6 9a5 5 0 0 0 5 5 5 5 0 0 0 0-10A5 5 0 0 0 6 9z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M13 15a5 5 0 0 0 5 5 5 5 0 0 0 0-10 5 5 0 0 0-5 5z" />
      <path {...base} stroke={color} strokeWidth={1.2}
        d="M8.5 7c-.5 1-.5 2 0 3M16 13c-.5 1-.5 2 0 3" />
    </svg>
  )
}

// ─── Status / UI ─────────────────────────────────────────────────────────────

export function CheckCircle({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <circle stroke={color} strokeWidth={1.8} fill="none" cx="12" cy="12" r="10" />
      <path {...base} stroke={color} strokeWidth={1.8} d="M7 12l4 4 6-7" />
    </svg>
  )
}

export function WarningTriangle({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line stroke={color} strokeWidth={1.8} x1="12" y1="9" x2="12" y2="13" />
      <line stroke={color} strokeWidth={2} x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function Lightbulb({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 18h6M10 22h4M12 2a7 7 0 0 1 5 11.9c-.5.5-.8 1.1-.8 1.8v.3H7.8v-.3c0-.7-.3-1.3-.8-1.8A7 7 0 0 1 12 2z" />
    </svg>
  )
}

export function Clipboard({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <rect {...base} stroke={color} strokeWidth={1.8} x="9" y="2" width="6" height="4" rx="1" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M5 4h2v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4h2" />
      <line stroke={color} strokeWidth={1.6} x1="9" y1="12" x2="15" y2="12" />
      <line stroke={color} strokeWidth={1.6} x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}

export function BarChart({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <rect {...base} stroke={color} strokeWidth={1.8} x="3" y="12" width="4" height="10" />
      <rect {...base} stroke={color} strokeWidth={1.8} x="10" y="6" width="4" height="16" />
      <rect {...base} stroke={color} strokeWidth={1.8} x="17" y="2" width="4" height="20" />
    </svg>
  )
}

export function Notes({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline {...base} stroke={color} strokeWidth={1.8} points="14 2 14 8 20 8" />
      <line stroke={color} strokeWidth={1.6} x1="8" y1="13" x2="16" y2="13" />
      <line stroke={color} strokeWidth={1.6} x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

export function CalendarIcon({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <rect {...base} stroke={color} strokeWidth={1.8} x="3" y="4" width="18" height="18" rx="2" />
      <line stroke={color} strokeWidth={1.8} x1="16" y1="2" x2="16" y2="6" />
      <line stroke={color} strokeWidth={1.8} x1="8" y1="2" x2="8" y2="6" />
      <line stroke={color} strokeWidth={1.8} x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function Heal({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 22c5.5-2.5 9-7 9-11A5 5 0 0 0 12 7a5 5 0 0 0-9 4c0 4 3.5 8.5 9 11z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 12h6M12 9v6" />
    </svg>
  )
}

export function HandHeart({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M11 14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 14v4M9 22h6" />
      <path {...base} stroke={color} strokeWidth={1.6}
        d="M9.5 8C9 6.5 10 5 11.5 5S14 6.5 13.5 8L12 10l-2.5-2z" />
    </svg>
  )
}

export function Nut({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 3c3 0 7 2.5 7 9s-4 9-7 9-7-2.5-7-9 4-9 7-9z" />
      <path {...base} stroke={color} strokeWidth={1.4}
        d="M9 10c0-1.5 1.5-3 3-3" />
    </svg>
  )
}

export function Praying({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M12 2L8 8l4 4 4-4-4-6z" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8 8L4 16l4 2 4-6M16 8l4 8-4 2-4-6" />
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M8 18l4 4 4-4" />
    </svg>
  )
}

export function Salt({ size = 24, color = 'currentColor', style, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...p}>
      <path {...base} stroke={color} strokeWidth={1.8}
        d="M9 2h6l1 4H8L9 2z" />
      <rect {...base} stroke={color} strokeWidth={1.8} x="7" y="6" width="10" height="16" rx="2" />
      <circle fill={color} cx="12" cy="10" r="1.2" />
      <circle fill={color} cx="9.5" cy="13" r="1" />
      <circle fill={color} cx="14.5" cy="13" r="1" />
      <circle fill={color} cx="12" cy="16" r="1" />
    </svg>
  )
}
