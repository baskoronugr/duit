import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Screen } from './Screen'

export function AddShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <Link to="/add">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </div>
        </Link>
        <div className="text-[16px] font-extrabold">{title}</div>
        <div className="w-11" />
      </div>
      {children}
    </Screen>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
      {children}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-2.5 w-full rounded-[16px] border px-4 py-3.5 text-[14px] outline-none"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

export function Pills({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className="rounded-full border px-3.5 py-2.5 text-xs font-semibold"
            style={
              active
                ? { background: 'rgba(180,76,246,.16)', borderColor: '#B44CF6', color: 'var(--text)' }
                : { background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-2)', fontWeight: 400 }
            }
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function OwnerToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Pills options={['Bas', 'Tere']} value={value} onChange={onChange} />
}

export function SaveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-7 flex h-14 w-full items-center justify-center rounded-full text-[15px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
      style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
    >
      {label}
    </button>
  )
}
