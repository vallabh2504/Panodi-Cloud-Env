import { useState, useEffect } from 'react'
import { getSettings, saveSettings, getAllLogs } from '../lib/storage'
import { supabase } from '../lib/supabase'

export default function SettingsScreen({ session }) {
  const [settings, setSettings] = useState({ userName: '', waterGoal: 8, fiberGoal: 25, darkMode: false })
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const s = getSettings()
    if (!s.userName && session?.user?.user_metadata?.full_name) {
      s.userName = session.user.user_metadata.full_name.split(' ')[0]
    }
    setSettings(s)
  }, [session])

  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exportData = async () => {
    const logs = await getAllLogs()
    const meds = JSON.parse(localStorage.getItem('fissurecare_medications') || '[]')
    const data = { logs, medications: meds, settings, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'fissurecare-backup.json'; a.click()
  }

  const copyToClipboard = async () => {
    const logs = await getAllLogs()
    const data = JSON.stringify({ logs, exportedAt: new Date().toISOString() }, null, 2)
    await navigator.clipboard.writeText(data)
    alert('Data copied to clipboard! 📋')
  }

  const resetData = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('fissurecare_'))
    keys.forEach(k => localStorage.removeItem(k))
    setShowReset(false)
    alert('All data has been reset. 🌱')
  }

  const InputRow = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>{label}</p>
      {children}
    </div>
  )

  return (
    <div>
      <div style={{ padding: '20px 20px 16px', background: 'linear-gradient(135deg, #FFF0EB, #FFF8F5)', borderBottom: '1px solid #F0E0DA' }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#E8705A' }}>⚙️ Settings</p>
        <p style={{ fontSize: 13, color: '#8C7070' }}>Personalize your experience</p>
      </div>

      <div style={{ padding: '20px' }}>
        <InputRow label="Your name (for the greeting):">
          <input value={settings.userName} onChange={e => setSettings(s => ({ ...s, userName: e.target.value }))}
            placeholder="e.g. Priya"
            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #F0E0DA', fontSize: 14 }} />
        </InputRow>

        <InputRow label={`Daily water goal: ${settings.waterGoal} glasses`}>
          <input type="range" min={4} max={12} value={settings.waterGoal}
            onChange={e => setSettings(s => ({ ...s, waterGoal: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: '#E8705A' }} />
          <p style={{ fontSize: 12, color: '#8C7070', marginTop: 4 }}>{settings.waterGoal * 250}ml daily goal</p>
        </InputRow>

        <button onClick={handleSave} style={{
          width: '100%', padding: '16px', marginBottom: 24,
          background: saved ? 'linear-gradient(135deg, #A8D5A2, #7BC97B)' : 'linear-gradient(135deg, #E8705A, #F5A68A)',
          border: 'none', borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer'
        }}>
          {saved ? '✅ Saved!' : 'Save Settings'}
        </button>

        {/* Data Management */}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7070', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>DATA & PRIVACY</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <button onClick={exportData} style={{
            padding: '14px', background: '#fff', border: '1.5px solid #C9A8F5', borderRadius: 14,
            color: '#7A58B5', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            📥 Export All Data (JSON)
          </button>
          <button onClick={copyToClipboard} style={{
            padding: '14px', background: '#fff', border: '1.5px solid #A8D5A2', borderRadius: 14,
            color: '#5A9E5A', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            📋 Copy Data to Clipboard
          </button>
          <button onClick={() => setShowReset(true)} style={{
            padding: '14px', background: '#fff', border: '1.5px solid #F48585', borderRadius: 14,
            color: '#E85A5A', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            🗑️ Reset All Data
          </button>
        </div>

        {/* PWA Install hint */}
        <div style={{ background: 'linear-gradient(135deg, #F0EBFF, #FFF8F5)', borderRadius: 16, padding: '14px 16px', border: '1px solid #E8D8FF', marginBottom: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#7A58B5', marginBottom: 4 }}>📱 Install as App</p>
          <p style={{ fontSize: 12, color: '#8C7070' }}>
            Add Healing Garden to your home screen for the best experience and future notification support.
            On iOS: tap Share → "Add to Home Screen". On Android: tap the browser menu → "Install App".
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ background: '#FFF8E8', borderRadius: 14, padding: '12px 14px', border: '1px solid #F5C67A' }}>
          <p style={{ fontSize: 11, color: '#8C7070', lineHeight: 1.6 }}>
            ⚠️ <strong>Medical Disclaimer:</strong> Healing Garden is for personal tracking only and does not constitute medical advice. Always consult your doctor or healthcare provider for medical decisions.
          </p>
        </div>

        {/* Sign Out */}
        {session && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F0E0DA' }}>
            <p style={{ fontSize: 12, color: '#8C7070', textAlign: 'center', marginBottom: 12 }}>
              Signed in as {session.user.email}
            </p>
            <button onClick={() => supabase.auth.signOut()} style={{
              width: '100%', padding: '14px', background: '#fff', border: '1.5px solid #E0D0C8',
              borderRadius: 14, color: '#8C7070', fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}>
              🚪 Sign Out
            </button>
          </div>
        )}

        <p style={{ fontSize: 11, color: '#C0A8A8', textAlign: 'center', marginTop: 20 }}>Healing Garden v1.0 · Built with love 💛</p>
      </div>

      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,43,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '28px 24px', maxWidth: 320, textAlign: 'center' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🌱</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#3D2B2B', marginBottom: 8 }}>Reset all data?</p>
            <p style={{ fontSize: 14, color: '#8C7070', marginBottom: 24 }}>
              This will permanently delete all your logs, medications and settings. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowReset(false)} style={{
                flex: 1, padding: '14px', background: '#F0E0DA', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#3D2B2B'
              }}>Cancel</button>
              <button onClick={resetData} style={{
                flex: 1, padding: '14px', background: '#F48585', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff'
              }}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
