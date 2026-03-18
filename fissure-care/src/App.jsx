import { useState, useEffect } from 'react'
import { getThemeId, saveThemeId, themes } from './lib/themes'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import WisdomScreen from './screens/WisdomScreen'
import BottomNav from './components/BottomNav'

function scheduleHealingReminders() {
  const settings = JSON.parse(localStorage.getItem('fissurecare_settings') || '{}')
  if (!settings.remindersEnabled) return
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const hasLoggedToday = !!localStorage.getItem(`fissurecare_log_${today}`)
  const hour = now.getHours()

  // Hydration nudge at noon if not logged
  if (hour >= 12 && hour < 14 && !hasLoggedToday) {
    const lastNudge = localStorage.getItem('fissurecare_nudge_noon_' + today)
    if (!lastNudge) {
      new Notification('Healing Garden — Hydration Check', {
        body: 'Have you had 8 glasses of water today? Staying hydrated is key to healing.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'hydration-noon',
      })
      localStorage.setItem('fissurecare_nudge_noon_' + today, '1')
    }
  }

  // Evening log reminder at 8pm
  if (hour >= 20 && hour < 22 && !hasLoggedToday) {
    const lastNudge = localStorage.getItem('fissurecare_nudge_evening_' + today)
    if (!lastNudge) {
      new Notification('Healing Garden — Log Your Day', {
        body: 'Take 2 minutes to log today\'s entry and track your healing progress.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'log-evening',
      })
      localStorage.setItem('fissurecare_nudge_evening_' + today, '1')
    }
  }

  // Morning fruit reminder at 9am if not logged
  if (hour >= 9 && hour < 11 && !hasLoggedToday) {
    const lastNudge = localStorage.getItem('fissurecare_nudge_morning_' + today)
    if (!lastNudge) {
      new Notification('Healing Garden — Good Morning', {
        body: 'Start your day with papaya or oats! Fiber-rich foods accelerate healing.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'fruit-morning',
      })
      localStorage.setItem('fissurecare_nudge_morning_' + today, '1')
    }
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [themeId, setThemeId] = useState(getThemeId())

  const theme = themes[themeId] || themes.cherry

  useEffect(() => {
    scheduleHealingReminders()
  }, [])

  const handleThemeChange = (id) => {
    saveThemeId(id)
    setThemeId(id)
  }

  return (
    <div className="min-h-dvh" style={{ background: theme.background, paddingBottom: '80px', transition: 'background 0.5s ease' }}>
      {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} theme={theme} />}
      {activeTab === 'log' && <LogScreen onNavigate={setActiveTab} />}
      {activeTab === 'insights' && <InsightsScreen />}
      {activeTab === 'meds' && <MedsScreen />}
      {activeTab === 'wisdom' && <WisdomScreen theme={theme} />}
      {activeTab === 'settings' && <SettingsScreen theme={theme} themeId={themeId} onThemeChange={handleThemeChange} />}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} theme={theme} />
    </div>
  )
}
