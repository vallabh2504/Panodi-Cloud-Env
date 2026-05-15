import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FEATURE_STEPS = [
  {
    title: 'Your Wellness Ring',
    body: 'This 0–100 score combines your hydration, fiber, sitz baths, pain level, and stool quality each day.',
    emoji: '💫',
  },
  {
    title: 'Blood-Free Streak',
    body: 'Each blood-free day grows a flower in your Healing Garden. Streaks build hope and track real recovery.',
    emoji: '🌸',
  },
  {
    title: 'Daily Log',
    body: 'Tap the Log tab to check in — it takes 2 minutes and walks you through 8 gentle steps.',
    emoji: '📋',
  },
  {
    title: 'Personalized Insights',
    body: 'After a few days, the Insights tab shows which foods help or hurt your healing based on your own data.',
    emoji: '🔬',
  },
]

export default function CoachMarks({ onDone }) {
  const [step, setStep] = useState(0) // step 0 = name capture, 1-4 = feature steps
  const [nameInput, setNameInput] = useState('')

  const totalSteps = 1 + FEATURE_STEPS.length // name step + 4 feature steps
  const isNameStep = step === 0
  const featureStep = FEATURE_STEPS[step - 1]

  const saveName = () => {
    if (nameInput.trim()) {
      const settings = JSON.parse(localStorage.getItem('fissurecare_settings') || '{}')
      settings.userName = nameInput.trim()
      localStorage.setItem('fissurecare_settings', JSON.stringify(settings))
    }
  }

  const handleNext = () => {
    if (isNameStep) saveName()
    if (step < totalSteps - 1) {
      setStep(s => s + 1)
    } else {
      onDone()
    }
  }

  const handleSkip = () => {
    onDone()
  }

  return (
    <AnimatePresence>
      <motion.div
        key="coach-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 900, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 16px 32px',
        }}
      >
        <motion.div
          key={step}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          style={{
            background: '#fff', borderRadius: 24, padding: '28px 24px',
            width: '100%', maxWidth: 400, textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {isNameStep ? (
            <>
              <p style={{ fontSize: 48, marginBottom: 12 }}>👋</p>
              <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Nunito', color: '#3D2B2B', marginBottom: 8 }}>
                What should we call you?
              </p>
              <input
                type="text"
                placeholder="Your name"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && nameInput.trim() && handleNext()}
                autoFocus
                maxLength={30}
                aria-label="Enter your name"
                style={{
                  width: '100%', padding: '14px', borderRadius: 14,
                  border: '1.5px solid #F0E0DA', fontSize: 16,
                  textAlign: 'center', fontFamily: 'Inter',
                  color: '#3D2B2B', marginBottom: 8, boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <p style={{ fontSize: 12, color: '#8C7070', marginBottom: 24 }}>
                Used for your personal greeting — stored on your device only.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 48, marginBottom: 12 }}>{featureStep.emoji}</p>
              <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Nunito', color: '#3D2B2B', marginBottom: 8 }}>
                {featureStep.title}
              </p>
              <p style={{ fontSize: 14, color: '#8C7070', lineHeight: 1.6, marginBottom: 24 }}>
                {featureStep.body}
              </p>
            </>
          )}

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{
                width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                background: i <= step ? '#E8705A' : '#F0E0DA',
                transition: 'width 0.3s ease',
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSkip} style={{
              flex: 1, padding: '12px', background: '#F5F0F0', border: 'none',
              borderRadius: 14, fontSize: 14, color: '#8C7070', cursor: 'pointer', fontWeight: 600,
            }}>
              {isNameStep ? 'Skip for now' : 'Skip'}
            </button>
            <button
              onClick={handleNext}
              disabled={isNameStep && nameInput.trim() === ''}
              style={{
                flex: 2, padding: '12px',
                background: isNameStep && nameInput.trim() === ''
                  ? '#F0E0DA'
                  : 'linear-gradient(135deg, #E8705A, #F5A68A)',
                border: 'none', borderRadius: 14, fontSize: 14,
                color: isNameStep && nameInput.trim() === '' ? '#C4A0A0' : '#fff',
                cursor: isNameStep && nameInput.trim() === '' ? 'default' : 'pointer',
                fontWeight: 700,
              }}
            >
              {step < totalSteps - 1 ? 'Next →' : 'Get Started 💛'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
