import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, PiggyBank } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { DonutRing } from '../components/DonutRing'
import { formatAmount } from '../data/currency'
import { useCollection } from '../data/useCollection'
import { savingsSuggestion, type Goal } from '../data/mockData'

const SPLIT_COLORS = ['#B44CF6', '#F6CE45', '#2DD4BF', '#F472B6', '#60A5FA']

export function Goals() {
  const { items: goals } = useCollection<Goal>('goal')
  const totalWeight = goals.reduce((s, g) => s + g.weight, 0)
  const savingPerMonth = savingsSuggestion.currentlySaving

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-extrabold">Goals</div>
        <Link
          to="/add/goal"
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold"
          style={{ background: 'var(--nav-pill)', color: 'var(--nav-pill-ink)' }}
        >
          <Plus size={14} strokeWidth={2.4} /> New goal
        </Link>
      </div>

      <SavingsSuggestion />

      {goals.length > 0 && (
        <Surface className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>
              Saving per month
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              split by weight
            </div>
          </div>
          <div className="mt-1 text-2xl font-extrabold tnum">{formatAmount(savingPerMonth, 'IDR')}</div>
          <div className="mt-3 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
            {goals.map((g, i) => (
              <div key={g.id} style={{ width: `${g.weight}%`, background: SPLIT_COLORS[i % SPLIT_COLORS.length] }} />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-3.5 text-[10.5px]" style={{ color: 'var(--text-3)' }}>
            {goals.map((g, i) => (
              <div key={g.id} className="flex items-center gap-1.5">
                <div className="h-[7px] w-[7px] rounded-full" style={{ background: SPLIT_COLORS[i % SPLIT_COLORS.length] }} />
                {g.name} {g.weight}%
              </div>
            ))}
          </div>
        </Surface>
      )}

      {goals.map((g) => {
        const percent = Math.round((g.saved / g.target) * 100)
        return (
          <Surface className="mt-3.5" key={g.id}>
            <div className="flex items-center gap-3.5">
              <DonutRing percent={percent} color={g.color} size={72} stroke={8} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-extrabold">{g.name}</div>
                  <div
                    className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tnum"
                    style={{ background: 'rgba(180,76,246,.16)', color: 'var(--accent-link)' }}
                  >
                    {g.weight}%
                  </div>
                </div>
                <div className="mt-1.5 text-xs tnum" style={{ color: 'var(--text-2)' }}>
                  {formatAmount(g.saved, g.currency)}{' '}
                  <span style={{ color: 'var(--text-3)' }}>of {formatAmount(g.target, g.currency)}</span>
                </div>
                <div
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold"
                  style={{
                    background: g.status === 'on-track' ? 'rgba(52,211,153,.14)' : 'rgba(245,158,11,.14)',
                    color: g.status === 'on-track' ? '#34D399' : '#F59E0B',
                  }}
                >
                  {g.statusText} · {g.owner}
                </div>
              </div>
            </div>
          </Surface>
        )
      })}

      {goals.length > 0 && (
        <div
          className="mt-3.5 flex items-center gap-3 rounded-[18px] border px-4 py-3.5"
          style={{ background: 'var(--surface)', borderColor: totalWeight === 100 ? 'rgba(52,211,153,.3)' : 'rgba(245,158,11,.3)' }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold tnum"
            style={{
              background: totalWeight === 100 ? 'rgba(52,211,153,.14)' : 'rgba(245,158,11,.14)',
              color: totalWeight === 100 ? '#34D399' : '#F59E0B',
            }}
          >
            {totalWeight}
          </div>
          <div>
            <div className="text-[12.5px] font-bold">Goal weights total {totalWeight}%</div>
            <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              {totalWeight === 100 ? 'every saved rupiah has a destination' : 'adjust weights to reach 100%'}
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}

function SavingsSuggestion() {
  const [rate, setRate] = useState(savingsSuggestion.recommendedRate)
  const suggested = Math.round((savingsSuggestion.incomeBase * rate) / 100)
  const gap = suggested - savingsSuggestion.currentlySaving

  return (
    <div className="mt-4 rounded-[24px] p-[18px]" style={{ background: 'linear-gradient(140deg,#2DD4BF,#0EA5A0)' }}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <PiggyBank size={18} strokeWidth={2} color="#fff" />
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-extrabold text-white">Suggested savings</div>
          <div className="text-[11px] text-white/80">based on {formatAmount(savingsSuggestion.incomeBase, 'IDR')} income</div>
        </div>
        <div className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white tnum">{rate}%</div>
      </div>

      <div className="mt-3 text-[28px] font-extrabold tnum text-white">
        {formatAmount(suggested, 'IDR')}
        <span className="text-[13px] font-semibold text-white/75"> /mo</span>
      </div>

      <input
        type="range"
        min={5}
        max={40}
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="mt-3 w-full accent-white"
      />
      <div className="mt-1 flex justify-between text-[10px] text-white/70">
        <span>5%</span>
        <span>20% recommended</span>
        <span>40%</span>
      </div>

      <div className="mt-3 rounded-[14px] bg-black/15 p-3 text-[11.5px] text-white/90">
        {gap > 0 ? (
          <>
            You're saving {formatAmount(savingsSuggestion.currentlySaving, 'IDR')} now — <b>{formatAmount(gap, 'IDR')} short</b> of
            this target.
          </>
        ) : (
          <>You're already saving {formatAmount(savingsSuggestion.currentlySaving, 'IDR')} — ahead of this target. Nice.</>
        )}
      </div>
    </div>
  )
}
