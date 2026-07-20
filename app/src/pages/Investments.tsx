import { Screen, Surface } from '../components/Screen'

const allocation = [
  { name: 'Stocks', percent: 44, color: '#B44CF6' },
  { name: 'Mutual funds', percent: 32, color: '#F6CE45' },
  { name: 'Crypto', percent: 24, color: '#2DD4BF' },
]

interface Row {
  ticker: string
  name: string
  detail: string
  value: string
  currency?: string
  changePercent: number
  changeSub?: string
  iconBg: string
  iconColor: string
}

const gold: Row[] = [
  { ticker: 'AU', name: 'Antam Gold', detail: '25,5 gram · avg Rp 1.129.400/gr', value: 'Rp 32.640.000', changePercent: 13.3, iconBg: 'rgba(246,206,69,.14)', iconColor: '#F6CE45' },
]

const stocks: Row[] = [
  { ticker: 'VOO', name: 'Vanguard S&P 500', detail: '3.2 sh · avg $512.40', value: '$1.891,20', currency: 'USD', changePercent: 15.3, changeSub: '≈ Rp 30,7 jt', iconBg: 'rgba(255,255,255,.07)', iconColor: '#C9C9D1' },
  { ticker: 'BBCA', name: 'Bank Central Asia', detail: '700 sh · avg Rp 9.150', value: 'Rp 6.965.000', changePercent: -2.1, iconBg: 'rgba(255,255,255,.07)', iconColor: '#C9C9D1' },
]

const mutualFunds: Row[] = [
  { ticker: 'RD', name: 'Sucorinvest Money Market', detail: 'Bibit · Tere', value: 'Rp 26.960.000', changePercent: 4.8, iconBg: 'rgba(246,206,69,.14)', iconColor: '#F6CE45' },
]

const crypto: Row[] = [
  { ticker: 'BTC', name: 'Bitcoin', detail: '0.012 BTC', value: '$842,16', currency: 'USD', changePercent: 31.0, changeSub: '≈ Rp 13,7 jt', iconBg: 'rgba(251,146,60,.14)', iconColor: '#FB923C' },
  { ticker: 'ETH', name: 'Ethereum', detail: '0.15 ETH', value: '$389,40', currency: 'USD', changePercent: -5.4, changeSub: '≈ Rp 6,3 jt', iconBg: 'rgba(96,165,250,.14)', iconColor: '#60A5FA' },
]

export function Investments() {
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
        <div className="mt-2 text-[30px] font-extrabold tracking-[-0.5px] tnum text-white">≈ Rp 116.890.000</div>
        <div className="mt-1 text-[11px] tnum text-white/75">consolidated IDR · FX 18 Jul 2026</div>
        <div className="mt-3.5 flex gap-2">
          <div className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum" style={{ background: 'rgba(0,0,0,.22)', color: '#7EF0C4' }}>
            +Rp 12.990.000 all-time
          </div>
          <div className="rounded-full px-3 py-1.5 text-[11.5px] font-bold tnum" style={{ background: '#F5F5F7', color: '#111114' }}>
            ↑ 12,5%
          </div>
        </div>
      </div>

      <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
        {allocation.map((a) => (
          <div key={a.name} style={{ width: `${a.percent}%`, background: a.color }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3.5 text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        {allocation.map((a) => (
          <div key={a.name} className="flex items-center gap-1.5">
            <div className="h-[7px] w-[7px] rounded-full" style={{ background: a.color }} />
            {a.name} {a.percent}%
          </div>
        ))}
      </div>

      <AssetGroup title="Gold" rows={gold} />
      <AssetGroup title="Stocks · US & ID" rows={stocks} />
      <AssetGroup title="Mutual funds" rows={mutualFunds} />
      <AssetGroup title="Crypto" rows={crypto} />
    </Screen>
  )
}

function AssetGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <>
      <div className="mt-[18px] text-xs font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        {title}
      </div>
      <Surface className="mt-2 !px-[18px] !py-1">
        {rows.map((r, i) => (
          <div
            key={r.ticker}
            className="flex items-center gap-3 py-3.5"
            style={i < rows.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-[11px] font-extrabold"
              style={{ background: r.iconBg, color: r.iconColor }}
            >
              {r.ticker}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold">{r.name}</div>
              <div className="text-[11px] tnum" style={{ color: 'var(--text-3)' }}>
                {r.detail}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold tnum">
                {r.value}
                {r.currency && (
                  <span
                    className="ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold"
                    style={{ background: 'var(--track)', color: 'var(--text-3)' }}
                  >
                    {r.currency}
                  </span>
                )}
              </div>
              <div className="text-[10px] tnum" style={{ color: r.changePercent >= 0 ? '#34D399' : '#F87171' }}>
                {r.changePercent >= 0 ? '+' : ''}
                {r.changePercent.toFixed(1).replace('.', ',')}%{r.changeSub && ` · ${r.changeSub}`}
              </div>
            </div>
          </div>
        ))}
      </Surface>
    </>
  )
}
