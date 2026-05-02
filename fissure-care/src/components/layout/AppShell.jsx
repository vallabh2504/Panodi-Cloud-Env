export default function AppShell({ children }) {
  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      minHeight: '100dvh',
      background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {children}
    </div>
  )
}
