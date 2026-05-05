import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { supabase } from './lib/supabase'
import { ThemeProvider } from './lib/theme'
import AuthScreen from './screens/AuthScreen'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import BottomNav from './components/layout/BottomNav'
import CustomCursor from './components/ui/CustomCursor'

const TAB_ORDER = ['home', 'log', 'insights', 'meds', 'settings']

const pageVariants = {
  initial: (dir) => ({ opacity: 0, x: dir * 28, filter: 'blur(3px)' }),
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit:    (dir) => ({ opacity: 0, x: dir * -18, filter: 'blur(2px)' }),
}

const pageTransition = { type: 'spring', stiffness: 280, damping: 30, mass: 0.85 }

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--gradient-hero)', fontFamily: 'var(--font-main)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        style={{
          width: 76, height: 76, borderRadius: 24,
          background: 'rgba(255,255,255,0.13)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Leaf size={36} color="#fff" strokeWidth={1.8} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, letterSpacing: '0.05em' }}
      >
        CareNest
      </motion.p>
    </motion.div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [direction, setDirection] = useState(1)
  const prevTabRef = useRef('home')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleNavigate = (tab) => {
    const prevIdx = TAB_ORDER.indexOf(prevTabRef.current)
    const nextIdx = TAB_ORDER.indexOf(tab)
    setDirection(nextIdx >= prevIdx ? 1 : -1)
    prevTabRef.current = tab
    setActiveTab(tab)
  }

  const screenMap = {
    home:     <HomeScreen onNavigate={handleNavigate} />,
    log:      <LogScreen onNavigate={handleNavigate} />,
    insights: <InsightsScreen />,
    meds:     <MedsScreen />,
    settings: <SettingsScreen session={session} />,
  }

  return (
    <ThemeProvider>
      <>
        <CustomCursor />
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loading" />
          ) : !session ? (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthScreen />
            </motion.div>
          ) : (
            <div key="app" style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingBottom: 80 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  style={{ minHeight: 'calc(100dvh - 80px)' }}
                >
                  {screenMap[activeTab]}
                </motion.div>
              </AnimatePresence>
              <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />
            </div>
          )}
        </AnimatePresence>
      </>
    </ThemeProvider>
  )
}
