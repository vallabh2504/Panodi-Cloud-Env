import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getSettings, saveSettings, getAllLogs } from '../lib/storage'
import { haptic } from '../lib/haptics'
import {
  User, Droplets, Download, Copy, RotateCcw,
  LogOut, Shield, Check,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import FadeUp from '../components/animations/FadeUp'

/* ─── SettingRow ─── */
function SettingRow({ icon, label, children, danger }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '15px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        flexShrink: 0,
        background: danger ? 'rgba(184,84,80,0.08)' : 'var(--color-surface-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: danger ? 'var(--color-danger)' : 'var(--color-primary)',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 14,
          fontWeight: 600,
          color: danger ? 'var(--color-danger)' : 'var(--color-text-primary)',
          margin: 0,
        }}>
          {label}
        </p>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

/* ─── SettingGroup ─── */
function SettingGroup({ title, children }) {
  return (
    <div style={{
      background: 'var(--color-surface-solid)',
      borderRadius: 'var(--radius-lg)',
      padding: '4px 18px',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {title && (
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          paddingTop: 14,
          marginBottom: -4,
        }}>
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

/* ─── Inline button style helper ─── */
const actionBtnStyle = (color = 'var(--color-primary)') => ({
  padding: '7px 12px',
  background: 'var(--color-surface-soft)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  color,
  fontFamily: 'var(--font-main)',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
})

/* ─── Main Screen ─── */
export default function SettingsScreen({ session }) {
  const [settings, setSettings] = useState({ userName: '', waterGoal: 8 })
  const [copied, setCopied] = useState(false)
  const [resetModal, setResetModal] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const s = getSettings()
    const googleName =
      session?.user?.user_metadata?.full_name ||
      session?.user?.user_metadata?.name ||
      ''
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
    haptic.tap()
    const logs = await getAllLogs()
    const blob = new Blob(
      [JSON.stringify({ settings, logs }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carenest-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyDoctor = async () => {
    haptic.tap()
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
          bm
            ? `Pain: ${bm.painLevel}/10, Stool type: ${bm.bristolType}, Bleeding: ${bm.bloodPresent ? 'Yes' : 'No'}`
            : '',
          `Water: ${l.hydration?.waterGlasses || 0} glasses, Sitz baths: ${l.sitzBaths?.length || 0}`,
          l.selfCare?.notes ? `Notes: ${l.selfCare.notes}` : '',
          '---',
        ]
          .filter(Boolean)
          .join('\n')
      }),
      '',
      'Not a substitute for professional medical advice.',
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      haptic.success()
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
    haptic.tap()
    await supabase.auth.signOut()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: 100 }}
    >
      <PageHeader
        title="Settings"
        subtitle="Your preferences & data"
        action={
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 10px',
                  background: 'rgba(74,158,110,0.12)',
                  borderRadius: 20,
                  color: 'var(--color-success)',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-main)',
                }}
              >
                <Check size={13} />
                Saved
              </motion.div>
            )}
          </AnimatePresence>
        }
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Profile group */}
        <FadeUp delay={0.05}>
          <SettingGroup title="Profile">
            <SettingRow icon={<User size={17} />} label="Your name">
              <input
                value={settings.userName}
                onChange={e => update('userName', e.target.value)}
                placeholder="Enter name"
                style={{
                  width: 120,
                  padding: '7px 10px',
                  textAlign: 'right',
                  background: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  fontFamily: 'var(--font-main)',
                }}
              />
            </SettingRow>

            {/* Water goal slider */}
            <div style={{ padding: '15px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  flexShrink: 0,
                }}>
                  <Droplets size={17} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      margin: 0,
                    }}>
                      Daily water goal
                    </p>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}>
                      {settings.waterGoal} glasses
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    value={settings.waterGoal}
                    onChange={e => update('waterGoal', +e.target.value)}
                    style={{ accentColor: 'var(--color-primary)', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </SettingGroup>
        </FadeUp>

        {/* Data group */}
        <FadeUp delay={0.09}>
          <SettingGroup title="Data">
            <SettingRow icon={<Download size={17} />} label="Export health data">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={exportData}
                style={actionBtnStyle()}
              >
                Export
              </motion.button>
            </SettingRow>
            <SettingRow icon={<Copy size={17} />} label="Copy doctor summary">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={copyDoctor}
                style={actionBtnStyle(copied ? 'var(--color-success)' : 'var(--color-primary)')}
              >
                {copied ? <><Check size={13} /> Copied</> : 'Copy'}
              </motion.button>
            </SettingRow>
          </SettingGroup>
        </FadeUp>

        {/* Danger zone */}
        <FadeUp delay={0.13}>
          <SettingGroup title="Danger zone">
            <SettingRow icon={<RotateCcw size={17} />} label="Reset all data" danger>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { haptic.tap(); setResetModal(true) }}
                style={{
                  padding: '7px 12px',
                  background: 'rgba(184,84,80,0.08)',
                  border: '1px solid rgba(184,84,80,0.2)',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--color-danger)',
                  fontFamily: 'var(--font-main)',
                }}
              >
                Reset
              </motion.button>
            </SettingRow>
          </SettingGroup>
        </FadeUp>

        {/* Medical disclaimer */}
        <FadeUp delay={0.17}>
          <div style={{
            background: 'var(--color-surface-teal)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            gap: 10,
          }}>
            <Shield size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: 'var(--color-primary)' }}>Medical disclaimer:</strong>{' '}
              CareNest is a personal wellness tracker and is not a substitute for professional
              medical advice, diagnosis, or treatment. Always seek the advice of your physician.
            </p>
          </div>
        </FadeUp>

        {/* Sign out */}
        {session && (
          <FadeUp delay={0.2}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={signOut}
              style={{
                width: '100%',
                padding: '15px',
                background: 'var(--color-surface-solid)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <LogOut size={17} />
              Sign out
            </motion.button>
          </FadeUp>
        )}

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          CareNest v2.0 · Your data stays private
        </p>
      </div>

      {/* Reset confirmation modal with AnimatePresence */}
      <AnimatePresence>
        {resetModal && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResetModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,26,58,0.5)',
                zIndex: 100,
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
              }}
            />
            <motion.div
              key="modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 430,
                zIndex: 101,
                background: 'var(--color-surface-solid)',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                padding: '28px 24px 52px',
                boxShadow: '0 -8px 40px rgba(44,49,64,0.14)',
              }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--color-border-strong)' }} />
              </div>

              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 10,
              }}>
                Reset all data?
              </h3>
              <p style={{
                fontSize: 14,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.55,
                marginBottom: 26,
              }}>
                This will permanently delete all your logs, medications, and settings.
                This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { haptic.tap(); setResetModal(false) }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'var(--color-surface-soft)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-main)',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { haptic.error(); resetAll() }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'var(--color-danger)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#fff',
                    fontFamily: 'var(--font-main)',
                  }}
                >
                  Reset everything
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
