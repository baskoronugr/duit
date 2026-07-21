import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Camera, Repeat, MoreHorizontal, ShoppingCart, Coffee, Car, TrendingUp, Wallet, Landmark, CreditCard, BarChart3 } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { ProfileHeader } from '../components/ProfileHeader'
import { OwnerFilter, type Owner } from '../components/OwnerFilter'
import { Carousel } from '../components/Carousel'
import { GradientProgressBar, ProgressBar } from '../components/ProgressBar'
import { DonutRing } from '../components/DonutRing'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatAmount } from '../data/currency'
import { useProfile } from '../theme/ProfileContext'
import { useCollection } from '../data/useCollection'
import { netWorth, monthlySpending, accounts, goals, portfolio, cashOnHand, debtTotal, type Transaction, type Subscription } from '../data/mockData'

function Hidden({ children, revealed }: { children: React.ReactNode; revealed: boolean }) {
  return (
    <span
      style={{
        filter: revealed ? 'none' : 'blur(9px)',
        transition: 'filter .2s',
        userSelect: revealed ? 'auto' : 'none',
      }}
    >
      {children}
    </span>
  )
}

const atRisk = [
  { name: 'Dining', percent: 92, color: '#F59E0B', icon: Coffee, note: null },
  { name: 'Transport', percent: 104, color: '#F87171', icon: Car, note: 'over Rp 120.000' },
]

const quickActions = [
  { label: 'Add', icon: Plus, to: '/add', hero: true },
  { label: 'Scan', icon: Camera, to: '/receipt-scan' },
  { label: 'Transfer', icon: Repeat, to: '/add/transfer' },
  { label: 'More', icon: MoreHorizontal, to: '/more' },
]

export function Dashboard() {
  const [owner, setOwner] = useState<Owner>('All')
  const [revealed, setRevealed] = useState(false)
  const card = accounts.find((a) => a.type === 'credit_card')!
  const trendPoints = monthlySpending.trend
    .map((v, i) => `${(i / (monthlySpending.trend.length - 1)) * 100},${20 - v}`)
    .join(' ')

  return (
    <Screen>
      {/* --- Mobile layout --- */}
      <div className="lg:hidden">
        <ProfileHeader revealed={revealed} onToggleReveal={() => setRevealed((r) => !r)} />
        <OwnerFilter value={owner} onChange={setOwner} />

        <div className="mt-5">
          <HeroCarousel revealed={revealed} />
        </div>

        <div className="mt-5 flex justify-between px-1.5">
          {quickActions.map(({ label, icon: Icon, to, hero }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full border"
                style={
                  hero
                    ? { background: 'linear-gradient(140deg,#B44CF6,#7C3AED)', borderColor: 'transparent' }
                    : { background: 'var(--surface)', borderColor: 'var(--border)' }
                }
              >
                <Icon size={20} strokeWidth={1.8} color={hero ? '#fff' : 'var(--text-2)'} />
              </div>
              <div className="text-[11.5px]" style={{ color: hero ? 'var(--text-2)' : 'var(--text-3)' }}>
                {label}
              </div>
            </Link>
          ))}
        </div>

        <SpendingCard trendPoints={trendPoints} />
        <AtRiskCard />

        {/* Credit card */}
        <Surface className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="text-[14px] font-bold">Credit card</div>
            <div className="text-[11px] font-semibold" style={{ color: '#F59E0B' }}>
              due {card.dueDate}
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>
              {card.name} · {card.masked}
            </div>
            <div className="text-[15px] font-bold tnum" style={{ color: '#F87171' }}>
              {formatAmount(card.balance, card.currency)}
            </div>
          </div>
          <div className="mt-2.5">
            <ProgressBar percent={(Math.abs(card.balance) / card.creditLimit!) * 100} color="#B44CF6" height={6} />
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] tnum" style={{ color: 'var(--text-3)' }}>
            <div>{Math.round((Math.abs(card.balance) / card.creditLimit!) * 100)}% of {formatAmount(card.creditLimit!, card.currency)} limit</div>
            <div>available {formatAmount(card.creditLimit! - Math.abs(card.balance), card.currency)}</div>
          </div>
        </Surface>

        <RenewalsCard />

        <div className="mt-4 flex gap-3">
          {goals.slice(0, 2).map((g) => (
            <Link to="/goals" key={g.id} className="flex-1">
              <Surface className="!p-4">
                <DonutRing percent={Math.round((g.saved / g.target) * 100)} color={g.color} />
                <div className="mt-2.5 text-[12.5px] font-semibold">{g.name}</div>
                <div className="mt-0.5 text-[10.5px]" style={{ color: g.color }}>
                  {g.statusText}
                </div>
              </Surface>
            </Link>
          ))}
        </div>

        <Link to="/investments">
          <Surface className="mt-4 flex items-center gap-3">
            <CategoryIcon icon={TrendingUp} color="#34D399" />
            <div className="flex-1">
              <div className="text-[13px] font-bold">Portfolio</div>
              <div className="text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
                ≈ {formatAmount(portfolio.currentValue, 'IDR')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold tnum" style={{ color: '#34D399' }}>
                +{formatAmount(portfolio.gain, 'IDR')}
              </div>
              <div className="text-[10.5px] tnum" style={{ color: '#34D399' }}>
                ↑ {portfolio.gainPercent}%
              </div>
            </div>
          </Surface>
        </Link>

        <RecentTransactionsCard />

        <Link
          to="/summary"
          className="mt-4 flex items-center gap-3 rounded-[20px] border p-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'rgba(180,76,246,.16)', color: 'var(--accent-link)' }}
          >
            <BarChart3 size={20} strokeWidth={1.9} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-bold">Full financial breakdown</div>
            <div className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
              Every metric in one place — net worth, cash, budgets, goals
            </div>
          </div>
          <div className="text-[18px]" style={{ color: 'var(--text-3)' }}>
            →
          </div>
        </Link>
      </div>

      {/* --- Desktop 3-column reflow --- */}
      <div className="hidden lg:block">
        <DesktopDashboard owner={owner} setOwner={setOwner} trendPoints={trendPoints} card={card} revealed={revealed} />
      </div>
    </Screen>
  )
}

