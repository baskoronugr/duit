import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Image, Sparkles, ShoppingCart, ChevronDown, AlertTriangle } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'

export function ReceiptScan() {
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <Link to="/quick-add">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </div>
        </Link>
        <div className="text-[15px] font-extrabold">Review scan</div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
        >
          <Trash2 size={17} strokeWidth={1.8} />
        </div>
      </div>

      <div
        className="relative mt-4 overflow-hidden rounded-[24px] border"
        style={{ background: 'linear-gradient(180deg,#2A2A32,#1F1F25)', borderColor: 'var(--border)' }}
      >
        <div className="flex h-[150px] flex-col items-center justify-center gap-2" style={{ color: '#5C5C66' }}>
          <Image size={30} strokeWidth={1.6} />
          <div className="text-[10.5px]">receipt photo · tap to zoom</div>
        </div>
        <div
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold text-white"
          style={{ background: 'rgba(180,76,246,.9)' }}
        >
          <Sparkles size={11} strokeWidth={2.4} /> Claude read this
        </div>
      </div>

      <Surface className="mt-3.5 !px-[18px] !py-1.5">
        <Field label="Merchant" value="Superindo Cilandak" confidence="high" />
        <Field label="Total" value="Rp 187.500" confidence="high" big />
        <Field label="Date" value="19 Jul 2026 · 10:24" confidence="high" />
        <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
            Category
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold"
              style={{ background: 'rgba(45,212,191,.14)', color: '#2DD4BF' }}
            >
              <ShoppingCart size={13} strokeWidth={1.8} /> Groceries
            </div>
            <div className="h-2 w-2 rounded-full" style={{ background: '#F59E0B' }} title="check me" />
          </div>
        </div>
        <div className="flex items-center justify-between py-3.5">
          <div className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
            Account
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[13.5px] font-bold">BCA Utama</div>
            <ChevronDown size={14} color="var(--text-3)" />
          </div>
        </div>
      </Surface>

      <div
        className="mt-3 flex items-center gap-2.5 rounded-[18px] border px-4 py-3"
        style={{ background: 'var(--surface)', borderColor: 'rgba(245,158,11,.3)' }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'rgba(245,158,11,.14)', color: '#F59E0B' }}
        >
          <AlertTriangle size={15} strokeWidth={2} />
        </div>
        <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
          Category is a guess — receipt includes 3 household items.{' '}
          <span className="font-bold" style={{ color: '#F59E0B' }}>
            Split into 2 categories?
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
          <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            Items read
          </div>
          <div className="mt-0.5 text-[12.5px] font-bold tnum">12 lines</div>
        </div>
        <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
          <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            Owner
          </div>
          <div className="mt-0.5 text-[12.5px] font-bold">Joint</div>
        </div>
        <div className="flex-1 rounded-[14px] p-2.5" style={{ background: 'var(--surface-2)' }}>
          <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            Duplicate?
          </div>
          <div className="mt-0.5 text-[12.5px] font-bold" style={{ color: '#34D399' }}>
            none found
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2.5">
        <button
          className="flex-1 rounded-full border text-[13.5px] font-bold"
          style={{ height: 56, background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-2)' }}
        >
          Edit fields
        </button>
        <Link
          to="/"
          className="flex flex-[1.4] items-center justify-center rounded-full text-[14px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
          style={{ height: 56, background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
        >
          Looks right — save
        </Link>
      </div>
    </Screen>
  )
}

function Field({ label, value, confidence, big }: { label: string; value: string; confidence: 'high' | 'low'; big?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
        {label}
      </div>
      <div className="flex items-center gap-2">
        <div className={big ? 'text-[16px] font-extrabold tnum' : 'text-[13.5px] font-bold tnum'}>{value}</div>
        <div className="h-2 w-2 rounded-full" style={{ background: confidence === 'high' ? '#34D399' : '#F59E0B' }} />
      </div>
    </div>
  )
}
