import { useState, useEffect, useRef, lazy, Suspense } from 'react'
const Confetti3D = lazy(() => import('../components/Confetti3D'))
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ChevronDown, ChevronUp, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { saveLog, getLog } from '../lib/storage'
import { haptics } from '../lib/haptics'
import { getTheme } from '../lib/themes'
import { HeartPulse, SteamWisps, CheckDrawn, WaterRipple, FoodPop, WarningWiggle, FlowerBloom } from '../components/AnimatedSVGs'
import {
  Journal, WaterDrop, WaterGlass, Bathtub, BloodDrop, Thermometer, Heart,
  Running, Walking, Yoga, Leaf, Seedling, Wave, WarningTriangle, CheckCircle,
  CherryBlossom, Celebration, CalendarIcon, Lightbulb,
  FaceRelieved, FaceNeutral, FaceDiscomfort, FacePain, FaceSevere,
} from '../components/icons/AppIcons'
import {
  BananaEmoji, AppleEmoji, GrapesEmoji, WatermelonEmoji, PearEmoji,
  KiwiEmoji, MangoEmoji, CoconutEmoji, BlueberryEmoji, PapayaEmoji,
  GuavaEmoji, ChikooEmoji,
  GrainEmoji, BrownRiceEmoji, LentilsEmoji, SpinachEmoji, CarrotEmoji,
  IsabgolEmoji, BreadEmoji, BroccoliEmoji, FlaxseedsEmoji, ChickpeasEmoji,
  ChiliEmoji, FrenchFriesEmoji, MeatEmoji, BeerEmoji, CoffeeEmoji, SaltEmoji,
  Bristol1Emoji, Bristol2Emoji, Bristol3Emoji, Bristol4Emoji,
  Bristol5Emoji, Bristol6Emoji, Bristol7Emoji,
} from '../components/icons/EmojiIcons'

function playHealingChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5 — pentatonic
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.55)
    })
  } catch {}
}

function playTapSound(freq = 800, duration = 0.08) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.01)
  } catch {}
}

function playWaterDrop() {
  playTapSound(1200, 0.12)
}

const BRISTOL = [
  { type: 1, label: 'Hard lumps', desc: 'Very hard, separate', color: '#F48585' },
  { type: 2, label: 'Lumpy', desc: 'Sausage-shaped, lumpy', color: '#F5A68A' },
  { type: 3, label: 'Cracked', desc: 'Sausage with cracks', color: '#F5C67A' },
  { type: 4, label: 'Smooth ✓', desc: 'Smooth sausage (Ideal!)', color: '#A8D5A2' },
  { type: 5, label: 'Soft blobs', desc: 'Soft, clear-cut edges', color: '#C9A8F5' },
  { type: 6, label: 'Mushy', desc: 'Fluffy, ragged edges', color: '#F5C67A' },
  { type: 7, label: 'Liquid', desc: 'No solid pieces', color: '#F48585' },
]

function BristolIcon({ type, size = 28 }) {
  switch (type) {
    case 1: return <Bristol1Emoji size={size} />
    case 2: return <Bristol2Emoji size={size} />
    case 3: return <Bristol3Emoji size={size} />
    case 4: return <Bristol4Emoji size={size} />
    case 5: return <Bristol5Emoji size={size} />
    case 6: return <Bristol6Emoji size={size} />
    case 7: return <Bristol7Emoji size={size} />
    default: return null
  }
}

const FRUITS_DATA = [
  { id: 'banana', name: 'Banana', benefit: 'Softens stool' },
  { id: 'papaya', name: 'Papaya', benefit: 'Aids digestion' },
  { id: 'grapes', name: 'Grapes', benefit: 'Natural softener' },
  { id: 'watermelon', name: 'Watermelon', benefit: 'Hydrates gut' },
  { id: 'chikoo', name: 'Chikoo', benefit: 'High fiber' },
  { id: 'jamun', name: 'Jamun', benefit: 'Anti-inflammatory' },
  { id: 'apple', name: 'Apple', benefit: 'Gentle fiber' },
  { id: 'pear', name: 'Pear', benefit: 'High fiber+sorbitol' },
  { id: 'kiwi', name: 'Kiwi', benefit: 'Natural laxative' },
  { id: 'mango', name: 'Mango', benefit: 'Gut motility' },
  { id: 'guava', name: 'Guava', benefit: 'Very high fiber' },
]

function FruitIcon({ id, size = 28 }) {
  switch (id) {
    case 'banana':     return <BananaEmoji size={size} />
    case 'papaya':     return <PapayaEmoji size={size} />
    case 'grapes':     return <GrapesEmoji size={size} />
    case 'watermelon': return <WatermelonEmoji size={size} />
    case 'chikoo':     return <ChikooEmoji size={size} />
    case 'jamun':      return <BlueberryEmoji size={size} />
    case 'apple':      return <AppleEmoji size={size} />
    case 'pear':       return <PearEmoji size={size} />
    case 'kiwi':       return <KiwiEmoji size={size} />
    case 'mango':      return <MangoEmoji size={size} />
    case 'guava':      return <GuavaEmoji size={size} />
    default:           return <AppleEmoji size={size} />
  }
}

const FIBER_FOODS = [
  { id: 'oats', name: 'Oats / Dalia', grams: 4 },
  { id: 'brown_rice', name: 'Brown rice', grams: 3 },
  { id: 'lentils', name: 'Lentils / Dal', grams: 5 },
  { id: 'spinach', name: 'Spinach', grams: 2 },
  { id: 'carrots', name: 'Carrots', grams: 3 },
  { id: 'isabgol', name: 'Isabgol husk', grams: 7 },
  { id: 'whole_wheat', name: 'Whole wheat bread', grams: 3 },
  { id: 'broccoli', name: 'Broccoli', grams: 3 },
  { id: 'flaxseeds', name: 'Flaxseeds', grams: 3 },
  { id: 'chickpeas', name: 'Chickpeas', grams: 6 },
]

