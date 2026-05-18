import { useState, useEffect } from 'react'
import { getMedications, saveMedications, getLog, saveLog } from '../lib/storage'
import { Plus, Check } from 'lucide-react'
import { Pill, Bathtub, CheckCircle } from '../components/icons/AppIcons'

const MED_TYPES = ['laxative', 'topical', 'oral', 'supplement']
const FREQ_OPTIONS = ['once_daily', 'twice_daily', 'three_times', 'as_needed']
const FREQ_LABELS = { once_daily: 'Once daily', twice_daily: 'Twice daily', three_times: '3x daily', as_needed: 'As needed' }

const PRESET_MEDS = [
  { name: 'Lactulose syrup', type: 'laxative', dosage: '15ml', frequency: 'twice_daily' },
  { name: 'Senna / Senokot', type: 'laxative', dosage: '1 tablet', frequency: 'once_daily' },
  { name: 'Dulcolax (Bisacodyl)', type: 'laxative', dosage: '1 tablet', frequency: 'once_daily' },
  { name: 'Isabgol husk', type: 'supplement', dosage: '1 tsp in water', frequency: 'twice_daily' },
  { name: 'Cremaffin syrup', type: 'laxative', dosage: '10ml', frequency: 'twice_daily' },
  { name: 'Lidocaine 2% jelly', type: 'topical', dosage: 'Apply thin layer', frequency: 'three_times' },
  { name: 'Nifedipine 0.2% ointment', type: 'topical', dosage: 'Apply thin layer', frequency: 'twice_daily' },
  { name: 'Nitroglycerin ointment', type: 'topical', dosage: 'Apply thin layer', frequency: 'twice_daily' },
  { name: 'Zinc oxide cream', type: 'topical', dosage: 'Apply as needed', frequency: 'as_needed' },
]

