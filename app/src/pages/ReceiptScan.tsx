import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Sparkles, ShoppingCart, AlertTriangle, Camera, Upload, Check } from 'lucide-react'
import { Screen, Surface } from '../components/Screen'
import { parseShorthandAmount, formatAmount } from '../data/currency'
import { putTransaction, newId } from '../data/db'
import { useProfile } from '../theme/ProfileContext'

type Stage = 'capture' | 'review'

const accountsList = ['BCA Utama', 'GoPay', 'Cash', 'BCA Visa', 'Jenius']
const categoriesList = ['Groceries', 'Dining', 'Transport', 'Utilities', 'Fun', 'Health', 'Home']

const CAT_COLOR: Record<string, string> = {
  Groceries: '#2DD4BF',
  Dining: '#60A5FA',
  Transport: '#F472B6',
  Utilities: '#FB923C',
  Fun: '#A78BFA',
  Health: '#F87171',
  Home: '#F6CE45',
}

export function ReceiptScan() {
  const navigate = useNavigate()
  const { active } = useProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const [stage, setStage] = useState<Stage>('capture')
  const [image, setImage] = useState<string | null>(null)

  // editable extracted fields
  const [merchant, setMerchant] = useState('Superindo Cilandak')
  const [amount, setAmount] = useState('187500')
  const [date, setDate] = useState('19 Jul 2026 · 10:24')
  const [category, setCategory] = useState('Groceries')
  const [account, setAccount] = useState('BCA Utama')

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setImage(URL.createObjectURL(f))
    // simulate AI extraction completing
    setStage('review')
  }

  const parsedAmount = parseShorthandAmount(amount)

  if (stage === 'capture') {
    return (
      <Screen>
        <div className="flex items-center justify-between">
          <Link to="/add">
            <IconBtn>
              <ArrowLeft size={18} strokeWidth={2} />
            </IconBtn>
          </Link>
          <div className="text-[15px] font-extrabold">Scan receipt</div>
          <div className="w-11" />
        </div>

        <div className="mt-8 text-center">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: 'rgba(180,76,246,.16)', color: 'var(--accent-link)' }}
          >
            <Camera size={34} strokeWidth={1.6} />
          </div>
          <div className="mt-4 text-[17px] font-bold">Capture a receipt</div>
          <div className="mx-auto mt-1.5 max-w-[280px] text-[12.5px]" style={{ color: 'var(--text-3)' }}>
            Take a live photo or upload one. Claude reads the amount, merchant, date and suggests a category.
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        <input id="upload-input" type="file" accept="image/*" className="hidden" onChange={onFile} />

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex h-14 items-center justify-center gap-2.5 rounded-full text-[14px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
            style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
          >
            <Camera size={19} strokeWidth={2} /> Take live photo
          </button>
          <button
            onClick={() => document.getElementById('upload-input')?.click()}
            className="flex h-14 items-center justify-center gap-2.5 rounded-full border text-[14px] font-bold"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text)' }}
          >
            <Upload size={18} strokeWidth={2} /> Upload from gallery
          </button>
        </div>
        <div className="mt-4 text-center text-[10.5px]" style={{ color: 'var(--text-3)' }}>
          image is sent to Google Gemini (free tier) for reading · turn off in Settings
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <button onClick={() => setStage('capture')}>
          <IconBtn>
            <ArrowLeft size={18} strokeWidth={2} />
          </IconBtn>
        </button>
        <div className="text-[15px] font-extrabold">Review scan</div>
        <button onClick={() => setStage('capture')}>
          <IconBtn>
            <Trash2 size={17} strokeWidth={1.8} />
          </IconBtn>
        </button>
      </div>

      <div
        className="relative mt-4 overflow-hidden rounded-[24px] border"
        style={{ borderColor: 'var(--border)' }}
      >
        {image ? (
          <img src={image} alt="receipt" className="h-[150px] w-full object-cover" />
        ) : (
          <div
            className="flex h-[150px] items-center justify-center"
            style={{ background: 'linear-gradient(180deg,#2A2A32,#1F1F25)', color: '#5C5C66' }}
          >
            <span className="text-[10.5px]">receipt photo</span>
          </div>
        )}
        <div
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold text-white"
          style={{ background: 'rgba(180,76,246,.9)' }}
        >
          <Sparkles size={11} strokeWidth={2.4} /> Claude read this
        </div>
      </div>

      <div className="mt-3 text-[11px]" style={{ color: 'var(--text-3)' }}>
        Tap any value to edit it directly.
      </div>

      <Surface className="mt-2 !px-[18px] !py-1.5">
        <TextField label="Merchant" value={merchant} onChange={setMerchant} confidence="high" />
        <AmountField
          label="Total"
          value={amount}
          onChange={setAmount}
          display={parsedAmount !== null ? formatAmount(parsedAmount, 'IDR') : amount}
          confidence="high"
        />
        <TextField label="Date" value={date} onChange={setDate} confidence="high" />
        <SelectField label="Category" value={category} onChange={setCategory} options={categoriesList} confidence="low" pill />
        <SelectField label="Account" value={account} onChange={setAccount} options={accountsList} confidence="high" />
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
          Category is a guess — tap it above to change.{' '}
          <span className="font-bold" style={{ color: '#F59E0B' }}>
            Split into 2 categories?
          </span>
        </div>
      </div>

      <button
        onClick={async () => {
          const parsed = parseShorthandAmount(amount.replace(/[^\d.,km]/gi, '')) ?? 0
          await putTransaction({
            id: newId('txn'),
            merchant,
            category,
            categoryColor: CAT_COLOR[category] ?? '#8E8E99',
            account,
            amount: -Math.abs(parsed),
            currency: 'IDR',
            date: new Date().toISOString().slice(0, 10),
            owner: active,
            source: 'screenshot',
            type: 'expense',
          })
          navigate('/transactions')
        }}
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full text-[14px] font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.4)]"
        style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
      >
        <Check size={18} strokeWidth={2.4} /> Looks right — save
      </button>
      <div className="mt-2.5 text-center text-[10.5px]" style={{ color: 'var(--text-3)' }}>
        saves to your expenses &amp; syncs to Tere
      </div>
    </Screen>
  )
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-full border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
    >
      {children}
    </div>
  )
}

