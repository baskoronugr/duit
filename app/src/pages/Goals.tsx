import { Plus } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { DonutRing } from '../components/DonutRing'
import { formatAmount } from '../data/currency'

const goals = [
  {
    name: 'Trip Jepang',
    weight: 50,
    color: '#B44CF6',
    saved: 23_500_000,
    target: 50_000_000,
    percent: 47,
    status: { text: 'projected Mei 2027 · 2 mo behind target', bg: 'rgba(245,158,11,.14)', color: '#F59E0B' },
    monthlyFlow: 3_750_000,
    targetDate: 'Mar 2027',
    toGo: 'Rp 26,5 jt',
  },
  {
    name: 'Dana Darurat',
    weight: 30,
    color: '#F6CE45',
    saved: 32_200_000,
    target: 50_000_000,
    percent: 64,
    status: { text: 'on track · done Nov 2026', bg: 'rgba(52,211,153,.14)', color: '#34D399' },
  },
  {
    name: 'DP Rumah',
    weight: 20,
    color: '#2DD4BF',
    saved: 24_000_000,
    target: 300_000_000,
    percent: 8,
    status: { text: 'long horizon · projected 2035', bg: 'rgba(255,255,255,.07)', color: '#C9C9D1' },
  },
]

const totalWeight = goals.reduce((s, g) => s + g.weight, 0)

export function Goals() {
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Goals</div>
        <button
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold"
          style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}
        >
          <Plus size={14} strokeWidth={2.4} /> New goal
        </button>
      </div>

      <Surface className="mt-4">
        <div className="flex items-baseline justify-between">
          <div className="text-xs" style={{ color: 'var(--text-3)' }}>
            Saving per month
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            split by weight
          </div>
        </div>
        <div className="mt-1 text-2xl font-extrabold tnum">{formatAmount(7_500_000, 'IDR')}</div>
        <div className="mt-3 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {goals.map((g) => (
            <div
              key={g.name}
              style={{
                width: `${g.weight}%`,
                background: g.color === '#B44CF6' ? 'linear-gradient(90deg,#B44CF6,#7C3AED)' : g.color,
              }}
            />
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-3.5 text-[10.5px]" style={{ color: 'var(--text-3)' }}>
          {goals.map((g) => (
            <div key={g.name} className="flex items-center gap-1.5">
              <div className="h-[7px] w-[7px] rounded-full" style={{ background: g.color }} />
              {g.name} {g.weight}%
            </div>
          ))}
        </div>
      </Surface>

      {goals.map((g) => (
        <Surface className="mt-3.5" key={g.name}>
          <div className="flex items-center gap-3.5">
            <DonutRing percent={g.percent} color={g.color} size={72} stroke={8} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-[15px] font-extrabold">{g.name}</div>
                <div
                  className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tnum"
                  style={{ background: 'rgba(180,76,246,.16)', color: 'var(--accent-link)' }}
                >
                  {g.weight}%
                </div>
              </div>
              <div className="mt-1.5 text-xs tnum" style={{ color: 'var(--text-2)' }}>
                {formatAmount(g.saved, 'IDR')}{' '}
                <span style={{ color: 'var(--text-3)' }}>of {formatAmount(g.target, 'IDR')}</span>
              </div>
              <div
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold"
                style={{ background: g.status.bg, color: g.status.color }}
              >
                {g.status.text}
              </div>
            </div>
          </div>
          {g.monthlyFlow && (
            <div className="mt-3.5 flex gap-2">
              <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
                <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                  monthly flow
                </div>
                <div className="mt-0.5 text-[12.5px] font-bold tnum">{formatAmount(g.monthlyFlow, 'IDR')}</div>
              </div>
              <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
                <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                  target date
                </div>
                <div className="mt-0.5 text-[12.5px] font-bold">{g.targetDate}</div>
              </div>
              <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
                <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                  to go
                </div>
                <div className="mt-0.5 text-[12.5px] font-bold tnum">{g.toGo}</div>
              </div>
            </div>
          )}
        </Surface>
      ))}

      <div
        className="mt-3.5 flex items-center gap-3 rounded-[18px] border px-4 py-3.5"
        style={{ background: 'var(--surface)', borderColor: 'rgba(52,211,153,.3)' }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold tnum"
          style={{ background: 'rgba(52,211,153,.14)', color: '#34D399' }}
        >
          {totalWeight}
        </div>
        <div>
          <div className="text-[12.5px] font-bold">Goal weights total {totalWeight}%</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            every saved rupiah has a destination
          </div>
        </div>
      </div>
    </Screen>
  )
}
