import { Sparkles } from 'lucide-react'
import { Screen } from '../components/Screen'

export function Reprioritize() {
  return (
    <Screen>
      <div className="mb-3.5 text-center text-[11px]" style={{ color: '#5C5C66' }}>
        appears on Dashboard &amp; Goals when Claude suggests a rebalance
      </div>
      <div
        className="rounded-[24px] border p-5 shadow-[0_14px_36px_rgba(124,58,237,0.15)]"
        style={{ background: 'var(--surface)', borderColor: 'rgba(180,76,246,.35)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
          >
            <Sparkles size={17} strokeWidth={2} color="#fff" />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-extrabold">Rebalance suggestion</div>
            <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
              Trip Jepang is 2 months behind
            </div>
          </div>
          <div
            className="rounded-full px-2.5 py-1.5 text-[10px] font-bold"
            style={{ background: 'rgba(255,255,255,.07)', color: 'var(--text-3)' }}
          >
            PROPOSAL
          </div>
        </div>

        <div className="mt-3.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
          Shift <b style={{ color: 'var(--text)' }}>5%</b> of monthly saving from DP Rumah to Trip Jepang until
          Desember. Trip lands back on target (Mar 2027); DP Rumah slips ~3 weeks on a 9-year horizon.
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5 rounded-[18px] p-3.5" style={{ background: 'var(--surface-2)' }}>
          <WeightRow label="Trip Jepang" from={50} to={55} fromColor="#3A3A44" barColor="linear-gradient(90deg,#B44CF6,#7C3AED)" arrowColor="#34D399" />
          <WeightRow label="Dana Darurat" value={30} barColor="#F6CE45" />
          <WeightRow label="DP Rumah" from={20} to={15} fromColor="#2DD4BF" reduceBadge arrowColor="#F87171" />
          <div
            className="flex justify-between pt-2.5 text-[10.5px]"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}
          >
            <div>weights still total</div>
            <div className="font-extrabold tnum" style={{ color: '#34D399' }}>
              100%
            </div>
          </div>
        </div>

        <div className="mt-3.5 flex gap-2">
          <button
            className="flex-1 rounded-full border text-[12.5px] font-bold"
            style={{ height: 48, background: 'var(--surface-2)', borderColor: 'var(--border-strong)', color: 'var(--text-2)' }}
          >
            Dismiss
          </button>
          <button
            className="flex-1 rounded-full border text-[12.5px] font-bold"
            style={{ height: 48, background: 'var(--surface-2)', borderColor: 'var(--border-strong)', color: 'var(--text-2)' }}
          >
            Adjust
          </button>
          <button
            className="flex-[1.2] rounded-full text-[12.5px] font-bold text-white"
            style={{ height: 48, background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
          >
            Apply
          </button>
        </div>
        <div className="mt-2.5 text-center text-[10px]" style={{ color: '#5C5C66' }}>
          nothing changes without your approval · Nadia gets a heads-up
        </div>
      </div>
    </Screen>
  )
}

function WeightRow({
  label,
  value,
  from,
  to,
  barColor,
  fromColor,
  reduceBadge,
  arrowColor,
}: {
  label: string
  value?: number
  from?: number
  to?: number
  barColor?: string
  fromColor?: string
  reduceBadge?: boolean
  arrowColor?: string
}) {
  const width = to ?? value ?? 0
  return (
    <div className="flex items-center gap-2.5 text-[11.5px]">
      <div className="w-[86px] shrink-0" style={{ color: 'var(--text-3)' }}>
        {label}
      </div>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--track)' }}>
        {from !== undefined && (
          <div className="h-full rounded-full" style={{ width: `${from}%`, background: fromColor }} />
        )}
        {to !== undefined && (
          <div
            className="absolute left-0 top-0 h-full rounded-full opacity-90"
            style={{ width: `${to}%`, background: barColor }}
          />
        )}
        {from === undefined && <div className="h-full rounded-full" style={{ width: `${width}%`, background: barColor }} />}
        {reduceBadge && (
          <div
            className="absolute top-0 h-full rounded-full"
            style={{ left: '15%', width: '5%', background: 'rgba(248,113,113,.5)' }}
          />
        )}
      </div>
      <div className="w-[74px] shrink-0 text-right font-bold tnum">
        {from !== undefined ? (
          <>
            {from} <span style={{ color: arrowColor }}>→ {to}%</span>
          </>
        ) : (
          `${value}%`
        )}
      </div>
    </div>
  )
}
