export function SkeletonBlock({ width = '100%', height = 16, radius = 8, style = {} }) {
  return (
    <div className="skeleton" style={{
      width, height, borderRadius: radius,
      ...style,
    }} />
  )
}

export function SkeletonCard({ style = {} }) {
  return (
    <div style={{
      margin: '16px 16px 0', background: '#fff', borderRadius: 22,
      padding: '22px 16px', border: '1px solid #F0E0DA',
      boxShadow: '0 2px 10px rgba(232,112,90,0.06)',
      ...style,
    }}>
      <SkeletonBlock height={14} width="40%" radius={6} style={{ marginBottom: 16 }} />
      <SkeletonBlock height={80} radius={12} style={{ marginBottom: 12 }} />
      <SkeletonBlock height={12} width="70%" radius={6} />
    </div>
  )
}

export function SkeletonHomeScreen() {
  return (
    <div style={{ paddingBottom: 16 }}>
      <div className="skeleton" style={{ height: 180, borderRadius: '0 0 28px 28px', margin: '0 0 20px' }} />
      <SkeletonCard />
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 0', overflowX: 'hidden' }}>
        {[0,1,2,3].map(i => (
          <div key={i} className="skeleton" style={{ minWidth: 82, height: 90, borderRadius: 18, flexShrink: 0 }} />
        ))}
      </div>
      <SkeletonCard />
    </div>
  )
}
