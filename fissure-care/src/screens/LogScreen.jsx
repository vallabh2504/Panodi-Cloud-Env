import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Salad, Pipette, Pill, ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { saveLog, getLog } from '../lib/storage'
import { haptic } from '../lib/haptics'

// ─── helpers ────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const stoolToBristol = { hard: 1, normal: 4, soft: 5, loose: 7 }
const bristolToStool = b => (b <= 2 ? 'hard' : b <= 4 ? 'normal' : b === 5 ? 'soft' : 'loose')
const bleedAmountMap = { spots: 'spotting', moderate: 'moderate', heavy: 'heavy' }
const bleedReverseMap = { spotting: 'spots', moderate: 'moderate', heavy: 'heavy' }

function painColor(level) {
  if (level <= 2) return '#4A9E6E'
  if (level <= 5) return '#C4845A'
  return '#B85450'
}

function painLabel(level) {
  if (level === 0) return 'No pain'
  if (level <= 2) return 'Minimal'
  if (level <= 4) return 'Mild'
  if (level <= 6) return 'Moderate'
  if (level <= 8) return 'Severe'
  return 'Intense'
}

function validationMessage(level) {
  if (level <= 2) return 'Great day! Keep up the care routine.'
  if (level <= 5) return 'Logged. Every day you track helps your recovery.'
  return 'Logged. Rough days happen — this data helps your doctor.'
}

// ─── animation variants ──────────────────────────────────────────────────────

const stepVariants = {
  enter: dir => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: dir => ({ opacity: 0, x: dir * -30 }),
}
const stepTransition = { type: 'spring', stiffness: 300, damping: 32 }

// ─── Stepper ────────────────────────────────────────────────────────────────

function Stepper({ value, min = 0, max = 12, onChange, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--color-surface-soft)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 52, height: 52, border: 'none', background: 'transparent',
          fontSize: 22, color: 'var(--color-primary)',
          fontFamily: 'var(--font-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >−</motion.button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)' }}>{value}</span>
        {label && (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 4 }}>{label}</span>
        )}
      </div>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 52, height: 52, border: 'none', background: 'transparent',
          fontSize: 22, color: 'var(--color-primary)',
          fontFamily: 'var(--font-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >+</motion.button>
    </div>
  )
}

// ─── ProgressDots ────────────────────────────────────────────────────────────

function ProgressDots({ current, total }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 8, padding: '8px 20px 20px',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < current
        const isActive = i === current
        return (
          <motion.div
            key={i}
            animate={{
              width: isActive ? 24 : 8,
              height: 8,
              background: isDone || isActive
                ? 'var(--color-primary)'
                : 'transparent',
              border: isDone || isActive
                ? '2px solid var(--color-primary)'
                : '2px solid var(--color-primary-light)',
              borderRadius: 9999,
              opacity: isDone ? 0.55 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ display: 'inline-block' }}
          />
        )
      })}
    </div>
  )
}

// ─── OptionTile ──────────────────────────────────────────────────────────────

function OptionTile({ value, label, icon, selected, onSelect, style }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => { haptic.tap(); onSelect(value) }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: 20,
        borderRadius: 18,
        background: selected ? 'var(--color-primary)' : 'var(--color-surface-solid)',
        border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        cursor: 'pointer',
        fontFamily: 'var(--font-main)',
        transition: 'background 0.18s ease, border-color 0.18s ease',
        ...style,
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontSize: 14, fontWeight: 600,
        color: selected ? '#fff' : 'var(--color-text-primary)',
      }}>{label}</span>
    </motion.button>
  )
}

// ─── Step 0: Pain ─────────────────────────────────────────────────────────────

