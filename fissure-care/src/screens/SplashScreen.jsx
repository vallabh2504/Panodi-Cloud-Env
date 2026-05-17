import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BloomFlower, SunIcon } from '../components/AnimatedSVGs'

const NoiseShaderHero = lazy(() => import('../components/NoiseShaderHero'))

const THEME_MAP = {
  cherry: {
    bg: '#FFF5F7',
    heroOverlay: 'linear-gradient(to right, #FFF5F7 68%, transparent)',
    headline: '#3D1A14',
    subtitle: '#8C7070',
    accentBar: '#F5C67A',
    pillBg: '#FFE4EA',
    pillText: '#E8705A',
    buttonGradient: 'linear-gradient(135deg, #E8705A 0%, #F5A68A 100%)',
    buttonShadow: 'rgba(232,112,90,0.38)',
    logoFill: '#E8705A',
    logoInner: '#FFF0EB',
    linkColor: '#8C7070',
    linkUnderline: '#F5C67A',
    starColor: '#F5C67A',
    featurePillBorder: '#FFD0DA',
    reviewBg: 'rgba(255,200,210,0.15)',
    flowerColor: '#E8705A',
  },
  ocean: {
    bg: '#F0F7FF',
    heroOverlay: 'linear-gradient(to right, #F0F7FF 68%, transparent)',
    headline: '#0A1F3A',
    subtitle: '#6A8BAA',
    accentBar: '#67C7B8',
    pillBg: '#D4E8FF',
    pillText: '#3B82C4',
    buttonGradient: 'linear-gradient(135deg, #3B82C4 0%, #7BB8E8 100%)',
    buttonShadow: 'rgba(59,130,196,0.38)',
    logoFill: '#3B82C4',
    logoInner: '#D4E8FF',
    linkColor: '#6A8BAA',
    linkUnderline: '#67C7B8',
    starColor: '#67C7B8',
    featurePillBorder: '#B8D8F8',
    reviewBg: 'rgba(180,216,240,0.15)',
    flowerColor: '#3B82C4',
  },
  aurora: {
    bg: '#F5F0FF',
    heroOverlay: 'linear-gradient(to right, #F5F0FF 68%, transparent)',
    headline: '#1C0B48',
    subtitle: '#7C6BA0',
    accentBar: '#34D399',
    pillBg: '#EDE4FF',
    pillText: '#8B5CF6',
    buttonGradient: 'linear-gradient(135deg, #8B5CF6 0%, #B794F6 100%)',
    buttonShadow: 'rgba(139,92,246,0.38)',
    logoFill: '#8B5CF6',
    logoInner: '#EDE4FF',
    linkColor: '#7C6BA0',
    linkUnderline: '#34D399',
    starColor: '#FBBF24',
    featurePillBorder: '#D8C8FF',
    reviewBg: 'rgba(197,168,245,0.15)',
    flowerColor: '#8B5CF6',
  },
  midnight: {
    bg: '#0D0A0E',
    heroOverlay: 'linear-gradient(to right, #0D0A0E 70%, transparent)',
    headline: '#F0E8F0',
    subtitle: '#9A8A9A',
    accentBar: '#C04060',
    pillBg: 'rgba(192,64,96,0.15)',
    pillText: '#E06080',
    buttonGradient: 'linear-gradient(135deg, #C04060 0%, #9D4EDD 100%)',
    buttonShadow: 'rgba(192,64,96,0.5)',
    logoFill: '#C04060',
    logoInner: '#3D1A3A',
    linkColor: '#9A8A9A',
    linkUnderline: '#9D4EDD',
    starColor: '#C04060',
    featurePillBorder: 'rgba(192,64,96,0.3)',
    reviewBg: 'rgba(192,64,96,0.08)',
    flowerColor: '#C04060',
  },
}

const FEATURES = [
  { emoji: '🩺', label: 'Expert', sub: 'Guidance' },
  { emoji: '📋', label: 'Personal', sub: 'Care Plan' },
  { emoji: '🔬', label: 'Backed by', sub: 'Science' },
]

function DropLogo({ fill, inner }) {
  return (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
      <path d="M12 1C12 1 1 13 1 19C1 24.5 6 29 12 29C18 29 23 24.5 23 19C23 13 12 1 12 1Z" fill={fill} />
      <path d="M12 9C12 9 6 15 6 20C6 23 8.7 26 12 26C15.3 26 18 23 18 20C18 15 12 9 12 9Z" fill={inner} opacity="0.45" />
    </svg>
  )
}

