import { useState, useEffect } from 'react'
import { saveLog, getLog } from '../lib/storage'
import { ChevronDown, ChevronUp, Plus, Minus, Check } from 'lucide-react'

// Bristol stool types
const BRISTOL = [
  { type: 1, emoji: '🪨', label: 'Hard lumps', desc: 'Very hard, separate', color: '#F48585' },
  { type: 2, emoji: '🌰', label: 'Lumpy', desc: 'Sausage-shaped, lumpy', color: '#F5A68A' },
  { type: 3, emoji: '🌭', label: 'Cracked', desc: 'Sausage with cracks', color: '#F5C67A' },
  { type: 4, emoji: '🍌', label: 'Smooth ✓', desc: 'Smooth sausage (Ideal!)', color: '#A8D5A2' },
  { type: 5, emoji: '☁️', label: 'Soft blobs', desc: 'Soft, clear-cut edges', color: '#C9A8F5' },
  { type: 6, emoji: '🌊', label: 'Mushy', desc: 'Fluffy, ragged edges', color: '#F5C67A' },
  { type: 7, emoji: '💧', label: 'Liquid', desc: 'No solid pieces', color: '#F48585' },
]

const FRUITS = [
  { id: 'banana', emoji: '🍌', name: 'Banana', benefit: 'Softens stool' },
  { id: 'papaya', emoji: '🧡', name: 'Papaya', benefit: 'Aids digestion' },
  { id: 'grapes', emoji: '🍇', name: 'Grapes', benefit: 'Natural softener' },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon', benefit: 'Hydrates gut' },
  { id: 'chikoo', emoji: '🟤', name: 'Chikoo', benefit: 'High fiber' },
  { id: 'jamun', emoji: '🫐', name: 'Jamun', benefit: 'Reduces inflammation' },
  { id: 'apple', emoji: '🍎', name: 'Apple', benefit: 'Gentle fiber' },
  { id: 'pear', emoji: '🍐', name: 'Pear', benefit: 'High fiber+sorbitol' },
  { id: 'kiwi', emoji: '🥝', name: 'Kiwi', benefit: 'Laxative effect' },
  { id: 'mango', emoji: '🥭', name: 'Mango', benefit: 'Gut motility' },
  { id: 'guava', emoji: '💚', name: 'Guava', benefit: 'Very high fiber' },
]

const FIBER_FOODS = [
  { id: 'oats', emoji: '🌾', name: 'Oats / Dalia' },
  { id: 'brown_rice', emoji: '🍚', name: 'Brown rice' },
  { id: 'lentils', emoji: '🍲', name: 'Lentils / Dal' },
  { id: 'spinach', emoji: '🥬', name: 'Spinach' },
  { id: 'carrots', emoji: '🥕', name: 'Carrots' },
  { id: 'isabgol', emoji: '🌿', name: 'Isabgol husk' },
]

const AVOID_FOODS = [
  { id: 'spicy', emoji: '🌶️', name: 'Spicy food', tip: 'Spicy food can irritate the area — try a soothing meal tonight 💛' },
  { id: 'fried', emoji: '🍟', name: 'Fried food', tip: 'Fried foods slow digestion. Try steamed or boiled alternatives 💛' },
  { id: 'red_meat', emoji: '🥩', name: 'Red meat', tip: 'Red meat is hard to digest. Lentils or eggs are gentler options 💛' },
  { id: 'alcohol', emoji: '🍺', name: 'Alcohol', tip: 'Alcohol dehydrates you and can irritate the gut lining 💛' },
  { id: 'coffee', emoji: '☕', name: 'Coffee/strong tea', tip: 'Caffeine can cause urgency. Herbal tea is a gentler choice 💛' },
  { id: 'salty', emoji: '🧂', name: 'Very salty food', tip: 'Too much salt leads to dehydration. Drink extra water today 💛' },
  { id: 'white_bread', emoji: '🍞', name: 'White bread/maida', tip: 'Refined carbs can harden stools. Try brown bread or oats instead 💛' },
]

const EMOTIONS = ['😊', '🥰', '😌', '😐', '😔', '😣', '😢', '😤']

function SectionHeader({ emoji, title, description }) {
  return (
    <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #F0E0DA' }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#3D2B2B' }}>{emoji} {title}</p>
      {description && <p style={{ fontSize: 12, color: '#8C7070', marginTop: 2 }}>{description}</p>}
    </div>
  )
}

