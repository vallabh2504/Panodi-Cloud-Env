export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding: '20px 20px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>{subtitle}</p>
        )}
      </div>
      {action && action}
    </div>
  )
}
