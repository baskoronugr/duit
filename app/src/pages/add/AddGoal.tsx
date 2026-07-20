import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddShell, FieldLabel, TextInput, Pills, OwnerToggle, SaveButton } from '../../components/AddShell'
import { parseShorthandAmount, formatAmount } from '../../data/currency'
import { goals } from '../../data/mockData'

const pockets = ['New pocket', 'Trip Jepang pocket', 'Emergency pocket', 'BCA Utama']

export function AddGoal() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [weight, setWeight] = useState(20)
  const [owner, setOwner] = useState('Bas')
  const [pocket, setPocket] = useState('New pocket')

  const parsed = parseShorthandAmount(target)
  const existingWeight = goals.reduce((s, g) => s + g.weight, 0)
  const newTotal = existingWeight + weight

  return (
    <AddShell title="New goal">
      <FieldLabel>Goal name</FieldLabel>
      <TextInput value={name} onChange={setName} placeholder="Trip to Japan, House DP…" />

      <FieldLabel>Target amount</FieldLabel>
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="50m"
        className="mt-2.5 w-full rounded-[16px] border px-4 py-3.5 text-[14px] tnum outline-none"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
      {parsed !== null && (
        <div className="mt-1.5 text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
          {formatAmount(parsed, 'IDR')}
        </div>
      )}

      <FieldLabel>Target date (optional)</FieldLabel>
      <input
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="mt-2.5 w-full rounded-[16px] border px-4 py-3.5 text-[14px] outline-none"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />

      <FieldLabel>Priority weight — {weight}%</FieldLabel>
      <input
        type="range"
        min={0}
        max={100}
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        className="mt-3 w-full accent-[#7C3AED]"
      />
      <div
        className="mt-2 rounded-[14px] p-3 text-[11.5px]"
        style={{
          background: 'var(--surface-2)',
          color: newTotal === 100 ? '#34D399' : '#F59E0B',
        }}
      >
        Goal weights would total <b className="tnum">{newTotal}%</b>{' '}
        {newTotal === 100 ? '— balanced' : `— rebalance others to reach 100%`}
      </div>

      <FieldLabel>Owner</FieldLabel>
      <OwnerToggle value={owner} onChange={setOwner} />

      <FieldLabel>Save into</FieldLabel>
      <Pills options={pockets} value={pocket} onChange={setPocket} />

      <SaveButton label="Create goal" onClick={() => navigate('/goals')} />
    </AddShell>
  )
}
