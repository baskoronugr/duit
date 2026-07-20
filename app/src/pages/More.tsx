import { Link } from 'react-router-dom'
import { PiggyBank, Target, TrendingUp, Sparkles, ScanLine, Settings, ChevronRight, Sun, Moon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { useTheme } from '../theme/ThemeContext'

const items: { label: string; to: string; icon: LucideIcon; color: string }[] = [
  { label: 'Budgets', to: '/budgets', icon: PiggyBank, color: '#B44CF6' },
  { label: 'Goals', to: '/goals', icon: Target, color: '#34D399' },
  { label: 'Investments', to: '/investments', icon: TrendingUp, color: '#F6CE45' },
  { label: 'Ask Duit', to: '/assistant', icon: Sparkles, color: '#60A5FA' },
  { label: 'Scan receipt', to: '/receipt-scan', icon: ScanLine, color: '#2DD4BF' },
  { label: 'Rebalance proposal', to: '/reprioritize', icon: Sparkles, color: '#F472B6' },
]

export function More() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Screen>
      <div className="text-[18px] font-extrabold">More</div>

      <Surface className="mt-4 !px-[18px] !py-1.5">
        {items.map((item, i) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 py-3.5"
            style={i < items.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: `${item.color}24`, color: item.color }}
            >
              <item.icon size={18} strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-[13.5px] font-semibold">{item.label}</div>
            <ChevronRight size={16} color="var(--text-3)" />
          </Link>
        ))}
      </Surface>

      <Surface className="mt-4">
        <button onClick={toggleTheme} className="flex w-full items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}
          >
            {theme === 'dark' ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
          </div>
          <div className="flex-1 text-left text-[13.5px] font-semibold">
            Theme · {theme === 'dark' ? 'Dark' : 'Light'}
          </div>
          <div
            className="rounded-full px-3 py-1.5 text-[11px] font-bold"
            style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}
          >
            Switch
          </div>
        </button>
      </Surface>

      <Surface className="mt-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}
          >
            <Settings size={18} strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-[13.5px] font-semibold">Settings</div>
          <ChevronRight size={16} color="var(--text-3)" />
        </div>
      </Surface>
    </Screen>
  )
}
