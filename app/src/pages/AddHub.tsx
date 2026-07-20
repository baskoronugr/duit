import { Link } from 'react-router-dom'
import { X, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Repeat, Target, PiggyBank, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Screen } from '../components/Screen'

const items: { label: string; desc: string; to: string; icon: LucideIcon; color: string }[] = [
  { label: 'Expense', desc: 'Log a spend — the 10-second flow', to: '/add/expense', icon: ArrowUpRight, color: '#F87171' },
  { label: 'Income', desc: 'Salary or other money in', to: '/add/income', icon: ArrowDownLeft, color: '#34D399' },
  { label: 'Transfer', desc: 'Move money between accounts', to: '/add/transfer', icon: ArrowLeftRight, color: '#A78BFA' },
  { label: 'Subscription', desc: 'A recurring bill or membership', to: '/add/subscription', icon: Repeat, color: '#FB923C' },
  { label: 'Goal', desc: 'A savings target with a weight', to: '/add/goal', icon: Target, color: '#2DD4BF' },
  { label: 'Budget', desc: 'A category envelope for the month', to: '/add/budget', icon: PiggyBank, color: '#60A5FA' },
]

export function AddHub() {
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Add</div>
        <Link to="/">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <X size={17} strokeWidth={2} />
          </div>
        </Link>
      </div>
      <div className="mt-1.5 text-[13px]" style={{ color: 'var(--text-3)' }}>
        What do you want to add?
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3.5 rounded-[20px] border p-4"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ background: `${item.color}24`, color: item.color }}
            >
              <item.icon size={22} strokeWidth={1.9} />
            </div>
            <div className="flex-1">
              <div className="text-[14.5px] font-bold">{item.label}</div>
              <div className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
                {item.desc}
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-3)" />
          </Link>
        ))}
      </div>
    </Screen>
  )
}
