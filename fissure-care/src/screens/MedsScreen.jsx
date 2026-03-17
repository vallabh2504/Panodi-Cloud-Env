import { useState, useEffect } from 'react'
import { getMedications, saveMedications } from '../lib/storage'
import { Plus, Check } from 'lucide-react'

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

function AddMedModal({ onSave, onClose }) {
  const [med, setMed] = useState({ name: '', type: 'laxative', dosage: '', frequency: 'twice_daily', notes: '' })
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,43,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#3D2B2B' }}>💊 Add Medication</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8C7070' }}>✕</button>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8C7070', marginBottom: 8 }}>Quick add:</p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }} className="scrollbar-hide">
          {PRESET_MEDS.map(p => (
            <button key={p.name} onClick={() => setMed({ ...p, notes: '' })} style={{
              minWidth: 120, padding: '8px 10px', borderRadius: 12, flexShrink: 0,
              border: '1.5px solid #F0E0DA', background: med.name === p.name ? '#FFF0EB' : '#fff',
              fontSize: 11, fontWeight: 600, color: '#3D2B2B', cursor: 'pointer', textAlign: 'left'
            }}>{p.name}</button>
          ))}
        </div>
        <input placeholder="Medication name" value={med.name} onChange={e => setMed(m => ({ ...m, name: e.target.value }))}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #F0E0DA', marginBottom: 10, fontSize: 14 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <select value={med.type} onChange={e => setMed(m => ({ ...m, type: e.target.value }))}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #F0E0DA', fontSize: 14 }}>
            {MED_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select value={med.frequency} onChange={e => setMed(m => ({ ...m, frequency: e.target.value }))}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #F0E0DA', fontSize: 14 }}>
            {FREQ_OPTIONS.map(f => <option key={f} value={f}>{FREQ_LABELS[f]}</option>)}
          </select>
        </div>
        <input placeholder="Dosage (e.g. 15ml, 1 tablet)" value={med.dosage} onChange={e => setMed(m => ({ ...m, dosage: e.target.value }))}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #F0E0DA', marginBottom: 10, fontSize: 14 }} />
        <input placeholder="Notes (e.g. take after meals)" value={med.notes} onChange={e => setMed(m => ({ ...m, notes: e.target.value }))}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #F0E0DA', marginBottom: 16, fontSize: 14 }} />
        <button onClick={() => { if (med.name) onSave({ ...med, id: 'med_' + Date.now(), active: true }) }} style={{
          width: '100%', padding: '16px', background: 'linear-gradient(135deg, #E8705A, #F5A68A)',
          border: 'none', borderRadius: 16, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer'
        }}>Save Medication</button>
      </div>
    </div>
  )
}

export default function MedsScreen() {
  const [meds, setMeds] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [taken, setTaken] = useState({})
  const today = new Date().toISOString().split('T')[0]

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
    const log = JSON.parse(localStorage.getItem('fissurecare_log_' + today) || '{}')
    setSitzBaths(log.sitzBaths || [])
  }, [today])

  const addSitzBath = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const baths = [...sitzBaths, { time, durationMinutes: 15 }]
    setSitzBaths(baths)
    const log = JSON.parse(localStorage.getItem('fissurecare_log_' + today) || '{}')
    log.sitzBaths = baths
    localStorage.setItem('fissurecare_log_' + today, JSON.stringify(log))
  }

  return (
    <div>
      <div style={{ padding: '20px 20px 16px', background: 'linear-gradient(135deg, #FFF0EB, #FFF8F5)', borderBottom: '1px solid #F0E0DA' }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#E8705A' }}>💊 Care Routine</p>
        <p style={{ fontSize: 13, color: '#8C7070' }}>Track your medications and treatments</p>
      </div>

      {/* Today's Checklist */}
      <div style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7070', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TODAY'S CHECKLIST</p>
        {meds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', background: '#fff', borderRadius: 20, border: '1px solid #F0E0DA' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>💊</p>
            <p style={{ fontSize: 14, color: '#8C7070' }}>No medications added yet. Add your first one below!</p>
          </div>
        ) : (
          meds.filter(m => m.active).map(med => (
            <div key={med.id} style={{
              background: taken[med.id] ? '#F0FFF5' : '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 10,
              border: `1.5px solid ${taken[med.id] ? '#A8D5A2' : '#F0E0DA'}`,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <button onClick={() => toggleTaken(med.id)} style={{
                width: 36, height: 36, borderRadius: 12, border: `2px solid ${taken[med.id] ? '#A8D5A2' : '#F0E0DA'}`,
                background: taken[med.id] ? '#A8D5A2' : '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'all 0.3s'
              }}>
                {taken[med.id] && <Check size={18} color="#fff" strokeWidth={3} />}
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#3D2B2B' }}>{med.name}</p>
                <p style={{ fontSize: 12, color: '#8C7070' }}>{med.dosage} · {FREQ_LABELS[med.frequency]}</p>
                {med.notes && <p style={{ fontSize: 11, color: '#C9A8F5' }}>{med.notes}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 12, color: taken[med.id] ? '#5A9E5A' : '#8C7070', fontWeight: 600 }}>
                  {taken[med.id] ? '✅ Taken' : 'Not yet'}
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
        <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7070', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SITZ BATH LOG TODAY</p>
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px', border: '1px solid #F0E0DA' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: '1', minWidth: 80, padding: '12px', borderRadius: 14, textAlign: 'center',
                background: i < sitzBaths.length ? '#F0FFF5' : '#FAFAFA',
                border: `2px solid ${i < sitzBaths.length ? '#A8D5A2' : '#F0E0DA'}`
              }}>
                <p style={{ fontSize: 20, marginBottom: 4 }}>{i < sitzBaths.length ? '🛁' : '○'}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: i < sitzBaths.length ? '#5A9E5A' : '#8C7070' }}>
                  {i < sitzBaths.length ? `${sitzBaths[i].time}` : `Bath ${i + 1}`}
                </p>
                {i < sitzBaths.length && <p style={{ fontSize: 10, color: '#8C7070' }}>{sitzBaths[i].durationMinutes} min</p>}
              </div>
            ))}
          </div>
          <button onClick={addSitzBath} style={{
            width: '100%', padding: '12px', background: '#F0FFF5', border: '1.5px dashed #A8D5A2',
            borderRadius: 12, color: '#5A9E5A', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            🛁 Log a sitz bath
          </button>
          <p style={{ fontSize: 11, color: '#8C7070', marginTop: 8, textAlign: 'center' }}>
            Aim for 2-3 sitz baths a day for best healing 💛
          </p>
        </div>
      </div>

      {/* Add Medication Button */}
      <div style={{ padding: '16px', marginTop: 8 }}>
        <button onClick={() => setShowAdd(true)} style={{
          width: '100%', padding: '16px', background: 'linear-gradient(135deg, #E8705A, #F5A68A)',
          border: 'none', borderRadius: 18, color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(232,112,90,0.25)'
        }}>
          <Plus size={20} /> Add Medication
        </button>
      </div>

      {showAdd && (
        <AddMedModal
          onSave={med => { saveMeds([...meds, med]); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
