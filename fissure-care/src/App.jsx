import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Leaf } from 'lucide-react'
import AuthScreen from './screens/AuthScreen'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import BottomNav from './components/layout/BottomNav'

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', fontFamily: 'var(--font-main)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 22,
        background: 'rgba(255,255,255,0.14)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Leaf size={36} color="#fff" strokeWidth={1.8} />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, letterSpacing: '0.02em' }}>
        Loading CareNest…
      </p>
    </div>
  )
}

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

  if (loading) return <LoadingScreen />
  if (!session) return <AuthScreen />

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingBottom: 80 }}>
      {activeTab === 'home'     && <HomeScreen     onNavigate={setActiveTab} />}
      {activeTab === 'log'      && <LogScreen      onNavigate={setActiveTab} />}
      {activeTab === 'insights' && <InsightsScreen />}
      {activeTab === 'meds'     && <MedsScreen />}
      {activeTab === 'settings' && <SettingsScreen session={session} />}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