function FiberIcon({ id, size = 28 }) {
  switch (id) {
    case 'oats':       return <GrainEmoji size={size} />
    case 'brown_rice': return <BrownRiceEmoji size={size} />
    case 'lentils':    return <LentilsEmoji size={size} />
    case 'spinach':    return <SpinachEmoji size={size} />
    case 'carrots':    return <CarrotEmoji size={size} />
    case 'isabgol':    return <IsabgolEmoji size={size} />
    case 'whole_wheat':return <BreadEmoji size={size} />
    case 'broccoli':   return <BroccoliEmoji size={size} />
    case 'flaxseeds':  return <FlaxseedsEmoji size={size} />
    case 'chickpeas':  return <ChickpeasEmoji size={size} />
    default:           return <GrainEmoji size={size} />
  }
}

const AVOID_FOODS = [
  { id: 'spicy', name: 'Spicy food', tip: 'Spicy food can irritate the area — try something soothing tonight' },
  { id: 'fried', name: 'Fried food', tip: 'Fried foods slow digestion. Try steamed or boiled alternatives' },
  { id: 'red_meat', name: 'Red meat', tip: 'Red meat is hard to digest. Lentils or eggs are gentler options' },
  { id: 'alcohol', name: 'Alcohol', tip: 'Alcohol dehydrates and can irritate the gut lining' },
  { id: 'coffee', name: 'Coffee / tea', tip: 'Caffeine causes urgency. Herbal tea is a gentler choice' },
  { id: 'salty', name: 'Very salty', tip: 'Too much salt leads to dehydration. Drink extra water today' },
  { id: 'white_bread', name: 'White bread', tip: 'Refined carbs can harden stools. Try whole grain instead' },
]

function AvoidIcon({ id, size = 28 }) {
  switch (id) {
    case 'spicy':      return <ChiliEmoji size={size} />
    case 'fried':      return <FrenchFriesEmoji size={size} />
    case 'red_meat':   return <MeatEmoji size={size} />
    case 'alcohol':    return <BeerEmoji size={size} />
    case 'coffee':     return <CoffeeEmoji size={size} />
    case 'salty':      return <SaltEmoji size={size} />
    case 'white_bread':return <BreadEmoji size={size} />
    default:           return <WarningTriangle size={size} color="currentColor" />
  }
}

const EMOTIONS = ['😊', '🥰', '😌', '😐', '😔', '😣', '😢', '😤']

const STEPS = [
  { id: 'welcome', label: 'Check In' },
  { id: 'movements', label: 'Movements' },
  { id: 'symptoms', label: 'Symptoms' },
  { id: 'hydration', label: 'Hydration' },
  { id: 'food', label: 'Healing Foods' },
  { id: 'avoid', label: 'Watch Out' },
  { id: 'selfcare', label: 'Self-Care' },
  { id: 'journal', label: 'Journal' },
]

function StepIcon({ id, size = 14, color }) {
  switch (id) {
    case 'welcome': return <Heart size={size} color={color} />
    case 'movements': return <Journal size={size} color={color} />
    case 'symptoms': return <Thermometer size={size} color={color} />
    case 'hydration': return <WaterDrop size={size} color={color} />
    case 'food': return <Apple size={size} color={color} />
    case 'avoid': return <WarningTriangle size={size} color={color} />
    case 'selfcare': return <Bathtub size={size} color={color} />
    case 'journal': return <Journal size={size} color={color} />
    default: return null
  }
}

const PAIN_LABELS = {
  0: 'No pain', 1: 'Minimal', 2: 'Mild', 3: 'Moderate', 4: 'Uncomfortable',
  5: 'Moderate pain', 6: 'Significant', 7: 'Severe', 8: 'Very severe', 9: 'Extreme', 10: 'Worst possible'
}

function PainSlider({ value, onChange, label, theme }) {
  const faceColor = value <= 2 ? theme.wellnessHigh : value <= 6 ? theme.primary : theme.danger
  const FaceIcon = value <= 2 ? FaceRelieved : value <= 4 ? FaceNeutral : value <= 6 ? FaceDiscomfort : value <= 8 ? FacePain : FaceSevere
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 10 }}>{label}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <input type="range" min={0} max={10} value={value}
          aria-valuetext={`${value} out of 10 — ${PAIN_LABELS[value] || ''}`}
          onChange={e => { haptics.tap(); onChange(Number(e.target.value)) }}
          style={{ flex: 1, accentColor: theme.primary, height: 6 }} />
        <div style={{ minWidth: 52, textAlign: 'center' }}>
          <motion.div key={value} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
            <FaceIcon size={24} color={faceColor} />
          </motion.div>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{value}</span>
        </div>
      </div>
    </div>
  )
}

function Toggle({ value, onChange, labelYes = 'Yes', labelNo = 'No', theme }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[true, false].map(v => (
        <motion.button key={String(v)} whileTap={{ scale: 0.96 }} onClick={() => { haptics.tap(); onChange(v) }} style={{
          flex: 1, padding: '11px', borderRadius: 14,
          border: `2px solid ${value === v ? theme.primary : theme.cardBorder}`,
          background: value === v ? theme.primary + '18' : theme.card,
          color: value === v ? theme.primary : theme.textMuted,
          fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s'
        }}>
          {v ? labelYes : labelNo}
        </motion.button>
      ))}
    </div>
  )
}

