import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { OwnerFilter, type Owner } from '../components/OwnerFilter'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatAmount } from '../data/currency'
import { useCollection } from '../data/useCollection'
import { monthTotals, iconForCategory } from '../data/derive'
import type { Transaction } from '../data/mockData'

const chips = ['July', 'Category', 'Account', 'Type']

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const same = d.toDateString() === today.toDateString()
  const fmt = d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
  return same ? `Today · ${fmt}` : fmt
}

export function Transactions() {
  const [owner, setOwner] = useState<Owner>('All')
  const { items } = useCollection<Transaction>('transaction')

  const filtered = useMemo(
    () => items.filter((t) => owner === 'All' || t.owner === owner),
    [items, owner],
  )

  const totals = useMemo(() => {
    const now = new Date()
    return monthTotals(filtered, now.getFullYear(), now.getMonth())
  }, [filtered])

  const groups = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1))
    const map = new Map<string, Transaction[]>()
    for (const t of sorted) {
      const key = t.date
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    return [...map.entries()].map(([date, rows]) => ({
      date,
      label: dayLabel(date),
      subtotal: rows.reduce((s, r) => s + r.amount, 0),
      rows,
    }))
  }, [filtered])

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Transactions</div>
        <div className="flex gap-2.5">
          {[Search, SlidersHorizontal].map((Icon, i) => (
            <div
              key={i}
              className="flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
            >
              <Icon size={17} strokeWidth={1.8} />
            </div>
          ))}
        </div>
      </div>

      <OwnerFilter value={owner} onChange={setOwner} />

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {chips.map((c, i) => (
          <div
            key={c}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[11.5px]"
            style={
              i === 0
                ? { background: 'rgba(180,76,246,.16)', borderColor: '#B44CF6', fontWeight: 600 }
                : { background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-2)' }
            }
          >
            {c}
            {i === 0 && <X size={12} strokeWidth={2.4} />}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2.5">
        <Surface className="flex-1 !rounded-[18px] !p-3.5">
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            Spent in July
          </div>
          <div className="mt-1 text-[15px] font-extrabold tnum" style={{ color: '#F87171' }}>
            {formatAmount(-totals.spent, 'IDR')}
          </div>
        </Surface>
        <Surface className="flex-1 !rounded-[18px] !p-3.5">
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            Received
          </div>
          <div className="mt-1 text-[15px] font-extrabold tnum" style={{ color: '#34D399' }}>
            +{formatAmount(totals.income, 'IDR')}
          </div>
        </Surface>
      </div>

      {groups.length === 0 && (
        <div className="mt-10 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
          No transactions yet. Tap <b>+</b> to add one.
        </div>
      )}

      {groups.map((g) => (
        <div key={g.date}>
          <div className="mt-5 flex items-baseline justify-between">
            <div className="text-[11.5px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
              {g.label}
            </div>
            <div className="text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
              {g.subtotal >= 0 ? '+' : ''}
              {formatAmount(g.subtotal, 'IDR')}
            </div>
          </div>
          <Surface className="mt-2 !px-[18px] !py-1">
            {g.rows.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center gap-3 py-3"
                style={i < g.rows.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
              >
                <CategoryIcon icon={iconForCategory(t.category)} color={t.categoryColor} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">{t.merchant}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                    {t.category} · {t.account} · <span style={{ color: 'var(--accent-link)' }}>{t.source}</span> · {t.owner}
                  </div>
                </div>
                <div
                  className="text-[13px] font-semibold tnum"
                  style={{ color: t.amount > 0 ? '#34D399' : t.type === 'transfer' ? 'var(--text-2)' : '#F87171' }}
                >
                  {t.amount > 0 ? '+' : ''}
                  {formatAmount(t.amount, t.currency)}
                </div>
              </div>
            ))}
          </Surface>
        </div>
      ))}
    </Screen>
  )
}