export default function SplashScreen({ onEnter, theme }) {
  const [ready, setReady] = useState(false)
  const themeId = theme?.id || 'cherry'
  const tc = THEME_MAP[themeId] || THEME_MAP.cherry

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 20 },
    transition: { duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <div style={{
      minHeight: '100dvh', width: '100%', maxWidth: 430, margin: '0 auto',
      background: tc.bg, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif",
    }}>

      {/* GPU noise shader — full-bleed animated background */}
      <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: tc.bg }} />}>
        <NoiseShaderHero theme={theme} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      </Suspense>

      {/* ── Hero illustration area ── */}
      <div style={{ position: 'relative', minHeight: '56dvh', flexShrink: 0 }}>
        {/* Hero image — right side */}
        <motion.img
          src="/hero-splash.png"
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: ready ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', right: -2, top: 0,
            width: '73%', maxWidth: 318,
            objectFit: 'cover', objectPosition: 'top center',
            zIndex: 1,
            borderBottomLeftRadius: 56,
          }}
        />
        {/* Text-readable left fade */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '68%',
          background: tc.heroOverlay,
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Logo */}
        <motion.div {...fadeUp(0.1)} style={{
          position: 'relative', zIndex: 3,
          padding: '50px 24px 0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <DropLogo fill={tc.logoFill} inner={tc.logoInner} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: tc.headline, letterSpacing: '2.5px', lineHeight: 1.2, margin: 0 }}>FISSURE</p>
            <div style={{ height: 1, background: tc.headline + '44', margin: '3px 0' }} />
            <p style={{ fontSize: 11, fontWeight: 400, color: tc.headline, letterSpacing: '2.5px', lineHeight: 1.2, margin: 0 }}>CARE</p>
          </div>
          {/* Decorative sun top-right of logo */}
          <div style={{ marginLeft: 'auto', marginRight: 8 }}>
            <SunIcon size={22} color={tc.accentBar} />
          </div>
        </motion.div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 3, padding: '24px 24px 0', maxWidth: '63%' }}>
          <motion.h1 {...fadeUp(0.22)} style={{
            fontSize: 38, fontWeight: 800, fontFamily: "'Nunito', sans-serif",
            color: tc.headline, lineHeight: 1.12, margin: 0, letterSpacing: '-0.5px',
          }}>
            Heal gently.
            <span style={{ display: 'block' }}>Live freely.</span>
          </motion.h1>
          <motion.div {...fadeUp(0.32)} style={{
            width: 44, height: 3.5, background: tc.accentBar, borderRadius: 2, margin: '14px 0',
          }} />
          <motion.p {...fadeUp(0.38)} style={{
            fontSize: 13.5, color: tc.subtitle, lineHeight: 1.65, margin: 0,
          }}>
            Personalised care and guidance to heal anal fissures and prevent recurrence.
          </motion.p>
        </div>

        <div style={{ height: 32 }} />
      </div>

      {/* ── Bottom content ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '20px 24px 28px', position: 'relative', zIndex: 3,
      }}>

        {/* Bloom flower accent above features */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 18 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
        >
          <BloomFlower size={52} color={tc.flowerColor} />
        </motion.div>

        {/* 3 feature pills */}
        <motion.div {...fadeUp(0.45)} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '12px 6px', background: tc.pillBg, borderRadius: 16,
              border: `1px solid ${tc.featurePillBorder}`, gap: 5,
            }}>
              <span style={{ fontSize: 22 }}>{f.emoji}</span>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: tc.pillText, margin: 0, textAlign: 'center', lineHeight: 1.2 }}>{f.label}</p>
              <p style={{ fontSize: 9.5, color: tc.subtitle, margin: 0, textAlign: 'center', lineHeight: 1.2 }}>{f.sub}</p>
            </div>
          ))}
        </motion.div>

        <div style={{ flex: 1 }} />

        {/* CTA button */}
        <motion.button
          {...fadeUp(0.52)}
          whileTap={{ scale: 0.97 }}
          onClick={() => onEnter('log')}
          style={{
            width: '100%', padding: '17px 24px',
            background: tc.buttonGradient, border: 'none', borderRadius: 20,
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '-0.2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            boxShadow: `0 8px 28px ${tc.buttonShadow}`,
          }}
        >
          Start My Healing Journey
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowRight size={17} color="#fff" />
          </div>
        </motion.button>

        {/* Secondary link */}
        <motion.button {...fadeUp(0.62)} whileTap={{ scale: 0.97 }}
          onClick={() => onEnter('home')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13.5, color: tc.linkColor, fontWeight: 500,
            padding: '13px', textAlign: 'center',
            textDecoration: 'underline',
            textDecorationColor: tc.linkUnderline,
            textUnderlineOffset: 3,
          }}
        >
          I already have an account
        </motion.button>

        {/* Stars */}
        <motion.div {...fadeUp(0.7)} style={{
          textAlign: 'center', padding: '10px 16px 6px',
          background: tc.reviewBg, borderRadius: 14,
        }}>
          <p style={{ fontSize: 13, marginBottom: 4 }}>🌿</p>
          <p style={{ fontSize: 11.5, color: tc.subtitle, lineHeight: 1.55, margin: 0 }}>
            Built with love for your healing journey. Your data stays private, always.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
