import { Screen, Surface } from '../components/Screen'
import { formatAmount } from '../data/currency'
import { useCollection } from '../data/useCollection'
import { toIdr } from '../data/derive'
import type { Holding } from '../data/mockData'

const CLASS_ORDER: Holding['assetClass'][] = ['Gold', 'Stocks', 'Reksadana', 'Crypto']
const CLASS_COLOR: Record<Holding['assetClass'], string> = {
  Gold: '#F6CE45',
  Stocks: '#B44CF6',
  Reksadana: '#2DD4BF',
  Crypto: '#FB923C',
}

function fmtQty(q: number, unit: string): string {
  const n = q.toLocaleString('id-ID', { maximumFractionDigits: unit === 'coin' ? 4 : 2 })
  return `${n} ${unit}`
}

export function Investments() {
  const { items } = useCollection<Holding>('holding')

  const currentIdr = items.reduce((s, h) => s + toIdr(h.currentValue, h.priceCurrency), 0)
  const investedIdr = items.reduce((s, h) => s + toIdr(h.invested, h.priceCurrency), 0)
  const gainIdr = currentIdr - investedIdr
  const gainPct = investedIdr ? (gainIdr / investedIdr) * 100 : 0

  const byClass = CLASS_ORDER.map((cls) => ({
    cls,
    color: CLASS_COLOR[cls],
    rows: items.filter((h) => h.assetClass === cls),
    valueIdr: items.filter((h) => h.assetClass === cls).reduce((s, h) => s + toIdr(h.currentValue, h.priceCurrency), 0),
  })).filter((g) => g.rows.length > 0)

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Investments</div>
        <div
          className="rounded-full border px-3.5 py-2.5 text-[11.5px] font-semibold"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
        >
          prices 19 Jul · 09:40
        </div>
      </div>

      <div
        className="mt-4 rounded-[24px] p-5 shadow-[0_16px_40px_rgba(124,58,237,0.35)]"
        style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
      >
        <div className="text-xs font-semibold text-white/85">Portfolio value</div>
        <div className="mt-2 text-[30px] font-extrabold tracking-[-0.5px] tnum text-white">
          ≈ {formatAmount(Math.round(currentIdr), 'IDR')}
        </div>
        <div className="mt-1 text-[11px] tnum text-white/75">consolidated IDR · FX 18 Jul 2026</div>
        <div className="mt-3.5 flex gap-2">
          <div
            className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum"
            style={{ background: 'rgba(0,0,0,.22)', color: gainIdr >= 0 ? '#7EF0C4' : '#FCA5A5' }}
          >
            {gainIdr >= 0 ? '+' : ''}
            {formatAmount(Math.round(gainIdr), 'IDR')} all-time
          </div>
          <div className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum" style={{ background: '#F5F5F7', color: '#111114' }}>
            {gainPct >= 0 ? '↑' : '↓'} {Math.abs(gainPct).toFixed(1).replace('.', ',')}%
          </div>
        </div>
      </div>

      {currentIdr > 0 && (
        <>
          <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
            {byClass.map((g) => (
              <div key={g.cls} style={{ width: `${(g.valueIdr / currentIdr) * 100}%`, background: g.color }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3.5 text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            {byClass.map((g) => (
              <div key={g.cls} className="flex items-center gap-1.5">
                <div className="h-[7px] w-[7px] rounded-full" style={{ background: g.color }} />
                {g.cls} {Math.round((g.valueIdr / currentIdr) * 100)}%
              </div>
            ))}
          </div>
        </>
      )}

      {byClass.map((g) => (
        <div key={g.cls}>
          <div className="mt-[18px] text-xs font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
            {g.cls}
          </div>
          <Surface className="mt-2 !px-[18px] !py-1">
            {g.rows.map((h, i) => (
              <div
                key={h.id}
                className="flex items-center gap-3 py-3.5"
                style={i < g.rows.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-[11px] font-extrabold"
                  style={{ background: `${g.color}24`, color: g.color }}
                >
                  {h.name.slice(0, 3).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold">{h.name}</div>
                  <div className="text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
                    {fmtQty(h.quantity, h.unit)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold tnum">
                    {formatAmount(h.currentValue, h.priceCurrency)}
                    {h.priceCurrency !== 'IDR' && (
                      <span className="ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold" style={{ background: 'var(--track)', color: 'var(--text-3)' }}>
                        {h.priceCurrency}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] tnum" style={{ color: h.gainPercent >= 0 ? '#34D399' : '#F87171' }}>
                    {h.gainPercent >= 0 ? '+' : ''}
                    {h.gainPercent.toFixed(1).replace('.', ',')}%
                  </div>
                </div>
              </div>
            ))}
          </Surface>
        </div>
      ))}
    </Screen>
  )
}