function Dot({ confidence }: { confidence: 'high' | 'low' }) {
  return <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: confidence === 'high' ? '#34D399' : '#F59E0B' }} />
}

function TextField({
  label,
  value,
  onChange,
  confidence,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  confidence: 'high' | 'low'
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
        {label}
      </span>
      <span className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[190px] rounded-lg bg-transparent px-2 py-1 text-right text-[13.5px] font-bold outline-none focus:bg-[var(--surface-2)]"
          style={{ color: 'var(--text)' }}
        />
        <Dot confidence={confidence} />
      </span>
    </label>
  )
}

function AmountField({
  label,
  value,
  onChange,
  display,
  confidence,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  display: string
  confidence: 'high' | 'low'
}) {
  const [editing, setEditing] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
        {label}
      </span>
      <span className="flex items-center gap-2">
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-[130px] rounded-lg px-2 py-1 text-right text-[16px] font-extrabold tnum outline-none"
            style={{ color: 'var(--text)', background: 'var(--surface-2)' }}
          />
        ) : (
          <button onClick={() => setEditing(true)} className="rounded-lg px-2 py-1 text-[16px] font-extrabold tnum" style={{ color: 'var(--text)' }}>
            {display}
          </button>
        )}
        <Dot confidence={confidence} />
      </span>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  confidence,
  pill,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  confidence: 'high' | 'low'
  pill?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
        {label}
      </span>
      <span className="flex items-center gap-2">
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none rounded-full px-3 py-1.5 text-[12.5px] font-bold outline-none"
            style={
              pill
                ? { background: 'rgba(45,212,191,.14)', color: '#2DD4BF' }
                : { background: 'var(--surface-2)', color: 'var(--text)' }
            }
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {pill && (
            <ShoppingCart
              size={13}
              strokeWidth={1.8}
              color="#2DD4BF"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-0"
            />
          )}
        </div>
        <Dot confidence={confidence} />
      </span>
    </div>
  )
}
