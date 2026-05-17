import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { getWatchData, saveWatchData, getAllWatchData, getLog } from '../lib/storage'

/* ── BLE connect helper ── */
async function connectBoatBLE({ onConnected, onHeartRate, onDisconnect }) {
  if (!navigator?.bluetooth) throw Object.assign(new Error('NO_BLE'), { code: 'NO_BLE' })
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      'battery_service',
      'heart_rate',
      '0000fee0-0000-1000-8000-00805f9b34fb',
    ],
  })
  if (onDisconnect) device.addEventListener('gattserverdisconnected', onDisconnect)
  const server = await device.gatt.connect()
  const info = { name: device.name || 'boAt Watch', battery: null }
  try {
    const svc = await server.getPrimaryService('battery_service')
    const ch = await svc.getCharacteristic('battery_level')
    info.battery = (await ch.readValue()).getUint8(0)
  } catch {}
  try {
    const hrSvc = await server.getPrimaryService('heart_rate')
    const hrCh = await hrSvc.getCharacteristic('heart_rate_measurement')
    await hrCh.startNotifications()
    hrCh.addEventListener('characteristicvaluechanged', e => {
      const flags = e.target.value.getUint8(0)
      const hr = (flags & 0x1) ? e.target.value.getUint16(1, true) : e.target.value.getUint8(1)
      if (onHeartRate) onHeartRate(hr)
    })
  } catch {}
  onConnected(info)
  return device
}

/* ── Concentric Activity Rings ── */
function ActivityRings({ steps, activeMinutes, calories, theme }) {
  const rings = [
    { r: 56, goal: 8000,  value: steps,         color: theme.primary,                label: 'Steps' },
    { r: 42, goal: 30,    value: activeMinutes,  color: theme.wellnessHigh || '#A8D5A2', label: 'Active' },
    { r: 28, goal: 300,   value: calories,       color: '#C9A8F5',                    label: 'Cals' },
  ]
  const cx = 68, cy = 68, sw = 8, tf = `rotate(-90 ${cx} ${cy})`
  return (
    <svg width={136} height={136} aria-label="Activity rings">
      {rings.map(({ r, color }) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none"
          stroke={theme.cardBorder} strokeWidth={sw} />
      ))}
      {rings.map(({ r, goal, value, color }) => {
        const c = 2 * Math.PI * r
        const off = c - Math.min(value / goal, 1) * c
        return (
          <circle key={r + 'p'} cx={cx} cy={cy} r={r} fill="none"
            stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off} transform={tf}
            style={{ transition: 'stroke-dashoffset 1.1s ease' }} />
        )
      })}
    </svg>
  )
}

