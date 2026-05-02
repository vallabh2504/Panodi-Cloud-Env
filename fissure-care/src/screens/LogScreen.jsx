import { useState, useEffect } from 'react'
import { saveLog, getLog } from '../lib/storage'
import { Check, Droplets, Salad, Bath, Pipette, Pill, FileText, ChevronDown, ChevronUp, Save } from 'lucide-react'
import SegmentedControl from '../components/ui/SegmentedControl'
import PageHeader from '../components/layout/PageHeader'

const BLEED_OPTS  = [{ value: 'none', label: 'None' }, { value: 'spots', label: 'Spots' }, { value: 'moderate', label: 'Moderate' }, { value: 'heavy', label: 'Heavy' }]
const STOOL_OPTS  = [{ value: 'hard', label: 'Hard' }, { value: 'normal', label: 'Normal' }, { value: 'soft', label: 'Soft' }, { value: 'loose', label: 'Loose' }]
const STRAIN_OPTS = [{ value: 'none', label: 'None' }, { value: 'mild', label: 'Mild' }, { value: 'strong', label: 'Strong' }]

const stoolToBristol = s => ({ hard: 1, normal: 4, soft: 5, loose: 7 }[s] || 4)
const bristolToStool = b => b <= 2 ? 'hard' : b <= 4 ? 'normal' : b === 5 ? 'soft' : 'loose'

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-main)',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</span>
        {open ? <ChevronUp size={18} color="var(--color-text-muted)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function Label({ children }) {
  return <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{children}</p>
}

