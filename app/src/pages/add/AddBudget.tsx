import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { AddShell, FieldLabel, TextInput, Pills, SaveButton } from '../../components/AddShell'
import { parseShorthandAmount, formatAmount } from '../../data/currency'
import { putBudget, newId } from '../../data/db'
import { useCollection } from '../../data/useCollection'
import type { BudgetCategory } from '../../data/mockData'

const suggestedCategories = ['Groceries', 'Dining', 'Transport', 'Utilities', 'Fun', 'Health', 'Home', 'Custom…']
const CAT_COLORS = ['#2DD4BF', '#60A5FA', '#F472B6', '#FB923C', '#A78BFA', '#F87171', '#F6CE45']

export function AddBudget() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('Groceries')
  const [custom, setCustom] = useState('')
  const [amount, setAmount] = useState('')
  const [weight, setWeight] = useState(10)

  const parsed = parseShorthandAmount(amount)
  const { items: budgetCategories } = useCollection<BudgetCategory>('budget')
  const existingWeight = budgetCategories.reduce((s, c) => s + c.weight, 0)
  const newTotal = existingWeight + weight

  async function save() {
    const name = category === 'Custom…' ? custom.trim() : category
    if (!name || parsed === null || parsed <= 0) return
    await putBudget({
      id: newId('budget'),
      name,
      icon: 'more-horizontal',
      color: CAT_COLORS[name.length % CAT_COLORS.length],
      weight,
      spent: 0,
      budget: parsed,
    })
    navigate('/budgets')
  }

  return (
    <AddShell title="Add budget">
      <Link
        to="/budgets/suggest"
        className="mt-5 flex items-center gap-3 rounded-[16px] border p-4"
        style={{ background: 'var(--surface)', borderColor: 'rgba(180,76,246,.35)' }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
        >
          <Sparkles size={18} strokeWidth={2} color="#fff" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold">Suggest budgets from my spending</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            Let Duit set all categories from your last 3 months
          </div>
        </div>
      </Link>

      <FieldLabel>Category</FieldLabel>
      <Pills options={suggestedCategories} value={category} onChange={setCategory} />
      {category === 'Custom…' && <TextInput value={custom} onChange={setCustom} placeholder="Category name" />}

      <FieldLabel>Monthly amount</FieldLabel>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="2.5m"
        className="mt-2.5 w-full rounded-[16px] border px-4 py-3.5 text-[14px] tnum outline-none"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
      {parsed !== null && (
        <div className="mt-1.5 text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
          {formatAmount(parsed, 'IDR')} / month
        </div>
      )}

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
        style={{ background: 'var(--surface-2)', color: newTotal === 100 ? '#34D399' : '#F59E0B' }}
      >
        Category weights would total <b className="tnum">{newTotal}%</b>{' '}
        {newTotal === 100 ? '— balanced' : '— adjust others to reach 100%'}
      </div>

      <SaveButton label="Add budget" onClick={save} />
    </AddShell>
  )
}
