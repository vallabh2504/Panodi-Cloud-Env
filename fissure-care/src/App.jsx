import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { getTheme, getThemeId, saveThemeId, themes } from './lib/themes'
import AuthScreen from './screens/AuthScreen'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import BottomNav from './components/BottomNav'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [themeId, setThemeId] = useState(getThemeId())

  const theme = themes[themeId] || themes.cherry

  const handleThemeChange = (id) => {
    saveThemeId(id)
    setThemeId(id)
  }

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

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: theme.backgroundGradient,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{theme.emoji}</div>
          <p style={{ color: theme.textMuted, fontSize: 14 }}>Loading your garden…</p>
        </div>
      </div>
    )
  }

  if (!session) return <AuthScreen />

  return (
    <div className="min-h-dvh" style={{ background: theme.background, paddingBottom: '80px', transition: 'background 0.5s ease' }}>
      {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} theme={theme} />}
      {activeTab === 'log' && <LogScreen onNavigate={setActiveTab} />}
      {activeTab === 'insights' && <InsightsScreen />}
      {activeTab === 'meds' && <MedsScreen />}
      {activeTab === 'settings' && <SettingsScreen session={session} theme={theme} themeId={themeId} onThemeChange={handleThemeChange} />}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} theme={theme} />
    </div>
  )
}
