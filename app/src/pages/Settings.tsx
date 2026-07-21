import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Landmark, CreditCard, Wallet, Layers, Banknote, Check, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { SyncSection } from '../components/SyncSection'
import { formatAmount, type CurrencyCode } from '../data/currency'
import { type Account } from '../data/mockData'
import { listAccounts, putAccount } from '../data/db'
import { useSync } from '../data/SyncContext'

const TYPES: { value: Account['type']; label: string; icon: LucideIcon; color: string }[] = [
  { value: 'bank', label: 'Bank', icon: Landmark, color: '#60A5FA' },
  { value: 'credit_card', label: 'Credit card', icon: CreditCard, color: '#F87171' },
  { value: 'pocket', label: 'Pocket', icon: Layers, color: '#F6CE45' },
  { value: 'emoney', label: 'E-money', icon: Wallet, color: '#34D399' },
  { value: 'cash', label: 'Cash', icon: Banknote, color: '#C9C9D1' },
]

const CURRENCIES: CurrencyCode[] = ['IDR', 'USD', 'JPY', 'SGD', 'CNY']

function typeMeta(t: Account['type']) {
  return TYPES.find((x) => x.value === t) ?? TYPES[0]
}

export function Settings() {
  const { changeTick } = useSync()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [adding, setAdding] = useState(false)

  // form state
  const [type, setType] = useState<Account['type']>('bank')
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('IDR')
  const [owner, setOwner] = useState<'Bas' | 'Tere'>('Bas')
  const [parentId, setParentId] = useState('')

  const banks = accounts.filter((a) => a.type === 'bank')

  async function refresh() {
    const docs = await listAccounts()
    setAccounts(docs.map(({ _id, _rev, docType, ...a }) => { void _id; void _rev; void docType; return a }))
  }

  // Load from the local DB, and refetch whenever a sync change arrives.
  useEffect(() => {
    refresh()
  }, [changeTick])

  async function save() {
    if (!name.trim()) return
    const meta = typeMeta(type)
    const account: Account = {
      id: `${type}-${Date.now()}`,
      name: name.trim(),
      institution: name.trim(),
      masked: '',
      type,
      currency,
      balance: 0,
      owner,
      color: meta.color,
      ...(type === 'pocket' && parentId ? { parentId } : {}),
      ...(type === 'credit_card' ? { creditLimit: 0 } : {}),
    }
    await putAccount(account)
    await refresh()
    setName('')
    setParentId('')
    setAdding(false)
  }

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <Link to="/more">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </div>
        </Link>
        <div className="text-[16px] font-extrabold">Accounts &amp; cards</div>
        <div className="w-11" />
      </div>

      <div className="mt-1.5 text-center text-[12px]" style={{ color: 'var(--text-3)' }}>
        Add and name your banks, cards, pockets and e-money.
      </div>

      <SyncSection />

      {/* existing accounts */}
      <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        Your accounts
      </div>
      <Surface className="mt-2 !px-[18px] !py-1">
        {accounts.map((a, i) => {
          const meta = typeMeta(a.type)
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 py-3"
              style={i < accounts.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
                style={{ background: `${meta.color}24`, color: meta.color }}
              >
                <meta.icon size={18} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">
                  {a.name}
                  {a.currency !== 'IDR' && (
                    <span className="ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold" style={{ background: 'var(--track)', color: 'var(--text-3)' }}>
                      {a.currency}
                    </span>
                  )}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                  {meta.label} · {a.owner}
                  {a.parentId ? ` · under ${accounts.find((p) => p.id === a.parentId)?.name ?? ''}` : ''}
                </div>
              </div>
              <div className="text-[12.5px] font-semibold tnum" style={{ color: 'var(--text-2)' }}>
                {formatAmount(a.balance, a.currency)}
              </div>
            </div>
          )
        })}
      </Surface>

      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed py-3.5 text-[12.5px] font-semibold"
          style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--accent-link)' }}
        >
          <Plus size={15} strokeWidth={2.2} /> Add account / card / pocket
        </button>
      ) : (
        <Surface className="mt-3.5">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold">New account</div>
            <button onClick={() => setAdding(false)} style={{ color: 'var(--text-3)' }}>
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="mt-3 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
            Type
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {TYPES.map((t) => {
              const active = t.value === type
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className="flex flex-col items-center gap-1.5 rounded-[14px] border py-2.5"
                  style={
                    active
                      ? { borderColor: '#B44CF6', background: 'rgba(180,76,246,.12)' }
                      : { borderColor: 'var(--border)', background: 'var(--surface-2)' }
                  }
                >
                  <t.icon size={18} strokeWidth={1.8} color={t.color} />
                  <span className="text-[10.5px] font-semibold">{t.label}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
            Name
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'pocket' ? 'Emergency, Trip Jepang…' : type === 'emoney' ? 'GoPay, OVO, ShopeePay…' : 'BCA Utama, Jenius…'}
            className="mt-2 w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />

          {type === 'pocket' && (
            <>
              <div className="mt-4 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
                Inside which bank
              </div>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="mt-2 w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <option value="">Select a bank…</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="mt-4 flex gap-3">
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
                Currency
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="mt-2 w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
                Owner
              </div>
              <div className="mt-2 flex gap-2">
                {(['Bas', 'Tere'] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOwner(o)}
                    className="flex-1 rounded-[14px] border py-3 text-[13px] font-semibold"
                    style={
                      o === owner
                        ? { borderColor: '#B44CF6', background: 'rgba(180,76,246,.12)', color: 'var(--text)' }
                        : { borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--text-2)' }
                    }
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={save}
            className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
            style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
          >
            <Check size={18} strokeWidth={2.4} /> Add {typeMeta(type).label.toLowerCase()}
          </button>
        </Surface>
      )}
    </Screen>
  )
}
