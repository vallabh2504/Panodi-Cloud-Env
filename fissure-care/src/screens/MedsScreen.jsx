import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMedications, saveMedications } from '../lib/storage'
import { haptic } from '../lib/haptics'
import { Plus, Check, Clock, Pill, Droplets, Bath, Salad, Pipette, Trash2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import StatPill from '../components/ui/StatPill'
import BottomSheet from '../components/ui/BottomSheet'
import FadeUp from '../components/animations/FadeUp'

/* ─── Constants ─── */
const PRESET_MEDS = [
  { name: 'Lactulose syrup', type: 'laxative', dosage: '15ml', frequency: 'twice_daily' },
  { name: 'Senna / Senokot', type: 'laxative', dosage: '1 tablet', frequency: 'once_daily' },
  { name: 'Isabgol husk', type: 'supplement', dosage: '1 tsp in water', frequency: 'twice_daily' },
  { name: 'Cremaffin syrup', type: 'laxative', dosage: '10ml', frequency: 'twice_daily' },
  { name: 'Lidocaine 2% jelly', type: 'topical', dosage: 'Apply thin layer', frequency: 'three_times' },
  { name: 'Nifedipine 0.2% ointment', type: 'topical', dosage: 'Apply thin layer', frequency: 'twice_daily' },
  { name: 'Nitroglycerin ointment', type: 'topical', dosage: 'Apply thin layer', frequency: 'twice_daily' },
  { name: 'Zinc oxide cream', type: 'topical', dosage: 'Apply as needed', frequency: 'as_needed' },
]

const FREQ_LABELS = {
  once_daily: 'Once daily',
  twice_daily: 'Twice daily',
  three_times: '3× daily',
  as_needed: 'As needed',
}

const TIMELINE = [
  { time: '08:00', period: 'Morning', label: 'Lactulose syrup', detail: '15ml', icon: <Pill size={17} /> },
  { time: '09:00', period: 'Morning', label: 'Water goal', detail: '2 glasses', icon: <Droplets size={17} /> },
  { time: '13:00', period: 'Afternoon', label: 'Fiber-rich meal', detail: 'High fibre lunch', icon: <Salad size={17} /> },
  { time: '15:00', period: 'Afternoon', label: 'Sitz bath', detail: '15 min', icon: <Bath size={17} /> },
  { time: '20:00', period: 'Evening', label: 'Ointment', detail: 'Topical application', icon: <Pipette size={17} /> },
  { time: '22:00', period: 'Evening', label: 'Sitz bath', detail: '15 min', icon: <Bath size={17} /> },
]

/* Period accent colors using new teal tokens */
const PERIOD_COLOR = {
  Morning: 'var(--color-warning)',
  Afternoon: 'var(--color-primary-light)',
  Evening: 'var(--color-primary)',
}

/* ─── Timeline group ─── */
function TimelineGroup({ period, items, done, onToggle }) {
  const periodColor = PERIOD_COLOR[period]

  return (
    <FadeUp>
      <div>
        {/* Period header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: periodColor, flexShrink: 0 }} />
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            {period}
          </span>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, index) => {
            const key = `${period}_${index}`
            const isDone = done[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.05 * index }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  haptic.tap()
                  onToggle(key)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 14px',
                  background: isDone ? 'var(--color-surface-soft)' : 'var(--color-surface-solid)',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid var(--color-border)`,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Icon circle with spring animation */}
                <motion.div
                  animate={{
                    background: isDone ? 'var(--color-border)' : `${periodColor}20`,
                    scale: isDone ? [1, 1.18, 1] : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDone ? 'var(--color-text-muted)' : periodColor,
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isDone ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      >
                        <Check size={16} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      >
                        {item.icon}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 600,
                    margin: 0,
                    color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                    {item.detail}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={11} color="var(--color-text-muted)" />
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {item.time}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </FadeUp>
  )
}

/* ─── Main Screen ─── */
export default function MedsScreen() {
  const today = new Date().toISOString().split('T')[0]
  const takenKey = 'fissurecare_taken_' + today

  const [meds, setMeds] = useState([])
  const [done, setDone] = useState({})
  const [sheet, setSheet] = useState(false)
  const [newMed, setNewMed] = useState({
    name: '', type: 'laxative', dosage: '', frequency: 'twice_daily', notes: '',
  })

  useEffect(() => {
    setMeds(getMedications())
    try { setDone(JSON.parse(localStorage.getItem(takenKey) || '{}')) } catch {}
  }, [takenKey])

  const toggleDone = key => {
    const next = { ...done, [key]: !done[key] }
    setDone(next)
    localStorage.setItem(takenKey, JSON.stringify(next))
  }

  const addMed = () => {
    if (!newMed.name.trim()) return
    const updated = [...meds, { ...newMed, id: Date.now().toString() }]
    setMeds(updated)
    saveMedications(updated)
    setNewMed({ name: '', type: 'laxative', dosage: '', frequency: 'twice_daily', notes: '' })
    setSheet(false)
    haptic.success()
  }

  const removeMed = id => {
    haptic.tap()
    const updated = meds.filter(m => m.id !== id)
    setMeds(updated)
    saveMedications(updated)
  }

  const periods = ['Morning', 'Afternoon', 'Evening']
  const grouped = periods.reduce((acc, p) => {
    acc[p] = TIMELINE.filter(t => t.period === p)
    return acc
  }, {})

  const totalTasks = TIMELINE.length
  const completedTasks = Object.values(done).filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: 100 }}
    >
      <PageHeader
        title="Care Plan"
        subtitle="Your daily recovery routine"
        action={
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => { haptic.tap(); setSheet(true) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              background: 'var(--gradient-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-main)',
              boxShadow: 'var(--shadow-teal)',
            }}
          >
            <Plus size={15} />
            Add
          </motion.button>
        }
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Stats pills */}
        <FadeUp delay={0.05}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.08 }}
            style={{ display: 'flex', gap: 10 }}
          >
            <StatPill label="Total items" value={totalTasks} color="var(--color-primary)" />
            <StatPill label="Completed" value={completedTasks} color="var(--color-success)" />
            <StatPill label="Remaining" value={Math.max(0, totalTasks - completedTasks)} color="var(--color-warning)" />
          </motion.div>
        </FadeUp>

        {/* Timeline groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {periods.map(period => (
            <TimelineGroup
              key={period}
              period={period}
              items={grouped[period]}
              done={done}
              onToggle={toggleDone}
            />
          ))}
        </div>

        {/* My medications */}
        {meds.length > 0 && (
          <FadeUp delay={0.1}>
            <div>
              <p style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 10,
              }}>
                My medications
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <AnimatePresence initial={false}>
                  {meds.map((med, idx) => {
                    const isTaken = done['med_' + med.id]
                    return (
                      <motion.div
                        key={med.id}
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-20px' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.04 * idx }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '13px 14px',
                          background: isTaken ? 'var(--color-surface-soft)' : 'var(--color-surface-solid)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {/* Toggle pill icon */}
                        <motion.div
                          whileTap={{ scale: 0.88 }}
                          onClick={() => { haptic.tap(); toggleDone('med_' + med.id) }}
                          animate={{
                            background: isTaken ? 'var(--color-primary)' : 'var(--color-surface-teal)',
                            scale: isTaken ? [1, 1.15, 1] : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isTaken ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                              >
                                <Check size={17} color="#fff" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="pill"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                              >
                                <Pill size={17} color="var(--color-primary)" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: isTaken ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                            margin: 0,
                            textDecoration: isTaken ? 'line-through' : 'none',
                          }}>
                            {med.name}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                            {med.dosage} · {FREQ_LABELS[med.frequency]}
                          </p>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={() => removeMed(med.id)}
                          style={{
                            background: 'rgba(184,84,80,0.08)',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: 'pointer',
                            color: 'var(--color-danger)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={15} />
                        </motion.button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Medical disclaimer */}
        <FadeUp delay={0.14}>
          <div style={{
            background: 'var(--color-surface-teal)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
              <strong style={{ color: 'var(--color-primary)' }}>Medical note:</strong>{' '}
              This is a personal tracker only. Always follow your doctor's prescription.
              Do not change medications without medical advice.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* Add medication bottom sheet */}
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Add medication">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            Quick add
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {PRESET_MEDS.map(p => (
              <motion.button
                key={p.name}
                whileTap={{ scale: 0.94 }}
                onClick={() => setNewMed({ ...p, notes: '' })}
                style={{
                  padding: '7px 12px',
                  background: newMed.name === p.name
                    ? 'var(--color-surface-teal)'
                    : 'var(--color-surface-soft)',
                  border: `1.5px solid ${newMed.name === p.name
                    ? 'var(--color-primary)'
                    : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: newMed.name === p.name
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-main)',
                }}
              >
                {p.name}
              </motion.button>
            ))}
          </div>

          {['name', 'dosage'].map(field => (
            <div key={field}>
              <p style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: 6,
                textTransform: 'capitalize',
              }}>
                {field}
              </p>
              <input
                value={newMed[field]}
                onChange={e => setNewMed(n => ({ ...n, [field]: e.target.value }))}
                placeholder={field === 'name' ? 'e.g. Lactulose syrup' : 'e.g. 15ml'}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--color-surface-soft)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14,
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  fontFamily: 'var(--font-main)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          <select
            value={newMed.frequency}
            onChange={e => setNewMed(n => ({ ...n, frequency: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--color-surface-soft)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              color: 'var(--color-text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-main)',
            }}
          >
            {Object.entries(FREQ_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addMed}
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--gradient-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-main)',
              boxShadow: '0 6px 18px rgba(45,125,111,0.28)',
            }}
          >
            Add to care plan
          </motion.button>
        </div>
      </BottomSheet>
    </motion.div>
  )
}
