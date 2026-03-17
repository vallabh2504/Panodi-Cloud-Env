import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
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
        background: 'linear-gradient(160deg, #FFF0EB 0%, #FFF8F0 45%, #F0F8EE 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <p style={{ color: '#8C7070', fontSize: 14 }}>Loading your garden…</p>
        </div>
      </div>
    )
  }

  if (!session) return <AuthScreen />

  return (
    <div className="min-h-dvh" style={{ background: '#FFF8F5', paddingBottom: '80px' }}>
      {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
      {activeTab === 'log' && <LogScreen onNavigate={setActiveTab} />}
      {activeTab === 'insights' && <InsightsScreen />}
      {activeTab === 'meds' && <MedsScreen />}
      {activeTab === 'settings' && <SettingsScreen session={session} />}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
