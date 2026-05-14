export default function Card({ children, style: extra = {}, padding = '20px', onClick, gradient }) {
  return (
    <div onClick={onClick} style={{
      background: gradient || 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: 'var(--shadow-sm)',
      border: gradient ? 'none' : '1px solid var(--color-border)',
      cursor: onClick ? 'pointer' : 'default',
      ...extra,
    }}>
      {children}
    </div>
  )
}
