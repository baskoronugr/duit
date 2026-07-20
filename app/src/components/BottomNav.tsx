import { NavLink } from 'react-router-dom'
import { Home, Wallet, Plus, Receipt, MoreHorizontal } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/accounts', label: 'Cards', icon: Wallet },
]

const items2 = [
  { to: '/transactions', label: 'Activity', icon: Receipt },
  { to: '/more', label: 'More', icon: MoreHorizontal },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-[18px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border p-2 shadow-[0_14px_36px_rgba(0,0,0,0.25)] lg:hidden"
      style={{ background: 'var(--nav-bg)', borderColor: 'var(--border-strong)' }}
    >
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center justify-center rounded-full transition-colors ${
              isActive ? 'gap-[7px] px-4 py-[11px] text-[12.5px] font-bold' : 'h-11 w-11'
            }`
          }
          style={({ isActive }) =>
            isActive
              ? { background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }
              : { color: 'var(--text-3)' }
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={18} strokeWidth={1.8} />
              {isActive && label}
            </>
          )}
        </NavLink>
      ))}
      <NavLink
        to="/add"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-[0_8px_20px_rgba(124,58,237,0.45)]"
        style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
      >
        <Plus size={20} strokeWidth={2.2} color="#fff" />
      </NavLink>
      {items2.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center justify-center rounded-full transition-colors ${
              isActive ? 'gap-[7px] px-4 py-[11px] text-[12.5px] font-bold' : 'h-11 w-11'
            }`
          }
          style={({ isActive }) =>
            isActive
              ? { background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }
              : { color: 'var(--text-3)' }
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={18} strokeWidth={1.8} />
              {isActive && label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
