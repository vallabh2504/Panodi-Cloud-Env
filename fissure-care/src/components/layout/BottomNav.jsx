import { Home, PenLine, BarChart2, Pill, Settings } from 'lucide-react'

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
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--color-border)',
      boxShadow: '0 -4px 20px rgba(30,42,120,0.07)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button key={id} onClick={() => onNavigate(id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 2px 12px', background: 'transparent', border: 'none',
              cursor: 'pointer', color: active ? 'var(--color-indigo)' : 'var(--color-text-muted)',
              transition: 'color 0.18s ease', fontFamily: 'var(--font-main)',
              position: 'relative',
            }}>
              {active && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 28, height: 3, borderRadius: '0 0 3px 3px',
                  background: 'var(--gradient-primary)',
                }} />
              )}
              <div style={{
                width: 34, height: 34, borderRadius: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? 'var(--color-surface-soft)' : 'transparent',
                transition: 'background 0.18s ease',
              }}>
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, marginTop: 2 }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