interface HeroSlideProps {
  label: string
  amount: string
  sub: string
  footLabel: string
  badge: string
  gradient: string
  icon: typeof Wallet
  revealed: boolean
}

function HeroSlide({ label, amount, sub, footLabel, badge, gradient, icon: Icon, revealed }: HeroSlideProps) {
  return (
    <div
      className="rounded-[24px] p-5 shadow-[0_16px_40px_rgba(124,58,237,0.28)]"
      style={{ background: gradient }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold text-white/85">{label}</div>
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/20">
          <Icon size={14} strokeWidth={2} color="#fff" />
        </div>
      </div>
      <div className="mt-2.5 text-[32px] font-extrabold tracking-[-0.5px] text-white tnum">
        <Hidden revealed={revealed}>{amount}</Hidden>
      </div>
      <div className="mt-1 text-[11px] tnum text-white/75">{sub}</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-[11.5px] text-white/80">{footLabel}</div>
        <div className="rounded-full px-3.5 py-1.5 text-[11.5px] font-bold tnum" style={{ background: '#F5F5F7', color: '#111114' }}>
          <Hidden revealed={revealed}>{badge}</Hidden>
        </div>
      </div>
    </div>
  )
}

function HeroCarousel({ revealed }: { revealed: boolean }) {
  return (
    <Carousel>
      {[
        <HeroSlide
          key="nw"
          revealed={revealed}
          label="Net worth"
          amount={formatAmount(netWorth.idr, 'IDR')}
          sub={`≈ consolidated in IDR · FX ${netWorth.fxDate}`}
          footLabel="Accounts + investments − debts"
          badge={`↑ ${netWorth.changePercent}% vs Jun`}
          gradient="linear-gradient(140deg,#B44CF6,#7C3AED)"
          icon={TrendingUp}
        />,
        <HeroSlide
          key="cash"
          revealed={revealed}
          label="Cash on hand"
          amount={formatAmount(cashOnHand.idr, 'IDR')}
          sub={`liquid across ${cashOnHand.accountsCount} accounts`}
          footLabel="Banks + e-money + cash"
          badge={`↑ ${cashOnHand.changePercent}% vs Jun`}
          gradient="linear-gradient(140deg,#2DD4BF,#0EA5A0)"
          icon={Landmark}
        />,
        <HeroSlide
          key="port"
          revealed={revealed}
          label="Portfolio"
          amount={`≈ ${formatAmount(portfolio.currentValue, 'IDR')}`}
          sub="gold · stocks · reksadana · crypto"
          footLabel={`+${formatAmount(portfolio.gain, 'IDR')} all-time`}
          badge={`↑ ${portfolio.gainPercent}%`}
          gradient="linear-gradient(140deg,#F6A93B,#EA7317)"
          icon={TrendingUp}
        />,
        <HeroSlide
          key="debt"
          revealed={revealed}
          label="Total owed"
          amount={formatAmount(debtTotal.idr, 'IDR')}
          sub="credit cards + loans"
          footLabel={`next due ${debtTotal.nextDue}`}
          badge="Pay bills"
          gradient="linear-gradient(140deg,#F87171,#DC2626)"
          icon={CreditCard}
        />,
      ]}
    </Carousel>
  )
}

function SpendingCard({ trendPoints }: { trendPoints: string }) {
  return (
    <Surface className="mt-[22px]">
      <div className="flex items-baseline justify-between">
        <div className="text-[14px] font-bold">July spending</div>
        <div className="text-[11.5px] tnum" style={{ color: 'var(--text-3)' }}>
          {monthlySpending.percent}% of budget
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <div className="text-[22px] font-extrabold tnum">{formatAmount(monthlySpending.spent, 'IDR')}</div>
        <div className="text-[12px] tnum" style={{ color: 'var(--text-3)' }}>
          of {formatAmount(monthlySpending.budget, 'IDR')}
        </div>
      </div>
      <div className="mt-3">
        <GradientProgressBar percent={monthlySpending.percent} />
      </div>
      <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
        {monthlySpending.breakdown.map((b) => (
          <div key={b.name} style={{ width: `${b.percent}%`, background: b.color }} />
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2 text-xs">
        {monthlySpending.breakdown.slice(0, 3).map((b) => (
          <div key={b.name} className="flex items-center gap-2">
            <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: b.color }} />
            <div style={{ color: 'var(--text-2)' }}>{b.name}</div>
            <div className="ml-auto font-semibold tnum">{formatAmount(b.amount, 'IDR')}</div>
            <div className="w-[34px] text-right tnum" style={{ color: 'var(--text-3)' }}>
              {b.percent}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex gap-2">
        <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            vs June
          </div>
          <div className="mt-0.5 text-[13px] font-bold tnum" style={{ color: '#34D399' }}>
            ↓ {Math.abs(monthlySpending.vsLastMonthPercent)}%
          </div>
        </div>
        <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            vs Jul 2025
          </div>
          <div className="mt-0.5 text-[13px] font-bold tnum" style={{ color: '#F87171' }}>
            ↑ {monthlySpending.vsLastYearPercent}%
          </div>
        </div>
        <div className="flex-[1.4] rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            6-month trend
          </div>
          <svg width="100%" height="22" viewBox="0 0 100 22" preserveAspectRatio="none" className="mt-1 block">
            <polyline points={trendPoints} fill="none" stroke="#B44CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Surface>
  )
}

function AtRiskCard() {
  return (
    <Surface className="mt-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[14px] font-bold">Budgets at risk</div>
        <Link to="/budgets" className="text-[11.5px]" style={{ color: 'var(--accent-link)' }}>
          All budgets
        </Link>
      </div>
      {atRisk.map((r) => (
        <div key={r.name} className="mt-3 flex items-center gap-3">
          <CategoryIcon icon={r.icon} color={r.color} />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[12.5px]">
              <div className="font-semibold">{r.name}</div>
              <div className="font-bold tnum" style={{ color: r.color }}>
                {r.percent}% {r.note ? `· ${r.note}` : ''}
              </div>
            </div>
            <div className="mt-1.5">
              <ProgressBar percent={r.percent} color={r.color} height={6} />
            </div>
          </div>
        </div>
      ))}
    </Surface>
  )
}

function RenewalsCard() {
  const { items: subs } = useCollection<Subscription>('subscription')
  const subscriptions = [...subs].sort((a, b) => a.renewsInDays - b.renewsInDays)
  return (
    <Surface className="mt-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[14px] font-bold">Upcoming renewals</div>
        <Link to="/subscriptions" className="text-[11.5px]" style={{ color: 'var(--accent-link)' }}>
          All
        </Link>
      </div>
      {subscriptions.slice(0, 2).map((s, i) => (
        <div
          key={s.id}
          className="flex items-center gap-3 py-2.5"
          style={i === 0 ? { borderBottom: '1px solid var(--border)' } : undefined}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: `${s.color}24`, color: s.color }}
          >
            {s.initial}
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">{s.name}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              renews in {s.renewsInDays} days · {s.owner}
            </div>
          </div>
          {s.currency === 'IDR' ? (
            <div className="text-[13px] font-semibold tnum">{formatAmount(s.amount, 'IDR')}</div>
          ) : (
            <div className="text-right">
              <div className="text-[13px] font-semibold tnum">
                {formatAmount(s.amount, s.currency)}{' '}
                <span
                  className="ml-1 rounded px-1 py-0.5 text-[9px] font-bold"
                  style={{ background: 'var(--track)', color: 'var(--text-3)' }}
                >
                  {s.currency}
                </span>
              </div>
              <div className="text-[10px] tnum" style={{ color: 'var(--text-3)' }}>
                ≈ Rp 48.600
              </div>
            </div>
          )}
        </div>
      ))}
    </Surface>
  )
}

function RecentTransactionsCard() {
  const { items } = useCollection<Transaction>('transaction')
  const transactions = [...items].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <Surface className="mt-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[14px] font-bold">Recent transactions</div>
        <Link to="/transactions" className="text-[11.5px]" style={{ color: 'var(--accent-link)' }}>
          View all
        </Link>
      </div>
      {transactions.slice(0, 3).map((t, i) => {
        const icon = t.category === 'Groceries' ? ShoppingCart : t.category === 'Transport' ? Repeat : t.type === 'income' ? TrendingUp : Wallet
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 py-2.5"
            style={i < 2 ? { borderBottom: '1px solid var(--border)' } : undefined}
          >
            <CategoryIcon icon={icon} color={t.categoryColor} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold">{t.merchant}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                {t.account} · <span style={{ color: 'var(--accent-link)' }}>{t.source}</span>
              </div>
            </div>
            <div className="text-[13px] font-semibold tnum" style={{ color: t.amount > 0 ? '#34D399' : '#F87171' }}>
              {t.amount > 0 ? '+' : ''}
              {formatAmount(t.amount, t.currency)}
            </div>
          </div>
        )
      })}
    </Surface>
  )
}

function DesktopDashboard({
  owner,
  setOwner,
  trendPoints,
  revealed,
}: {
  owner: Owner
  setOwner: (o: Owner) => void
  trendPoints: string
  card: (typeof accounts)[number]
  revealed: boolean
}) {
  const { active } = useProfile()
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[34px] font-extrabold tracking-[-0.5px]">Hi, {active}!</div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-3)' }}>
            Let&rsquo;s manage your money.
          </div>
        </div>
        <div className="w-[260px]">
          <OwnerFilter value={owner} onChange={setOwner} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-5">
        <div className="col-span-1 flex flex-col gap-5">
          <HeroCarousel revealed={revealed} />
          <AtRiskCard />
        </div>
        <div className="col-span-1 flex flex-col gap-5">
          <SpendingCard trendPoints={trendPoints} />
        </div>
        <div className="col-span-1 flex flex-col gap-5">
          <RenewalsCard />
          <RecentTransactionsCard />
        </div>
      </div>
    </>
  )
}