/* ── BLE Connect Card ── */
function ConnectCard({ theme, today, onDataSaved }) {
  const [bleState, setBleState] = useState('idle')
  const [bleInfo, setBleInfo] = useState(null)
  const [liveHR, setLiveHR] = useState(null)
  const [showManual, setShowManual] = useState(false)
  const [form, setForm] = useState({ steps: '', activeMinutes: '', heartRate: '', spO2: '', sleepHours: '', calories: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const bleDeviceRef = useRef(null)
  const bleSupported = typeof navigator !== 'undefined' && !!navigator.bluetooth

  const handleConnect = async () => {
    if (!bleSupported) { setShowManual(true); return }
    setBleState('connecting')
    try {
      const device = await connectBoatBLE({
        onConnected: info => { setBleInfo(info); setBleState('connected') },
        onHeartRate: hr => {
          setLiveHR(hr)
          // Save live HR to watch data immediately
          saveWatchData(today, { heartRate: hr, syncedAt: new Date().toISOString() })
        },
        onDisconnect: () => { setBleState('disconnected'); setLiveHR(null) },
      })
      bleDeviceRef.current = device
    } catch (e) {
      if (e.name === 'NotFoundError') setBleState('idle')
      else { setBleState('error'); setTimeout(() => setBleState('idle'), 3000) }
    }
  }

  const openManual = () => {
    const stored = getWatchData(today)
    setForm({
      steps: stored?.steps ? String(stored.steps) : '',
      activeMinutes: stored?.activeMinutes ? String(stored.activeMinutes) : '',
      heartRate: stored?.heartRate ? String(stored.heartRate) : liveHR ? String(liveHR) : '',
      spO2: stored?.spO2 ? String(stored.spO2) : '',
      sleepHours: stored?.sleepHours ? String(stored.sleepHours) : '',
      calories: stored?.calories ? String(stored.calories) : '',
    })
    setShowManual(true)
  }

  const handleSave = async () => {
    const data = {
      steps: parseInt(form.steps) || 0,
      activeMinutes: parseInt(form.activeMinutes) || 0,
      heartRate: parseInt(form.heartRate) || null,
      spO2: parseFloat(form.spO2) || null,
      sleepHours: parseFloat(form.sleepHours) || null,
      calories: parseInt(form.calories) || 0,
      syncedAt: new Date().toISOString(),
    }
    setSaving(true)
    await saveWatchData(today, data)
    setSaved(true)
    setSaving(false)
    onDataSaved()
    setTimeout(() => { setSaved(false); setShowManual(false) }, 900)
  }

  const FIELDS = [
    { key: 'steps',         label: '🚶 Steps',                placeholder: 'e.g. 6000',  type: 'numeric',  quick: [1000, 2000] },
    { key: 'activeMinutes', label: '⏱️ Active Minutes',        placeholder: 'e.g. 30',   type: 'numeric' },
    { key: 'heartRate',     label: '❤️ Avg Heart Rate (bpm)',  placeholder: 'e.g. 72',   type: 'numeric' },
    { key: 'spO2',          label: '🩸 SpO2 (%)',              placeholder: 'e.g. 98',   note: 'Normal: 95–100%', type: 'decimal' },
    { key: 'sleepHours',    label: '😴 Sleep Last Night (hrs)',placeholder: 'e.g. 7.5',  note: '+5 pts if ≥7h',   type: 'decimal' },
    { key: 'calories',      label: '🔥 Calories Burned',       placeholder: 'e.g. 280',  type: 'numeric' },
  ]

  return (
    <>
      <div style={{
        margin: '0 16px 16px', background: theme.card, borderRadius: 22,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: `0 2px 14px ${theme.cardShadow}`, overflow: 'hidden',
      }}>
        {/* Watch icon + name + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}08)`,
              border: `1.5px solid ${theme.primary}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>⌚</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>boAt Wave Magma</p>
              <p style={{ fontSize: 11, color: theme.textMuted }}>Bluetooth Smart Watch</p>
            </div>
          </div>
          <div>
            {bleState === 'connected' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.successBg, borderRadius: 20, padding: '5px 12px', border: `1px solid ${theme.successBorder}` }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.success, animation: 'pulse 1.5s ease infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.success }}>{bleInfo?.name || 'Connected'}</span>
                {bleInfo?.battery != null && <span style={{ fontSize: 11, color: theme.success }}>🔋{bleInfo.battery}%</span>}
              </div>
            ) : bleState === 'connecting' ? (
              <span style={{ fontSize: 12, color: theme.textMuted }}>Searching…</span>
            ) : bleState === 'error' ? (
              <span style={{ fontSize: 12, color: '#F48585' }}>Failed</span>
            ) : bleState === 'disconnected' ? (
              <span style={{ fontSize: 12, color: '#F5C67A' }}>Disconnected</span>
            ) : null}
          </div>
        </div>

        {/* Live HR badge when connected */}
        {liveHR && (
          <div style={{ margin: '0 16px 12px', background: theme.dangerBg, borderRadius: 14, padding: '10px 14px', border: `1px solid ${theme.dangerBorder}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>❤️</span>
            <div>
              <p style={{ fontSize: 11, color: theme.danger, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Heart Rate</p>
              <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Nunito', color: theme.danger, lineHeight: 1.1 }}>{liveHR} <span style={{ fontSize: 13, fontWeight: 500 }}>bpm</span></p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, padding: '0 16px 14px' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleConnect}
            disabled={bleState === 'connecting'}
            style={{
              flex: 1, padding: '13px 0',
              background: bleState === 'connected'
                ? theme.successBg
                : `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}08)`,
              border: `1.5px solid ${bleState === 'connected' ? theme.successBorder : theme.primary + '60'}`,
              borderRadius: 16, cursor: bleState === 'connecting' ? 'default' : 'pointer',
              color: bleState === 'connected' ? theme.success : theme.primary,
              fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            {bleState === 'connecting' ? '⏳ Connecting…'
              : bleState === 'connected' ? '● Connected via BLE'
              : '⌚ Connect Watch (BLE)'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openManual}
            style={{
              flex: 1, padding: '13px 0',
              background: theme.tipBg, border: `1.5px solid ${theme.cardBorder}`,
              borderRadius: 16, cursor: 'pointer',
              color: theme.textMuted, fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >✏️ Enter Manually</motion.button>
        </div>

        {/* BLE platform note */}
        <div style={{ padding: '0 16px 14px' }}>
          {!bleSupported ? (
            <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6, textAlign: 'center' }}>
              ⚠️ BLE requires Chrome on Android/desktop.<br />
              On iPhone: open <b>boAt Connect</b> app → check stats → tap <b>Enter Manually</b>.
            </p>
          ) : (
            <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6, textAlign: 'center' }}>
              Pair via BLE for live heart rate · Tap <b>Enter Manually</b> for steps, SpO2 &amp; sleep from the boAt Connect app.
            </p>
          )}
        </div>
      </div>

      {/* Manual entry bottom sheet */}
      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={e => { if (e.target === e.currentTarget) setShowManual(false) }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{
                background: theme.card, borderRadius: '28px 28px 0 0',
                width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.22)',
              }}
            >
              <div style={{ padding: '18px 20px 40px' }}>
                <div style={{ width: 36, height: 4, background: theme.cardBorder, borderRadius: 2, margin: '0 auto 18px' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>⌚ boAt Watch Data</p>
                  <button onClick={() => setShowManual(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: theme.textMuted, cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>

                {/* How-to */}
                <div style={{ background: theme.tipBg, borderRadius: 14, padding: '11px 14px', marginBottom: 18, border: `1px solid ${theme.tipBorder}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: theme.primary, marginBottom: 5 }}>How to read from boAt Wave Magma</p>
                  <p style={{ fontSize: 12, color: theme.text, lineHeight: 1.7 }}>
                    📱 Open <b>boAt Connect</b> app on your phone<br />
                    → tap <b>Health</b> tab for SpO2 &amp; sleep<br />
                    → tap <b>Activity</b> for steps, calories, active time<br />
                    → tap the ❤️ icon for heart rate
                  </p>
                </div>

                {FIELDS.map(({ key, label, placeholder, note, type, quick }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      {label}
                      {note && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 6, color: theme.primary }}>· {note}</span>}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="number"
                        inputMode={type === 'decimal' ? 'decimal' : 'numeric'}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{
                          flex: 1, padding: '11px 14px', borderRadius: 12,
                          border: `1.5px solid ${theme.cardBorder}`, background: theme.tipBg,
                          fontSize: 17, fontWeight: 700, color: theme.text, outline: 'none',
                        }}
                      />
                      {quick?.map(amt => (
                        <button key={amt}
                          onClick={() => setForm(f => ({ ...f, [key]: String((parseInt(f[key]) || 0) + amt) }))}
                          style={{
                            padding: '0 12px', background: theme.tipBg,
                            border: `1px solid ${theme.cardBorder}`, borderRadius: 12,
                            fontSize: 12, fontWeight: 700, color: theme.primary, cursor: 'pointer', whiteSpace: 'nowrap',
                          }}
                        >+{amt >= 1000 ? `${amt / 1000}k` : amt}</button>
                      ))}
                    </div>
                  </div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', marginTop: 8, padding: '15px',
                    background: saved ? (theme.wellnessHigh || '#A8D5A2') : (theme.ctaGradient || theme.primary),
                    border: 'none', borderRadius: 16, color: '#fff',
                    fontSize: 15, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.3s ease',
                  }}
                >
                  {saved ? '✓ Saved — Score Updated!' : saving ? 'Saving…' : '⌚ Save boAt Data'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Today's Stats ── */
function TodayStats({ watchData, liveHR, theme }) {
  const steps     = watchData?.steps || 0
  const activeMins = watchData?.activeMinutes || 0
  const calories  = watchData?.calories || 0
  const hr        = liveHR || watchData?.heartRate
  const spO2      = watchData?.spO2
  const sleep     = watchData?.sleepHours

  const stepsGoal = 8000
  const stepsPct = Math.min(steps / stepsGoal, 1)
  const stepsColor = steps >= stepsGoal ? (theme.wellnessHigh || '#A8D5A2')
    : steps >= 5000 ? theme.primary
    : steps >= 2500 ? '#F5C67A'
    : theme.cardBorder

  return (
    <div style={{ margin: '0 16px 16px' }}>
      {/* Activity rings + ring legend */}
      <div style={{
        background: theme.card, borderRadius: 22, padding: '18px 16px 14px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: `0 2px 14px ${theme.cardShadow}`,
      }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Today's Activity</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ActivityRings steps={steps} activeMinutes={activeMins} calories={calories} theme={theme} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontSize: 26 }}>{steps >= 8000 ? '🏆' : steps >= 4000 ? '🚶' : '🏃'}</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {[
              { color: theme.primary,                 label: 'Steps',   value: `${steps.toLocaleString()} / 8,000` },
              { color: theme.wellnessHigh || '#A8D5A2', label: 'Active', value: `${activeMins} / 30 min` },
              { color: '#C9A8F5',                     label: 'Cals',    value: `${calories} / 300 cal` },
            ].map(({ color, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: theme.textMuted, width: 46, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step progress bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: theme.textMuted }}>Steps goal</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: stepsColor }}>{Math.round(stepsPct * 100)}%</span>
          </div>
          <div style={{ height: 6, background: theme.cardBorder, borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepsPct * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 3, background: stepsColor }}
            />
          </div>
        </div>
      </div>

      {/* Vitals pills */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {[
          { icon: '❤️', label: 'Heart Rate',  value: hr    ? `${hr} bpm`  : '—', color: '#F48585' },
          { icon: '🩸', label: 'SpO2',        value: spO2  ? `${spO2}%`  : '—', color: '#74B8E8' },
          { icon: '😴', label: 'Sleep',       value: sleep ? `${sleep}h` : '—', color: '#C9A8F5' },
          { icon: '🔥', label: 'Calories',    value: calories || '—',            color: '#F5C67A' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: theme.card,
            borderRadius: 16, padding: '10px 6px', textAlign: 'center',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: `0 1px 6px ${theme.cardShadow}`,
          }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{stat.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Nunito', color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Score impact */}
      {(steps > 0 || sleep) && (
        <div style={{
          marginTop: 10, background: theme.tipBg, borderRadius: 16, padding: '11px 14px',
          border: `1px solid ${theme.tipBorder}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Wellness Score Boost</p>
            <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>
              {steps >= 7500 ? '+10 pts for 7,500+ steps' : steps >= 5000 ? '+7 pts for 5,000+ steps' : steps >= 2500 ? '+4 pts for 2,500+ steps' : steps > 0 ? '+1 pt for any steps' : 'Reach 7,500+ steps for +10 pts'}
              {sleep >= 7 ? ' · +5 pts for 7h+ sleep' : sleep >= 6 ? ' · +3 pts for 6h+ sleep' : sleep >= 5 ? ' · +1 pt for 5h+ sleep' : ' · Sleep 7h for +5 pts'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Fitness Charts ── */
function FitnessCharts({ theme, days }) {
  const [period, setPeriod] = useState('Week')
  const PERIODS = ['Week', 'Month', '3 Months']

  const allWatchData = useMemo(() => {
    const map = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('fissurecare_watch_')) {
        try { map[key.replace('fissurecare_watch_', '')] = JSON.parse(localStorage.getItem(key)) } catch {}
      }
    }
    return map
  }, [])

  const limit = period === 'Week' ? 7 : period === 'Month' ? 30 : 90

  const chartData = useMemo(() => {
    const result = []
    for (let i = limit - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const wd = allWatchData[dateStr] || {}
      const logRaw = localStorage.getItem('fissurecare_log_' + dateStr)
      const log = logRaw ? JSON.parse(logRaw) : null
      const steps = log?.activity?.steps || wd.steps || 0
      if (steps > 0 || wd.heartRate || wd.sleepHours) {
        result.push({
          date: d.toLocaleDateString('en', { day: 'numeric', month: 'short' }),
          steps,
          activeMins: log?.activity?.walkingMinutes || wd.activeMinutes || 0,
          heartRate: log?.activity?.heartRate || wd.heartRate || null,
          spO2: log?.activity?.spO2 || wd.spO2 || null,
          sleepHours: log?.activity?.sleepHours || wd.sleepHours || null,
          calories: log?.activity?.calories || wd.calories || 0,
        })
      }
    }
    return result
  }, [allWatchData, period])

  const hasData = chartData.length > 0
  const hasHR = chartData.some(d => d.heartRate)
  const hasSleep = chartData.some(d => d.sleepHours)
  const hasCals = chartData.some(d => d.calories > 0)

  const activeDays = chartData.filter(d => d.steps > 0)
  const avgSteps = activeDays.length ? Math.round(activeDays.reduce((s, d) => s + d.steps, 0) / activeDays.length) : 0
  const goalDays = chartData.filter(d => d.steps >= 8000).length
  const hrDays = chartData.filter(d => d.heartRate)
  const avgHR = hrDays.length ? Math.round(hrDays.reduce((s, d) => s + d.heartRate, 0) / hrDays.length) : null
  const sleepDays = chartData.filter(d => d.sleepHours)
  const avgSleep = sleepDays.length ? (sleepDays.reduce((s, d) => s + d.sleepHours, 0) / sleepDays.length).toFixed(1) : null

  const p = theme.primary
  const muted = theme.textMuted
  const cardBg = theme.card
  const border = theme.cardBorder

  if (!hasData) {
    return (
      <div style={{ margin: '0 16px 24px', background: cardBg, borderRadius: 20, padding: '36px 20px', textAlign: 'center', border: `1px solid ${border}` }}>
        <p style={{ fontSize: 36, marginBottom: 10 }}>📊</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 6 }}>No history yet</p>
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>Connect your watch or enter data above — your fitness trends will appear here.</p>
      </div>
    )
  }

  return (
    <>
      {/* Period selector */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '8px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: period === p ? theme.primary : border,
            color: period === p ? '#fff' : muted,
            fontWeight: period === p ? 700 : 400, fontSize: 13, transition: 'all 0.2s',
          }}>{p}</button>
        ))}
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px', overflowX: 'auto' }}>
        {[
          { label: 'Avg Steps',  value: avgSteps.toLocaleString(),          icon: '🚶', color: p },
          { label: 'Goal Days',  value: `${goalDays}d`,                     icon: '🏆', color: theme.wellnessHigh || '#A8D5A2', sub: '8k steps' },
          { label: 'Avg HR',     value: avgHR   ? `${avgHR} bpm` : '—',    icon: '❤️', color: '#F48585' },
          { label: 'Avg Sleep',  value: avgSleep ? `${avgSleep}h` : '—',   icon: '😴', color: '#C9A8F5' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: '0 0 auto', minWidth: 80, background: cardBg, borderRadius: 16,
            padding: '11px 10px', textAlign: 'center', border: `1px solid ${border}`,
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{stat.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Nunito', color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: muted, marginTop: 2 }}>{stat.sub || stat.label}</div>
          </div>
        ))}
      </div>

      {/* Steps chart */}
      <div style={{ margin: '0 16px 14px', background: cardBg, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Steps & Active Time</p>
        <p style={{ fontSize: 11, color: muted, marginBottom: 10 }}>Daily steps vs. active minutes</p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
            <YAxis yAxisId="s" orientation="left" tick={{ fontSize: 10, fill: muted }} width={32} />
            <YAxis yAxisId="m" orientation="right" domain={[0, 60]} tick={{ fontSize: 10, fill: muted }} width={22} />
            <Tooltip formatter={(v, name) => [name === 'steps' ? v.toLocaleString() : `${v} min`, name === 'steps' ? 'Steps' : 'Active mins']} />
            <ReferenceLine yAxisId="s" y={8000} stroke={p} strokeDasharray="3 3" opacity={0.4} />
            <Line yAxisId="s" type="monotone" dataKey="steps" stroke={p} strokeWidth={2.5} dot={{ fill: p, r: 3 }} connectNulls name="steps" />
            <Line yAxisId="m" type="monotone" dataKey="activeMins" stroke={theme.wellnessHigh || '#A8D5A2'} strokeWidth={2} dot={false} connectNulls name="activeMins" />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 11, color: muted, marginTop: 4 }}>
          <span style={{ color: p }}>— Steps</span> &nbsp;
          <span style={{ color: theme.wellnessHigh || '#A8D5A2' }}>— Active mins</span>
          &nbsp;·&nbsp; Dashed = 8k goal · 8k+ steps adds +10 pts to wellness score
        </p>
      </div>

      {/* HR + SpO2 chart */}
      {hasHR && (
        <div style={{ margin: '0 16px 14px', background: cardBg, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Heart Rate & SpO2</p>
          <p style={{ fontSize: 11, color: muted, marginBottom: 10 }}>Resting HR and blood oxygen from boAt Watch</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={chartData.filter(d => d.heartRate || d.spO2)}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
              <YAxis yAxisId="hr" orientation="left" domain={[40, 120]} tick={{ fontSize: 10, fill: muted }} width={25} />
              <YAxis yAxisId="sp" orientation="right" domain={[90, 100]} tick={{ fontSize: 10, fill: muted }} width={25} />
              <Tooltip formatter={(v, name) => [name === 'heartRate' ? `${v} bpm` : `${v}%`, name === 'heartRate' ? 'Heart Rate' : 'SpO2']} />
              <Line yAxisId="hr" type="monotone" dataKey="heartRate" stroke="#F48585" strokeWidth={2.5} dot={{ fill: '#F48585', r: 3 }} connectNulls name="heartRate" />
              <Line yAxisId="sp" type="monotone" dataKey="spO2" stroke="#74B8E8" strokeWidth={2} dot={{ fill: '#74B8E8', r: 2 }} connectNulls name="spO2" />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: muted, marginTop: 4 }}>
            <span style={{ color: '#F48585' }}>— Heart Rate</span> &nbsp;
            <span style={{ color: '#74B8E8' }}>— SpO2</span>
            &nbsp;·&nbsp; Normal SpO2: 95–100%
          </p>
        </div>
      )}

      {/* Sleep chart */}
      {hasSleep && (
        <div style={{ margin: '0 16px 14px', background: cardBg, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Sleep Quality</p>
          <p style={{ fontSize: 11, color: muted, marginBottom: 10 }}>Hours of sleep per night · Target: 7–9h</p>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={chartData.filter(d => d.sleepHours)}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: muted }} width={20} />
              <Tooltip formatter={v => [`${v}h`, 'Sleep']} />
              <ReferenceLine y={7} stroke="#C9A8F5" strokeDasharray="3 3" opacity={0.6} />
              <Bar dataKey="sleepHours" fill="#C9A8F5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: muted, marginTop: 4 }}>
            Dashed = 7h target · Sleep ≥7h adds +5 pts to your wellness score
          </p>
        </div>
      )}

      {/* Calories chart */}
      {hasCals && (
        <div style={{ margin: '0 16px 14px', background: cardBg, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Calories Burned</p>
          <p style={{ fontSize: 11, color: muted, marginBottom: 10 }}>Active calorie burn from boAt Watch</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: muted }} width={28} />
              <Tooltip formatter={v => [`${v} kcal`, 'Calories']} />
              <Bar dataKey="calories" fill="#F5C67A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  )
}

/* ── Main FitnessScreen ── */
export default function FitnessScreen({ theme }) {
  const today = new Date().toISOString().split('T')[0]
  const [watchData, setWatchData] = useState(null)
  const [tick, setTick] = useState(0)

  const refresh = () => {
    setWatchData(getWatchData(today))
    setTick(t => t + 1)
  }

  useEffect(() => { refresh() }, [today])

  const p = theme?.primary || '#E8705A'
  const header = theme?.headerGradient || 'linear-gradient(135deg, #FFF0EB, #FFF8F5)'
  const border = theme?.cardBorder || '#F0E0DA'
  const muted = theme?.textMuted || '#8C7070'

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: '22px 20px 16px', background: header, borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>⌚</span>
          <p style={{ fontSize: 20, fontWeight: 700, color: p }}>Fitness Tracker</p>
        </div>
        <p style={{ fontSize: 13, color: muted }}>boAt Wave Magma · Activity, vitals &amp; sleep</p>
        {watchData?.syncedAt && (
          <p style={{ fontSize: 11, color: muted, marginTop: 4 }}>
            Last synced: {new Date(watchData.syncedAt).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}
          </p>
        )}
      </div>

      <div style={{ paddingTop: 16 }}>
        {/* Today's stats */}
        <TodayStats watchData={watchData} theme={theme} />

        {/* Section divider */}
        <div style={{ padding: '4px 20px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Connect &amp; Sync</p>
          <div style={{ flex: 1, height: 1, background: border }} />
        </div>

        {/* BLE connect card */}
        <ConnectCard theme={theme} today={today} onDataSaved={refresh} />

        {/* Section divider */}
        <div style={{ padding: '4px 20px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.8px' }}>History &amp; Trends</p>
          <div style={{ flex: 1, height: 1, background: border }} />
        </div>

        {/* Charts */}
        <FitnessCharts key={tick} theme={theme} />
      </div>
    </div>
  )
}
