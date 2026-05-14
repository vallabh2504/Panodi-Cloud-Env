export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
      {options.map(opt => {
        const selected = opt.value === value
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            flex: 1, padding: '9px 4px', borderRadius: 8, border: 'none',
            background: selected ? 'var(--color-surface)' : 'transparent',
            color: selected ? 'var(--color-indigo)' : 'var(--color-text-muted)',
            fontWeight: selected ? 600 : 500, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.15s ease', boxShadow: selected ? 'var(--shadow-sm)' : 'none',
            fontFamily: 'var(--font-main)', whiteSpace: 'nowrap',
          }}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
