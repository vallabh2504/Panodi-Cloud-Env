import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Heart, Shield, Bell, TrendingUp } from 'lucide-react'

function LotusIllustration() {
  return (
    <svg viewBox="0 0 300 220" fill="none" style={{ width: '100%', maxWidth: 270, display: 'block', margin: '0 auto' }}>
      {/* Water surface */}
      <ellipse cx="150" cy="208" rx="95" ry="12" fill="rgba(124,108,255,0.12)" />
      <ellipse cx="150" cy="208" rx="62" ry="7.5" fill="rgba(124,108,255,0.08)" />
      {/* Stem */}
      <path d="M150 206 Q147 183 149 160" stroke="rgba(110,175,110,0.5)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lily pads */}
      <ellipse cx="98" cy="198" rx="48" ry="13" fill="rgba(100,185,100,0.22)" transform="rotate(-18 98 198)" />
      <ellipse cx="204" cy="196" rx="43" ry="12" fill="rgba(100,185,100,0.22)" transform="rotate(14 204 196)" />
      {/* Outermost petals */}
      <ellipse cx="105" cy="124" rx="22" ry="68" fill="rgba(168,152,255,0.28)" transform="rotate(-40 105 124)" />
      <ellipse cx="195" cy="124" rx="22" ry="68" fill="rgba(168,152,255,0.28)" transform="rotate(40 195 124)" />
      {/* Second layer */}
      <ellipse cx="117" cy="118" rx="22" ry="62" fill="rgba(195,185,255,0.44)" transform="rotate(-23 117 118)" />
      <ellipse cx="183" cy="118" rx="22" ry="62" fill="rgba(195,185,255,0.44)" transform="rotate(23 183 118)" />
      {/* Inner petals */}
      <ellipse cx="126" cy="128" rx="21" ry="55" fill="rgba(228,222,255,0.73)" transform="rotate(-12 126 128)" />
      <ellipse cx="174" cy="128" rx="21" ry="55" fill="rgba(228,222,255,0.73)" transform="rotate(12 174 128)" />
      {/* Centre petal */}
      <ellipse cx="150" cy="108" rx="24" ry="63" fill="white" opacity="0.96" />
      {/* Stamen */}
      <ellipse cx="150" cy="133" rx="27" ry="16" fill="rgba(255,213,148,0.28)" />
      <circle cx="150" cy="127" r="14" fill="rgba(255,226,110,0.53)" />
      <circle cx="150" cy="127" r="8.5" fill="rgba(255,208,48,0.66)" />
      {/* Dew drops */}
      <circle cx="54" cy="172" r="5.5" fill="rgba(124,108,255,0.16)" />
      <circle cx="246" cy="176" r="4.5" fill="rgba(124,108,255,0.13)" />
      <circle cx="67" cy="154" r="3.5" fill="rgba(124,108,255,0.2)" />
      <circle cx="233" cy="160" r="4" fill="rgba(124,108,255,0.16)" />
      <circle cx="42" cy="160" r="2.5" fill="rgba(124,108,255,0.11)" />
      <circle cx="258" cy="164" r="3" fill="rgba(124,108,255,0.11)" />
    </svg>
  )
}

const FEATURES = [
  { Icon: Heart, label: 'Built for sensitive conditions' },
  { Icon: Shield, label: 'Private & secure' },
  { Icon: Bell, label: 'Care routine reminders' },
  { Icon: TrendingUp, label: 'Meaningful insights' },
]

export default function AuthScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'var(--font-main)' }}>
      {/* Hero — light lavender */}
      <div style={{
        background: 'linear-gradient(158deg, #EDE8FF 0%, #E4EDFF 55%, #EDE8FF 100%)',
        padding: '52px 24px 30px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -55, right: -55, width: 210, height: 210, borderRadius: '50%', background: 'rgba(124,108,255,0.09)' }} />
        <div style={{ position: 'absolute', bottom: -25, left: -35, width: 150, height: 150, borderRadius: '50%', background: 'rgba(77,163,255,0.07)' }} />
        <LotusIllustration />
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#0F1A3A', margin: '16px 0 0', letterSpacing: '-0.5px', textAlign: 'center' }}>CareNest</h1>
        <p style={{ fontSize: 14, color: '#8492B0', marginTop: 7, textAlign: 'center', lineHeight: 1.5 }}>Gentle fissure recovery tracking</p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '28px 24px 36px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 36 }}>
          {FEATURES.map(({ Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                background: 'linear-gradient(135deg, #F2EEFF, #EBF1FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color="#5865F2" strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#384264', lineHeight: 1.4 }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
          <button onClick={login} disabled={loading} style={{
            width: '100%', padding: '17px', borderRadius: 16,
            background: loading ? '#C4CAF8' : 'linear-gradient(135deg, #5865F2 0%, #7C6CFF 60%, #4DA3FF 100%)',
            border: 'none', color: '#fff', fontSize: 16, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 28px rgba(88,101,242,0.42)',
            fontFamily: 'var(--font-main)', letterSpacing: '0.01em',
          }}>
            {loading ? 'Signing in…' : 'Start my care plan'}
          </button>
          <button onClick={login} disabled={loading} style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: 'transparent', border: '1.5px solid #E2E5F4',
            color: '#5865F2', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-main)',
          }}>
            I already use CareNest
          </button>
        </div>

        {error && <p style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', marginTop: 12 }}>{error}</p>}
        <p style={{ fontSize: 11, color: '#B8C3D8', textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
          Not a substitute for medical advice.<br />Always follow your doctor&#39;s recommendations.
        </p>
      </div>
    </div>
  )
}
