import { useState, useEffect, useCallback } from 'react'
import { getThemeId, saveThemeId, themes } from './lib/themes'
import { getStreak } from './lib/storage'
import { checkAndClaimCelebrations } from './lib/celebrations'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import WisdomScreen from './screens/WisdomScreen'
import BottomNav from './components/BottomNav'
import OfflineBanner from './components/OfflineBanner'
import CelebrationOverlay from './components/CelebrationOverlay'

function scheduleHealingReminders() {
  const settings = JSON.parse(localStorage.getItem('fissurecare_settings') || '{}')
  if (!settings.remindersEnabled) return
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const hasLoggedToday = !!localStorage.getItem(`fissurecare_log_${today}`)
  const hour = now.getHours()
  const name = settings.userName || 'Bujji'

  if (hour >= 12 && hour < 14 && !hasLoggedToday) {
    const key = 'fissurecare_nudge_noon_' + today
    if (!localStorage.getItem(key)) {
      new Notification('💧 Hydration Check', {
        body: `${name}, have you had 8 glasses of water today? Staying hydrated is key to healing.`,
        icon: '/favicon.svg', tag: 'hydration-noon',
      })
      localStorage.setItem(key, '1')
    }
  }

  if (hour >= 20 && hour < 22 && !hasLoggedToday) {
    const key = 'fissurecare_nudge_evening_' + today
    if (!localStorage.getItem(key)) {
      new Notification('📝 Log Your Day', {
        body: `${name}, take 2 minutes to log today and track your healing progress 💛`,
        icon: '/favicon.svg', tag: 'log-evening',
      })
      localStorage.setItem(key, '1')
    }
  }

  if (hour >= 9 && hour < 11 && !hasLoggedToday) {
    const key = 'fissurecare_nudge_morning_' + today
    if (!localStorage.getItem(key)) {
      new Notification('🌸 Good Morning!', {
        body: `Start your day with papaya or oats, ${name}! Fiber-rich foods accelerate healing.`,
        icon: '/favicon.svg', tag: 'fruit-morning',
      })
      localStorage.setItem(key, '1')
    }
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [themeId, setThemeId] = useState(getThemeId())
  const [celebration, setCelebration] = useState(null)

  const theme = themes[themeId] || themes.cherry

  useEffect(() => {
    scheduleHealingReminders()
  }, [])

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
    <div className="min-h-dvh" style={{ background: theme.background, paddingBottom: '80px', transition: 'background 0.5s ease' }}>
      <OfflineBanner />
      {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} theme={theme} />}
      {activeTab === 'log' && <LogScreen onNavigate={setActiveTab} onLogSaved={handleLogSaved} />}
      {activeTab === 'insights' && <InsightsScreen theme={theme} />}
      {activeTab === 'meds' && <MedsScreen theme={theme} />}
      {activeTab === 'wisdom' && <WisdomScreen theme={theme} />}
      {activeTab === 'settings' && <SettingsScreen theme={theme} themeId={themeId} onThemeChange={handleThemeChange} />}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} theme={theme} />
      <CelebrationOverlay celebration={celebration} onDismiss={handleDismissCelebration} />
    </div>
  )
}
