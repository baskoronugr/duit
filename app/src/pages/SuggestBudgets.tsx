import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, ShoppingCart, Coffee, Car, Zap, Home, Heart, MoreHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatAmount } from '../data/currency'
import { budgetCategories } from '../data/mockData'

const iconMap: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  utensils: Coffee,
  car: Car,
  repeat: Zap,
  home: Home,
  'heart-pulse': Heart,
  'more-horizontal': MoreHorizontal,
}

/** Round up to the nearest Rp 50.000 for tidy suggested budgets. */
function roundBudget(n: number) {
  return Math.ceil(n / 50_000) * 50_000
}

export function SuggestBudgets() {
  const navigate = useNavigate()

  // "3-month average" mocked from current spend + 8% headroom
  const rows = budgetCategories.map((c) => {
    const avg3 = c.spent // pretend this is the 3-month average
    const suggested = roundBudget(avg3 * 1.08)
    return { ...c, avg3, suggested }
  })

  const [accepted, setAccepted] = useState<Record<string, boolean>>(
    Object.fromEntries(rows.map((r) => [r.id, true])),
  )

  const activeRows = rows.filter((r) => accepted[r.id])
  const totalSuggested = activeRows.reduce((s, r) => s + r.suggested, 0)
  // derive weights from suggested shares
  const withWeights = activeRows.map((r) => ({
    ...r,
    weight: totalSuggested ? Math.round((r.suggested / totalSuggested) * 100) : 0,
  }))
  const weightSum = withWeights.reduce((s, r) => s + r.weight, 0)

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <Link to="/budgets">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </div>
        </Link>
        <div className="text-[16px] font-extrabold">Suggested budgets</div>
        <div className="w-11" />
      </div>

      <div
        className="mt-4 flex items-center gap-3 rounded-[20px] border p-4"
        style={{ background: 'var(--surface)', borderColor: 'rgba(180,76,246,.35)' }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
        >
          <Sparkles size={19} strokeWidth={2} color="#fff" />
        </div>
        <div className="text-[12px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
          Based on your <b style={{ color: 'var(--text)' }}>last 3 months</b> of spending, here's a budget per
          category with a little headroom. Toggle any off; weights are derived automatically.
        </div>
      </div>

      <Surface className="mt-4 !px-[18px] !py-1.5">
        {rows.map((r, i) => {
          const Icon = iconMap[r.icon] ?? MoreHorizontal
          const on = accepted[r.id]
          const weight = withWeights.find((w) => w.id === r.id)?.weight ?? 0
          return (
            <div
              key={r.id}
              className="flex items-center gap-3 py-3.5"
              style={i < rows.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
            >
              <CategoryIcon icon={Icon} color={r.color} size={40} />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">{r.name}</div>
                <div className="text-[10.5px] tnum" style={{ color: 'var(--text-3)' }}>
                  avg {formatAmount(r.avg3, 'IDR')}/mo{on && ` · weight ${weight}%`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold tnum" style={{ color: on ? 'var(--text)' : 'var(--text-3)' }}>
                  {formatAmount(r.suggested, 'IDR')}
                </div>
              </div>
              <button
                onClick={() => setAccepted((a) => ({ ...a, [r.id]: !a[r.id] }))}
                className="flex h-6 w-11 items-center rounded-full p-0.5 transition-colors"
                style={{ background: on ? '#7C3AED' : 'var(--track)' }}
                aria-label={`Toggle ${r.name}`}
              >
                <div
                  className="h-5 w-5 rounded-full bg-white transition-transform"
                  style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          )
        })}
      </Surface>

      <div
        className="mt-4 flex items-center justify-between rounded-[18px] p-4"
        style={{ background: 'var(--surface-2)' }}
      >
        <div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            Total monthly budget
          </div>
          <div className="text-[18px] font-extrabold tnum">{formatAmount(totalSuggested, 'IDR')}</div>
        </div>
        <div
          className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum"
          style={{ background: weightSum === 100 ? 'rgba(52,211,153,.14)' : 'rgba(245,158,11,.14)', color: weightSum === 100 ? '#34D399' : '#F59E0B' }}
        >
          weights {weightSum}%
        </div>
      </div>

      <button
        onClick={() => navigate('/budgets')}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-full text-[15px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
        style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
      >
        Apply {activeRows.length} budgets
      </button>
      <div className="mt-2.5 text-center text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        you can fine-tune any category afterwards
      </div>
    </Screen>
  )
}
