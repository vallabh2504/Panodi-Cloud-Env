import { motion, AnimatePresence } from 'framer-motion'
import { Home, PenLine, BarChart2, Pill, Settings } from 'lucide-react'
import { haptic } from '../../lib/haptics'

const TABS = [
  { id: 'home',     label: 'Today',    Icon: Home },
  { id: 'log',      label: 'Log',      Icon: PenLine },
  { id: 'insights', label: 'Insights', Icon: BarChart2 },
  { id: 'meds',     label: 'Care',     Icon: Pill },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function BottomNav({ activeTab, onNavigate }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center',
    }}>
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.15 }}
      style={{
        width: '100%', maxWidth: 430,
        background: 'rgba(254, 252, 248, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 24px rgba(44,49,64,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <motion.button
              key={id}
              onClick={() => { haptic.tap(); onNavigate(id) }}
              whileTap={{ scale: 0.88 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '8px 2px 12px', background: 'transparent', border: 'none',
                cursor: 'pointer', color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-main)', position: 'relative',
              }}
            >
              <div style={{ position: 'relative', width: 44, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {active && (
                  <motion.div
                    layoutId="tab-bg"
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: 12,
                      background: 'var(--color-primary-muted)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
                </motion.div>
              </div>
              <motion.span
                animate={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                style={{ fontSize: 10, fontWeight: active ? 700 : 500, marginTop: 1 }}
              >
                {label}
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
    </div>
  )
}
