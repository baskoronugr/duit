import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, CreditCard as CardIcon } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { OwnerFilter, type Owner } from '../components/OwnerFilter'
import { ProgressBar } from '../components/ProgressBar'
import { formatAmount } from '../data/currency'
import { accounts } from '../data/mockData'

const stackCards = [
  { name: 'Jenius', masked: '**** 8843', tag: 'USD', bg: '#26262D', ink: '#C9C9D1', top: 0, z: 1 },
  { name: 'Bank Jago', masked: '**** 5087', tag: null, bg: '#F6CE45', ink: '#191400', top: 34, z: 2 },
]

export function Accounts() {
  const [owner, setOwner] = useState<Owner>('All')
  const [fanned, setFanned] = useState(false)
  const bca = accounts.find((a) => a.id === 'bca-utama')!
  const bcaEmergency = accounts.find((a) => a.id === 'bca-emergency')!
  const card = accounts.find((a) => a.type === 'credit_card')!

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Accounts</div>
        <button
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold"
          style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}
        >
          <Plus size={14} strokeWidth={2.4} /> Add account
        </button>
      </div>

      <OwnerFilter value={owner} onChange={setOwner} />

      <div className="mt-[18px]">
        <div className="text-xs" style={{ color: 'var(--text-3)' }}>
          Total money
        </div>
        <div className="mt-1 text-[28px] font-extrabold tracking-[-0.5px] tnum">≈ {formatAmount(154_520_000, 'IDR')}</div>
        <div className="mt-0.5 text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
          IDR + USD consolidated · FX 18 Jul 2026
        </div>
      </div>

      {/* Card stack */}
      <button
        onClick={() => setFanned((f) => !f)}
        className="relative mt-[18px] block w-full text-left"
        style={{ height: fanned ? 420 : 250 }}
      >
        {stackCards.map((c, i) => (
          <div
            key={c.name}
            className="absolute rounded-[24px] px-[18px] py-3.5 text-[12.5px] font-bold transition-all duration-300"
            style={{
              left: fanned ? 12 : i === 0 ? 24 : 12,
              right: fanned ? 12 : i === 0 ? 24 : 12,
              top: fanned ? i * 100 : c.top,
              height: 180,
              background: c.bg,
              color: c.ink,
              zIndex: c.z,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{c.name}</span>
            <span className="tnum tracking-[1.5px]">
              {c.masked}
              {c.tag && (
                <span
                  className="ml-1.5 rounded px-1 py-0.5 text-[9px] tracking-normal"
                  style={{ background: 'rgba(255,255,255,.1)' }}
                >
                  {c.tag}
                </span>
              )}
            </span>
          </div>
        ))}
        <div
          className="absolute rounded-[24px] p-5 shadow-[0_18px_44px_rgba(124,58,237,0.4)] transition-all duration-300"
          style={{
            left: 0,
            right: 0,
            top: fanned ? 200 : 70,
            height: 180,
            background: 'linear-gradient(140deg,#B44CF6,#7C3AED)',
            zIndex: 3,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white">BCA</div>
            <div className="text-[13px] font-semibold tracking-[2px] tnum text-white/90">**** 4482</div>
          </div>
          <div className="mt-5.5 text-[11.5px] text-white/75">Balance</div>
          <div className="mt-0.5 text-[28px] font-extrabold tnum text-white">{formatAmount(bca.balance, 'IDR')}</div>
          <div className="mt-3.5 flex items-center justify-between">
            <div className="text-[11.5px] text-white/80">Adit · Joint use</div>
            <div className="flex">
              <div className="h-6 w-6 rounded-full bg-white/90" />
              <div className="-ml-2.5 h-6 w-6 rounded-full bg-black/45" />
            </div>
          </div>
        </div>
      </button>
      <div className="mt-2.5 text-center text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        tap the stack to fan · swipe to switch card
      </div>

      {/* Money map */}
      <Surface className="mt-[18px] !px-[18px] !py-1.5">
        <MoneyMapRow initial="B" color="#B79AF8" bg="rgba(180,76,246,.16)" name="BCA" sub="2 pockets" amount={formatAmount(bca.balance, 'IDR')} expandable />
        <PocketRow name="Utama" sub="daily spending" amount={formatAmount(bca.balance - bcaEmergency.balance, 'IDR')} />
        <PocketRow name="Darurat" sub="locked pocket" amount={formatAmount(bcaEmergency.balance, 'IDR')} last />
        <MoneyMapRow initial="J" color="#F6CE45" bg="rgba(246,206,69,.14)" name="Bank Jago" sub="Nadia" amount="Rp 21.750.000" expandable chevron="right" />
        <MoneyMapRow
          initial="Jn"
          color="#60A5FA"
          bg="rgba(96,165,250,.14)"
          name="Jenius"
          tag="USD"
          sub="Adit"
          amount="$2.850,00"
          subAmount="≈ Rp 46.312.500"
        />
        <MoneyMapRow initial="G" color="#34D399" bg="rgba(52,211,153,.14)" name="GoPay" sub="e-money · Joint" amount="Rp 745.000" />
        <MoneyMapRow initial="C" color="#C9C9D1" bg="rgba(255,255,255,.07)" name="Cash" sub="wallet drawer" amount="Rp 1.200.000" last />
      </Surface>

      {/* Credit card */}
      <div className="mt-4 text-xs font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        Credit cards
      </div>
      <Surface className="mt-2.5" style={{ borderColor: 'rgba(248,113,113,.25)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
              style={{ background: 'rgba(248,113,113,.14)', color: '#F87171' }}
            >
              <CardIcon size={17} strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[13.5px] font-bold">{card.name}</div>
              <div className="text-[11px] tracking-[1px] tnum" style={{ color: 'var(--text-3)' }}>
                {card.masked}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
              owed
            </div>
            <div className="text-[15px] font-extrabold tnum" style={{ color: '#F87171' }}>
              {formatAmount(Math.abs(card.balance), 'IDR')}
            </div>
          </div>
        </div>
        <div className="mt-3.5">
          <ProgressBar percent={(Math.abs(card.balance) / card.creditLimit!) * 100} color="#B44CF6" height={6} />
        </div>
        <div className="mt-[7px] flex justify-between text-[10.5px] tnum" style={{ color: 'var(--text-3)' }}>
          <div>{Math.round((Math.abs(card.balance) / card.creditLimit!) * 100)}% of {formatAmount(card.creditLimit!, 'IDR')} limit</div>
          <div>available {formatAmount(card.creditLimit! - Math.abs(card.balance), 'IDR')}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold"
            style={{ background: 'rgba(245,158,11,.14)', color: '#F59E0B' }}
          >
            due {card.dueDate} · 17 days
          </div>
          <button className="rounded-full px-3.5 py-2 text-[11.5px] font-bold" style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}>
            Pay bill
          </button>
        </div>
      </Surface>

      <div className="mt-3.5 text-center text-[11px]" style={{ color: 'var(--text-3)' }}>
        2 archived accounts hidden · <span style={{ color: 'var(--accent-link)' }}>show</span>
      </div>
    </Screen>
  )
}

function MoneyMapRow({
  initial,
  color,
  bg,
  name,
  sub,
  tag,
  amount,
  subAmount,
  expandable,
  last,
  chevron = 'down',
}: {
  initial: string
  color: string
  bg: string
  name: string
  sub: string
  tag?: string
  amount: string
  subAmount?: string
  expandable?: boolean
  last?: boolean
  chevron?: 'down' | 'right'
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={!last ? { borderBottom: '1px solid var(--border)' } : undefined}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-xs font-extrabold"
        style={{ background: bg, color }}
      >
        {initial}
      </div>
      <div className="flex-1">
        <div className="text-[13.5px] font-bold">
          {name}
          {tag && (
            <span
              className="ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold"
              style={{ background: 'var(--track)', color: 'var(--text-3)' }}
            >
              {tag}
            </span>
          )}
        </div>
        <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
          {sub}
        </div>
      </div>
      <div className={subAmount ? 'text-right' : ''}>
        <div className="text-[13.5px] font-bold tnum">{amount}</div>
        {subAmount && (
          <div className="text-[10px] tnum" style={{ color: 'var(--text-3)' }}>
            {subAmount}
          </div>
        )}
      </div>
      {expandable && (chevron === 'down' ? <ChevronDown size={16} color="var(--text-3)" /> : <ChevronRight size={16} color="var(--text-3)" />)}
    </div>
  )
}

function PocketRow({ name, sub, amount, last }: { name: string; sub: string; amount: string; last?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 py-2.5 pl-[22px]"
      style={!last ? { borderBottom: '1px solid var(--border)' } : undefined}
    >
      <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#3A3A44' }} />
      <div className="flex-1">
        <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text-2)' }}>
          {name}
        </div>
        <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
          {sub}
        </div>
      </div>
      <div className="text-[12.5px] font-semibold tnum" style={{ color: 'var(--text-2)' }}>
        {amount}
      </div>
    </div>
  )
}
