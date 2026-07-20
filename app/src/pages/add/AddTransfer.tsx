import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import { AddShell, FieldLabel, SaveButton } from '../../components/AddShell'
import { parseShorthandAmount, formatAmount } from '../../data/currency'

const accounts = ['BCA Utama', 'Emergency pocket', 'Trip Jepang pocket', 'Jenius', 'GoPay', 'Cash', 'BCA Visa']

export function AddTransfer() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('BCA Utama')
  const [to, setTo] = useState('Emergency pocket')
  const [amount, setAmount] = useState('3m')
  const parsed = parseShorthandAmount(amount)

  return (
    <AddShell title="Transfer">
      <div className="mt-6 text-center">
        <div className="text-[13px]" style={{ color: 'var(--text-3)' }}>
          Amount · IDR
        </div>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1.5 w-full bg-transparent text-center text-[40px] font-extrabold tracking-[-1px] tnum outline-none"
          style={{ color: 'var(--text)' }}
        />
        {parsed !== null && (
          <div className="text-[12px] tnum" style={{ color: 'var(--text-3)' }}>
            {formatAmount(parsed, 'IDR')}
          </div>
        )}
      </div>

      <FieldLabel>From</FieldLabel>
      <Selector value={from} onChange={setFrom} options={accounts.filter((a) => a !== to)} />

      <div className="my-2 flex justify-center">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--accent-link)' }}
        >
          <ArrowDown size={18} strokeWidth={2} />
        </div>
      </div>

      <FieldLabel>To</FieldLabel>
      <Selector value={to} onChange={setTo} options={accounts.filter((a) => a !== from)} />

      <div className="mt-4 rounded-[14px] p-3 text-[11.5px]" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>
        Transfers move money between your own accounts — they never count as spending.
      </div>

      <SaveButton label="Transfer money" onClick={() => navigate('/accounts')} />
    </AddShell>
  )
}

function Selector({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2.5 w-full rounded-[16px] border px-4 py-3.5 text-[14px] font-semibold outline-none"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
