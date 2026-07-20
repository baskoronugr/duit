import { useState } from 'react'
import { Search, SlidersHorizontal, X, ShoppingCart, Coffee, TrendingUp, Repeat, Zap, Car } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { OwnerFilter, type Owner } from '../components/OwnerFilter'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatAmount } from '../data/currency'

interface Row {
  merchant: string
  detail: string
  amount: string
  amountColor: string
  icon: LucideIcon
  color: string
  fx?: string
}

const groups: { label: string; total: string; rows: Row[] }[] = [
  {
    label: 'Today · Sat 19 Jul',
    total: '−Rp 225.500',
    rows: [
      { merchant: 'Superindo', detail: 'Groceries · BCA Utama · scan · Bas', amount: '−Rp 187.500', amountColor: '#F87171', icon: ShoppingCart, color: '#2DD4BF' },
      { merchant: 'Kopi Kenangan', detail: 'Dining · GoPay · telegram · Tere', amount: '−Rp 38.000', amountColor: '#F87171', icon: Coffee, color: '#60A5FA' },
    ],
  },
  {
    label: 'Fri 18 Jul',
    total: '+Rp 28.148.200',
    rows: [
      { merchant: 'Salary', detail: 'Income · BCA Utama · Bas', amount: '+Rp 28.500.000', amountColor: '#34D399', icon: TrendingUp, color: '#34D399' },
      { merchant: 'To Darurat pocket', detail: 'Transfer · BCA → Darurat · Bas', amount: 'Rp 3.000.000', amountColor: 'var(--text-2)', icon: Repeat, color: '#A78BFA' },
      { merchant: 'Ichiran Ramen', detail: 'Dining · Jenius · Tere', amount: '−¥2.180', amountColor: '#F87171', icon: Coffee, color: '#60A5FA', fx: '≈ Rp 231.800' },
    ],
  },
  {
    label: 'Thu 17 Jul',
    total: '−Rp 1.494.000',
    rows: [
      { merchant: 'PLN Token', detail: 'Utilities · BCA Utama · Bas', amount: '−Rp 502.000', amountColor: '#F87171', icon: Zap, color: '#FB923C' },
      { merchant: 'Grab · airport', detail: 'Transport · BCA Visa · Bas', amount: '−Rp 992.000', amountColor: '#F87171', icon: Car, color: '#F472B6' },
    ],
  },
]

const chips = ['July', 'Category', 'Account', 'Type']

export function Transactions() {
  const [owner, setOwner] = useState<Owner>('All')

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Transactions</div>
        <div className="flex gap-2.5">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <Search size={17} strokeWidth={1.8} />
          </div>
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <SlidersHorizontal size={17} strokeWidth={1.8} />
          </div>
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
            {formatAmount(-11_240_000, 'IDR')}
          </div>
        </Surface>
        <Surface className="flex-1 !rounded-[18px] !p-3.5">
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            Received
          </div>
          <div className="mt-1 text-[15px] font-extrabold tnum" style={{ color: '#34D399' }}>
            +{formatAmount(41_300_000, 'IDR')}
          </div>
        </Surface>
      </div>

      {groups.map((g) => (
        <div key={g.label}>
          <div className="mt-5 flex items-baseline justify-between">
            <div className="text-[11.5px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
              {g.label}
            </div>
            <div className="text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
              {g.total}
            </div>
          </div>
          <Surface className="mt-2 !px-[18px] !py-1">
            {g.rows.map((r, i) => (
              <div
                key={r.merchant}
                className="flex items-center gap-3 py-3"
                style={i < g.rows.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
              >
                <CategoryIcon icon={r.icon} color={r.color} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">{r.merchant}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                    {r.detail}
                  </div>
                </div>
                <div className={r.fx ? 'text-right' : ''}>
                  <div className="text-[13px] font-semibold tnum" style={{ color: r.amountColor }}>
                    {r.amount}
                  </div>
                  {r.fx && (
                    <div className="text-[10px] tnum" style={{ color: 'var(--text-3)' }}>
                      {r.fx}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Surface>
        </div>
      ))}
    </Screen>
  )
}
