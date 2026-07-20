export function DonutRing({
  percent,
  color,
  size = 52,
  stroke = 6,
}: {
  percent: number
  color: string
  size?: number
  stroke?: number
}) {
  const r = (size - stroke) / 2
  const c = size / 2
  const circumference = 2 * Math.PI * r
  const dash = (percent / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(-90 ${c} ${c})`}
      />
      <text
        x={c}
        y={c + 4}
        textAnchor="middle"
        fill="var(--text)"
        fontSize={size * 0.23}
        fontWeight={700}
        fontFamily="Sora"
      >
        {percent}%
      </text>
    </svg>
  )
}
