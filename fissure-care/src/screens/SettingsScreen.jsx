import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getSettings, saveSettings, getAllLogs } from '../lib/storage'
import { User, Droplets, Download, Copy, RotateCcw, LogOut, Shield, ChevronRight, Check } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'

function SettingRow({ icon, label, children, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: danger ? 'var(--color-soft-danger)' : 'var(--color-surface-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'var(--color-danger)' : 'var(--color-indigo)',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: danger ? 'var(--color-danger)' : 'var(--color-text-primary)', margin: 0 }}>{label}</p>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function SettingGroup({ title, children }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '4px 18px',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {title && (
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', paddingTop: 14, marginBottom: -4 }}>{title}</p>
      )}
      {children}
    </div>
  )
}

export default function SettingsScreen({ session }) {
  const [settings, setSettings] = useState({ userName: '', waterGoal: 8 })
  const [copied, setCopied] = useState(false)
  const [resetModal, setResetModal] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const s = getSettings()
    const googleName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || ''
    setSettings({ ...s, userName: s.userName || googleName })
  }, [session])

  const update = (key, val) => {
    const next = { ...settings, [key]: val }
    setSettings(next)
    saveSettings(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const exportData = async () => {
    const logs = await getAllLogs()
    const blob = new Blob([JSON.stringify({ settings, logs }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `carenest-data-${new Date().toISOString().split('T')[0]}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const copyDoctor = async () => {
    const logs = await getAllLogs()
    const recent = logs.slice(0, 7)
    const lines = [
      'CareNest — Patient Summary',
      `Name: ${settings.userName || 'Not set'}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      ...recent.map(l => {
        const bm = l.bowelMovements?.[0]
        return [
          `Date: ${l.date}`,
          bm ? `Pain: ${bm.painLevel}/10, Stool type: ${bm.bristolType}, Bleeding: ${bm.bloodPresent ? 'Yes' : 'No'}` : '',
          `Water: ${l.hydration?.waterGlasses || 0} glasses, Sitz baths: ${l.sitzBaths?.length || 0}`,
          l.selfCare?.notes ? `Notes: ${l.selfCare.notes}` : '',
          '---',
        ].filter(Boolean).join('\n')
      }),
      '',
      'Not a substitute for professional medical advice.',
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Could not copy — try exporting as JSON instead.')
    }
  }

  const resetAll = () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i)
      if (k?.startsWith('fissurecare_')) localStorage.removeItem(k)
    }
    setResetModal(false)
    window.location.reload()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader title="Settings" subtitle="Your preferences & data" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Profile */}
        <SettingGroup title="Profile">
          <SettingRow icon={<User size={17} />} label="Your name">
            <input
              value={settings.userName}
              onChange={e => update('userName', e.target.value)}
              placeholder="Enter name"
              style={{
                width: 120, padding: '7px 10px', textAlign: 'right',
                background: 'var(--color-surface-soft)',
                border: '1px solid var(--color-border)',
                borderRadius: 8, fontSize: 13,
                color: 'var(--color-text-primary)',
                outline: 'none', fontFamily: 'var(--font-main)',
              }}
            />
          </SettingRow>
          <div style={{ padding: '15px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-indigo)' }}>
                <Droplets size={17} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>Daily water goal</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-indigo)' }}>{settings.waterGoal} glasses</span>
                </div>
                <input type="range" min={4} max={12} value={settings.waterGoal}
                  onChange={e => update('waterGoal', +e.target.value)}
                  style={{ accentColor: 'var(--color-indigo)', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </SettingGroup>

        {/* Data */}
        <SettingGroup title="Data">
          <SettingRow icon={<Download size={17} />} label="Export health data">
            <button onClick={exportData} style={{
              padding: '7px 12px', background: 'var(--color-surface-soft)',
              border: '1px solid var(--color-border)', borderRadius: 8,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              color: 'var(--color-indigo)', fontFamily: 'var(--font-main)',
            }}>Export</button>
          </SettingRow>
          <SettingRow icon={<Copy size={17} />} label="Copy doctor summary">
            <button onClick={copyDoctor} style={{
              padding: '7px 12px', background: 'var(--color-surface-soft)',
              border: '1px solid var(--color-border)', borderRadius: 8,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              color: copied ? 'var(--color-success)' : 'var(--color-indigo)',
              fontFamily: 'var(--font-main)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {copied ? <><Check size={13} /> Copied</> : 'Copy'}
            </button>
          </SettingRow>
        </SettingGroup>

        {/* Danger zone */}
        <SettingGroup title="Danger zone">
          <SettingRow icon={<RotateCcw size={17} />} label="Reset all data" danger>
            <button onClick={() => setResetModal(true)} style={{
              padding: '7px 12px',
              background: 'var(--color-soft-danger)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', color: 'var(--color-danger)',
              fontFamily: 'var(--font-main)',
            }}>Reset</button>
          </SettingRow>
        </SettingGroup>

        {/* Medical disclaimer */}
        <div style={{
          background: 'var(--color-surface-lavender)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          border: '1px solid rgba(124,108,255,0.2)',
          display: 'flex', gap: 10,
        }}>
          <Shield size={18} color="var(--color-lavender)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--color-lavender)' }}>Medical disclaimer:</strong> CareNest is a personal wellness tracker and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
          </p>
        </div>

        {/* Sign out */}
        {session && (
          <button onClick={signOut} style={{
            width: '100%', padding: '15px',
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <LogOut size={17} />
            Sign out
          </button>
        )}

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          CareNest v2.0 · Your data stays private
        </p>
      </div>

      {/* Reset confirmation modal */}
      {resetModal && (
        <>
          <div onClick={() => setResetModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(15,26,58,0.5)',
            zIndex: 100, backdropFilter: 'blur(2px)',
          }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 101,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: '28px 24px 48px',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>Reset all data?</h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
              This will permanently delete all your logs, medications, and settings. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setResetModal(false)} style={{
                flex: 1, padding: '14px',
                background: 'var(--color-surface-soft)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                color: 'var(--color-text-secondary)', fontFamily: 'var(--font-main)',
              }}>Cancel</button>
              <button onClick={resetAll} style={{
                flex: 1, padding: '14px',
                background: 'var(--color-danger)',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                color: '#fff', fontFamily: 'var(--font-main)',
              }}>Reset everything</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
