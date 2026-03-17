import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import LogScreen from './screens/LogScreen'
import InsightsScreen from './screens/InsightsScreen'
import MedsScreen from './screens/MedsScreen'
import SettingsScreen from './screens/SettingsScreen'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-dvh" style={{ background: '#FFF8F5', paddingBottom: '80px' }}>
      {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
      {activeTab === 'log' && <LogScreen onNavigate={setActiveTab} />}
      {activeTab === 'insights' && <InsightsScreen />}
      {activeTab === 'meds' && <MedsScreen />}
      {activeTab === 'settings' && <SettingsScreen />}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
