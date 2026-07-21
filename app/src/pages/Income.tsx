import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Repeat } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatAmount } from '../data/currency'
import { useCollection } from '../data/useCollection'
import { toIdr } from '../data/derive'
import type { IncomeEntry } from '../data/mockData'

export function Income() {
  const { items: incomeEntries } = useCollection<IncomeEntry>('income')
  const totalIdr = incomeEntries.reduce((s, i) => s + toIdr(i.amount, i.currency), 0)
  const salary = incomeEntries.filter((i) => i.kind === 'Salary').reduce((s, i) => s + toIdr(i.amount, i.currency), 0)
  const other = totalIdr - salary
  const incomeThisMonth = { idr: totalIdr }

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Income</div>
        <Link
          to="/add/income"
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold"
          style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}
        >
          <Plus size={14} strokeWidth={2.4} /> Add income
        </Link>
      </div>

      <div
        className="mt-4 rounded-[24px] p-5 shadow-[0_16px_40px_rgba(52,211,153,0.28)]"
        style={{ background: 'linear-gradient(140deg,#34D399,#0EA5A0)' }}
      >
        <div className="text-[12px] font-semibold text-white/85">Income this month</div>
        <div className="mt-2 text-[30px] font-extrabold tracking-[-0.5px] tnum text-white">
          {formatAmount(incomeThisMonth.idr, 'IDR')}
        </div>
        <div className="mt-3.5 flex gap-2">
          <div className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum" style={{ background: 'rgba(0,0,0,.18)', color: '#fff' }}>
            Salary {formatAmount(salary, 'IDR')}
          </div>
          <div className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum" style={{ background: '#F5F5F7', color: '#111114' }}>
            Other {formatAmount(other, 'IDR')}
          </div>
        </div>
      </div>

      <Link
        to="/goals"
        className="mt-3.5 flex items-center gap-3 rounded-[18px] border p-4"
        style={{ background: 'var(--surface)', borderColor: 'rgba(180,76,246,.35)' }}
      >
        <div className="flex-1">
          <div className="text-[13px] font-bold">Save 20% of this?</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            Suggested {formatAmount(Math.round(incomeThisMonth.idr * 0.2), 'IDR')} → your goals
          </div>
        </div>
        <div className="rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}>
          Review
        </div>
      </Link>

      <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        This month
      </div>
      <Surface className="mt-2 !px-[18px] !py-1">
        {incomeEntries.map((i, idx) => (
          <div
            key={i.id}
            className="flex items-center gap-3 py-3.5"
            style={idx < incomeEntries.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
          >
            <CategoryIcon icon={TrendingUp} color="#34D399" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                {i.source}
                {i.recurring && <Repeat size={12} strokeWidth={2} color="var(--text-3)" />}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                {i.kind} · {i.account} · {i.owner}
              </div>
            </div>
            <div className="text-[13px] font-bold tnum" style={{ color: '#34D399' }}>
              +{formatAmount(i.amount, i.currency)}
            </div>
          </div>
        ))}
      </Surface>
    </Screen>
  )
}
