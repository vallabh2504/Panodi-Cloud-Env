import { X } from 'lucide-react'

export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,26,58,0.5)',
        zIndex: 100, backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        padding: '0 20px 48px',
        zIndex: 101,
        maxHeight: '88vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-border-strong)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 20px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'var(--color-surface-soft)', border: 'none',
            borderRadius: 8, padding: '6px', cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
