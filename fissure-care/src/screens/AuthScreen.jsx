import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Shield, Activity, TrendingUp, Leaf } from 'lucide-react'

const FEATURES = [
  { Icon: Shield,     label: 'Private & secure',     desc: 'Your data stays on your device' },
  { Icon: Activity,   label: 'Smart care tracking',  desc: 'Daily logs, meds & wellness scores' },
  { Icon: TrendingUp, label: 'Meaningful insights',  desc: 'Spot patterns in your recovery' },
]

export default function AuthScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-main)' }}>
      {/* Hero */}
      <div style={{
        background: 'var(--gradient-hero)',
        padding: '64px 32px 52px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,108,255,0.18)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(77,163,255,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 40, left: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Logo mark */}
        <div style={{
          width: 76, height: 76, borderRadius: 24,
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <Leaf size={38} color="#fff" strokeWidth={1.8} />
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.5px', textAlign: 'center' }}>
          CareNest
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>
          Gentle fissure recovery tracking
        </p>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, padding: '36px 24px 32px',
        background: 'var(--color-bg)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Feature trust cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {FEATURES.map(({ Icon, label, desc }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'var(--color-surface-lavender)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-lavender)',
              }}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '17px',
          background: loading ? 'var(--color-border)' : 'var(--gradient-primary)',
          border: 'none', borderRadius: 'var(--radius-md)',
          color: '#fff', fontSize: 15, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 8px 24px rgba(88,101,242,0.38)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--font-main)', transition: 'all 0.2s ease',
          marginBottom: 12,
        }}>
          {loading ? 'Signing in…' : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                <path fill="#fff" fillOpacity="0.9" d="M44.5 20H24v8h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
              </svg>
              Start my care plan
            </>
          )}
        </button>

        {/* Secondary CTA */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '16px',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-indigo)', fontSize: 15, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-main)', transition: 'all 0.2s ease',
        }}>
          I already use CareNest
        </button>

        {error && (
          <p style={{ marginTop: 12, color: 'var(--color-danger)', fontSize: 13, textAlign: 'center' }}>{error}</p>
        )}

        <p style={{
          marginTop: 'auto', paddingTop: 28,
          fontSize: 11, color: 'var(--color-text-muted)',
          textAlign: 'center', lineHeight: 1.65,
        }}>
          Not a substitute for medical advice.<br />Always follow your doctor's recommendations.
        </p>
      </div>
    </div>
  )
}
