import { Home, PlusCircle, BarChart2, Pill, Settings } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'log', label: 'Log', Icon: PlusCircle },
  { id: 'insights', label: 'Insights', Icon: BarChart2 },
  { id: 'meds', label: 'Care', Icon: Pill },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function BottomNav({ activeTab, onNavigate }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px', background: '#FFFFFF',
      borderTop: '1px solid #F0E0DA', display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 50, boxShadow: '0 -4px 20px rgba(61,43,43,0.08)'
    }}>
      {tabs.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => onNavigate(id)} style={{
          flex: 1, padding: '10px 4px 8px', border: 'none', background: 'none',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '3px', color: activeTab === id ? '#E8705A' : '#8C7070',
          transition: 'color 0.2s'
        }}>
          <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 1.8} />
          <span style={{ fontSize: '10px', fontWeight: activeTab === id ? 600 : 400 }}>{label}</span>
        </button>
      ))}
    </nav>
  )
}
