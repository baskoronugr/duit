import { useState } from 'react'
import { ChevronDown, Check, Eye, EyeOff } from 'lucide-react'
import { useProfile, type ActiveMember } from '../theme/ProfileContext'

/**
 * Dashboard header. Replaces the old avatar + bell circles. The name is tappable
 * to switch who is currently using the app (Bas / Tere), which sets the default
 * owner for anything they add. Also hosts the privacy (blur) toggle.
 */
export function ProfileHeader({
  revealed,
  onToggleReveal,
}: {
  revealed: boolean
  onToggleReveal: () => void
}) {
  const { active, setActive } = useProfile()
  const [open, setOpen] = useState(false)

  function choose(m: ActiveMember) {
    setActive(m)
    setOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-start justify-between">
        <button onClick={() => setOpen((o) => !o)} className="text-left">
          <div className="flex items-center gap-1.5">
            <div className="text-[30px] font-extrabold tracking-[-0.5px]">Hi, {active}!</div>
            <ChevronDown size={20} strokeWidth={2.4} color="var(--text-3)" />
          </div>
          <div className="mt-0.5 text-[12.5px]" style={{ color: 'var(--text-3)' }}>
            Not {active}? Tap your name to switch who's logging.
          </div>
        </button>

        <button
          onClick={onToggleReveal}
          aria-label={revealed ? 'Hide amounts' : 'Show amounts'}
          className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
        >
          {revealed ? <Eye size={18} strokeWidth={1.8} /> : <EyeOff size={18} strokeWidth={1.8} />}
        </button>
      </div>

      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="absolute left-0 top-[58px] z-20 w-[230px] overflow-hidden rounded-[18px] border shadow-xl"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)' }}
          >
            <div className="px-4 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
              Who's using Duit?
            </div>
            {(['Bas', 'Tere'] as ActiveMember[]).map((m) => (
              <button
                key={m}
                onClick={() => choose(m)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: m === 'Bas' ? 'linear-gradient(140deg,#B44CF6,#7C3AED)' : 'linear-gradient(140deg,#F472B6,#DB2777)' }}
                >
                  {m[0]}
                </div>
                <div className="flex-1 text-[14px] font-semibold">{m}</div>
                {active === m && <Check size={16} strokeWidth={2.6} color="var(--accent-link)" />}
              </button>
            ))}
            <div className="px-4 pb-3 pt-1 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
              New entries default to this person. You both see everything — this just tags who logged it.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
