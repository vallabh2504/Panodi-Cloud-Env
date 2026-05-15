import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Bookmark, Heart } from 'lucide-react'
import { WISDOM, CATEGORIES, getDailyTip, getBookmarkedTips, toggleBookmark } from '../lib/wisdom'
import { HealingLeaf } from '../components/AnimatedSVGs'

function TipCard({ tip, bookmarked, onBookmark, theme }) {
  const cat = CATEGORIES[tip.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        background: theme.card, borderRadius: 22, padding: '18px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: `0 2px 12px ${theme.cardShadow}`,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: cat.color,
              background: cat.color + '22', borderRadius: 8, padding: '3px 8px',
              textTransform: 'uppercase', letterSpacing: '0.3px',
            }}>
              {cat.emoji} {cat.label}
            </span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: theme.text, lineHeight: 1.35 }}>
            {tip.emoji} {tip.title}
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => onBookmark(tip.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0,
        }}>
          <Bookmark size={18}
            fill={bookmarked ? theme.primary : 'none'}
            color={bookmarked ? theme.primary : theme.textMuted}
          />
        </motion.button>
      </div>
      <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.75 }}>{tip.tip}</p>
    </motion.div>
  )
}

export default function WisdomScreen({ theme }) {
  const t = theme || {}
  const primary = t.primary || '#E8705A'
  const card = t.card || '#fff'
  const cardBorder = t.cardBorder || '#F0E0DA'
  const textMuted = t.textMuted || '#8C7070'
  const text = t.text || '#3D2B2B'
  const headerGradient = t.headerGradient || 'linear-gradient(135deg, #FFF0EB, #FFF8F5)'
  const tipBg = t.tipBg || '#FFF0EB'
  const tipBorder = t.tipBorder || '#F0D0C8'
  const cardShadow = t.cardShadow || 'rgba(232,112,90,0.08)'

  const safeTheme = { primary, card, cardBorder, textMuted, text, cardShadow, ...t }

  const [activeCategory, setActiveCategory] = useState('all')
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarks, setBookmarks] = useState(getBookmarkedTips())

  const dailyTip = useMemo(() => getDailyTip(), [])
  const name = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}').userName || 'Bujji' } catch { return 'Bujji' }
  }, [])

  const handleBookmark = (id) => {
    const updated = toggleBookmark(id)
    setBookmarks([...updated])
  }

  const displayedTips = useMemo(() => {
    let tips = WISDOM
    if (showBookmarks) tips = tips.filter(t => bookmarks.includes(t.id))
    else if (activeCategory !== 'all') tips = tips.filter(t => t.category === activeCategory)
    return tips
  }, [activeCategory, showBookmarks, bookmarks])

  const categories = [
    { id: 'all', label: 'All', emoji: '✨' },
    ...Object.entries(CATEGORIES).map(([id, c]) => ({ id, label: c.label, emoji: c.emoji })),
  ]

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', background: headerGradient, borderBottom: `1px solid ${cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <BookOpen size={20} color={primary} />
          <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Nunito', color: primary }}>Healing Wisdom</p>
        </div>
        <p style={{ fontSize: 13, color: textMuted }}>
          60 curated tips just for you, {name} 💛
        </p>
      </div>

      {/* Daily Tip Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: '16px 16px 0', borderRadius: 22, padding: '18px',
          background: `linear-gradient(135deg, ${primary}18, ${primary}08)`,
          border: `1.5px solid ${primary}35`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <HealingLeaf size={18} color={primary} />
          <p style={{ fontSize: 11, fontWeight: 700, color: primary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            ✨ Tip for you today, {name}
          </p>
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 8, lineHeight: 1.35 }}>
          {dailyTip.emoji} {dailyTip.title}
        </p>
        <p style={{ fontSize: 13, color: textMuted, lineHeight: 1.7 }}>{dailyTip.tip}</p>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => handleBookmark(dailyTip.id)}
          style={{
            marginTop: 12, padding: '8px 16px', background: 'none',
            border: `1.5px solid ${primary}50`, borderRadius: 12,
            color: primary, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Bookmark size={14} fill={bookmarks.includes(dailyTip.id) ? primary : 'none'} />
          {bookmarks.includes(dailyTip.id) ? 'Bookmarked' : 'Save this tip'}
        </motion.button>
      </motion.div>

      {/* Category filter */}
      <div style={{ padding: '16px 16px 4px', display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide">
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => { setShowBookmarks(false); setActiveCategory('all') }}
          style={{
            flexShrink: 0, padding: '7px 14px', borderRadius: 20,
            background: !showBookmarks && activeCategory === 'all' ? primary : tipBg,
            border: `1px solid ${!showBookmarks && activeCategory === 'all' ? primary : tipBorder}`,
            color: !showBookmarks && activeCategory === 'all' ? '#fff' : primary,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>✨ All</motion.button>
        {Object.entries(CATEGORIES).map(([id, cat]) => {
          const active = !showBookmarks && activeCategory === id
          return (
            <motion.button key={id} whileTap={{ scale: 0.94 }} onClick={() => { setShowBookmarks(false); setActiveCategory(id) }}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20,
                background: active ? cat.color : tipBg,
                border: `1px solid ${active ? cat.color : tipBorder}`,
                color: active ? '#fff' : primary,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              {cat.emoji} {cat.label}
            </motion.button>
          )
        })}
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowBookmarks(true)}
          style={{
            flexShrink: 0, padding: '7px 14px', borderRadius: 20,
            background: showBookmarks ? primary : tipBg,
            border: `1px solid ${showBookmarks ? primary : tipBorder}`,
            color: showBookmarks ? '#fff' : primary,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
          <Bookmark size={12} /> Saved ({bookmarks.length})
        </motion.button>
      </div>

      {/* Tips list */}
      <div style={{ padding: '12px 16px 16px' }}>
        {displayedTips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>💛</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 8 }}>
              {showBookmarks ? 'No saved tips yet' : 'No tips here'}
            </p>
            <p style={{ fontSize: 13, color: textMuted }}>
              {showBookmarks
                ? 'Tap the 🔖 on any tip to save it for later'
                : 'Try a different category'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {displayedTips.map(tip => (
              <TipCard
                key={tip.id}
                tip={tip}
                bookmarked={bookmarks.includes(tip.id)}
                onBookmark={handleBookmark}
                theme={safeTheme}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      <p style={{ fontSize: 11, color: textMuted, textAlign: 'center', padding: '0 24px 16px', lineHeight: 1.6 }}>
        Community wisdom and evidence-based tips. Always follow your doctor's guidance 💛
      </p>
    </div>
  )
}