function PainSlider({ value, onChange, label }) {
  const emoji = value <= 0 ? '😊' : value <= 3 ? '🙂' : value <= 6 ? '😐' : value <= 9 ? '😣' : '😭'
  return (
    <div style={{ padding: '12px 20px' }}>
      {label && <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>{label}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input type="range" min={0} max={10} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#E8705A', height: 6 }} />
        <div style={{ minWidth: 50, textAlign: 'center' }}>
          <div style={{ fontSize: 22 }}>{emoji}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#3D2B2B' }}>{value}</div>
        </div>
      </div>
    </div>
  )
}

function Toggle({ value, onChange, labelYes = 'Yes', labelNo = 'No' }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[true, false].map(v => (
        <button key={String(v)} onClick={() => onChange(v)} style={{
          flex: 1, padding: '10px', borderRadius: 12, border: `2px solid ${value === v ? '#E8705A' : '#F0E0DA'}`,
          background: value === v ? '#FFF0EB' : '#fff', color: value === v ? '#E8705A' : '#8C7070',
          fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s'
        }}>
          {v ? labelYes : labelNo}
        </button>
      ))}
    </div>
  )
}

function Stepper({ value, onChange, min = 0, max = 10 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} style={{
        width: 36, height: 36, borderRadius: 12, border: '1px solid #F0E0DA',
        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Minus size={16} color="#8C7070" />
      </button>
      <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Nunito', minWidth: 30, textAlign: 'center' }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} style={{
        width: 36, height: 36, borderRadius: 12, border: '1px solid #F0E0DA',
        background: '#E8705A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Plus size={16} color="#fff" />
      </button>
    </div>
  )
}

function BMCard({ bm, index, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <div style={{ margin: '0 16px 12px', background: '#fff', borderRadius: 20, border: '1px solid #F0E0DA', overflow: 'hidden' }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', padding: '14px 16px', background: 'none', border: 'none',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🚽</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#3D2B2B' }}>Movement #{index + 1}</p>
            <p style={{ fontSize: 12, color: '#8C7070' }}>
              {bm.time || 'Now'} · Pain: {bm.painLevel}/10 · {bm.bloodPresent ? '🩸 Blood' : 'No blood'}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} color="#8C7070" /> : <ChevronDown size={18} color="#8C7070" />}
      </button>
      {expanded && (
        <div style={{ borderTop: '1px solid #F0E0DA' }}>
          <div style={{ padding: '12px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 10 }}>Time</p>
            <input type="time" value={bm.time || ''} onChange={e => onUpdate({ ...bm, time: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #F0E0DA', fontSize: 14, color: '#3D2B2B', width: '100%' }} />
          </div>
          <div style={{ padding: '0 16px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 10 }}>Stool type — tap to select:</p>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }} className="scrollbar-hide">
              {BRISTOL.map(b => (
                <button key={b.type} onClick={() => onUpdate({ ...bm, bristolType: b.type })} style={{
                  minWidth: 60, padding: '8px 6px', borderRadius: 12, flexShrink: 0,
                  border: `2px solid ${bm.bristolType === b.type ? b.color : '#F0E0DA'}`,
                  background: bm.bristolType === b.type ? b.color + '22' : '#fff', cursor: 'pointer'
                }}>
                  <div style={{ fontSize: 20 }}>{b.emoji}</div>
                  <div style={{ fontSize: 10, color: '#3D2B2B', fontWeight: bm.bristolType === b.type ? 700 : 400 }}>Type {b.type}</div>
                </button>
              ))}
            </div>
            {bm.bristolType && (
              <p style={{ fontSize: 12, color: '#8C7070', marginTop: 6 }}>
                {BRISTOL.find(b => b.type === bm.bristolType)?.desc}
              </p>
            )}
          </div>
          <PainSlider value={bm.painLevel || 0} onChange={v => onUpdate({ ...bm, painLevel: v })} label="Pain level during movement:" />
          <div style={{ padding: '0 16px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>Was there any bleeding?</p>
            <Toggle value={bm.bloodPresent} onChange={v => onUpdate({ ...bm, bloodPresent: v })} labelYes="Yes 🩸" labelNo="None 🙏" />
            {bm.bloodPresent && (
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                {['spotting', 'moderate', 'heavy'].map(a => (
                  <button key={a} onClick={() => onUpdate({ ...bm, bloodAmount: a })} style={{
                    flex: 1, padding: '8px', borderRadius: 10,
                    border: `2px solid ${bm.bloodAmount === a ? '#F48585' : '#F0E0DA'}`,
                    background: bm.bloodAmount === a ? '#FFF0F0' : '#fff',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#3D2B2B'
                  }}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '0 16px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>Any spasms?</p>
            <Toggle value={bm.spasm} onChange={v => onUpdate({ ...bm, spasm: v })} />
            {bm.spasm && (
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                {['<5 min', '5-15 min', '15-30 min', '30+ min'].map(d => (
                  <button key={d} onClick={() => onUpdate({ ...bm, spasmDuration: d })} style={{
                    flex: 1, padding: '7px 4px', borderRadius: 10,
                    border: `2px solid ${bm.spasmDuration === d ? '#C9A8F5' : '#F0E0DA'}`,
                    background: bm.spasmDuration === d ? '#F5F0FF' : '#fff',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#3D2B2B'
                  }}>{d}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '0 16px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>Did you strain?</p>
            <Toggle value={bm.straining} onChange={v => onUpdate({ ...bm, straining: v })} />
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <textarea placeholder="Any notes about this movement..." value={bm.notes || ''} onChange={e => onUpdate({ ...bm, notes: e.target.value })}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #F0E0DA',
                fontSize: 14, color: '#3D2B2B', resize: 'none', minHeight: 60,
                fontFamily: 'Inter', background: '#FAFAFA'
              }} rows={2} />
          </div>
          <button onClick={onDelete} style={{
            width: 'calc(100% - 32px)', margin: '0 16px 16px', padding: '10px',
            borderRadius: 12, border: '1px solid #F0E0DA', background: '#FFF0F0',
            color: '#F48585', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>Remove this entry</button>
        </div>
      )}
    </div>
  )
}

function WaterTracker({ glasses, onChange, goal = 8 }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {Array.from({ length: goal }).map((_, i) => (
          <button key={i} onClick={() => onChange(i < glasses ? i : i + 1)} style={{
            fontSize: 24, background: 'none', border: 'none', cursor: 'pointer',
            filter: i < glasses ? 'none' : 'grayscale(100%) opacity(0.3)',
            transform: i < glasses ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s'
          }}>
            {i < glasses ? '🥛' : '🫙'}
          </button>
        ))}
      </div>
      <div style={{ background: '#F0E0DA', borderRadius: 8, height: 8, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, #A8D5A2, #7BC97B)',
          width: `${Math.min((glasses / goal) * 100, 100)}%`, transition: 'width 0.3s', borderRadius: 8
        }} />
      </div>
      <p style={{ fontSize: 12, color: '#8C7070', marginTop: 6 }}>
        {glasses * 250}ml / {goal * 250}ml · {glasses >= goal ? '🎉 Goal reached!' : `${goal - glasses} more to go!`}
      </p>
    </div>
  )
}

export default function LogScreen({ onNavigate }) {
  const today = new Date().toISOString().split('T')[0]
  const [saved, setSaved] = useState(false)
  const [avoidWarning, setAvoidWarning] = useState(null)
  const [log, setLog] = useState({
    date: today,
    bowelMovements: [],
    dailySymptoms: { restingPain: 0, itchingBurning: 0, sittingDiscomfort: 0, overallComfort: null, stressLevel: 0, sleepQuality: 5 },
    medications: [],
    topicalOintment: { name: '', timesApplied: 0 },
    sitzBaths: [],
    hydration: { waterGlasses: 0, waterMl: 0, coconutWater: false, coffee: false, alcohol: false },
    fruitsEaten: [],
    fiberFoods: [],
    avoidFoods: [],
    activity: { walking: false, walkingMinutes: 0, yoga: false, exerciseLevel: 'none' },
    selfCare: { topicalApplied: false, warmCompress: false, dietaryAdherence: null, emotionalWellbeing: null, notes: '' }
  })

  useEffect(() => {
    getLog(today).then(existing => {
      if (existing) setLog(existing)
    })
  }, [today])

  const addBM = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setLog(l => ({ ...l, bowelMovements: [...l.bowelMovements, { id: Date.now(), time, painLevel: 0, bloodPresent: false, spasm: false, straining: false }] }))
  }

  const updateBM = (id, data) => {
    setLog(l => ({ ...l, bowelMovements: l.bowelMovements.map(bm => bm.id === id ? data : bm) }))
  }

  const deleteBM = (id) => {
    setLog(l => ({ ...l, bowelMovements: l.bowelMovements.filter(bm => bm.id !== id) }))
  }

  const toggleFruit = (id) => {
    setLog(l => ({
      ...l,
      fruitsEaten: l.fruitsEaten.includes(id) ? l.fruitsEaten.filter(f => f !== id) : [...l.fruitsEaten, id]
    }))
  }

  const toggleFiber = (id) => {
    setLog(l => ({
      ...l,
      fiberFoods: l.fiberFoods.includes(id) ? l.fiberFoods.filter(f => f !== id) : [...l.fiberFoods, id]
    }))
  }

  const toggleAvoid = (id) => {
    const food = AVOID_FOODS.find(f => f.id === id)
    if (!log.avoidFoods.includes(id)) {
      setAvoidWarning(food.tip)
      setTimeout(() => setAvoidWarning(null), 4000)
    }
    setLog(l => ({
      ...l,
      avoidFoods: l.avoidFoods.includes(id) ? l.avoidFoods.filter(f => f !== id) : [...l.avoidFoods, id]
    }))
  }

  const handleSave = async () => {
    const updated = { ...log, hydration: { ...log.hydration, waterMl: log.hydration.waterGlasses * 250 } }
    await saveLog(today, updated)
    setSaved(true)
    setTimeout(() => { setSaved(false); onNavigate('home') }, 2000)
  }

  const addSitzBath = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setLog(l => ({ ...l, sitzBaths: [...l.sitzBaths, { time, durationMinutes: 15 }] }))
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px', background: 'linear-gradient(135deg, #FFF0EB, #FFF8F5)', borderBottom: '1px solid #F0E0DA' }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#E8705A' }}>📝 Today's Log</p>
        <p style={{ fontSize: 13, color: '#8C7070' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Section: Bowel Movements */}
      <SectionHeader emoji="🚽" title="Bowel Movements" description="Log each movement separately" />
      {log.bowelMovements.map((bm, i) => (
        <BMCard key={bm.id} bm={bm} index={i} onUpdate={updated => updateBM(bm.id, updated)} onDelete={() => deleteBM(bm.id)} />
      ))}
      <div style={{ padding: '0 16px 16px' }}>
        <button onClick={addBM} style={{
          width: '100%', padding: '14px', background: '#FFF0EB', borderRadius: 16,
          border: '2px dashed #E8705A', color: '#E8705A', fontSize: 15, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <Plus size={18} /> Add Bowel Movement
        </button>
      </div>

      {/* Section: Daily Symptoms */}
      <SectionHeader emoji="🌡️" title="How You're Feeling" description="Overall comfort today (separate from movements)" />
      <PainSlider value={log.dailySymptoms.restingPain} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, restingPain: v } }))} label="Resting discomfort (when not in the bathroom):" />
      <PainSlider value={log.dailySymptoms.itchingBurning} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, itchingBurning: v } }))} label="Burning or itching around the area:" />
      <PainSlider value={log.dailySymptoms.sittingDiscomfort} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, sittingDiscomfort: v } }))} label="Discomfort when sitting:" />
      <div style={{ padding: '0 20px 16px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 10 }}>How was your day overall?</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['😊', 'good', 'Good day!'], ['😐', 'ok', 'Just okay'], ['😣', 'hard_day', 'Hard day']].map(([emoji, val, label]) => (
            <button key={val} onClick={() => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, overallComfort: val } }))} style={{
              flex: 1, padding: '12px 8px', borderRadius: 14,
              border: `2px solid ${log.dailySymptoms.overallComfort === val ? '#E8705A' : '#F0E0DA'}`,
              background: log.dailySymptoms.overallComfort === val ? '#FFF0EB' : '#fff',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
            }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#3D2B2B' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <PainSlider value={log.dailySymptoms.stressLevel} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, stressLevel: v } }))} label="Stress or anxiety today:" />
      <PainSlider value={log.dailySymptoms.sleepQuality} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, sleepQuality: v } }))} label="Sleep quality last night:" />

      {/* Section: Hydration */}
      <SectionHeader emoji="💧" title="Hydration" description="Each glass = 250ml. Tap to fill!" />
      <WaterTracker glasses={log.hydration.waterGlasses} onChange={g => setLog(l => ({ ...l, hydration: { ...l.hydration, waterGlasses: g, waterMl: g * 250 } }))} />
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 12 }}>
        {[
          { key: 'coconutWater', emoji: '🥥', label: 'Coconut water', good: true },
          { key: 'coffee', emoji: '☕', label: 'Coffee', good: false },
          { key: 'alcohol', emoji: '🍺', label: 'Alcohol', good: false },
        ].map(({ key, emoji, label, good }) => (
          <button key={key} onClick={() => setLog(l => ({ ...l, hydration: { ...l.hydration, [key]: !l.hydration[key] } }))} style={{
            flex: 1, padding: '10px 6px', borderRadius: 12, cursor: 'pointer',
            border: `2px solid ${log.hydration[key] ? (good ? '#A8D5A2' : '#F48585') : '#F0E0DA'}`,
            background: log.hydration[key] ? (good ? '#F0FFF0' : '#FFF0F0') : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
          }}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <span style={{ fontSize: 10, color: '#3D2B2B', fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 10 }}>{good ? '✅' : '⚠️'}</span>
          </button>
        ))}
      </div>

      {/* Section: Fruits */}
      <SectionHeader emoji="🍎" title="Fruits & Fiber" description="Tap the fruits you had today 🌿" />
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {FRUITS.map(fruit => (
          <button key={fruit.id} onClick={() => toggleFruit(fruit.id)} style={{
            padding: '10px 6px', borderRadius: 14, cursor: 'pointer',
            border: `2px solid ${log.fruitsEaten.includes(fruit.id) ? '#A8D5A2' : '#F0E0DA'}`,
            background: log.fruitsEaten.includes(fruit.id) ? '#F0FFF5' : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
          }}>
            <span style={{ fontSize: 22 }}>{fruit.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#3D2B2B' }}>{fruit.name}</span>
            <span style={{ fontSize: 9, color: '#8C7070' }}>{fruit.benefit}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#8C7070', marginBottom: 8 }}>Other fiber-rich foods:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FIBER_FOODS.map(f => (
            <button key={f.id} onClick={() => toggleFiber(f.id)} style={{
              padding: '8px 12px', borderRadius: 20, cursor: 'pointer',
              border: `1.5px solid ${log.fiberFoods.includes(f.id) ? '#A8D5A2' : '#F0E0DA'}`,
              background: log.fiberFoods.includes(f.id) ? '#F0FFF5' : '#fff',
              fontSize: 13, color: '#3D2B2B', display: 'flex', alignItems: 'center', gap: 5
            }}>
              <span>{f.emoji}</span> {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Sitz Baths */}
      <SectionHeader emoji="🛁" title="Sitz Baths & Care" description="Warm water soaks help so much 💛" />
      <div style={{ padding: '12px 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>Sitz baths today ({log.sitzBaths.length}):</p>
        {log.sitzBaths.map((bath, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 12px', background: '#F0FFF5', borderRadius: 12 }}>
            <span style={{ fontSize: 18 }}>🛁</span>
            <span style={{ fontSize: 13, color: '#3D2B2B', flex: 1 }}>Bath {i + 1} at {bath.time}</span>
            <input type="number" value={bath.durationMinutes} min={5} max={60}
              onChange={e => setLog(l => ({ ...l, sitzBaths: l.sitzBaths.map((b, j) => j === i ? { ...b, durationMinutes: Number(e.target.value) } : b) }))}
              style={{ width: 50, padding: '4px 8px', borderRadius: 8, border: '1px solid #A8D5A2', fontSize: 13, textAlign: 'center' }} />
            <span style={{ fontSize: 12, color: '#8C7070' }}>min</span>
            <button onClick={() => setLog(l => ({ ...l, sitzBaths: l.sitzBaths.filter((_, j) => j !== i) }))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F48585', fontSize: 16 }}>✕</button>
          </div>
        ))}
        <button onClick={addSitzBath} style={{
          padding: '10px 16px', background: '#F0FFF5', border: '1.5px dashed #A8D5A2',
          borderRadius: 12, color: '#5A9E5A', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Plus size={16} /> Log a sitz bath
        </button>
      </div>

      {/* Section: Medications */}
      <SectionHeader emoji="💊" title="Medications & Ointments" description="Log what you've taken today" />
      <div style={{ padding: '12px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>Topical ointment applied:</p>
          <input placeholder="e.g. Lidocaine jelly, Nifedipine cream..." value={log.topicalOintment.name}
            onChange={e => setLog(l => ({ ...l, topicalOintment: { ...l.topicalOintment, name: e.target.value } }))}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #F0E0DA', marginBottom: 8, fontSize: 14 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#8C7070' }}>Times applied:</span>
            <Stepper value={log.topicalOintment.timesApplied} onChange={v => setLog(l => ({ ...l, topicalOintment: { ...l.topicalOintment, timesApplied: v } }))} max={8} />
          </div>
        </div>
        <div style={{ background: '#FFF8E8', borderRadius: 12, padding: '10px 12px', border: '1px solid #F5C67A' }}>
          <p style={{ fontSize: 11, color: '#8C7070' }}>💛 Always follow your doctor's prescribed dosage. Do not adjust without consulting your healthcare provider.</p>
        </div>
      </div>

      {/* Section: Foods to Avoid */}
      <SectionHeader emoji="⚠️" title="Foods to Avoid" description="Did you have any of these today?" />
      {avoidWarning && (
        <div style={{ margin: '0 16px 10px', background: '#FFF8E8', borderRadius: 12, padding: '10px 12px', border: '1px solid #F5C67A' }}>
          <p style={{ fontSize: 13, color: '#8C7070' }}>{avoidWarning}</p>
        </div>
      )}
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {AVOID_FOODS.map(food => (
          <button key={food.id} onClick={() => toggleAvoid(food.id)} style={{
            padding: '10px 6px', borderRadius: 14, cursor: 'pointer',
            border: `2px solid ${log.avoidFoods.includes(food.id) ? '#F5C67A' : '#F0E0DA'}`,
            background: log.avoidFoods.includes(food.id) ? '#FFF8E8' : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
          }}>
            <span style={{ fontSize: 22 }}>{food.emoji}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#3D2B2B', textAlign: 'center' }}>{food.name}</span>
          </button>
        ))}
      </div>

      {/* Section: Activity */}
      <SectionHeader emoji="🚶" title="Gentle Movement" description="Even a short walk helps!" />
      <div style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🚶</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#3D2B2B' }}>Walking today?</span>
          </div>
          <Toggle value={log.activity.walking} onChange={v => setLog(l => ({ ...l, activity: { ...l.activity, walking: v } }))} />
        </div>
        {log.activity.walking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#8C7070' }}>Minutes walked:</span>
            <Stepper value={log.activity.walkingMinutes} onChange={v => setLog(l => ({ ...l, activity: { ...l.activity, walkingMinutes: v } }))} min={0} max={120} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🧘</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#3D2B2B' }}>Gentle yoga/stretching?</span>
          </div>
          <Toggle value={log.activity.yoga} onChange={v => setLog(l => ({ ...l, activity: { ...l.activity, yoga: v } }))} />
        </div>
      </div>

      {/* Section: Self Care & Journal */}
      <SectionHeader emoji="💛" title="Self-Care & Journal" description="A moment to check in with yourself" />
      <div style={{ padding: '12px 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 10 }}>How are you feeling right now?</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          {EMOTIONS.map(emoji => (
            <button key={emoji} onClick={() => setLog(l => ({ ...l, selfCare: { ...l.selfCare, emotionalWellbeing: emoji } }))} style={{
              fontSize: 28, background: log.selfCare.emotionalWellbeing === emoji ? '#FFF0EB' : 'none',
              border: `2px solid ${log.selfCare.emotionalWellbeing === emoji ? '#E8705A' : 'transparent'}`,
              borderRadius: 14, padding: '6px 8px', cursor: 'pointer', transition: 'all 0.2s'
            }}>{emoji}</button>
          ))}
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>Any notes or thoughts? (Just for you)</p>
        <textarea placeholder="Write how you're feeling, what helped, what didn't..." value={log.selfCare.notes}
          onChange={e => setLog(l => ({ ...l, selfCare: { ...l.selfCare, notes: e.target.value } }))}
          rows={4} style={{
            width: '100%', padding: '12px', borderRadius: 14, border: '1px solid #F0E0DA',
            fontSize: 14, color: '#3D2B2B', resize: 'none', fontFamily: 'Inter', background: '#FAFAFA', lineHeight: 1.6
          }} />
      </div>

      {/* Save Button */}
      <div style={{ padding: '16px 20px 32px' }}>
        {saved ? (
          <div style={{
            padding: '18px', background: 'linear-gradient(135deg, #A8D5A2, #7BC97B)',
            borderRadius: 20, color: '#fff', fontSize: 16, fontWeight: 700, textAlign: 'center'
          }}>
            <Check size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            All saved! 💛 Every entry is a step toward healing.
          </div>
        ) : (
          <button onClick={handleSave} style={{
            width: '100%', padding: '18px', background: 'linear-gradient(135deg, #E8705A, #F5A68A)',
            border: 'none', borderRadius: 20, color: '#fff', fontSize: 17, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 6px 24px rgba(232,112,90,0.35)'
          }}>
            ✅ Save Today's Log
          </button>
        )}
      </div>
    </div>
  )
}
