export function ProgressBar({
  percent,
  color,
  height = 8,
}: {
  percent: number
  color: string
  height?: number
}) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div
      className="overflow-hidden rounded-full"
      style={{ height, background: 'var(--track)' }}
    >
      <div className="h-full rounded-full" style={{ width: `${clamped}%`, background: color }} />
    </div>
  )
}

export function GradientProgressBar({ percent, height = 8 }: { percent: number; height?: number }) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="overflow-hidden rounded-full" style={{ height, background: 'var(--track)' }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${clamped}%`, background: 'linear-gradient(90deg,#B44CF6,#7C3AED)' }}
      />
    </div>
  )
}
