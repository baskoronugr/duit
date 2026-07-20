import type { CSSProperties, ReactNode } from 'react'

export function Screen({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`mx-auto w-full ${wide ? 'max-w-[1200px]' : 'max-w-[480px]'} px-5 pt-6 pb-[110px] lg:pb-10`}
      style={{ color: 'var(--text)' }}
    >
      {children}
    </div>
  )
}

export function Surface({
  children,
  className = '',
  padded = true,
  style,
}: {
  children: ReactNode
  className?: string
  padded?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      className={`rounded-[24px] border ${padded ? 'p-[18px]' : ''} ${className}`}
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', ...style }}
    >
      {children}
    </div>
  )
}