function StepPain({ form, set }) {
  const color = painColor(form.painLevel)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
      <div>
        <h3 style={{
          fontSize: 22, fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 6, lineHeight: 1.3,
        }}>How are you feeling today?</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Rate your current pain level
        </p>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 0 24px',
        background: 'var(--color-surface-teal)',
        borderRadius: 'var(--radius-xl)',
        gap: 8,
      }}>
        <motion.span
          key={form.painLevel}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          style={{
            fontSize: 80, fontWeight: 800,
            color, lineHeight: 1,
            display: 'block',
          }}
        >
          {form.painLevel}
        </motion.span>
        <span style={{ fontSize: 16, fontWeight: 600, color }}>{painLabel(form.painLevel)}</span>
      </div>

      <div style={{ padding: '0 4px' }}>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={form.painLevel}
          onChange={e => set('painLevel', +e.target.value)}
          style={{
            width: '100%',
            accentColor: color,
            height: 6,
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>0 — No pain</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>10 — Worst</span>
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Bleeding ─────────────────────────────────────────────────────────

const BLEED_OPTS = [
  { value: 'none', label: 'None', icon: '✓' },
  { value: 'spots', label: 'Spots', icon: '🔴' },
  { value: 'moderate', label: 'Moderate', icon: '💧' },
  { value: 'heavy', label: 'Heavy', icon: '⚠️' },
]

function StepBleeding({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          Any bleeding today?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Select what applies</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {BLEED_OPTS.map(opt => (
          <OptionTile
            key={opt.value}
            {...opt}
            selected={form.bleeding === opt.value}
            onSelect={v => set('bleeding', v)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Stool ────────────────────────────────────────────────────────────

const STOOL_OPTS = [
  { value: 'hard', label: 'Hard', icon: '🪨' },
  { value: 'normal', label: 'Normal', icon: '✅' },
  { value: 'soft', label: 'Soft', icon: '🌊' },
  { value: 'loose', label: 'Loose', icon: '💧' },
]

function StepStool({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          What was the stool like?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Bristol stool scale</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {STOOL_OPTS.map(opt => (
          <OptionTile
            key={opt.value}
            {...opt}
            selected={form.stoolType === opt.value}
            onSelect={v => set('stoolType', v)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Step 3: Straining ────────────────────────────────────────────────────────

const STRAIN_OPTS = [
  { value: 'none', label: 'None', icon: '😌' },
  { value: 'mild', label: 'Mild', icon: '😐' },
  { value: 'significant', label: 'Significant', icon: '😣' },
]

function StepStraining({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          Did you strain?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Straining worsens fissures</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {STRAIN_OPTS.map(opt => (
          <OptionTile
            key={opt.value}
            {...opt}
            selected={form.straining === opt.value}
            onSelect={v => set('straining', v)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Step 4: Care ─────────────────────────────────────────────────────────────

const CARE_ITEMS = [
  { key: 'fiberMeal', label: 'Fiber meal', Icon: Salad },
  { key: 'ointment', label: 'Ointment', Icon: Pipette },
  { key: 'medication', label: 'Medication', Icon: Pill },
]

function CareTile({ label, Icon, active, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      animate={{
        background: active ? 'var(--color-primary)' : 'var(--color-surface-soft)',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      onClick={() => { haptic.tap(); onToggle() }}
      style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '18px 10px',
        border: '2px solid var(--color-border)',
        borderRadius: 18,
        cursor: 'pointer',
        fontFamily: 'var(--font-main)',
        position: 'relative',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(255,255,255,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={11} color="#fff" strokeWidth={3} />
        </div>
      )}
      <Icon
        size={26}
        color={active ? '#fff' : 'var(--color-text-muted)'}
        strokeWidth={1.8}
      />
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: active ? '#fff' : 'var(--color-text-secondary)',
        textAlign: 'center', lineHeight: 1.25,
      }}>{label}</span>
    </motion.button>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 12, fontWeight: 600, letterSpacing: '0.07em',
      color: 'var(--color-text-muted)', textTransform: 'uppercase',
      marginBottom: 10,
    }}>{children}</p>
  )
}

function StepCare({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          What did you do today?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Log your care actions</p>
      </div>

      {/* Completed toggles */}
      <div>
        <SectionLabel>Completed</SectionLabel>
        <div style={{ display: 'flex', gap: 10 }}>
          {CARE_ITEMS.map(({ key, label, Icon }) => (
            <CareTile
              key={key}
              label={label}
              Icon={Icon}
              active={form[key]}
              onToggle={() => set(key, !form[key])}
            />
          ))}
        </div>
      </div>

      {/* Water intake */}
      <div>
        <SectionLabel>Water intake</SectionLabel>
        <Stepper
          value={form.waterGlasses}
          min={0}
          max={12}
          label="glasses"
          onChange={v => set('waterGlasses', v)}
        />
      </div>

      {/* Sitz baths */}
      <div>
        <SectionLabel>Sitz baths</SectionLabel>
        <Stepper
          value={form.sitzBaths}
          min={0}
          max={6}
          label="baths"
          onChange={v => set('sitzBaths', v)}
        />
      </div>
    </div>
  )
}

// ─── Step 5: Notes ────────────────────────────────────────────────────────────

function StepNotes({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 12 }}>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          How are you feeling? <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-muted)' }}>(Optional)</span>
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          This step is optional — tap Skip to finish
        </p>
      </div>

      <textarea
        value={form.notes}
        onChange={e => set('notes', e.target.value)}
        placeholder="Any observations, symptoms, or thoughts…"
        rows={6}
        style={{
          width: '100%', padding: '14px',
          background: 'var(--color-surface-soft)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 14, color: 'var(--color-text-primary)',
          resize: 'vertical', outline: 'none',
          lineHeight: 1.6,
          fontFamily: 'var(--font-main)',
          transition: 'border-color 0.18s ease',
          boxSizing: 'border-box',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
        onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
      />
    </div>
  )
}

// ─── Completion Screen ────────────────────────────────────────────────────────

const PARTICLE_COLORS = [
  '#4CA99A', '#2D7D6F', '#6EC4B8', '#C4956A',
  '#F5E6D8', '#4A9E6E', '#4CA99A', '#C4956A',
  '#2D7D6F', '#6EC4B8', '#4A9E6E', '#F5E6D8',
]

function CompletionScreen({ painLevel, onDone }) {
  const angles = Array.from({ length: 12 }, (_, i) => (i * 360) / 12)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '40px 24px',
      }}
    >
      {/* Particles */}
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const dx = Math.cos(rad) * 140
        const dy = Math.sin(rad) * 140
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: dx,
              y: dy,
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.6],
            }}
            transition={{ duration: 1.2, delay: 0.15 + i * 0.04, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
              marginTop: -5,
              marginLeft: -5,
              pointerEvents: 'none',
            }}
          />
        )
      })}

      {/* Check circle */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        style={{
          width: 96, height: 96,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        <Check size={48} color="#fff" strokeWidth={2.5} />
      </motion.div>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          fontSize: 36, fontWeight: 800, color: '#fff',
          fontFamily: 'var(--font-main)',
          marginBottom: 14, textAlign: 'center',
        }}
      >
        Logged ✓
      </motion.p>

      {/* Validation message */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.45 }}
        style={{
          fontSize: 15, color: 'rgba(255,255,255,0.80)',
          fontFamily: 'var(--font-main)',
          textAlign: 'center', maxWidth: 280, lineHeight: 1.55,
          marginBottom: 44,
        }}
      >
        {validationMessage(painLevel)}
      </motion.p>

      {/* Back to today button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDone}
        style={{
          padding: '16px 36px',
          background: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          borderRadius: 9999,
          fontSize: 15, fontWeight: 700,
          color: 'var(--color-primary-deep)',
          fontFamily: 'var(--font-main)',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          boxShadow: 'var(--shadow-teal)',
        }}
      >
        Back to today →
      </motion.button>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LogScreen({ onNavigate }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    painLevel: 0,
    bleeding: 'none',
    stoolType: 'normal',
    straining: 'none',
    fiberMeal: false,
    ointment: false,
    medication: false,
    waterGlasses: 4,
    sitzBaths: 0,
    notes: '',
  })

  // Preload existing log
  useEffect(() => {
    getLog(today).then(log => {
      if (!log) return
      const bm = log.bowelMovements?.[0]
      setForm({
        painLevel: bm?.painLevel ?? log.dailySymptoms?.restingPain ?? 0,
        bleeding: bm?.bloodPresent
          ? (bleedReverseMap[bm.bloodAmount] || 'spots')
          : 'none',
        stoolType: bm?.bristolType ? bristolToStool(bm.bristolType) : 'normal',
        straining: bm?.straining ? 'mild' : 'none',
        waterGlasses: log.hydration?.waterGlasses ?? 4,
        sitzBaths: log.sitzBaths?.length ?? 0,
        fiberMeal: !!(log.fruitsEaten?.length || log.fiberFoods?.length),
        ointment: (log.topicalOintment?.timesApplied || 0) > 0,
        medication: !!(log.medications?.length),
        notes: log.selfCare?.notes || '',
      })
    })
  }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const goForward = () => {
    haptic.tap()
    setDirection(1)
    setStep(s => Math.min(5, s + 1))
  }

  const goBack = () => {
    haptic.tap()
    setDirection(-1)
    setStep(s => Math.max(0, s - 1))
  }

  const handleSave = async () => {
    setSaving(true)
    haptic.success()
    const log = {
      date: today,
      bowelMovements: [{
        id: 1,
        painLevel: form.painLevel,
        bristolType: stoolToBristol[form.stoolType] || 4,
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
      sitzBaths: Array.from({ length: form.sitzBaths }, () => ({
        time: new Date().toTimeString().slice(0, 5),
        durationMinutes: 15,
      })),
      topicalOintment: { timesApplied: form.ointment ? 1 : 0 },
      medications: form.medication ? [{ name: 'taken', id: 'med_today' }] : [],
      selfCare: { notes: form.notes },
    }
    await saveLog(today, log)
    setSaving(false)
    setDone(true)
  }

  function renderStep(s) {
    switch (s) {
      case 0: return <StepPain form={form} set={set} />
      case 1: return <StepBleeding form={form} set={set} />
      case 2: return <StepStool form={form} set={set} />
      case 3: return <StepStraining form={form} set={set} />
      case 4: return <StepCare form={form} set={set} />
      case 5: return <StepNotes form={form} set={set} />
      default: return null
    }
  }

  // ── Nav buttons ────────────────────────────────────────────────────────────

  function NavButtons() {
    const isLast = step === 5

    return (
      <div style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '16px 20px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        background: 'rgba(245,240,232,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', gap: 10,
        zIndex: 20,
      }}>
        {/* Back */}
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            style={{
              height: 52, paddingInline: 20,
              background: 'var(--color-surface-soft)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 15, fontWeight: 600,
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-main)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>
        )}

        {/* Skip (step 5 only) */}
        {isLast && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            style={{
              height: 52, paddingInline: 20,
              background: 'transparent',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 15, fontWeight: 600,
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-main)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Skip
          </motion.button>
        )}

        {/* Next / Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={isLast ? handleSave : goForward}
          disabled={saving}
          style={{
            flex: 1, height: 52,
            background: 'var(--gradient-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 15, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-main)',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(45,125,111,0.30)',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? (
            'Saving…'
          ) : isLast ? (
            <><Save size={18} /> Save &amp; done</>
          ) : (
            <>Next <ArrowRight size={18} /></>
          )}
        </motion.button>
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (done) {
    return (
      <CompletionScreen
        painLevel={form.painLevel}
        onDone={() => onNavigate('home')}
      />
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-main)',
    }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 4px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: 'var(--color-surface-soft)',
              border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              marginTop: 4,
            }}
          >
            <ArrowLeft size={18} color="var(--color-text-secondary)" />
          </motion.button>
        )}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 2 }}>
            Step {step + 1} of 5
          </p>
          <h2 style={{
            fontSize: 24, fontWeight: 800,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>Daily Log</h2>
        </div>
      </div>

      {/* Progress dots */}
      <ProgressDots current={step} total={5} />

      {/* Step content */}
      <div style={{ flex: 1, padding: '0 20px', overflowX: 'hidden' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
            style={{ paddingBottom: 120 }}
          >
            {renderStep(step)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <NavButtons />
    </div>
  )
}
