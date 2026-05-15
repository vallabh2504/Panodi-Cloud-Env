import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, Sparkles, BookOpen } from 'lucide-react'

const FEATURES = [
  { icon: '🩺', label: 'Expert', sub: 'Guidance' },
  { icon: '📋', label: 'Personal', sub: 'Care Plan' },
  { icon: '🔬', label: 'Backed by', sub: 'Science' },
]

/* ── Inline SVG drop logo ── */
function DropLogo() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path d="M11 0C11 0 1 10.5 1 17C1 22.523 5.477 27 11 27C16.523 27 21 22.523 21 17C21 10.5 11 0 11 0Z"
        fill="#1D3E2F" />
      <path d="M11 6C11 6 4 13.5 4 18C4 21.314 7.134 24 11 24C14.866 24 18 21.314 18 18C18 13.5 11 6 11 6Z"
        fill="#2D5A3F" opacity="0.4" />
    </svg>
  )
}

export default function SplashScreen({ onEnter }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <div style={{
      minHeight: '100dvh', width: '100%', maxWidth: 430, margin: '0 auto',
      background: '#FAF3EC', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ─── Upper hero section ─── */}
      <div style={{ position: 'relative', flex: '0 0 auto', minHeight: '58dvh' }}>

        {/* Hero illustration — right side, fills height */}
        <motion.img
          src="/hero-splash.png"
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: ready ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', right: -4, top: -4,
            width: '72%', maxWidth: 320,
            objectFit: 'cover', objectPosition: 'center top',
            zIndex: 1,
            borderBottomLeftRadius: 60,
          }}
        />

        {/* Soft left-fade overlay so text reads clearly */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '55%',
          background: 'linear-gradient(to right, #FAF3EC 60%, transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            position: 'relative', zIndex: 3,
            padding: '52px 24px 0',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <DropLogo />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#1D3E2F', letterSpacing: '2.5px', lineHeight: 1.2 }}>
              FISSURE
            </p>
            <div style={{ width: '100%', height: 1, background: '#1D3E2F44', margin: '2px 0' }} />
            <p style={{ fontSize: 11, fontWeight: 400, color: '#1D3E2F', letterSpacing: '2.5px', lineHeight: 1.2 }}>
              CARE
            </p>
          </div>
        </motion.div>

        {/* Headline + subtitle */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={ready ? 'visible' : 'hidden'}
          style={{
            position: 'relative', zIndex: 3,
            padding: '28px 24px 0', maxWidth: '62%',
          }}
        >
          <motion.h1 variants={fadeUp} style={{
            fontSize: 38, fontWeight: 800, fontFamily: "'Nunito', sans-serif",
            color: '#1D3E2F', lineHeight: 1.12, margin: 0,
            letterSpacing: '-0.5px',
          }}>
            Heal gently.{'\n'}
            <span style={{ display: 'block' }}>Live freely.</span>
          </motion.h1>

          {/* Accent line */}
          <motion.div
            variants={fadeUp}
            style={{ width: 44, height: 3, background: '#C8A87A', borderRadius: 2, margin: '14px 0' }}
          />

          <motion.p variants={fadeUp} style={{
            fontSize: 13.5, color: '#6B7864', lineHeight: 1.65, margin: 0,
          }}>
            Personalised care and guidance to heal anal fissures and prevent recurrence.
          </motion.p>
        </motion.div>

        {/* Bottom spacer — gives room for image to show */}
        <div style={{ height: 48 }} />
      </div>

      {/* ─── Lower content section ─── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '24px 24px 32px', zIndex: 3, position: 'relative',
      }}>

        {/* 3 Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ display: 'flex', gap: 10, marginBottom: 28, justifyContent: 'space-between' }}
        >
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, padding: '12px 6px',
              background: '#F0E8DC', borderRadius: 16,
            }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1D3E2F', lineHeight: 1.2, margin: 0 }}>{f.label}</p>
                <p style={{ fontSize: 10, color: '#8A9E8A', lineHeight: 1.2, margin: 0 }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Spacer to push buttons toward bottom */}
        <div style={{ flex: 1 }} />

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => onEnter('log')}
          style={{
            width: '100%', padding: '18px 24px',
            background: '#1D3E2F',
            border: 'none', borderRadius: 20,
            color: '#FAF3EC', fontSize: 16, fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            boxShadow: '0 8px 32px rgba(29,62,47,0.28)',
            letterSpacing: '-0.2px',
          }}
        >
          Start My Healing Journey
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowRight size={18} color="#FAF3EC" />
          </div>
        </motion.button>

        {/* Secondary link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onEnter('home')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, color: '#6B7864', fontWeight: 500,
            padding: '14px', textAlign: 'center',
            textDecoration: 'underline', textDecorationColor: '#C8A87A',
            textUnderlineOffset: 3,
          }}
        >
          I already have an account
        </motion.button>

        {/* Star reviews */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 8 }}
        >
          <p style={{ fontSize: 12, color: '#8A9E8A', marginBottom: 6, lineHeight: 1.5 }}>
            Trusted by thousands on their<br />journey to lasting relief.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 4 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: 16, color: '#E8B84B' }}>★</span>
            ))}
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1D3E2F' }}>
            4.8 · 10K+ reviews
          </p>
        </motion.div>

      </div>
    </div>
  )
}
