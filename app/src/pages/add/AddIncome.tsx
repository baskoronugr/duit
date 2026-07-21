import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddShell, FieldLabel, Pills, OwnerToggle, SaveButton } from '../../components/AddShell'
import { parseShorthandAmount, formatAmount } from '../../data/currency'
import { putIncome, putTransaction, newId } from '../../data/db'
import { useProfile } from '../../theme/ProfileContext'
import type { IncomeEntry } from '../../data/mockData'

const sources = ['Salary', 'Bonus', 'Freelance', 'Gift', 'Other']
const accounts = ['BCA Utama', 'Jenius', 'GoPay', 'Cash']

export function AddIncome() {
  const navigate = useNavigate()
  const { active } = useProfile()
  const [amount, setAmount] = useState('28.5m')
  const [source, setSource] = useState('Salary')
  const [account, setAccount] = useState('BCA Utama')
  const [owner, setOwner] = useState<'Bas' | 'Tere'>(active)
  const [recurring, setRecurring] = useState(true)

  const parsed = parseShorthandAmount(amount)

  async function save() {
    if (parsed === null || parsed <= 0) return
    const id = newId('inc')
    const date = new Date().toISOString().slice(0, 10)
    await putIncome({
      id,
      source: source === 'Salary' ? 'Monthly salary' : source,
      kind: source as IncomeEntry['kind'],
      account,
      amount: parsed,
      currency: 'IDR',
      date,
      owner,
      recurring,
    })
    await putTransaction({
      id: newId('txn'),
      merchant: source,
      category: 'Income',
      categoryColor: '#34D399',
      account,
      amount: parsed,
      currency: 'IDR',
      date,
      owner,
      source: 'manual',
      type: 'income',
    })
    navigate('/income')
  }

  return (
    <AddShell title="Income">
      <div className="mt-6 text-center">
        <div className="text-[13px]" style={{ color: 'var(--text-3)' }}>
          Amount · IDR
        </div>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1.5 w-full bg-transparent text-center text-[40px] font-extrabold tracking-[-1px] tnum outline-none"
          style={{ color: '#34D399' }}
        />
        {parsed !== null && (
          <div className="text-[12px] tnum" style={{ color: 'var(--text-3)' }}>
            {formatAmount(parsed, 'IDR')}
          </div>
        )}
      </div>

      <FieldLabel>Source</FieldLabel>
      <Pills options={sources} value={source} onChange={setSource} />

      <FieldLabel>Into account</FieldLabel>
      <Pills options={accounts} value={account} onChange={setAccount} />

      <FieldLabel>Owner</FieldLabel>
      <OwnerToggle value={owner} onChange={(v) => setOwner(v as 'Bas' | 'Tere')} />

      <button
        onClick={() => setRecurring((r) => !r)}
        className="mt-5 flex w-full items-center gap-3 rounded-[16px] border p-4"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex-1 text-left">
          <div className="text-[13.5px] font-bold">Repeat monthly</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            {source === 'Salary' ? 'salary usually lands every month' : 'auto-post on the same day each month'}
          </div>
        </div>
        <div
          className="flex h-6 w-11 items-center rounded-full p-0.5 transition-colors"
          style={{ background: recurring ? '#7C3AED' : 'var(--track)' }}
        >
          <div
            className="h-5 w-5 rounded-full bg-white transition-transform"
            style={{ transform: recurring ? 'translateX(20px)' : 'translateX(0)' }}
          />
        </div>
      </button>

      <SaveButton label="Save income" onClick={save} />
    </AddShell>
  )
}