function CareToggle({ icon, label, active, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '12px 8px', flex: 1,
      background: active ? 'var(--color-surface-lavender)' : 'var(--color-surface-soft)',
      border: `2px solid ${active ? 'var(--color-indigo)' : 'transparent'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer', transition: 'all 0.18s ease',
      fontFamily: 'var(--font-main)', position: 'relative',
    }}>
      {active && (
        <div style={{
          position: 'absolute', top: 5, right: 5,
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--color-indigo)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={10} color="#fff" strokeWidth={3} />
        </div>
      )}
      <div style={{ color: active ? 'var(--color-indigo)' : 'var(--color-text-muted)' }}>{icon}</div>
      <span style={{ fontSize: 11, fontWeight: 600, color: active ? 'var(--color-indigo)' : 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </button>
  )
}

function Stepper({ value, min = 0, max = 12, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} style={{
        width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer',
        fontSize: 20, color: 'var(--color-indigo)', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>−</button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</span>
        {label && <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 4 }}>{label}</span>}
      </div>
      <button onClick={() => onChange(Math.min(max, value + 1))} style={{
        width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer',
        fontSize: 20, color: 'var(--color-indigo)', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>+</button>
    </div>
  )
}

export default function LogScreen({ onNavigate }) {
  const today = new Date().toISOString().split('T')[0]
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    painLevel: 0,
    bleeding: 'none',
    stoolType: 'normal',
    straining: 'none',
    waterGlasses: 0,
    sitzBaths: 0,
    fiberMeal: false,
    ointment: false,
    medication: false,
    notes: '',
  })

  useEffect(() => {
    getLog(today).then(log => {
      if (!log) return
      const bm = log.bowelMovements?.[0]
      const bleedMap = { spotting: 'spots', moderate: 'moderate', heavy: 'heavy' }
      setForm({
        painLevel: bm?.painLevel ?? log.dailySymptoms?.restingPain ?? 0,
        bleeding: bm?.bloodPresent ? (bleedMap[bm.bloodAmount] || 'spots') : 'none',
        stoolType: bm?.bristolType ? bristolToStool(bm.bristolType) : 'normal',
        straining: bm?.straining ? 'mild' : 'none',
        waterGlasses: log.hydration?.waterGlasses || 0,
        sitzBaths: log.sitzBaths?.length || 0,
        fiberMeal: !!(log.fruitsEaten?.length || log.fiberFoods?.length),
        ointment: (log.topicalOintment?.timesApplied || 0) > 0,
        medication: !!(log.medications?.length),
        notes: log.selfCare?.notes || '',
      })
    })
  }, [today])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    const bleedAmountMap = { spots: 'spotting', moderate: 'moderate', heavy: 'heavy' }
    const log = {
      date: today,
      bowelMovements: [{
        id: 1,
        painLevel: form.painLevel,
        bristolType: stoolToBristol(form.stoolType),
        bloodPresent: form.bleeding !== 'none',
        bloodAmount: form.bleeding !== 'none' ? bleedAmountMap[form.bleeding] : null,
        straining: form.straining !== 'none',
        notes: form.notes,
      }],
      dailySymptoms: { restingPain: form.painLevel },
      hydration: {
        waterGlasses: form.waterGlasses,
        waterMl: form.waterGlasses * 250,
      },
      fruitsEaten: form.fiberMeal ? ['banana'] : [],
      fiberFoods: form.fiberMeal ? ['oats'] : [],
      sitzBaths: Array.from({ length: form.sitzBaths }, (_, i) => ({
        time: new Date().toTimeString().slice(0, 5),
        durationMinutes: 15,
      })),
      topicalOintment: { timesApplied: form.ointment ? 1 : 0 },
      medications: form.medication ? [{ name: 'taken', id: 'med_today' }] : [],
      selfCare: { notes: form.notes },
    }
    await saveLog(today, log)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const painColor = form.painLevel <= 3 ? 'var(--color-success)' : form.painLevel <= 6 ? 'var(--color-warning)' : 'var(--color-danger)'

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader
        title="Daily Log"
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Bowel movement section */}
        <Section title="Bowel Movement">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Label>Pain level</Label>
              <span style={{ fontSize: 22, fontWeight: 700, color: painColor }}>{form.painLevel}</span>
            </div>
            <input type="range" min={0} max={10} value={form.painLevel}
              onChange={e => set('painLevel', +e.target.value)}
              style={{ accentColor: 'var(--color-indigo)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>No pain</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Worst</span>
            </div>
          </div>

          <div>
            <Label>Bleeding</Label>
            <SegmentedControl options={BLEED_OPTS} value={form.bleeding} onChange={v => set('bleeding', v)} />
          </div>

          <div>
            <Label>Stool type</Label>
            <SegmentedControl options={STOOL_OPTS} value={form.stoolType} onChange={v => set('stoolType', v)} />
          </div>

          <div>
            <Label>Straining</Label>
            <SegmentedControl options={STRAIN_OPTS} value={form.straining} onChange={v => set('straining', v)} />
          </div>
        </Section>

        {/* Care actions */}
        <Section title="Care Actions">
          <div>
            <Label>Water intake</Label>
            <Stepper value={form.waterGlasses} min={0} max={12} label="glasses" onChange={v => set('waterGlasses', v)} />
          </div>

          <div>
            <Label>Sitz baths</Label>
            <Stepper value={form.sitzBaths} min={0} max={6} label="baths" onChange={v => set('sitzBaths', v)} />
          </div>

          <div>
            <Label>Completed today</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <CareToggle icon={<Salad size={20} />} label="Fiber meal" active={form.fiberMeal} onToggle={() => set('fiberMeal', !form.fiberMeal)} />
              <CareToggle icon={<Pipette size={20} />} label="Ointment" active={form.ointment} onToggle={() => set('ointment', !form.ointment)} />
              <CareToggle icon={<Pill size={20} />} label="Medication" active={form.medication} onToggle={() => set('medication', !form.medication)} />
            </div>
          </div>
        </Section>

        {/* Notes */}
        <Section title="Notes" defaultOpen={false}>
          <div>
            <Label>How are you feeling?</Label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any observations, moods, or notes for today…"
              rows={4}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--color-surface-soft)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 14, color: 'var(--color-text-primary)',
                resize: 'vertical', outline: 'none',
                lineHeight: 1.55, fontFamily: 'var(--font-main)',
                transition: 'border-color 0.18s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-indigo)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
        </Section>

        {/* Save */}
        <button onClick={handleSave} style={{
          width: '100%', padding: '18px',
          background: saved ? 'var(--color-success)' : 'var(--gradient-primary)',
          border: 'none', borderRadius: 'var(--radius-md)',
          color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: saved ? '0 8px 24px rgba(34,197,94,0.3)' : '0 8px 24px rgba(88,101,242,0.38)',
          fontFamily: 'var(--font-main)', transition: 'all 0.3s ease',
        }}>
          {saved ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save log</>}
        </button>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Not a substitute for medical advice. Always follow your doctor's guidance.
        </p>
      </div>
    </div>
  )
}
