import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #FFF0EB 0%, #FFF8F0 45%, #F0F8EE 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Logo + App Name */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🌿</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#3D2314', margin: 0, letterSpacing: '-0.5px' }}>
          Healing Garden
        </h1>
        <p style={{ fontSize: 15, color: '#8C7070', marginTop: 8, fontStyle: 'italic' }}>
          Your gentle path to wellness
        </p>
      </div>

      {/* Feature highlights */}
      <div style={{ width: '100%', maxWidth: 360, marginBottom: 40 }}>
        {[
          { icon: '📊', label: 'Daily wellness tracking' },
          { icon: '💧', label: 'Hydration & nutrition logs' },
          { icon: '🛁', label: 'Self-care routine reminders' },
          { icon: '💊', label: 'Medication management' },
        ].map(f => (
          <div key={f.label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '10px 0', borderBottom: '1px solid #F0E0DA'
          }}>
            <span style={{ fontSize: 22 }}>{f.icon}</span>
            <span style={{ fontSize: 14, color: '#5A3A2A', fontWeight: 500 }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Google Sign In */}
      <button onClick={handleGoogle} disabled={loading} style={{
        width: '100%', maxWidth: 360, padding: '16px',
        background: loading ? '#E0D0C8' : '#fff',
        border: '1.5px solid #E0D0C8', borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        fontSize: 15, fontWeight: 700, color: '#3D2314', cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 20px rgba(61,35,20,0.12)', transition: 'all 0.2s'
      }}>
        {loading ? (
          <span style={{ fontSize: 20 }}>⏳</span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        )}
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      {error && (
        <p style={{ marginTop: 16, color: '#E85A5A', fontSize: 13, textAlign: 'center', maxWidth: 320 }}>
          {error}
        </p>
      )}

      <p style={{ marginTop: 32, fontSize: 11, color: '#C0A8A8', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
        Your data is private and secure. By continuing, you agree to use this app for personal wellness tracking only.
      </p>
    </div>
  )
}
