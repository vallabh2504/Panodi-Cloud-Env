import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Heart, Shield, Bell, TrendingUp } from 'lucide-react'
import { haptic } from '../lib/haptics'

function LotusIllustration() {
  return (
    <svg viewBox="0 0 300 220" fill="none" style={{ width: '100%', maxWidth: 260, display: 'block', margin: '0 auto' }}>
      <ellipse cx="150" cy="208" rx="95" ry="12" fill="rgba(45,125,111,0.10)" />
      <ellipse cx="150" cy="208" rx="62" ry="7.5" fill="rgba(45,125,111,0.07)" />
      <path d="M150 206 Q147 183 149 160" stroke="rgba(74,158,110,0.5)" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="98" cy="198" rx="48" ry="13" fill="rgba(74,158,110,0.2)" transform="rotate(-18 98 198)" />
      <ellipse cx="204" cy="196" rx="43" ry="12" fill="rgba(74,158,110,0.2)" transform="rotate(14 204 196)" />
      <ellipse cx="105" cy="124" rx="22" ry="68" fill="rgba(76,169,154,0.22)" transform="rotate(-40 105 124)" />
      <ellipse cx="195" cy="124" rx="22" ry="68" fill="rgba(76,169,154,0.22)" transform="rotate(40 195 124)" />
      <ellipse cx="117" cy="118" rx="22" ry="62" fill="rgba(76,169,154,0.38)" transform="rotate(-23 117 118)" />
      <ellipse cx="183" cy="118" rx="22" ry="62" fill="rgba(76,169,154,0.38)" transform="rotate(23 183 118)" />
      <ellipse cx="126" cy="128" rx="21" ry="55" fill="rgba(196,212,210,0.72)" transform="rotate(-12 126 128)" />
      <ellipse cx="174" cy="128" rx="21" ry="55" fill="rgba(196,212,210,0.72)" transform="rotate(12 174 128)" />
      <ellipse cx="150" cy="108" rx="24" ry="63" fill="white" opacity="0.95" />
      <ellipse cx="150" cy="133" rx="27" ry="16" fill="rgba(196,149,106,0.22)" />
      <circle cx="150" cy="127" r="14" fill="rgba(196,149,106,0.45)" />
      <circle cx="150" cy="127" r="8.5" fill="rgba(196,149,106,0.6)" />
      <circle cx="54" cy="172" r="5.5" fill="rgba(45,125,111,0.14)" />
      <circle cx="246" cy="176" r="4.5" fill="rgba(45,125,111,0.12)" />
      <circle cx="67" cy="154" r="3.5" fill="rgba(45,125,111,0.18)" />
      <circle cx="233" cy="160" r="4" fill="rgba(45,125,111,0.14)" />
    </svg>
  )
}

const FEATURES = [
  { Icon: Heart,      label: 'Designed for sensitive recovery' },
  { Icon: Shield,     label: 'Your data stays private' },
  { Icon: Bell,       label: 'Gentle care routine reminders' },
  { Icon: TrendingUp, label: 'Insights that actually help' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden:   { opacity: 0, y: 18 },
  visible:  { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
}

export default function AuthScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    haptic.tap()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-solid)', fontFamily: 'var(--font-main)' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(158deg, #E8F5F3 0%, #EDF5F0 50%, #F0F0F8 100%)',
          padding: '56px 24px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -55, right: -55, width: 210, height: 210, borderRadius: '50%', background: 'rgba(45,125,111,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -25, left: -35, width: 160, height: 160, borderRadius: '50%', background: 'rgba(196,149,106,0.06)', pointerEvents: 'none' }} />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 22, delay: 0.15 }}
          style={{ width: '100%' }}
        >
          <LotusIllustration />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 38, fontWeight: 800, color: 'var(--color-text-primary)',
            margin: '14px 0 0', letterSpacing: '-0.5px', textAlign: 'center',
            textShadow: '0 2px 12px rgba(45,125,111,0.12)',
          }}
        >
          CareNest
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.45 }}
          style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 7, textAlign: 'center', lineHeight: 1.5 }}
        >
          Gentle fissure recovery tracking
        </motion.p>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ flex: 1, padding: '28px 24px 36px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
          {FEATURES.map(({ Icon, label }) => (
            <motion.div key={label} variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: 'var(--color-primary-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{label}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
          <motion.button
            variants={itemVariants}
            onClick={login}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%', padding: '18px',
              background: loading ? 'rgba(45,125,111,0.5)' : 'var(--gradient-primary)',
              border: 'none', borderRadius: 'var(--radius-lg)', color: '#fff',
              fontSize: 16, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : 'var(--shadow-teal)',
              fontFamily: 'var(--font-main)', letterSpacing: '0.01em',
            }}
          >
            {loading ? 'Signing in…' : 'Start my care plan'}
          </motion.button>
          <motion.button
            variants={itemVariants}
            onClick={login}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%', padding: '16px',
              background: 'transparent',
              border: '1.5px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-primary)', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-main)',
            }}
          >
            I already use CareNest
          </motion.button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'var(--color-danger)', fontSize: 13, textAlign: 'center', marginTop: 12 }}
          >
            {error}
          </motion.p>
        )}
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
          Not a substitute for medical advice.<br />Always follow your doctor&#39;s recommendations.
        </p>
      </motion.div>
    </div>
  )
}
