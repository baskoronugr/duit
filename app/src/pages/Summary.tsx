import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, Target, Repeat } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { ProgressBar } from '../components/ProgressBar'
import { formatAmount } from '../data/currency'
import {
  netWorth,
  cashOnHand,
  portfolio,
  debtTotal,
  incomeThisMonth,
  monthlySpending,
  budgetCategories,
  goals,
  subscriptions,
  accounts,
} from '../data/mockData'

const assets = cashOnHand.idr + portfolio.currentValue
const liabilities = debtTotal.idr
const savingsThisMonth = 7_500_000
const netCashFlow = incomeThisMonth.idr - monthlySpending.spent
const subsMonthly = subscriptions.reduce((s, x) => s + (x.currency === 'IDR' ? x.amount : x.amount * 16_250), 0)

const nwTrend = [188, 196, 201, 208, 214, 224] // last 6 months, jt

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
      {children}
    </div>
  )
}

function StatTile({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="flex-1 rounded-[16px] p-3.5" style={{ background: 'var(--surface-2)' }}>
      <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        {label}
      </div>
      <div className="mt-1 text-[15px] font-extrabold tnum" style={{ color: color ?? 'var(--text)' }}>
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-[10px] tnum" style={{ color: 'var(--text-3)' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export function Summary() {
  const budgetTotal = budgetCategories.reduce((s, c) => s + c.budget, 0)
  const budgetSpent = budgetCategories.reduce((s, c) => s + c.spent, 0)
  const goalsSaved = goals.reduce((s, g) => s + g.saved, 0)
  const goalsTarget = goals.reduce((s, g) => s + g.target, 0)
  const maxTrend = Math.max(...nwTrend)
  const minTrend = Math.min(...nwTrend)

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <Link to="/">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </div>
        </Link>
        <div className="text-[16px] font-extrabold">Full breakdown</div>
        <div className="w-11" />
      </div>
      <div className="mt-1 text-center text-[11.5px]" style={{ color: 'var(--text-3)' }}>
        Everything, consolidated to IDR · July 2026
      </div>

      {/* Net worth composition */}
      <SectionTitle>Net worth</SectionTitle>
      <Surface className="mt-2">
        <div className="text-[28px] font-extrabold tracking-[-0.5px] tnum">{formatAmount(netWorth.idr, 'IDR')}</div>
        <div className="mt-1 flex items-center gap-1.5 text-[11.5px]" style={{ color: '#34D399' }}>
          <TrendingUp size={13} strokeWidth={2.2} /> +{netWorth.changePercent}% vs June
        </div>
        {/* asset vs liability bar */}
        <div className="mt-3 flex h-3 overflow-hidden rounded-full" style={{ background: 'var(--track)' }}>
          <div style={{ width: `${(assets / (assets + liabilities)) * 100}%`, background: '#34D399' }} />
          <div style={{ width: `${(liabilities / (assets + liabilities)) * 100}%`, background: '#F87171' }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px]">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: '#34D399' }} /> Assets{' '}
            <span className="font-bold tnum">{formatAmount(assets, 'IDR')}</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: '#F87171' }} /> Debts{' '}
            <span className="font-bold tnum">{formatAmount(liabilities, 'IDR')}</span>
          </div>
        </div>
        {/* trend */}
        <div className="mt-4 flex h-[60px] items-end gap-1.5">
          {nwTrend.map((v, i) => (
            <div key={i} className="flex-1 rounded-t-[5px]" style={{
              height: `${((v - minTrend) / (maxTrend - minTrend)) * 70 + 30}%`,
              background: i === nwTrend.length - 1 ? 'linear-gradient(180deg,#B44CF6,#7C3AED)' : 'var(--track)',
            }} />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[9.5px]" style={{ color: 'var(--text-3)' }}>
          <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
        </div>
      </Surface>

      {/* This month cash flow */}
      <SectionTitle>This month</SectionTitle>
      <div className="mt-2 flex gap-2.5">
        <StatTile label="Income" value={formatAmount(incomeThisMonth.idr, 'IDR')} color="#34D399" />
        <StatTile label="Spending" value={formatAmount(monthlySpending.spent, 'IDR')} color="#F87171" />
        <StatTile label="Saved" value={formatAmount(savingsThisMonth, 'IDR')} color="#B79AF8" />
      </div>
      <Surface className="mt-2.5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: netCashFlow >= 0 ? 'rgba(52,211,153,.14)' : 'rgba(248,113,113,.14)', color: netCashFlow >= 0 ? '#34D399' : '#F87171' }}
        >
          {netCashFlow >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>
        <div className="flex-1">
          <div className="text-[12.5px] font-bold">Net cash flow</div>
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            income − spending this month
          </div>
        </div>
        <div className="text-[15px] font-extrabold tnum" style={{ color: netCashFlow >= 0 ? '#34D399' : '#F87171' }}>
          {netCashFlow >= 0 ? '+' : ''}
          {formatAmount(netCashFlow, 'IDR')}
        </div>
      </Surface>

      {/* Where money is */}
      <SectionTitle>Where the money is</SectionTitle>
      <Surface className="mt-2 !px-[18px] !py-1">
        <BreakdownRow icon={Wallet} color="#34D399" label="Cash & accounts" sub={`${cashOnHand.accountsCount} accounts`} value={formatAmount(cashOnHand.idr, 'IDR')} />
        <BreakdownRow icon={TrendingUp} color="#F6A93B" label="Investments" sub={`+${formatAmount(portfolio.gain, 'IDR')} (${portfolio.gainPercent}%)`} value={formatAmount(portfolio.currentValue, 'IDR')} />
        <BreakdownRow icon={CreditCard} color="#F87171" label="Credit card debt" sub={`due ${debtTotal.nextDue}`} value={`−${formatAmount(debtTotal.idr, 'IDR')}`} valueColor="#F87171" last />
      </Surface>

      {/* Budget adherence */}
      <SectionTitle>Budget adherence</SectionTitle>
      <Surface className="mt-2">
        <div className="flex items-baseline justify-between">
          <div className="text-[13px] font-bold tnum">{formatAmount(budgetSpent, 'IDR')}</div>
          <div className="text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
            of {formatAmount(budgetTotal, 'IDR')}
          </div>
        </div>
        <div className="mt-2">
          <ProgressBar percent={(budgetSpent / budgetTotal) * 100} color="#B44CF6" height={8} />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {budgetCategories.slice(0, 4).map((c) => {
            const pct = Math.round((c.spent / c.budget) * 100)
            const col = pct >= 100 ? '#F87171' : pct >= 80 ? '#F59E0B' : '#34D399'
            return (
              <div key={c.id} className="flex items-center gap-2 text-[11.5px]">
                <div className="w-[70px] shrink-0" style={{ color: 'var(--text-2)' }}>{c.name}</div>
                <div className="flex-1"><ProgressBar percent={pct} color={col} height={5} /></div>
                <div className="w-9 text-right font-bold tnum" style={{ color: col }}>{pct}%</div>
              </div>
            )
          })}
        </div>
        <Link to="/budgets" className="mt-3 block text-[11.5px] font-semibold" style={{ color: 'var(--accent-link)' }}>
          All budgets →
        </Link>
      </Surface>

      {/* Goals + subs */}
      <SectionTitle>Goals &amp; commitments</SectionTitle>
      <div className="mt-2 flex gap-2.5">
        <Surface className="flex-1 !p-4">
          <Target size={18} color="#2DD4BF" />
          <div className="mt-2 text-[10.5px]" style={{ color: 'var(--text-3)' }}>Goals saved</div>
          <div className="text-[15px] font-extrabold tnum">{formatAmount(goalsSaved, 'IDR')}</div>
          <div className="mt-1 text-[10px] tnum" style={{ color: 'var(--text-3)' }}>
            of {formatAmount(goalsTarget, 'IDR')} · {Math.round((goalsSaved / goalsTarget) * 100)}%
          </div>
        </Surface>
        <Surface className="flex-1 !p-4">
          <Repeat size={18} color="#FB923C" />
          <div className="mt-2 text-[10.5px]" style={{ color: 'var(--text-3)' }}>Subscriptions</div>
          <div className="text-[15px] font-extrabold tnum">≈ {formatAmount(Math.round(subsMonthly), 'IDR')}</div>
          <div className="mt-1 text-[10px] tnum" style={{ color: 'var(--text-3)' }}>
            /mo · {subscriptions.length} active
          </div>
        </Surface>
      </div>

      {/* Owner split */}
      <SectionTitle>By owner</SectionTitle>
      <Surface className="mt-2 !px-[18px] !py-1">
        {(['Bas', 'Tere'] as const).map((o, i, arr) => {
          const bal = accounts.filter((a) => a.owner === o && a.type !== 'credit_card').reduce((s, a) => s + (a.currency === 'IDR' ? a.balance : a.balance * 16_250), 0)
          return (
            <BreakdownRow
              key={o}
              icon={PiggyBank}
              color={o === 'Bas' ? '#B44CF6' : '#F472B6'}
              label={o}
              sub="cash across accounts"
              value={`≈ ${formatAmount(Math.round(bal), 'IDR')}`}
              last={i === arr.length - 1}
            />
          )
        })}
      </Surface>

      <div className="mt-6 text-center text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        Figures are illustrative until the backend is connected.
      </div>
    </Screen>
  )
}

function BreakdownRow({
  icon: Icon,
  color,
  label,
  sub,
  value,
  valueColor,
  last,
}: {
  icon: typeof Wallet
  color: string
  label: string
  sub: string
  value: string
  valueColor?: string
  last?: boolean
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={!last ? { borderBottom: '1px solid var(--border)' } : undefined}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}24`, color }}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{label}</div>
        <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{sub}</div>
      </div>
      <div className="text-[13.5px] font-bold tnum" style={{ color: valueColor ?? 'var(--text)' }}>{value}</div>
    </div>
  )
}
