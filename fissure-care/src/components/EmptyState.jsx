import { motion } from 'framer-motion'
import { SeedlingGrow } from './AnimatedSVGs'

const STATES = {
  noLogs: {
    illustration: <SeedlingGrow size={110} color="#A8D5A2" />,
    title: 'Your journey starts here',
    subtitle: 'Log your first day and watch your healing garden grow, Bujji 🌸',
    cta: 'Log Today',
  },
  noInsights: {
    illustration: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="54" fill="#F0F7FF" />
        <text x="60" y="75" fontSize="52" textAnchor="middle">📊</text>
      </svg>
    ),
    title: 'Insights are coming',
    subtitle: 'Log for 3 days and I\'ll start finding patterns for you, Bujji 💡',
    cta: null,
  },
  noMeds: {
    illustration: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="54" fill="#F5F0FF" />
        <text x="60" y="75" fontSize="52" textAnchor="middle">💊</text>
      </svg>
    ),
    title: 'No medications added yet',
    subtitle: 'Add your medications so we can track them together 💊',
    cta: 'Add Medication',
  },
  noWisdom: {
    illustration: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="54" fill="#FFFBF0" />
        <text x="60" y="75" fontSize="52" textAnchor="middle">📚</text>
      </svg>
    ),
    title: 'All tips are here',
    subtitle: 'Swipe through 60 curated healing tips — one a day keeps the doctor away 💛',
    cta: null,
  },
}

export default function EmptyState({ type = 'noLogs', onCta, theme }) {
  const state = STATES[type] || STATES.noLogs
  const primary = theme?.primary || '#E8705A'
  const ctaGradient = theme?.ctaGradient || 'linear-gradient(135deg, #E8705A, #F5A68A)'
  const text = theme?.text || '#3D2B2B'
  const textMuted = theme?.textMuted || '#8C7070'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: 'center', padding: '40px 32px' }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginBottom: 20, display: 'inline-block' }}
      >
        {state.illustration}
      </motion.div>
      <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Nunito', color: text, marginBottom: 10 }}>
        {state.title}
      </p>
      <p style={{ fontSize: 14, color: textMuted, lineHeight: 1.6, marginBottom: state.cta ? 24 : 0 }}>
        {state.subtitle}
      </p>
      {state.cta && onCta && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onCta}
          style={{
            padding: '14px 28px', background: ctaGradient,
            border: 'none', borderRadius: 16, color: '#fff',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 6px 20px ${theme?.ctaShadow || 'rgba(232,112,90,0.35)'}`,
          }}
        >
          {state.cta}
        </motion.button>
      )}
    </motion.div>
  )
}
