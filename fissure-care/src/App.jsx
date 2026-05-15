import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getThemeId, saveThemeId, themes } from './lib/themes'
import { getStreak } from './lib/storage'
import { checkAndClaimCelebrations } from './lib/celebrations'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import WisdomScreen from './screens/WisdomScreen'
import SplashScreen from './screens/SplashScreen'
import BottomNav from './components/BottomNav'
import OfflineBanner from './components/OfflineBanner'
import CelebrationOverlay from './components/CelebrationOverlay'
import CoachMarks from './components/CoachMarks'

function scheduleHealingReminders() {
  const settings = JSON.parse(localStorage.getItem('fissurecare_settings') || '{}')
  if (!settings.remindersEnabled) return
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const hour = now.getHours()
  const name = settings.userName || 'friend'
  const todayLog = JSON.parse(localStorage.getItem('fissurecare_log_' + today) || 'null')
  const glasses = todayLog?.hydration?.waterGlasses || 0
  const hasSitz = (todayLog?.sitzBaths?.length || 0) > 0
  const hasBM = (todayLog?.bowelMovements?.length || 0) > 0

  // Hydration nudge: if <2 glasses by 2pm
  if (hour >= 14 && hour < 15 && glasses < 2) {
    const key = 'fissurecare_nudge_hydration_' + today
    if (!localStorage.getItem(key)) {
      new Notification('💧 Hydration Check', {
        body: `${name}, you've had ${glasses} glasses so far. Aim for 8 to support healing!`,
        icon: '/favicon.svg', tag: 'hydration-afternoon',
      })
      localStorage.setItem(key, '1')
    }
  }

  // Post-BM sitz reminder: if BM logged today but no sitz bath yet, nudge at next hour
  if (hasBM && !hasSitz && hour >= 8 && hour < 20) {
    const key = 'fissurecare_nudge_sitz_' + today + '_' + hour
    if (!localStorage.getItem(key)) {
      new Notification('🛁 Sitz Bath Reminder', {
        body: `${name}, a warm sitz bath after your bowel movement helps healing. 15 minutes is all it takes!`,
        icon: '/favicon.svg', tag: 'sitz-reminder',
      })
      localStorage.setItem(key, '1')
    }
  }

  // Evening log reminder if no log by 9pm
  if (hour >= 21 && hour < 22 && !todayLog) {
    const key = 'fissurecare_nudge_evening_' + today
    if (!localStorage.getItem(key)) {
      new Notification('📝 Log Your Day', {
        body: `${name}, take 2 minutes to log today — every entry helps track your healing! 💛`,
        icon: '/favicon.svg', tag: 'log-evening',
      })
      localStorage.setItem(key, '1')
    }
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [themeId, setThemeId] = useState(getThemeId())
  const [celebration, setCelebration] = useState(null)
  const [showSplash, setShowSplash] = useState(
    () => !localStorage.getItem('fissurecare_launched')
  )
  const [showCoachMarks, setShowCoachMarks] = useState(() => !localStorage.getItem('fissurecare_toured'))

  const theme = themes[themeId] || themes.cherry

  useEffect(() => {
    scheduleHealingReminders()
    const id = setInterval(scheduleHealingReminders, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const handleEnter = (tab = 'home') => {
    localStorage.setItem('fissurecare_launched', '1')
    setShowSplash(false)
    setActiveTab(tab)
  }

  const handleThemeChange = (id) => {
    saveThemeId(id)
    setThemeId(id)
  }

  const handleLogSaved = useCallback((log) => {
    const streak = getStreak()
    const celebrations = checkAndClaimCelebrations(log, streak)
    if (celebrations.length > 0) {
      setCelebration(celebrations[0])
    }
  }, [])

  const handleDismissCelebration = () => setCelebration(null)

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
        >
          <SplashScreen onEnter={handleEnter} theme={theme} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-dvh"
          style={{ background: theme.background, paddingBottom: '80px', transition: 'background 0.5s ease' }}
        >
          <OfflineBanner />
          {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} theme={theme} />}
          {activeTab === 'log' && <LogScreen onNavigate={setActiveTab} onLogSaved={handleLogSaved} theme={theme} />}
          {activeTab === 'insights' && <InsightsScreen theme={theme} />}
          {activeTab === 'meds' && <MedsScreen theme={theme} />}
          {activeTab === 'wisdom' && <WisdomScreen theme={theme} />}
          {activeTab === 'settings' && <SettingsScreen theme={theme} themeId={themeId} onThemeChange={handleThemeChange} />}
          <BottomNav activeTab={activeTab} onNavigate={setActiveTab} theme={theme} />
          <CelebrationOverlay celebration={celebration} onDismiss={handleDismissCelebration} />
          {showCoachMarks && !showSplash && <CoachMarks onDone={() => { localStorage.setItem('fissurecare_toured', '1'); setShowCoachMarks(false) }} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
