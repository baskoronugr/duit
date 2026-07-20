import { Bell, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Avatar({ initial, size = 44 }: { initial: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: 'linear-gradient(140deg,#B44CF6,#7C3AED)',
      }}
    >
      {initial}
    </div>
  )
}

export function IconButton({
  children,
  onClick,
  size = 44,
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: number
}) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center justify-center rounded-full border"
      style={{ width: size, height: size, background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
    >
      {children}
    </button>
  )
}

export function TopBar({ avatarInitial = 'A' }: { avatarInitial?: string }) {
  return (
    <div className="flex items-center justify-between">
      <Avatar initial={avatarInitial} />
      <IconButton>
        <Bell size={19} strokeWidth={1.8} />
      </IconButton>
    </div>
  )
}

export function BackBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link to="/">
        <IconButton size={40}>
          <ArrowLeft size={18} strokeWidth={1.8} />
        </IconButton>
      </Link>
      <div className="text-[17px] font-bold">{title}</div>
    </div>
  )
}

export function Greeting({ name }: { name: string }) {
  return (
    <>
      <div className="mt-[18px] text-[30px] font-extrabold tracking-[-0.5px]">Hi, {name}!</div>
      <div className="mt-[2px] text-[13px]" style={{ color: 'var(--text-3)' }}>
        Let&rsquo;s manage your money.
      </div>
    </>
  )
}
