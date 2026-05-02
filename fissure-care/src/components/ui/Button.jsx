export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, disabled, fullWidth, icon, style: extra = {}
}) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontFamily: 'var(--font-main)', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.18s ease', border: 'none', outline: 'none',
    width: fullWidth ? '100%' : 'auto', opacity: disabled ? 0.6 : 1,
  }
  const sizes = {
    sm:  { padding: '8px 16px',  fontSize: 13, borderRadius: 'var(--radius-sm)' },
    md:  { padding: '14px 24px', fontSize: 15, borderRadius: 'var(--radius-md)' },
    lg:  { padding: '18px 32px', fontSize: 16, borderRadius: 'var(--radius-md)' },
  }
  const variants = {
    primary: { background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 8px 24px rgba(88,101,242,0.35)' },
    secondary: { background: 'var(--color-surface)', color: 'var(--color-indigo)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' },
    ghost: { background: 'transparent', color: 'var(--color-text-secondary)' },
    danger: { background: 'var(--color-soft-danger)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.2)' },
  }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extra }}>
      {icon && icon}
      {children}
    </button>
  )
}
