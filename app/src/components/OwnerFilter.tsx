const OPTIONS = ['All', 'Bas', 'Tere'] as const
export type Owner = (typeof OPTIONS)[number]

export function OwnerFilter({ value, onChange }: { value: Owner; onChange: (v: Owner) => void }) {
  return (
    <div
      className="mt-4 flex gap-[2px] rounded-full border p-1"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {OPTIONS.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="flex-1 rounded-full py-[9px] text-[12.5px] transition-colors"
            style={
              active
                ? { background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)', fontWeight: 600 }
                : { color: 'var(--text-3)', fontWeight: 500 }
            }
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
