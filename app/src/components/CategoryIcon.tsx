import type { LucideIcon } from 'lucide-react'

/** Converts a hex color to an rgba string with the given alpha, for the tinted-disc backgrounds used throughout the mockup. */
function tint(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function CategoryIcon({
  icon: Icon,
  color,
  size = 40,
}: {
  icon: LucideIcon
  color: string
  size?: number
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: tint(color, 0.14), color }}
    >
      <Icon size={size * 0.425} strokeWidth={1.8} />
    </div>
  )
}

export function InitialDisc({
  initial,
  color,
  size = 40,
}: {
  initial: string
  color: string
  size?: number
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: tint(color, 0.14), color, fontSize: size * 0.325 }}
    >
      {initial}
    </div>
  )
}