function AddMedModal({ onSave, onClose, theme }) {
  const [med, setMed] = useState({ name: '', type: 'laxative', dosage: '', frequency: 'twice_daily', notes: '' })
  const card = theme?.card || '#fff'
  const border = theme?.cardBorder || '#F0E0DA'
  const text = theme?.text || '#3D2B2B'
  const muted = theme?.textMuted || '#8C7070'
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,43,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: card, borderRadius: '24px 24px 0 0', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: text, display: 'flex', alignItems: 'center', gap: 6 }}><Pill size={18} color={text} /> Add Medication</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: muted }}>✕</button>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 8 }}>Quick add:</p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }} className="scrollbar-hide">
          {PRESET_MEDS.map(p => (
            <button key={p.name} onClick={() => setMed({ ...p, notes: '' })} style={{
              minWidth: 120, padding: '8px 10px', borderRadius: 12, flexShrink: 0,
              border: `1.5px solid ${border}`, background: med.name === p.name ? theme?.tipBg || '#FFF0EB' : card,
              fontSize: 11, fontWeight: 600, color: text, cursor: 'pointer', textAlign: 'left'
            }}>{p.name}</button>
          ))}
        </div>
        <input placeholder="Medication name" value={med.name} onChange={e => setMed(m => ({ ...m, name: e.target.value }))}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1px solid ${border}`, marginBottom: 10, fontSize: 14, color: text, background: card }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <select value={med.type} onChange={e => setMed(m => ({ ...m, type: e.target.value }))}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${border}`, fontSize: 14, color: text, background: card }}>
            {MED_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select value={med.frequency} onChange={e => setMed(m => ({ ...m, frequency: e.target.value }))}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${border}`, fontSize: 14, color: text, background: card }}>
            {FREQ_OPTIONS.map(f => <option key={f} value={f}>{FREQ_LABELS[f]}</option>)}
          </select>
        </div>
        <input placeholder="Dosage (e.g. 15ml, 1 tablet)" value={med.dosage} onChange={e => setMed(m => ({ ...m, dosage: e.target.value }))}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1px solid ${border}`, marginBottom: 10, fontSize: 14, color: text, background: card }} />
        <input placeholder="Notes (e.g. take after meals)" value={med.notes} onChange={e => setMed(m => ({ ...m, notes: e.target.value }))}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1px solid ${border}`, marginBottom: 16, fontSize: 14, color: text, background: card }} />
        <button onClick={() => { if (med.name) onSave({ ...med, id: 'med_' + Date.now(), active: true }) }} style={{
          width: '100%', padding: '16px', background: theme?.ctaGradient || 'linear-gradient(135deg, #E8705A, #F5A68A)',
          border: 'none', borderRadius: 16, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer'
        }}>Save Medication</button>
      </div>
    </div>
  )
}

export default function MedsScreen({ theme }) {
  const [meds, setMeds] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [taken, setTaken] = useState({})
  const today = new Date().toISOString().split('T')[0]

  const p = theme?.primary || '#E8705A'
  const card = theme?.card || '#fff'
  const border = theme?.cardBorder || '#F0E0DA'
  const text = theme?.text || '#3D2B2B'
  const muted = theme?.textMuted || '#8C7070'
  const headerGrad = theme?.headerGradient || 'linear-gradient(135deg, #FFF0EB, #FFF8F5)'
  const wellHigh = theme?.wellnessHigh || '#A8D5A2'

  useEffect(() => {
    setMeds(getMedications())
    const t = JSON.parse(localStorage.getItem('fissurecare_taken_' + today) || '{}')
    setTaken(t)
  }, [today])

  const saveMeds = (updated) => {
    setMeds(updated)
    saveMedications(updated)
  }

  const toggleTaken = (id) => {
    const updated = { ...taken, [id]: !taken[id] }
    setTaken(updated)
    localStorage.setItem('fissurecare_taken_' + today, JSON.stringify(updated))
  }

  const deleteMed = (id) => {
    saveMeds(meds.filter(m => m.id !== id))
  }

  const [sitzBaths, setSitzBaths] = useState([])
  useEffect(() => {
    getLog(today).then(log => setSitzBaths(log?.sitzBaths || []))
  }, [today])

  // Routes through saveLog() so wellness score recalculates and Supabase syncs
  const addSitzBath = async () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const baths = [...sitzBaths, { time, durationMinutes: 15 }]
    setSitzBaths(baths)
    const existing = await getLog(today) || {}
    await saveLog(today, { ...existing, sitzBaths: baths })
  }

  return (
    <div>
      <div style={{ padding: '20px 20px 16px', background: headerGrad, borderBottom: `1px solid ${border}` }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: p, display: 'flex', alignItems: 'center', gap: 8 }}><Pill size={22} color={p} /> Care Routine</p>
        <p style={{ fontSize: 13, color: muted }}>Track your medications and treatments</p>
      </div>

      {/* Today's Checklist */}
      <div style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TODAY'S CHECKLIST</p>
        {meds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', background: card, borderRadius: 20, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 32, marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Pill size={32} color={p} /></div>
            <p style={{ fontSize: 14, color: muted }}>No medications added yet. Add your first one below!</p>
          </div>
        ) : (
          meds.filter(m => m.active).map(med => (
            <div key={med.id} style={{
              background: taken[med.id] ? wellHigh + '18' : card,
              borderRadius: 16, padding: '14px 16px', marginBottom: 10,
              border: `1.5px solid ${taken[med.id] ? wellHigh : border}`,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <button onClick={() => toggleTaken(med.id)} style={{
                width: 36, height: 36, borderRadius: 12,
                border: `2px solid ${taken[med.id] ? wellHigh : border}`,
                background: taken[med.id] ? wellHigh : card, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'all 0.3s'
              }}>
                {taken[med.id] && <Check size={18} color="#fff" strokeWidth={3} />}
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: text }}>{med.name}</p>
                <p style={{ fontSize: 12, color: muted }}>{med.dosage} · {FREQ_LABELS[med.frequency]}</p>
                {med.notes && <p style={{ fontSize: 11, color: theme?.accent || '#C9A8F5' }}>{med.notes}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 12, color: taken[med.id] ? wellHigh : muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {taken[med.id] ? <><CheckCircle size={14} color={wellHigh} /> Taken</> : 'Not yet'}
                </span>
                <button onClick={() => deleteMed(med.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#F48585'
                }}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sitz Bath Log */}
      <div style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SITZ BATH LOG TODAY</p>
        <div style={{ background: card, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: '1', minWidth: 80, padding: '12px', borderRadius: 14, textAlign: 'center',
                background: i < sitzBaths.length ? wellHigh + '18' : '#FAFAFA',
                border: `2px solid ${i < sitzBaths.length ? wellHigh : border}`
              }}>
                <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{i < sitzBaths.length ? <Bathtub size={20} color={wellHigh} /> : <span style={{ fontSize: 20 }}>○</span>}</div>
                <p style={{ fontSize: 11, fontWeight: 600, color: i < sitzBaths.length ? wellHigh : muted }}>
                  {i < sitzBaths.length ? sitzBaths[i].time : `Bath ${i + 1}`}
                </p>
                {i < sitzBaths.length && <p style={{ fontSize: 10, color: muted }}>{sitzBaths[i].durationMinutes} min</p>}
              </div>
            ))}
          </div>
          <button onClick={addSitzBath} style={{
            width: '100%', padding: '12px',
            background: wellHigh + '20', border: `1.5px dashed ${wellHigh}`,
            borderRadius: 12, color: wellHigh, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Bathtub size={18} color={wellHigh} /> Log a sitz bath
          </button>
          <p style={{ fontSize: 11, color: muted, marginTop: 8, textAlign: 'center' }}>
            Aim for 2-3 sitz baths a day for best healing 💛
          </p>
        </div>
      </div>

      {/* Add Medication Button */}
      <div style={{ padding: '16px', marginTop: 8 }}>
        <button onClick={() => setShowAdd(true)} style={{
          width: '100%', padding: '16px',
          background: theme?.ctaGradient || 'linear-gradient(135deg, #E8705A, #F5A68A)',
          border: 'none', borderRadius: 18, color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: `0 4px 16px ${theme?.ctaShadow || 'rgba(232,112,90,0.25)'}`,
        }}>
          <Plus size={20} /> Add Medication
        </button>
      </div>

      {showAdd && (
        <AddMedModal
          theme={theme}
          onSave={med => { saveMeds([...meds, med]); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
