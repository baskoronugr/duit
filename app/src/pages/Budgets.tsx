import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Plus, ShoppingCart, Coffee, Car, Zap, Home, Heart, MoreHorizontal, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { ProgressBar } from '../components/ProgressBar'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatAmount } from '../data/currency'
import { useCollection } from '../data/useCollection'
import type { BudgetCategory } from '../data/mockData'

const MONTHS = ['Apr 2026', 'May 2026', 'Jun 2026', 'July', 'Aug 2026']

const iconMap: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  utensils: Coffee,
  car: Car,
  repeat: Zap,
  home: Home,
  'heart-pulse': Heart,
  'more-horizontal': MoreHorizontal,
}

function statusColor(percent: number) {
  if (percent >= 100) return '#F87171'
  if (percent >= 80) return '#F59E0B'
  return '#34D399'
}

export function Budgets() {
  const { items: budgetCategories } = useCollection<BudgetCategory>('budget')
  const totalWeight = budgetCategories.reduce((s, c) => s + c.weight, 0)
  const balanced = totalWeight === 100
  const [month, setMonth] = useState('July')
  const [monthOpen, setMonthOpen] = useState(false)
  const monthlySpending = {
    spent: budgetCategories.reduce((s, c) => s + c.spent, 0),
    budget: budgetCategories.reduce((s, c) => s + c.budget, 0),
    percent: 0,
  }
  monthlySpending.percent = monthlySpending.budget
    ? Math.round((monthlySpending.spent / monthlySpending.budget) * 100)
    : 0

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Budgets</div>
        <div className="relative">
          <button
            onClick={() => setMonthOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-xs font-semibold"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            {month} <ChevronDown size={13} strokeWidth={2} />
          </button>
          {monthOpen && (
            <div
              className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-[16px] border shadow-lg"
              style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)' }}
            >
              {MONTHS.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMonth(m)
                    setMonthOpen(false)
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[12.5px]"
                  style={{ color: m === month ? 'var(--text)' : 'var(--text-2)', fontWeight: m === month ? 700 : 400 }}
                >
                  {m}
                  {m === month && <Check size={14} strokeWidth={2.4} color="var(--accent-link)" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="mt-4 rounded-[24px] p-[18px] shadow-[0_14px_36px_rgba(124,58,237,0.3)]"
        style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
      >
        <div className="flex items-baseline justify-between">
          <div className="text-xs font-semibold text-white/85">Monthly envelope</div>
          <div className="text-[11px] tnum text-white/75">12 days left</div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-[26px] font-extrabold tnum text-white">{formatAmount(monthlySpending.spent, 'IDR')}</div>
          <div className="text-xs tnum text-white/75">of {formatAmount(monthlySpending.budget, 'IDR')}</div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/25">
          <div className="h-full rounded-full bg-[#F5F5F7]" style={{ width: `${monthlySpending.percent}%` }} />
        </div>
        <div className="mt-2 text-[11px] tnum text-white/80">
          {monthlySpending.percent}% used · on pace for Rp 17,3 jt · under budget
        </div>
      </div>

      <div
        className="mt-3.5 flex items-center gap-3 rounded-[18px] border px-4 py-3.5"
        style={{ background: 'var(--surface)', borderColor: balanced ? 'rgba(52,211,153,.3)' : 'rgba(248,113,113,.3)' }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold tnum"
          style={{ background: balanced ? 'rgba(52,211,153,.14)' : 'rgba(248,113,113,.14)', color: balanced ? '#34D399' : '#F87171' }}
        >
          {totalWeight}
        </div>
        <div className="flex-1">
          <div className="text-[12.5px] font-bold">Weights total {totalWeight}%</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            {balanced ? 'balanced — you can save changes' : 'adjust weights to reach 100% before saving'}
          </div>
        </div>
        <div className="h-1.5 w-[90px] shrink-0 overflow-hidden rounded-full" style={{ background: 'var(--track)' }}>
          <div
            className="h-full"
            style={{ width: `${Math.min(100, totalWeight)}%`, background: balanced ? '#34D399' : '#F87171' }}
          />
        </div>
      </div>

      <Surface className="mt-4 !px-[18px] !py-1.5">
        {budgetCategories.map((c, i) => {
          const percent = Math.round((c.spent / c.budget) * 100)
          const color = statusColor(percent)
          const Icon = iconMap[c.icon] ?? MoreHorizontal
          const over = c.spent > c.budget
          return (
            <div
              key={c.id}
              className="flex items-center gap-3 py-3.5"
              style={i < budgetCategories.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
            >
              <CategoryIcon icon={Icon} color={c.color} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-[13.5px] font-bold">{c.name}</div>
                  <div
                    className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tnum"
                    style={{ background: 'rgba(180,76,246,.16)', color: 'var(--accent-link)' }}
                  >
                    {c.weight}%
                  </div>
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={percent} color={color} height={6} />
                </div>
                <div className="mt-1 text-[10.5px] tnum" style={{ color: over ? '#F87171' : 'var(--text-3)' }}>
                  {over && `over by ${formatAmount(c.spent - c.budget, 'IDR')} · `}
                  {formatAmount(c.spent, 'IDR')} of {formatAmount(c.budget, 'IDR')}
                </div>
              </div>
              <div className="text-xs font-bold tnum" style={{ color }}>
                {percent}%
              </div>
            </div>
          )
        })}
      </Surface>

      <Link
        to="/add/budget"
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed py-3.5 text-[12.5px] font-semibold"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--accent-link)' }}
      >
        <Plus size={15} strokeWidth={2.2} /> Add category budget
      </Link>
    </Screen>
  )
}