function Stepper({ value, onChange, min = 0, max = 10, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <motion.button whileTap={{ scale: 0.92 }} aria-label="Decrease" onClick={() => { haptics.tap(); onChange(Math.max(min, value - 1)) }} style={{
        width: 40, height: 40, borderRadius: 14, border: `1px solid ${theme.cardBorder}`,
        background: theme.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Minus size={16} color={theme.textMuted} />
      </motion.button>
      <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Nunito', minWidth: 36, textAlign: 'center', color: theme.text }}>{value}</span>
      <motion.button whileTap={{ scale: 0.92 }} aria-label="Increase" onClick={() => { haptics.tap(); onChange(Math.min(max, value + 1)) }} style={{
        width: 40, height: 40, borderRadius: 14, border: 'none',
        background: theme.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Plus size={16} color="#fff" />
      </motion.button>
    </div>
  )
}

function BMCard({ bm, index, onUpdate, onSoftDelete, theme }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 12, background: theme.card, borderRadius: 20, border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}
    >
      <button
        onClick={() => { haptics.light(); setExpanded(!expanded) }}
        aria-label={expanded ? 'Collapse movement entry' : 'Expand movement entry'}
        style={{
          width: '100%', padding: '14px 16px', background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Journal size={18} color={theme.primary} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Movement #{index + 1}</p>
            <p style={{ fontSize: 12, color: theme.textMuted }}>
              {bm.time || 'Now'} · Pain {bm.painLevel}/10 · {bm.bloodPresent ? <><BloodDrop size={12} color={theme.danger} /> Blood</> : 'No blood'}{bm.straining && bm.straining !== 'none' ? ` · Straining: ${bm.straining.charAt(0).toUpperCase() + bm.straining.slice(1)}` : ''}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} color={theme.textMuted} /> : <ChevronDown size={18} color={theme.textMuted} />}
      </button>
      {expanded && (
        <div style={{ borderTop: `1px solid ${theme.cardBorder}`, padding: '14px 16px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Time of movement:</p>
          <input type="time" value={bm.time || ''} onChange={e => onUpdate({ ...bm, time: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${theme.cardBorder}`, fontSize: 14, color: theme.text, marginBottom: 16, width: '100%', background: theme.card }} />

          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 10 }}>Stool type — aim for <Banana size={14} color={theme.primary} style={{ display: 'inline', verticalAlign: 'middle' }} /> Type 4:</p>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 4 }} className="scrollbar-hide">
            {BRISTOL.map(b => (
              <motion.button key={b.type} whileTap={{ scale: 0.94 }} onClick={() => { haptics.tap(); onUpdate({ ...bm, bristolType: b.type }) }} style={{
                minWidth: 62, padding: '8px 6px', borderRadius: 14, flexShrink: 0, cursor: 'pointer',
                border: `2.5px solid ${bm.bristolType === b.type ? b.color : theme.cardBorder}`,
                background: bm.bristolType === b.type ? b.color + '25' : theme.card,
              }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}><BristolIcon type={b.type} size={20} color={bm.bristolType === b.type ? b.color : '#A0A8B0'} /></div>
                <div style={{ fontSize: 10, color: theme.text, fontWeight: bm.bristolType === b.type ? 700 : 400 }}>Type {b.type}</div>
              </motion.button>
            ))}
          </div>
          {bm.bristolType && (
            <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>
              {BRISTOL.find(b => b.type === bm.bristolType)?.desc}
            </p>
          )}

          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Straining?</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[
              { value: 'none', label: 'None 😌' },
              { value: 'some', label: 'Some 😤' },
              { value: 'significant', label: 'Significant 😣' },
            ].map(opt => (
              <motion.button key={opt.value} whileTap={{ scale: 0.94 }} onClick={() => { haptics.tap(); onUpdate({ ...bm, straining: opt.value }) }} style={{
                flex: 1, padding: '9px', borderRadius: 12, cursor: 'pointer',
                border: `2px solid ${bm.straining === opt.value ? theme.primary : theme.cardBorder}`,
                background: bm.straining === opt.value ? theme.primary + '18' : theme.card,
                fontSize: 12, fontWeight: 600, color: bm.straining === opt.value ? theme.primary : theme.text
              }}>
                {opt.label}
              </motion.button>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Urgency?</p>
            <Toggle value={bm.urgent} onChange={v => onUpdate({ ...bm, urgent: v })} labelYes={<><Running size={14} color="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Urgent</>} labelNo={<><Walking size={14} color="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Normal</>} theme={theme} />
          </div>

          <PainSlider value={bm.painLevel || 0} onChange={v => onUpdate({ ...bm, painLevel: v })} label="Pain during this movement:" theme={theme} />

          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Any bleeding?</p>
          <Toggle value={bm.bloodPresent} onChange={v => onUpdate({ ...bm, bloodPresent: v })} labelYes={<><BloodDrop size={14} color="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Yes</>} labelNo="None" theme={theme} />
          {bm.bloodPresent && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {['spotting', 'moderate', 'heavy'].map(a => (
                <motion.button key={a} whileTap={{ scale: 0.94 }} onClick={() => onUpdate({ ...bm, bloodAmount: a })} style={{
                  flex: 1, padding: '9px', borderRadius: 12, cursor: 'pointer',
                  border: `2px solid ${bm.bloodAmount === a ? '#F48585' : theme.cardBorder}`,
                  background: bm.bloodAmount === a ? '#FFF0F0' : theme.card,
                  fontSize: 12, fontWeight: 600, color: theme.text
                }}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </motion.button>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Spasms after?</p>
            <Toggle value={bm.spasm} onChange={v => onUpdate({ ...bm, spasm: v })} theme={theme} />
          </div>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onSoftDelete(bm)} aria-label="Remove movement entry" style={{
            width: '100%', marginTop: 14, padding: '10px',
            borderRadius: 12, border: `1px solid ${theme.cardBorder}`,
            background: '#FFF0F0', color: '#F48585', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>Remove this entry</motion.button>
        </div>
      )}
    </motion.div>
  )
}

function WaterTracker({ glasses, onChange, goal = 8, theme, justFilled, onJustFill }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {Array.from({ length: goal }).map((_, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }}
            aria-label={i < glasses ? `Remove glass ${i + 1}` : `Add glass ${i + 1}`}
            onClick={() => {
              haptics.tap()
              if (i >= glasses) { onJustFill(i); playWaterDrop() }
              onChange(i < glasses ? i : i + 1)
            }}
            style={{
              fontSize: 26, background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.15s', padding: 0,
            }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              background: i < glasses
                ? 'linear-gradient(to top, #3B82F4 0%, #60A5FA 100%)'
                : 'transparent',
              transform: justFilled === i ? 'scale(1.3)' : 'scale(1)',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <WaterGlass size={20} color={i < glasses ? '#fff' : '#B0B8C1'} style={{ opacity: i < glasses ? 1 : 0.4 }} />
            </div>
          </motion.button>
        ))}
      </div>
      <div style={{ background: theme.cardBorder, borderRadius: 8, height: 10, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${Math.min((glasses / goal) * 100, 100)}%` }}
          transition={{ duration: 0.3 }}
          role="progressbar"
          aria-valuenow={glasses}
          aria-valuemin={0}
          aria-valuemax={8}
          aria-label="Water intake progress"
          style={{ height: '100%', background: 'linear-gradient(90deg, #A8D5A2, #7BC97B)', borderRadius: 8 }}
        />
      </div>
      <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 8 }}>
        {glasses * 250}ml / {goal * 250}ml · {glasses >= goal ? <><Celebration size={12} color={theme.primary} style={{ display: 'inline', verticalAlign: 'middle' }} /> Goal reached!</> : `${goal - glasses} more to go`}
      </p>
    </div>
  )
}

function StepHeader({ step, total, stepData, theme }) {
  const progress = ((step + 1) / total) * 100

  return (
    <div style={{ padding: '16px 20px 12px', background: theme.headerGradient, borderBottom: `1px solid ${theme.cardBorder}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>
          Step {step + 1} of {total}
        </p>
        <p style={{ fontSize: 13, fontWeight: 700, color: theme.primary, display: 'flex', alignItems: 'center', gap: 4 }}>
          <StepIcon id={stepData.id} size={14} color={theme.primary} /> {stepData.label}
        </p>
      </div>
      {/* Progress bar */}
      <div style={{ background: theme.cardBorder, borderRadius: 6, height: 6, overflow: 'hidden', marginBottom: 10 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 6, background: theme.ctaGradient }}
        />
      </div>
      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.id}
            animate={{ scale: i === step ? 1.3 : 1, opacity: i <= step ? 1 : 0.35 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              width: i === step ? 18 : 8, height: 8, borderRadius: 4,
              background: i < step ? theme.wellnessHigh : i === step ? theme.primary : theme.cardBorder,
              transition: 'width 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Main LogScreen ── */
export default function LogScreen({ onNavigate, onLogSaved, theme: themeProp }) {
  const today = new Date().toISOString().split('T')[0]
  const theme = themeProp || getTheme()
  const name = (() => { try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}').userName || 'Bujji' } catch { return 'Bujji' } })()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avoidWarning, setAvoidWarning] = useState(null)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)

  // Micro-interaction states
  const [justFilled, setJustFilled] = useState(null)
  const [bgWarmth, setBgWarmth] = useState('')
  const [saveFlash, setSaveFlash] = useState(false)

  // P1-A: Undo snackbar state
  const [pendingDelete, setPendingDelete] = useState(null) // { id, bm, timeoutId }

  // P1-B: Draft save ref
  const draftTimerRef = useRef(null)

  // P1-B: Draft banner state
  const [showDraftBanner, setShowDraftBanner] = useState(false)

  const emptyLog = {
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
    activity: { walking: false, walkingMinutes: 0, yoga: false },
    selfCare: { topicalApplied: false, warmCompress: false, emotionalWellbeing: null, notes: '' }
  }

  const [log, setLog] = useState(emptyLog)

  // P1-B: Auto-draft save effect
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    draftTimerRef.current = setTimeout(() => {
      if (!saved) {
        localStorage.setItem('fissurecare_draft_' + today, JSON.stringify({ log, step }))
      }
    }, 800)
    return () => clearTimeout(draftTimerRef.current)
  }, [log, step, saved, today])

  // P1-B: Load existing log or draft on mount
  useEffect(() => {
    getLog(today).then(existing => {
      if (existing) {
        setLog(prev => ({
          ...prev,
          ...existing,
          dailySymptoms: { ...prev.dailySymptoms, ...(existing.dailySymptoms || {}) },
          hydration: { ...prev.hydration, ...(existing.hydration || {}) },
          topicalOintment: { ...prev.topicalOintment, ...(existing.topicalOintment || {}) },
          activity: { ...prev.activity, ...(existing.activity || {}) },
          selfCare: { ...prev.selfCare, ...(existing.selfCare || {}) },
          bowelMovements: existing.bowelMovements || [],
          sitzBaths: existing.sitzBaths || [],
          medications: existing.medications || [],
          fruitsEaten: existing.fruitsEaten || [],
          fiberFoods: existing.fiberFoods || [],
          avoidFoods: existing.avoidFoods || [],
        }))
      } else {
        const draft = localStorage.getItem('fissurecare_draft_' + today)
        if (draft) {
          try {
            const { log: draftLog, step: draftStep } = JSON.parse(draft)
            setLog(prev => ({
              ...prev,
              ...(draftLog || {}),
              dailySymptoms: { ...prev.dailySymptoms, ...(draftLog?.dailySymptoms || {}) },
              hydration: { ...prev.hydration, ...(draftLog?.hydration || {}) },
              topicalOintment: { ...prev.topicalOintment, ...(draftLog?.topicalOintment || {}) },
              activity: { ...prev.activity, ...(draftLog?.activity || {}) },
              selfCare: { ...prev.selfCare, ...(draftLog?.selfCare || {}) },
              bowelMovements: draftLog?.bowelMovements || [],
              sitzBaths: draftLog?.sitzBaths || [],
              medications: draftLog?.medications || [],
              fruitsEaten: draftLog?.fruitsEaten || [],
              fiberFoods: draftLog?.fiberFoods || [],
              avoidFoods: draftLog?.avoidFoods || [],
            }))
            setStep(Math.min(draftStep || 0, STEPS.length - 1))
            setShowDraftBanner(true)
          } catch {}
        }
      }
    })
  }, [today])

  const goNext = () => {
    if (step < STEPS.length - 1) { haptics.light(); setDirection(1); setStep(s => s + 1) }
  }
  const goPrev = () => {
    if (step > 0) { haptics.light(); setDirection(-1); setStep(s => s - 1) }
  }

  const handleSave = async () => {
    if (saving || saved) return
    setSaving(true)
    haptics.success()
    const updated = { ...log, hydration: { ...log.hydration, waterMl: log.hydration.waterGlasses * 250 } }
    await saveLog(today, updated)
    // P1-B: Clear draft on successful save
    localStorage.removeItem('fissurecare_draft_' + today)
    setSaved(true)
    setSaving(false)
    if (onLogSaved) onLogSaved(updated)
    haptics.success()
    playHealingChime()
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 800)
    setTimeout(() => { setSaved(false); onNavigate('home') }, 2200)
  }

  const addBM = () => {
    haptics.medium()
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setLog(l => ({ ...l, bowelMovements: [...l.bowelMovements, { id: Date.now(), time, painLevel: 0, bloodPresent: false, spasm: false }] }))
  }

  // P1-A: Soft delete handler
  const handleSoftDelete = (bm) => {
    haptics.medium()
    if (pendingDelete?.timeoutId) clearTimeout(pendingDelete.timeoutId)
    // Immediately hide it from the list
    setLog(l => ({ ...l, bowelMovements: l.bowelMovements.filter(b => b.id !== bm.id) }))
    const timeoutId = setTimeout(() => setPendingDelete(null), 5000)
    setPendingDelete({ id: bm.id, bm, timeoutId })
  }

  // P1-A: Undo delete handler
  const handleUndoDelete = () => {
    if (!pendingDelete) return
    haptics.light()
    clearTimeout(pendingDelete.timeoutId)
    setLog(l => ({ ...l, bowelMovements: [...l.bowelMovements, pendingDelete.bm] }))
    setPendingDelete(null)
  }

  const handleJustFill = (index) => {
    setJustFilled(index)
    setTimeout(() => setJustFilled(null), 300)
  }

  const toggleFruit = (id) => {
    haptics.light()
    playTapSound(600, 0.06)
    setLog(l => ({ ...l, fruitsEaten: l.fruitsEaten.includes(id) ? l.fruitsEaten.filter(f => f !== id) : [...l.fruitsEaten, id] }))
  }
  const toggleFiber = (id) => {
    haptics.light()
    setLog(l => ({ ...l, fiberFoods: l.fiberFoods.includes(id) ? l.fiberFoods.filter(f => f !== id) : [...l.fiberFoods, id] }))
  }
  const toggleAvoid = (id) => {
    haptics.tap()
    const food = AVOID_FOODS.find(f => f.id === id)
    if (!(log.avoidFoods || []).includes(id)) {
      setAvoidWarning(food.tip)
      setTimeout(() => setAvoidWarning(null), 4000)
    }
    setLog(l => ({ ...l, avoidFoods: l.avoidFoods.includes(id) ? l.avoidFoods.filter(f => f !== id) : [...l.avoidFoods, id] }))
  }
  const addSitzBath = () => {
    haptics.medium()
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setLog(l => ({ ...l, sitzBaths: [...l.sitzBaths, { time, durationMinutes: 15 }] }))
  }

  const settings = (() => { try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} } })()
  const waterGoal = settings.waterGoal || 8

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
  }

  const renderStep = () => {
    switch (STEPS[step].id) {
      /* ── Step 1: Welcome ── */
      case 'welcome':
        return (
          <div style={{ padding: '28px 20px' }}>
            {/* P1-B: Draft resume banner */}
            {showDraftBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: theme.tipBg, border: `1px solid ${theme.tipBorder}`,
                  borderRadius: 14, padding: '10px 14px', marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <p style={{ fontSize: 13, color: theme.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Journal size={14} color={theme.primary} /> Resuming where you left off</p>
                <button onClick={() => {
                  setShowDraftBanner(false)
                  setLog({ date: today, bowelMovements: [], dailySymptoms: { restingPain: 0, itchingBurning: 0, sittingDiscomfort: 0, overallComfort: null, stressLevel: 0, sleepQuality: 5 }, medications: [], topicalOintment: { name: '', timesApplied: 0 }, sitzBaths: [], hydration: { waterGlasses: 0, waterMl: 0, coconutWater: false, coffee: false, alcohol: false }, fruitsEaten: [], fiberFoods: [], avoidFoods: [], activity: { walking: false, walkingMinutes: 0, yoga: false }, selfCare: { topicalApplied: false, warmCompress: false, emotionalWellbeing: null, notes: '' } })
                }}
                  style={{ fontSize: 12, color: theme.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Start fresh
                </button>
              </motion.div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <HeartPulse size={72} color={theme.primary} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Nunito', color: theme.primary, textAlign: 'center', marginBottom: 10 }}>
              {greeting}, {name}!
            </h2>
            <p style={{ fontSize: 15, color: theme.textMuted, textAlign: 'center', lineHeight: 1.7, marginBottom: 24 }}>
              Let's take 2 minutes to check in on your healing today. Every log is a step forward.
            </p>
            <div style={{
              background: theme.tipBg, borderRadius: 18, padding: '16px 18px',
              border: `1px solid ${theme.tipBorder}`,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: theme.primary, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon size={14} color={theme.primary} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>
                8 quick steps · about 2 minutes · everything stays private
              </p>
            </div>
            <p style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              Swipe or tap Next to begin <Heart size={12} color={'#F5C67A'} />
            </p>
          </div>
        )

      /* ── Step 2: Bowel Movements ── */
      case 'movements':
        return (
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>Bowel movements today <Journal size={17} color={theme.primary} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.5 }}>Log each movement separately. Aim for Type 4 <Banana size={13} color={theme.primary} style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
            {( log.bowelMovements || []).map((bm, i) => (
              <BMCard key={bm.id} bm={bm} index={i} theme={theme}
                onUpdate={updated => setLog(l => ({ ...l, bowelMovements: l.bowelMovements.map(b => b.id === bm.id ? updated : b) }))}
                onSoftDelete={handleSoftDelete}
              />
            ))}
            {(log.bowelMovements || []).length === 0 && (
              <div style={{ background: theme.tipBg, borderRadius: 16, padding: '16px', border: `1px solid ${theme.tipBorder}`, marginBottom: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: theme.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>No movements yet today — that's okay <Heart size={14} color={'#F5C67A'} /></p>
                <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Add one below if you've already had a movement</p>
              </div>
            )}
            <motion.button whileTap={{ scale: 0.96 }} onClick={addBM} style={{
              width: '100%', padding: '14px', background: theme.primary + '18', borderRadius: 16,
              border: `2px dashed ${theme.primary}`, color: theme.primary, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <Plus size={18} /> Add Bowel Movement
            </motion.button>
          </div>
        )

      /* ── Step 3: Symptoms ── */
      case 'symptoms':
        return (
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>How are you feeling, {name}? <Thermometer size={17} color={theme.primary} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>These are separate from movements — your general comfort today</p>
            <PainSlider value={log.dailySymptoms.restingPain} onChange={v => {
              haptics.light()
              setBgWarmth(v <= 2 ? 'warm' : '')
              setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, restingPain: v } }))
            }} label="Resting discomfort (when not in the bathroom):" theme={theme} />
            <PainSlider value={log.dailySymptoms.itchingBurning} onChange={v => { haptics.light(); setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, itchingBurning: v } })) }} label="Burning or itching:" theme={theme} />
            <PainSlider value={log.dailySymptoms.sittingDiscomfort} onChange={v => { haptics.light(); setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, sittingDiscomfort: v } })) }} label="Discomfort when sitting:" theme={theme} />
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 12 }}>How was your day overall?</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[['😊', 'good', 'Good day!'], ['😐', 'ok', 'Just okay'], ['😣', 'hard_day', 'Hard day']].map(([emoji, val, label]) => (
                <motion.button key={val} whileTap={{ scale: 0.94 }}
                  onClick={() => { haptics.tap(); setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, overallComfort: val } })) }} style={{
                    flex: 1, padding: '12px 8px', borderRadius: 16,
                    border: `2.5px solid ${log.dailySymptoms.overallComfort === val ? theme.primary : theme.cardBorder}`,
                    background: log.dailySymptoms.overallComfort === val ? theme.primary + '15' : theme.card,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}>
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>{label}</span>
                </motion.button>
              ))}
            </div>
            <PainSlider value={log.dailySymptoms.stressLevel} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, stressLevel: v } }))} label="Stress level today (0 = calm, 10 = very stressed):" theme={theme} />
            <PainSlider value={log.dailySymptoms.sleepQuality} onChange={v => setLog(l => ({ ...l, dailySymptoms: { ...l.dailySymptoms, sleepQuality: v } }))} label="Sleep quality last night:" theme={theme} />
          </div>
        )

      /* ── Step 4: Hydration ── */
      case 'hydration':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <WaterRipple size={52} color={theme.primary} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>Stay hydrated <WaterDrop size={17} color={theme.primary} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>Each glass = 250ml. Tap to fill — aim for {waterGoal} glasses!</p>
            <WaterTracker glasses={log.hydration.waterGlasses}
              onChange={g => setLog(l => ({ ...l, hydration: { ...l.hydration, waterGlasses: g, waterMl: g * 250 } }))}
              goal={waterGoal} theme={theme}
              justFilled={justFilled}
              onJustFill={handleJustFill} />
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginTop: 20, marginBottom: 12 }}>Other drinks today:</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { key: 'coconutWater', icon: <Coconut size={22} color={theme.primary} />, label: 'Coconut water', good: true },
                { key: 'coffee', icon: <Coffee size={22} color={theme.primary} />, label: 'Coffee', good: false },
                { key: 'alcohol', icon: <BeerGlass size={22} color={theme.primary} />, label: 'Alcohol', good: false },
              ].map(({ key, icon, label, good }) => (
                <motion.button key={key} whileTap={{ scale: 0.94 }}
                  onClick={() => { haptics.tap(); setLog(l => ({ ...l, hydration: { ...l.hydration, [key]: !l.hydration[key] } })) }} style={{
                    flex: 1, padding: '12px 8px', borderRadius: 16, cursor: 'pointer',
                    border: `2.5px solid ${log.hydration[key] ? (good ? '#A8D5A2' : '#F48585') : theme.cardBorder}`,
                    background: log.hydration[key] ? (good ? '#F0FFF0' : '#FFF0F0') : theme.card,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}>
                  {icon}
                  <span style={{ fontSize: 10, color: theme.text, fontWeight: 600 }}>{label}</span>
                  {good
                    ? <CheckCircle size={14} color={theme.wellnessHigh} />
                    : <WarningTriangle size={14} color={theme.danger} />}
                </motion.button>
              ))}
            </div>
          </div>
        )

      /* ── Step 5: Healing Foods ── */
      case 'food':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <FoodPop size={52} color={theme.primary} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>What healing foods did you have today? <Apple size={17} color={theme.primary} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>Tap everything you had. These foods support your recovery <Lightbulb size={13} color={theme.primary} /></p>
            <p style={{ fontSize: 12, fontWeight: 700, color: theme.primary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 4 }}>Healing fruits <CherryBlossom size={12} color={theme.primary} /></p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {FRUITS_DATA.map(fruit => (
                <motion.button key={fruit.id} whileTap={{ scale: 0.92 }} onClick={() => toggleFruit(fruit.id)} style={{
                  padding: '10px 6px', borderRadius: 14, cursor: 'pointer',
                  border: `2.5px solid ${(log.fruitsEaten || []).includes(fruit.id) ? '#A8D5A2' : theme.cardBorder}`,
                  background: (log.fruitsEaten || []).includes(fruit.id) ? '#F0FFF5' : theme.card,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
                }}>
                  <motion.div
                    animate={(log.fruitsEaten || []).includes(fruit.id) ? { scale: [1, 1.2, 1] } : {}}
                  >
                    <FruitIcon id={fruit.id} size={22} color={(log.fruitsEaten || []).includes(fruit.id) ? theme.wellnessHigh : theme.primary} />
                  </motion.div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: theme.text }}>{fruit.name}</span>
                </motion.button>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#A8D5A2', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fiber-rich foods</p>
            {(() => {
              const totalFiber = (log.fiberFoods || []).reduce((sum, id) => {
                const food = FIBER_FOODS.find(f => f.id === id)
                return sum + (food ? food.grams : 0)
              }, 0)
              const fiberGoal = 25
              const badgeColor = totalFiber >= fiberGoal ? '#A8D5A2' : totalFiber >= 15 ? '#F5C67A' : '#F48585'
              const badgeBg = totalFiber >= fiberGoal ? '#F0FFF5' : totalFiber >= 15 ? '#FFF8E8' : '#FFF0F0'
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      padding: '6px 14px', borderRadius: 20,
                      background: badgeBg, border: `1.5px solid ${badgeColor}`,
                      fontSize: 13, fontWeight: 700, color: badgeColor
                    }}>
                      Fiber today: {totalFiber}g / {fiberGoal}g goal
                    </div>
                  </div>
                  <div style={{ background: theme.cardBorder, borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 14 }}>
                    <motion.div
                      animate={{ width: `${Math.min((totalFiber / fiberGoal) * 100, 100)}%` }}
                      transition={{ duration: 0.3 }}
                      role="progressbar"
                      aria-valuenow={totalFiber}
                      aria-valuemin={0}
                      aria-valuemax={30}
                      aria-label={`Fiber intake: ${totalFiber} of 30 grams`}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${badgeColor}, ${badgeColor}cc)`, borderRadius: 8 }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {FIBER_FOODS.map(f => (
                      <motion.button key={f.id} whileTap={{ scale: 0.94 }} onClick={() => toggleFiber(f.id)} style={{
                        padding: '8px 12px', borderRadius: 16, cursor: 'pointer',
                        border: `2px solid ${(log.fiberFoods || []).includes(f.id) ? theme.primary : theme.cardBorder}`,
                        background: (log.fiberFoods || []).includes(f.id) ? theme.primary + '12' : theme.card,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 72
                      }}>
                        <FiberIcon id={f.id} size={20} color={(log.fiberFoods || []).includes(f.id) ? theme.primary : theme.textMuted} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: theme.text, textAlign: 'center' }}>{f.name}</span>
                        <span style={{ fontSize: 10, color: theme.textMuted }}>+{f.grams}g</span>
                      </motion.button>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        )

      /* ── Step 6: Watch Out (Avoid Foods) ── */
      case 'avoid':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <WarningWiggle size={52} color="#F5C67A" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>Anything to note? <WarningTriangle size={17} color={theme.danger} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>These foods can slow healing — just tracking, no judgment <Heart size={13} color={'#F5C67A'} /></p>
            <AnimatePresence>
              {avoidWarning && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: '#FFF8E8', borderRadius: 12, padding: '10px 14px', border: '1px solid #F5C67A', marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: '#8C7070', display: 'flex', alignItems: 'center', gap: 4 }}>{avoidWarning} <Heart size={13} color={'#F5C67A'} /></p>
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {AVOID_FOODS.map(food => (
                <motion.button key={food.id} whileTap={{ scale: 0.92 }} onClick={() => toggleAvoid(food.id)} style={{
                  padding: '10px 6px', borderRadius: 14, cursor: 'pointer',
                  border: `2.5px solid ${(log.avoidFoods || []).includes(food.id) ? '#F5C67A' : theme.cardBorder}`,
                  background: (log.avoidFoods || []).includes(food.id) ? '#FFF8E8' : theme.card,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                }}>
                  <AvoidIcon id={food.id} size={22} color={(log.avoidFoods || []).includes(food.id) ? '#F5C67A' : theme.textMuted} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: theme.text, textAlign: 'center' }}>{food.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )

      /* ── Step 7: Self-Care ── */
      case 'selfcare':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <FlowerBloom size={52} color={theme.primary} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>Almost there, {name}! <Bathtub size={17} color={theme.primary} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>Self-care tracking — every sitz bath matters so much</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, margin: 0 }}>Sitz baths today ({(log.sitzBaths || []).length}):</p>
              {(log.sitzBaths || []).length > 0 && <SteamWisps size={28} color="#A8D5A2" />}
            </div>
            {(log.sitzBaths || []).map((bath, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '12px', background: '#F0FFF5', borderRadius: 14, border: '1px solid #A8D5A2' }}>
                <Bathtub size={20} color={theme.primary} />
                <span style={{ fontSize: 13, color: theme.text, flex: 1 }}>Bath {i + 1} at {bath.time}</span>
                <input type="number" value={bath.durationMinutes} min={5} max={60}
                  onChange={e => setLog(l => ({ ...l, sitzBaths: l.sitzBaths.map((b, j) => j === i ? { ...b, durationMinutes: Number(e.target.value) } : b) }))}
                  style={{ width: 52, padding: '4px 8px', borderRadius: 8, border: '1px solid #A8D5A2', fontSize: 13, textAlign: 'center', color: theme.text }} />
                <span style={{ fontSize: 12, color: theme.textMuted }}>min</span>
                <button onClick={() => setLog(l => ({ ...l, sitzBaths: l.sitzBaths.filter((_, j) => j !== i) }))}
                  aria-label="Remove movement entry"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F48585', fontSize: 18 }}>✕</button>
              </motion.div>
            ))}
            <motion.button whileTap={{ scale: 0.95 }} onClick={addSitzBath} style={{
              padding: '11px 18px', background: '#F0FFF5', border: '1.5px dashed #A8D5A2',
              borderRadius: 14, color: '#5A9E5A', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20
            }}>
              <Plus size={16} /> Log a sitz bath
            </motion.button>

            <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Topical ointment:</p>
            <input placeholder="e.g. Lidocaine, Nifedipine cream..." value={log.topicalOintment.name}
              onChange={e => setLog(l => ({ ...l, topicalOintment: { ...l.topicalOintment, name: e.target.value } }))}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 14, border: `1px solid ${theme.cardBorder}`, fontSize: 14, marginBottom: 10, color: theme.text, background: theme.card }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: theme.textMuted }}>Times applied:</span>
              <Stepper value={log.topicalOintment.timesApplied} onChange={v => setLog(l => ({ ...l, topicalOintment: { ...l.topicalOintment, timesApplied: v } }))} max={8} theme={theme} />
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Gentle movement:</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={() => { haptics.tap(); setLog(l => ({ ...l, activity: { ...l.activity, walking: !l.activity.walking } })) }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 16, cursor: 'pointer',
                  border: `2.5px solid ${log.activity.walking ? '#A8D5A2' : theme.cardBorder}`,
                  background: log.activity.walking ? '#F0FFF5' : theme.card,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 14, fontWeight: 600, color: theme.text,
                }}>
                <Walking size={16} color={theme.text} /> Walking
              </motion.button>
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={() => { haptics.tap(); setLog(l => ({ ...l, activity: { ...l.activity, yoga: !l.activity.yoga } })) }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 16, cursor: 'pointer',
                  border: `2.5px solid ${log.activity.yoga ? '#C9A8F5' : theme.cardBorder}`,
                  background: log.activity.yoga ? '#F5F0FF' : theme.card,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 14, fontWeight: 600, color: theme.text,
                }}>
                <Yoga size={16} color={theme.text} /> Yoga
              </motion.button>
            </div>
            {log.activity.walking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: theme.textMuted }}>Minutes walked:</span>
                <Stepper value={log.activity.walkingMinutes} onChange={v => setLog(l => ({ ...l, activity: { ...l.activity, walkingMinutes: v } }))} min={0} max={120} theme={theme} />
              </div>
            )}
          </div>
        )

      /* ── Step 8: Journal & Save ── */
      case 'journal':
        return (
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>A moment just for you <Journal size={17} color={theme.primary} /></p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>How are you feeling right now?</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {EMOTIONS.map(emoji => (
                <motion.button key={emoji} whileTap={{ scale: 0.9 }}
                  onClick={() => { haptics.tap(); setLog(l => ({ ...l, selfCare: { ...l.selfCare, emotionalWellbeing: emoji } })) }} style={{
                    fontSize: 30,
                    background: log.selfCare.emotionalWellbeing === emoji ? theme.primary + '18' : 'none',
                    border: `2px solid ${log.selfCare.emotionalWellbeing === emoji ? theme.primary : 'transparent'}`,
                    borderRadius: 14, padding: '8px', cursor: 'pointer'
                  }}>{emoji}</motion.button>
              ))}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>
              Anything on your mind, {name}? (just for you)
            </p>
            <textarea
              placeholder={`What's on your mind, ${name}? What helped today, what felt hard?`}
              value={log.selfCare.notes}
              onChange={e => setLog(l => ({ ...l, selfCare: { ...l.selfCare, notes: e.target.value } }))}
              rows={4}
              style={{
                width: '100%', padding: '14px', borderRadius: 16, border: `1px solid ${theme.cardBorder}`,
                fontSize: 14, color: theme.text, resize: 'none', fontFamily: 'Inter',
                background: theme.card, lineHeight: 1.7, marginBottom: 24,
              }}
            />
            {saved && (
              <Suspense fallback={null}>
                <Confetti3D colors={['#A8D5A2', '#E8705A', '#F5C67A', '#C9A8F5', '#FFD700']} />
              </Suspense>
            )}
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    padding: '20px', background: 'linear-gradient(135deg, #A8D5A2, #7BC97B)',
                    borderRadius: 20, color: '#fff', fontSize: 16, fontWeight: 700, textAlign: 'center',
                    boxShadow: '0 6px 24px rgba(168,213,162,0.4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <CheckDrawn size={28} color="#fff" />
                    All saved, {name}! <Heart size={16} color={'#F5C67A'} /> Every log is a step toward healing.
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="save"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  aria-label="Save today's log"
                  style={{
                    width: '100%', padding: '18px', background: theme.ctaGradient,
                    border: 'none', borderRadius: 20, color: '#fff', fontSize: 17, fontWeight: 700,
                    cursor: 'pointer', boxShadow: `0 6px 24px ${theme.ctaShadow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}
                >
                  <Check size={20} /> Save Today's Log <Heart size={16} color={'#F5C67A'} />
                </motion.button>
              )}
            </AnimatePresence>
            <p style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', marginTop: 10 }}>
              Saved locally even if you're offline
            </p>
          </div>
        )

      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: theme.background, maxWidth: 430, margin: '0 auto', transition: 'background 0.8s ease' }}>
      {/* bgWarmth amber tint overlay */}
      <div style={{
        background: 'rgba(255, 180, 50, 0.06)',
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        transition: 'opacity 0.8s ease',
        opacity: bgWarmth === 'warm' ? 1 : 0,
      }} />

      {/* Save flash celebration overlay */}
      {saveFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(90, 158, 90, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          animation: 'celebFlash 0.8s ease forwards',
        }}>
          <div style={{ animation: 'popIn 0.4s ease' }}><Heart size={48} color={'#F5C67A'} /></div>
        </div>
      )}

      {/* P1-A: Undo snackbar */}
      <AnimatePresence>
        {pendingDelete && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: 430, zIndex: 300,
              background: '#3D2B2B', padding: '14px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Movement entry removed</p>
            <button onClick={handleUndoDelete} style={{
              background: 'none', border: '1.5px solid #F5C67A', borderRadius: 10,
              color: '#F5C67A', fontSize: 13, fontWeight: 700, padding: '6px 14px', cursor: 'pointer',
            }}>Undo</button>
          </motion.div>
        )}
      </AnimatePresence>

      <StepHeader step={step} total={STEPS.length} stepData={STEPS[step]} theme={theme} />

      {/* Swipeable content area */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', overflowX: 'hidden' }}
        onTouchStart={e => {
          dragStartX.current = e.touches[0].clientX
          dragStartY.current = e.touches[0].clientY
        }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - dragStartX.current
          const dy = e.changedTouches[0].clientY - dragStartY.current
          // Only fire step navigation when gesture is clearly horizontal:
          // dx must exceed 110px AND be at least 2× larger than the vertical component
          if (Math.abs(dx) > 110 && Math.abs(dx) > Math.abs(dy) * 2) {
            if (dx < 0) goNext()
            else goPrev()
          }
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingBottom: 160 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation — sits above the app's BottomNav bar */}
      <div style={{
        position: 'fixed', bottom: 'calc(64px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: theme.navBg, borderTop: `1px solid ${theme.navBorder}`,
        padding: '10px 20px', display: 'flex', gap: 12, zIndex: 10,
        boxShadow: `0 -4px 20px ${theme.cardShadow}`,
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous step"
          style={{
            flex: 1, padding: '14px', borderRadius: 16,
            background: step === 0 ? theme.cardBorder : theme.card,
            border: `1.5px solid ${theme.cardBorder}`,
            color: step === 0 ? theme.textMuted : theme.text,
            fontSize: 15, fontWeight: 600, cursor: step === 0 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
        {step < STEPS.length - 1 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            aria-label="Next step"
            style={{
              flex: 2, padding: '14px', borderRadius: 16,
              background: theme.ctaGradient,
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 4px 16px ${theme.ctaShadow}`,
            }}
          >
            Next <ArrowRight size={18} />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            aria-label="Save today's log"
            style={{
              flex: 2, padding: '14px', borderRadius: 16,
              background: 'linear-gradient(135deg, #A8D5A2, #7BC97B)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(168,213,162,0.4)',
            }}
          >
            <Check size={18} /> Save Log <Heart size={16} color={'#F5C67A'} />
          </motion.button>
        )}
      </div>
    </div>
  )
}
