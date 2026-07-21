import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  X,
  ArrowLeft,
  Delete,
  ShoppingCart,
  Coffee,
  Car,
  Zap,
  Gamepad2,
  Heart,
  Home as HomeIcon,
  MoreHorizontal,
  Camera,
} from 'lucide-react'
import { Screen } from '../components/Screen'
import { parseShorthandAmount, formatAmount } from '../data/currency'
import { members, accounts } from '../data/mockData'
import { putTransaction, newId } from '../data/db'
import { useProfile } from '../theme/ProfileContext'

const categories = [
  { name: 'Groceries', icon: ShoppingCart, color: '#2DD4BF' },
  { name: 'Dining', icon: Coffee, color: '#60A5FA' },
  { name: 'Transport', icon: Car, color: '#F472B6' },
  { name: 'Utilities', icon: Zap, color: '#FB923C' },
  { name: 'Fun', icon: Gamepad2, color: '#A78BFA' },
  { name: 'Health', icon: Heart, color: '#F87171' },
  { name: 'Home', icon: HomeIcon, color: '#F6CE45' },
]

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'k', '0', 'back']

export function QuickAdd() {
  const navigate = useNavigate()
  const { active } = useProfile()
  const [raw, setRaw] = useState('45k')
  const [category, setCategory] = useState('Groceries')
  const [account, setAccount] = useState('BCA Utama')
  const [note, setNote] = useState('')

  const parsed = parseShorthandAmount(raw)

  function pressKey(k: string) {
    if (k === 'back') {
      setRaw((r) => r.slice(0, -1))
    } else {
      setRaw((r) => (r + k).slice(0, 10))
    }
  }

  async function save() {
    if (parsed === null || parsed <= 0) return
    const cat = categories.find((c) => c.name === category)
    await putTransaction({
      id: newId('txn'),
      merchant: note.trim() || category,
      category,
      categoryColor: cat?.color ?? '#8E8E99',
      account,
      amount: -parsed,
      currency: 'IDR',
      date: new Date().toISOString().slice(0, 10),
      owner: active,
      source: 'manual',
      type: 'expense',
    })
    navigate('/transactions')
  }

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <Link to="/add">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </div>
        </Link>
        <div className="text-[16px] font-extrabold">Expense</div>
        <Link to="/">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <X size={17} strokeWidth={2} />
          </div>
        </Link>
      </div>

      <div className="mt-6 text-center">
        <div className="text-[13px]" style={{ color: 'var(--text-3)' }}>
          Amount · IDR
        </div>
        <div className="mt-1.5 text-[44px] font-extrabold tracking-[-1px] tnum">
          {parsed !== null ? formatAmount(parsed, 'IDR') : raw || 'Rp 0'}
        </div>
        {parsed !== null && raw && (
          <div
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px]"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-3)' }}
          >
            <span style={{ color: '#F6CE45', fontWeight: 700, fontFamily: 'ui-monospace, Menlo, monospace' }}>
              {raw}
            </span>
            parsed as {formatAmount(parsed, 'IDR')}
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 px-3">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => pressKey(k)}
            className="flex h-14 items-center justify-center rounded-[18px] border text-[20px] font-bold"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: k === 'k' ? '#F6CE45' : k === 'back' ? 'var(--text-2)' : 'var(--text)',
              fontSize: k === 'k' ? 15 : undefined,
            }}
          >
            {k === 'back' ? <Delete size={20} strokeWidth={1.8} /> : k}
          </button>
        ))}
      </div>

      <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        Category
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2.5">
        {categories.map((c) => {
          const active = c.name === category
          return (
            <button key={c.name} onClick={() => setCategory(c.name)} className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
                style={{
                  background: `${c.color}24`,
                  color: c.color,
                  boxShadow: active ? '0 0 0 2px #B44CF6' : undefined,
                }}
              >
                <c.icon size={19} strokeWidth={1.8} />
              </div>
              <div className="text-[10.5px]" style={{ color: active ? 'var(--text)' : 'var(--text-3)', fontWeight: active ? 600 : 400 }}>
                {c.name}
              </div>
            </button>
          )
        })}
        <button className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-3)' }}
          >
            <MoreHorizontal size={18} strokeWidth={1.8} />
          </div>
          <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            More
          </div>
        </button>
      </div>

      <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        From account
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {accounts
          .filter((a) => a.type !== 'pocket')
          .map((a) => {
            const active = a.name === account
            return (
              <button
                key={a.id}
                onClick={() => setAccount(a.name)}
                className="flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-xs font-semibold"
                style={
                  active
                    ? { background: 'rgba(180,76,246,.16)', borderColor: '#B44CF6' }
                    : { background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-2)', fontWeight: 400 }
                }
              >
                {a.name}
                {active && (
                  <span className="tnum" style={{ color: 'var(--accent-link)' }}>
                    {formatAmount(a.balance, a.currency)}
                  </span>
                )}
              </button>
            )
          })}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add note…"
        rows={1}
        className="mt-4 w-full resize-none rounded-[18px] border px-4 py-3.5 text-[13px] outline-none"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />

      <div className="mt-4.5 flex gap-2.5">
        <Link to="/receipt-scan">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text)' }}
          >
            <Camera size={20} strokeWidth={1.8} />
          </div>
        </Link>
        <button
          onClick={save}
          className="flex h-14 flex-1 items-center justify-center rounded-full text-[15px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
          style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
        >
          Save expense
        </button>
      </div>
      <div className="mt-3 text-center text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        Saved &amp; synced to {members.wife.name} · quiet toast, no modal
      </div>
    </Screen>
  )
}
