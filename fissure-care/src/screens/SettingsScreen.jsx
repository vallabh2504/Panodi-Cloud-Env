import { useState, useEffect } from 'react'
import { getSettings, saveSettings, getAllLogs } from '../lib/storage'
import { themeList } from '../lib/themes'
import { motion } from 'framer-motion'
import { Check, Palette, Bell, BellOff } from 'lucide-react'
import { jsPDF } from 'jspdf'

async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

export default function SettingsScreen({ theme, themeId, onThemeChange }) {
  const [settings, setSettings] = useState({ userName: '', waterGoal: 8, fiberGoal: 25, remindersEnabled: false })
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetCountdown, setResetCountdown] = useState(0)
  const [notifStatus, setNotifStatus] = useState('unknown')
  const [notifDeniedMsg, setNotifDeniedMsg] = useState('')
  const [clipMsg, setClipMsg] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    setSettings(getSettings())
    if (typeof Notification !== 'undefined') {
      setNotifStatus(Notification.permission)
    } else {
      setNotifStatus('unsupported')
    }
  }, [])

  const handleToggleReminders = async (enabled) => {
    if (enabled) {
      const status = await requestNotificationPermission()
      setNotifStatus(status)
      if (status !== 'granted') {
        setNotifDeniedMsg('Permission not granted. Please enable notifications in your browser/OS settings.')
        return
      }
    }
    setNotifDeniedMsg('')
    setSettings(s => ({ ...s, remindersEnabled: enabled }))
  }

  const handleSave = () => {
    saveSettings({ ...settings })
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
    setClipMsg('Copied to clipboard!')
    setTimeout(() => setClipMsg(''), 2500)
  }

  const generatePDF = async () => {
    setPdfLoading(true)
    try {
      const logs = await getAllLogs()
      const cfg = getSettings()
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)
      const rangeStart = thirtyDaysAgo.toISOString().split('T')[0]

      // Title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('Fissure Care — Health Summary', 20, 24)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(120)
      doc.text(`Date range: ${rangeStart} to ${dateStr}`, 20, 32)
      doc.text(`Patient: ${cfg.userName || 'Not specified'}`, 20, 38)
      doc.setTextColor(0)

      // Section 1: Pain & Bleeding Summary
      let y = 50
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('1. Pain & Bleeding Summary (last 14 entries)', 20, y)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80)
      doc.text('Date          Pain   Blood   Bristol   Sitz Baths', 20, y)
      doc.setTextColor(0)
      y += 5
      doc.setDrawColor(200)
      doc.line(20, y, 190, y)
      y += 5

      const recent14 = logs.slice(0, 14)
      doc.setFontSize(9)
      for (const l of recent14) {
        const entryDate = l.date || '—'
        const pain = l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain ?? '—'
        const blood = l.bowelMovements?.some(bm => bm.bloodPresent) ? 'Yes' : 'No'
        const bristol = l.bowelMovements?.[0]?.bristolType ?? '—'
        const sitz = l.sitzBaths?.length ?? 0
        doc.text(`${entryDate}    ${pain}      ${blood}    ${bristol}         ${sitz}`, 20, y)
        y += 6
        if (y > 260) { doc.addPage(); y = 20 }
      }

      // Section 2: Medication List
      y += 6
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('2. Medication List', 20, y)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const meds = JSON.parse(localStorage.getItem('fissurecare_medications') || '[]')
      if (meds.length === 0) {
        doc.setTextColor(120)
        doc.text('No medications recorded.', 20, y)
        doc.setTextColor(0)
        y += 7
      } else {
        for (const med of meds) {
          doc.text(`• ${med.name || 'Unknown'}`, 20, y)
          y += 6
          if (y > 260) { doc.addPage(); y = 20 }
        }
      }

      // Section 3: Notes (last 3 journal entries)
      y += 6
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('3. Notes', 20, y)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const notedLogs = logs.filter(l => l.selfCare?.notes).slice(0, 3)
      if (notedLogs.length === 0) {
        doc.setTextColor(120)
        doc.text('No journal notes recorded.', 20, y)
        doc.setTextColor(0)
        y += 7
      } else {
        for (const l of notedLogs) {
          doc.setFont('helvetica', 'bold')
          doc.text(l.date || '—', 20, y)
          y += 5
          doc.setFont('helvetica', 'normal')
          const lines = doc.splitTextToSize(l.selfCare.notes, 165)
          doc.text(lines, 20, y)
          y += lines.length * 5 + 4
          if (y > 260) { doc.addPage(); y = 20 }
        }
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text('Generated by Fissure Care · For personal use only · Not a medical record', 20, 287)
      }

      doc.save(`fissure-care-report-${dateStr}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  const resetData = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('fissurecare_'))
    keys.forEach(k => localStorage.removeItem(k))
    setShowReset(false)
    setSaved(false)
    setSettings({ userName: '', waterGoal: 8, fiberGoal: 25, remindersEnabled: false })
  }

  const startResetCountdown = () => {
    setResetCountdown(3)
    const interval = setInterval(() => {
      setResetCountdown(c => {
        if (c <= 1) { clearInterval(interval); resetData(); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const InputRow = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>{label}</p>
      {children}
    </div>
  )

  return (
    <div>
      <div style={{
        padding: '20px 20px 16px', background: theme.headerGradient,
        borderBottom: `1px solid ${theme.cardBorder}`,
      }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: theme.primary }}>Settings</p>
        <p style={{ fontSize: 13, color: theme.textMuted }}>Personalize your experience</p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* ── Theme Picker ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Palette size={15} color={theme.primary} />
            <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              THEME
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {themeList.map((t) => {
              const isActive = t.id === themeId
              return (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onThemeChange(t.id)}
                  aria-label={isActive ? `${t.name} theme selected` : `Select ${t.name} theme`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 16,
                    background: isActive ? theme.card : theme.card,
                    border: `2px solid ${isActive ? t.primary : theme.cardBorder}`,
                    boxShadow: isActive ? `0 4px 16px ${t.primary}25` : 'none',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Theme preview gradient strip */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${t.primary}, ${t.primaryLight})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {t.emoji}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: theme.textMuted }}>{t.description}</p>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${t.primary}, ${t.primaryLight})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
          {/* Theme color preview dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
            {themeList.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onThemeChange(t.id)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${t.id} theme`}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onThemeChange(t.id)}
                style={{
                  width: t.id === themeId ? 28 : 12, height: 12, borderRadius: 6,
                  background: `linear-gradient(90deg, ${t.primary}, ${t.primaryLight})`,
                  cursor: 'pointer', transition: 'width 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        <InputRow label="Your name (for the greeting):">
          <input value={settings.userName} onChange={e => setSettings(s => ({ ...s, userName: e.target.value }))}
            placeholder="e.g. Priya"
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              border: `1px solid ${theme.cardBorder}`, fontSize: 14,
              color: theme.text, background: theme.card,
            }} />
        </InputRow>

        <InputRow label={`Daily water goal: ${settings.waterGoal} glasses`}>
          <input type="range" min={4} max={12} value={settings.waterGoal}
            onChange={e => setSettings(s => ({ ...s, waterGoal: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: theme.primary }} />
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{settings.waterGoal * 250}ml daily goal</p>
        </InputRow>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          style={{
            width: '100%', padding: '16px', marginBottom: 24,
            background: saved ? 'linear-gradient(135deg, #A8D5A2, #7BC97B)' : theme.ctaGradient,
            border: 'none', borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </motion.button>

        {/* ── Healing Reminders ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Bell size={15} color={theme.primary} />
            <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              HEALING REMINDERS
            </p>
          </div>
          <div style={{
            background: theme.tipBg, borderRadius: 16, padding: '14px 16px',
            border: `1px solid ${theme.tipBorder}`, marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, marginRight: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
                  {settings.remindersEnabled ? 'Reminders Enabled' : 'Enable Reminders'}
                </p>
                <p style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>
                  Push notifications at 9am (fiber tip), noon (hydration), and 8pm (log reminder) — fires when the app is open near those times.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleToggleReminders(!settings.remindersEnabled)}
                style={{
                  width: 52, height: 30, borderRadius: 15, border: 'none', cursor: 'pointer',
                  background: settings.remindersEnabled ? theme.primary : theme.cardBorder,
                  position: 'relative', flexShrink: 0, transition: 'background 0.3s',
                }}
              >
                <motion.div
                  animate={{ x: settings.remindersEnabled ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2 }}
                />
              </motion.button>
            </div>
            {notifDeniedMsg && (
              <p style={{ fontSize: 11, color: '#E85A5A', marginTop: 8 }}>{notifDeniedMsg}</p>
            )}
            {notifStatus === 'denied' && !notifDeniedMsg && (
              <p style={{ fontSize: 11, color: '#E85A5A', marginTop: 8 }}>
                Notifications are blocked. Please enable them in your browser/OS settings.
              </p>
            )}
            {notifStatus === 'unsupported' && (
              <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 8 }}>
                Notifications are not supported in this browser.
              </p>
            )}
            {notifStatus === 'granted' && settings.remindersEnabled && (
              <p style={{ fontSize: 11, color: theme.wellnessHigh, marginTop: 8 }}>
                Active: morning fruit reminder (9am), hydration check (noon), evening log reminder (8pm).
              </p>
            )}
          </div>
        </div>

        {/* Data Management */}
        <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>DATA & PRIVACY</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <button onClick={exportData} style={{
            padding: '14px', background: theme.card, border: `1.5px solid ${theme.accent}`, borderRadius: 14,
            color: theme.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Export All Data (JSON)
          </button>
          <button onClick={generatePDF} disabled={pdfLoading} style={{
            padding: '14px', background: theme.card, border: `1.5px solid ${theme.accent}`, borderRadius: 14,
            color: theme.primary, fontSize: 14, fontWeight: 600, cursor: pdfLoading ? 'default' : 'pointer',
            opacity: pdfLoading ? 0.7 : 1,
          }}>
            {pdfLoading ? 'Generating...' : 'Share with Doctor (PDF)'}
          </button>
          <button onClick={copyToClipboard} style={{
            padding: '14px', background: theme.card, border: `1.5px solid ${theme.wellnessHigh}`, borderRadius: 14,
            color: theme.wellnessHigh, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Copy Data to Clipboard
          </button>
          {clipMsg && (
            <p style={{ fontSize: 12, color: theme.wellnessHigh, textAlign: 'center', fontWeight: 600 }}>{clipMsg}</p>
          )}
          <button onClick={() => setShowReset(true)} style={{
            padding: '14px', background: theme.card, border: '1.5px solid #F48585', borderRadius: 14,
            color: '#E85A5A', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Reset All Data
          </button>
        </div>

        {/* PWA Install hint */}
        <div style={{
          background: theme.tipBg, borderRadius: 16, padding: '14px 16px',
          border: `1px solid ${theme.tipBorder}`, marginBottom: 24,
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: theme.primary, marginBottom: 4 }}>Install as App</p>
          <p style={{ fontSize: 12, color: theme.textMuted }}>
            Add Healing Garden to your home screen for the best experience and future notification support.
            On iOS: tap Share then "Add to Home Screen". On Android: tap the browser menu then "Install App".
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ background: '#FFF8E8', borderRadius: 14, padding: '12px 14px', border: '1px solid #F5C67A' }}>
          <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6 }}>
            <strong>Medical Disclaimer:</strong> Healing Garden is for personal tracking only and does not constitute medical advice. Always consult your doctor or healthcare provider for medical decisions.
          </p>
        </div>

        <p style={{ fontSize: 11, color: theme.navInactive, textAlign: 'center', marginTop: 20 }}>Healing Garden v2.0</p>
      </div>

      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: theme.card, borderRadius: 24, padding: '28px 24px', maxWidth: 320, textAlign: 'center' }}
          >
            <p style={{ fontSize: 32, marginBottom: 12 }}>{theme.emoji}</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Reset all data?</p>
            <p style={{ fontSize: 14, color: theme.textMuted, marginBottom: 24 }}>
              This will permanently delete all your logs, medications and settings. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowReset(false)} style={{
                flex: 1, padding: '14px', background: theme.cardBorder, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: theme.text,
              }}>Cancel</button>
              <button onClick={resetData} style={{
                flex: 1, padding: '14px', background: '#F48585', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff',
              }}>Yes, Reset</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
