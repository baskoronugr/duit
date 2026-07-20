import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddShell, FieldLabel, TextInput, Pills, OwnerToggle, SaveButton } from '../../components/AddShell'
import { parseShorthandAmount, formatAmount, type CurrencyCode } from '../../data/currency'

const cycles = ['Monthly', 'Quarterly', 'Yearly']
const currencies: CurrencyCode[] = ['IDR', 'USD', 'JPY', 'SGD', 'CNY']
const accounts = ['BCA Visa', 'BCA Utama', 'GoPay', 'Jenius']
const categories = ['Subscriptions', 'Fun', 'Utilities', 'Health', 'Other']

export function AddSubscription() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('IDR')
  const [cycle, setCycle] = useState('Monthly')
  const [nextDate, setNextDate] = useState('')
  const [account, setAccount] = useState('BCA Visa')
  const [category, setCategory] = useState('Subscriptions')
  const [owner, setOwner] = useState('Bas')

  const parsed = parseShorthandAmount(amount)

  return (
    <AddShell title="Subscription">
      <FieldLabel>Name</FieldLabel>
      <TextInput value={name} onChange={setName} placeholder="Netflix, Spotify, iCloud…" />

      <FieldLabel>Amount</FieldLabel>
      <div className="mt-2.5 flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="186000 or 2.99"
          className="flex-1 rounded-[16px] border px-4 py-3.5 text-[14px] tnum outline-none"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="rounded-[16px] border px-3 text-[13px] font-bold outline-none"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {parsed !== null && (
        <div className="mt-1.5 text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
          {formatAmount(parsed, currency)} every {cycle.toLowerCase().replace('ly', '')}
        </div>
      )}

      <FieldLabel>Billing cycle</FieldLabel>
      <Pills options={cycles} value={cycle} onChange={setCycle} />

      <FieldLabel>Next renewal</FieldLabel>
      <input
        type="date"
        value={nextDate}
        onChange={(e) => setNextDate(e.target.value)}
        className="mt-2.5 w-full rounded-[16px] border px-4 py-3.5 text-[14px] outline-none"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />

      <FieldLabel>Pay from</FieldLabel>
      <Pills options={accounts} value={account} onChange={setAccount} />

      <FieldLabel>Category</FieldLabel>
      <Pills options={categories} value={category} onChange={setCategory} />

      <FieldLabel>Owner</FieldLabel>
      <OwnerToggle value={owner} onChange={setOwner} />

      <SaveButton label="Save subscription" onClick={() => navigate('/subscriptions')} />
    </AddShell>
  )
}
