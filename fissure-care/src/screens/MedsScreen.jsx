import { useState, useEffect } from 'react'
import { getMedications, saveMedications } from '../lib/storage'
import { Plus, Check, Clock, Pill, Droplets, Bath, Salad, Pipette, Trash2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import StatPill from '../components/ui/StatPill'
import BottomSheet from '../components/ui/BottomSheet'

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
  once_daily: 'Once daily', twice_daily: 'Twice daily',
  three_times: '3× daily', as_needed: 'As needed',
}

const TIMELINE = [
  { time: '08:00', period: 'Morning', label: 'Lactulose syrup', detail: '15ml', icon: <Pill size={17} /> },
  { time: '09:00', period: 'Morning', label: 'Water goal', detail: '2 glasses', icon: <Droplets size={17} /> },
  { time: '13:00', period: 'Afternoon', label: 'Fiber-rich meal', detail: 'High fibre lunch', icon: <Salad size={17} /> },
  { time: '15:00', period: 'Afternoon', label: 'Sitz bath', detail: '15 min', icon: <Bath size={17} /> },
  { time: '20:00', period: 'Evening', label: 'Ointment', detail: 'Topical application', icon: <Pipette size={17} /> },
  { time: '22:00', period: 'Evening', label: 'Sitz bath', detail: '15 min', icon: <Bath size={17} /> },
]

function TimelineGroup({ period, items, done, onToggle }) {
  const periodColor = { Morning: 'var(--color-warning)', Afternoon: 'var(--color-soft-blue)', Evening: 'var(--color-lavender)' }[period]
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: periodColor, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{period}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => {
          const key = `${period}_${i}`
          const isDone = done[key]
          return (
            <div key={key} onClick={() => onToggle(key)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 14px',
              background: isDone ? 'var(--color-surface-soft)' : 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${isDone ? 'var(--color-border)' : 'var(--color-border)'}`,
              cursor: 'pointer', transition: 'all 0.18s ease',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isDone ? 'var(--color-border)' : `${periodColor}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isDone ? 'var(--color-text-muted)' : periodColor,
              }}>
                {isDone ? <Check size={16} /> : item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 14, fontWeight: 600, margin: 0,
                  color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>{item.label}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{item.detail}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={11} color="var(--color-text-muted)" />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>{item.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MedsScreen() {
  const today = new Date().toISOString().split('T')[0]
  const takenKey = 'fissurecare_taken_' + today
  const [meds, setMeds] = useState([])
  const [done, setDone] = useState({})
  const [sheet, setSheet] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', type: 'laxative', dosage: '', frequency: 'twice_daily', notes: '' })

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
  }

  const removeMed = id => {
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
    <div style={{ paddingBottom: 100 }}>
      <PageHeader
        title="Care Plan"
        subtitle="Your daily recovery routine"
        action={
          <button onClick={() => setSheet(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: 'var(--gradient-primary)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-main)',
          }}>
            <Plus size={15} /> Add
          </button>
        }
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatPill label="Total items" value={totalTasks} color="var(--color-indigo)" />
          <StatPill label="Completed" value={completedTasks} color="var(--color-success)" />
          <StatPill label="Remaining" value={Math.max(0, totalTasks - completedTasks)} color="var(--color-warning)" />
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

        {/* Medications section */}
        {meds.length > 0 && (
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 10 }}>My medications</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {meds.map(med => {
                const isTaken = done['med_' + med.id]
                return (
                  <div key={med.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 14px',
                    background: isTaken ? 'var(--color-surface-soft)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div onClick={() => toggleDone('med_' + med.id)} style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: isTaken ? 'var(--color-indigo)' : 'var(--color-surface-lavender)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.18s ease',
                    }}>
                      {isTaken ? <Check size={17} color="#fff" /> : <Pill size={17} color="var(--color-lavender)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: isTaken ? 'var(--color-text-muted)' : 'var(--color-text-primary)', margin: 0, textDecoration: isTaken ? 'line-through' : 'none' }}>{med.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{med.dosage} · {FREQ_LABELS[med.frequency]}</p>
                    </div>
                    <button onClick={() => removeMed(med.id)} style={{
                      background: 'var(--color-soft-danger)', border: 'none',
                      borderRadius: 8, padding: '6px',
                      cursor: 'pointer', color: 'var(--color-danger)',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          background: 'var(--color-surface-lavender)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          border: '1px solid rgba(124,108,255,0.2)',
        }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
            <strong style={{ color: 'var(--color-lavender)' }}>Medical note:</strong> This is a personal tracker only. Always follow your doctor's prescription. Do not change medications without medical advice.
          </p>
        </div>
      </div>

      {/* Add medication bottom sheet */}
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Add medication">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Quick add</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {PRESET_MEDS.map(p => (
              <button key={p.name} onClick={() => { setNewMed({ ...p, notes: '' }); }} style={{
                padding: '7px 12px',
                background: newMed.name === p.name ? 'var(--color-surface-lavender)' : 'var(--color-surface-soft)',
                border: `1.5px solid ${newMed.name === p.name ? 'var(--color-indigo)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                color: newMed.name === p.name ? 'var(--color-indigo)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-main)',
              }}>{p.name}</button>
            ))}
          </div>

          {['name', 'dosage'].map(field => (
            <div key={field}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'capitalize' }}>{field}</p>
              <input
                value={newMed[field]}
                onChange={e => setNewMed(n => ({ ...n, [field]: e.target.value }))}
                placeholder={field === 'name' ? 'e.g. Lactulose syrup' : 'e.g. 15ml'}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--color-surface-soft)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14, color: 'var(--color-text-primary)',
                  outline: 'none', fontFamily: 'var(--font-main)',
                }}
              />
            </div>
          ))}

          <select
            value={newMed.frequency}
            onChange={e => setNewMed(n => ({ ...n, frequency: e.target.value }))}
            style={{
              width: '100%', padding: '12px 14px',
              background: 'var(--color-surface-soft)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14, color: 'var(--color-text-primary)',
              outline: 'none', fontFamily: 'var(--font-main)',
            }}
          >
            {Object.entries(FREQ_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <button onClick={addMed} style={{
            width: '100%', padding: '16px',
            background: 'var(--gradient-primary)', border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-main)',
            boxShadow: '0 6px 18px rgba(88,101,242,0.3)',
          }}>
            Add to care plan
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
