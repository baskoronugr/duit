import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { formatAmount } from '../data/currency'
import { useCollection } from '../data/useCollection'
import { toIdr } from '../data/derive'
import type { Subscription } from '../data/mockData'

export function Subscriptions() {
  const { items } = useCollection<Subscription>('subscription')
  const sorted = [...items].sort((a, b) => a.renewsInDays - b.renewsInDays)
  const monthlyIdr = items.reduce((s, x) => s + toIdr(x.amount, x.currency), 0)

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Subscriptions</div>
        <Link
          to="/add/subscription"
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold"
          style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}
        >
          <Plus size={14} strokeWidth={2.4} /> Add
        </Link>
      </div>

      <div
        className="mt-4 rounded-[24px] p-5 shadow-[0_16px_40px_rgba(251,146,60,0.25)]"
        style={{ background: 'linear-gradient(140deg,#FB923C,#EA7317)' }}
      >
        <div className="text-[12px] font-semibold text-white/85">Monthly subscriptions</div>
        <div className="mt-2 text-[30px] font-extrabold tracking-[-0.5px] tnum text-white">
          ≈ {formatAmount(Math.round(monthlyIdr), 'IDR')}
        </div>
        <div className="mt-1 text-[11px] tnum text-white/80">
          ≈ {formatAmount(Math.round(monthlyIdr * 12), 'IDR')} / year · {items.length} active
        </div>
      </div>

      <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        Upcoming renewals
      </div>
      {sorted.length === 0 && (
        <div className="mt-8 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
          No subscriptions yet.
        </div>
      )}
      <Surface className="mt-2 !px-[18px] !py-1">
        {sorted.map((s, i) => (
          <div
            key={s.id}
            className="flex items-center gap-3 py-3.5"
            style={i < sorted.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
              style={{ background: `${s.color}24`, color: s.color }}
            >
              {s.initial}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{s.name}</div>
              <div className="text-[11px]" style={{ color: s.renewsInDays <= 3 ? '#F59E0B' : 'var(--text-3)' }}>
                renews in {s.renewsInDays} days · {s.owner}
              </div>
            </div>
            <div className="text-[13px] font-semibold tnum">
              {formatAmount(s.amount, s.currency)}
              {s.currency !== 'IDR' && (
                <span className="ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold" style={{ background: 'var(--track)', color: 'var(--text-3)' }}>
                  {s.currency}
                </span>
              )}
            </div>
          </div>
        ))}
      </Surface>
    </Screen>
  )
}
