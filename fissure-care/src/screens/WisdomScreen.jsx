import { useState } from 'react'
import { Search, ExternalLink, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

const WISDOM_CARDS = [
  {
    title: 'The Sitz Bath Protocol That Worked',
    votes: '2.4k upvotes',
    tag: 'Recovery Essential',
    bg: '#FFF0EB',
    border: '#F0D0C8',
    content:
      '3× daily sitz baths in warm water for 15 minutes changed everything. The warm water relaxes the internal anal sphincter, increases blood flow, and accelerates tissue healing. Add Epsom salt for extra relief. Consistency is the key — miss a day and you can feel it.',
  },
  {
    title: 'Fiber + Hydration is the Foundation',
    votes: '1.8k upvotes',
    tag: 'Diet Wisdom',
    bg: '#F0FFF5',
    border: '#B8E4B8',
    content:
      'The one thing that saved me: 30g fiber per day and 3 liters of water. Soft, easy stools mean no re-injury. Oats for breakfast, psyllium husk with lunch, papaya as a snack. Bristol Type 4 should be the daily goal — anything harder re-tears the wound.',
  },
  {
    title: 'Squatty Potty + No Straining Rule',
    votes: '1.5k upvotes',
    tag: 'Position Hack',
    bg: '#F5F0FF',
    border: '#C8B8F0',
    content:
      'A footstool to elevate your feet while on the toilet changes the anorectal angle and eliminates straining. Never wait or push — if it does not come easily in 2 minutes, get up and try later. This single change prevents 90% of re-injury events.',
  },
  {
    title: 'GTN / Diltiazem Ointment Guide',
    votes: '1.2k upvotes',
    tag: 'Medication',
    bg: '#FFFBF0',
    border: '#E8D898',
    content:
      'Apply the ointment 3× daily: morning, after each bowel movement, and at night. Use a clean finger to apply inside, not just outside. Headaches from GTN are normal — take paracetamol if needed. Diltiazem is gentler on headaches for most people.',
  },
  {
    title: 'The 8-Week Healing Timeline',
    votes: '980 upvotes',
    tag: 'Timeline',
    bg: '#F0FAFF',
    border: '#A8CFF0',
    content:
      'Weeks 1–2: Inflammation, worst pain. Weeks 3–4: Noticeably less bleeding. Weeks 5–6: Pain mainly after bowel movements. Weeks 7–8: Most people feel healed. Staying consistent with sitz baths and diet is the key — setbacks are normal, do not give up.',
  },
]

const QUICK_TERMS = ['diet tips', 'sitz bath', 'recovery timeline', 'GTN cream', 'surgery', 'fiber foods']

export default function WisdomScreen({ theme }) {
  const [query, setQuery] = useState('')

  const t = theme || {}
  const primary = t.primary || '#E8705A'
  const card = t.card || '#fff'
  const cardBorder = t.cardBorder || '#F0E0DA'
  const textMuted = t.textMuted || '#8C7070'
  const text = t.text || '#3D2B2B'
  const tipBg = t.tipBg || '#FFF0EB'
  const tipBorder = t.tipBorder || '#F0D0C8'
  const headerGradient = t.headerGradient || 'linear-gradient(135deg, #FFF0EB, #FFF8F5)'
  const ctaGradient = t.ctaGradient || 'linear-gradient(135deg, #E8705A, #F5A68A)'
  const cardShadow = t.cardShadow || 'rgba(232,112,90,0.08)'

  const searchReddit = () => {
    if (query.trim()) {
      window.open(
        `https://www.reddit.com/r/AnalFissures/search/?q=${encodeURIComponent(query.trim())}&restrict_sr=1`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  const openQuickSearch = (term) => {
    window.open(
      `https://www.reddit.com/r/AnalFissures/search/?q=${encodeURIComponent(term)}&restrict_sr=1`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 16px',
        background: headerGradient,
        borderBottom: `1px solid ${cardBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <BookOpen size={20} color={primary} />
          <p style={{ fontSize: 20, fontWeight: 700, color: primary }}>Healing Wisdom</p>
        </div>
        <p style={{ fontSize: 13, color: textMuted }}>
          Community knowledge from r/AnalFissures
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: card, border: `1px solid ${cardBorder}`,
            borderRadius: 16, padding: '11px 14px',
            boxShadow: `0 2px 8px ${cardShadow}`,
          }}>
            <Search size={16} color={textMuted} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchReddit()}
              placeholder="Search r/AnalFissures..."
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 14,
                background: 'transparent', color: text,
              }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={searchReddit}
            style={{
              padding: '11px 16px', background: ctaGradient,
              border: 'none', borderRadius: 16, color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            }}
          >
            <ExternalLink size={14} /> Search
          </motion.button>
        </div>
        <p style={{ fontSize: 11, color: textMuted, marginTop: 6, paddingLeft: 4 }}>
          Opens Reddit in your browser
        </p>
      </div>

      {/* Quick Terms */}
      <div style={{ padding: '4px 16px 12px', display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide">
        {QUICK_TERMS.map(term => (
          <motion.button
            key={term}
            whileTap={{ scale: 0.95 }}
            onClick={() => openQuickSearch(term)}
            style={{
              flexShrink: 0, padding: '6px 14px',
              background: tipBg, border: `1px solid ${tipBorder}`,
              borderRadius: 20, fontSize: 12, color: primary,
              cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap',
            }}
          >
            {term}
          </motion.button>
        ))}
      </div>

      {/* Wisdom Cards */}
      <div style={{ padding: '4px 16px 16px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Top community wisdom
        </p>
        {WISDOM_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{
              background: card.bg, border: `1px solid ${card.border}`,
              borderRadius: 20, padding: '16px', marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: primary,
                  background: `${primary}18`, borderRadius: 8, padding: '2px 8px',
                  display: 'inline-block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.3px',
                }}>
                  {card.tag}
                </span>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#3D2B2B', lineHeight: 1.3 }}>
                  {card.title}
                </p>
              </div>
              <span style={{ fontSize: 11, color: '#8C7070', flexShrink: 0, marginLeft: 10, marginTop: 4 }}>
                ⬆ {card.votes}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#5C4040', lineHeight: 1.75 }}>{card.content}</p>
          </motion.div>
        ))}

        {/* Link to subreddit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => window.open('https://www.reddit.com/r/AnalFissures/', '_blank', 'noopener,noreferrer')}
          style={{
            width: '100%', padding: '14px', marginTop: 4,
            background: 'transparent',
            border: `2px solid ${cardBorder}`,
            borderRadius: 18, color: text,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <ExternalLink size={16} /> Visit r/AnalFissures Community
        </motion.button>

        <p style={{ fontSize: 11, color: textMuted, textAlign: 'center', marginTop: 10, lineHeight: 1.6 }}>
          Community advice is not medical guidance. Always consult your doctor.
        </p>
      </div>
    </div>
  )
}
