import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, X, Mic, ArrowUp } from 'lucide-react'
import { Screen } from '../components/Screen'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const initialMessages: Message[] = [
  { role: 'user', text: 'Berapa spending makan di luar bulan ini vs bulan lalu?' },
  { role: 'assistant', text: '' },
]

const suggestions = ['Show those brunches', 'Tighten Dining budget', 'Compare vs Tere']

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
  }

  return (
    <Screen>
      <div className="flex h-[calc(100vh-140px)] flex-col">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
          >
            <Sparkles size={19} strokeWidth={2} color="#fff" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-extrabold">Ask Duit</div>
            <div className="text-[10.5px]" style={{ color: '#34D399' }}>
              ● sees your live numbers
            </div>
          </div>
          <Link to="/">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
            >
              <X size={17} strokeWidth={2} />
            </div>
          </Link>
        </div>

        <div className="mt-[18px] flex flex-1 flex-col gap-3.5 overflow-y-auto">
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div
                key={i}
                className="max-w-[82%] self-end rounded-[20px] rounded-br-[6px] px-4 py-3 text-[13px] leading-relaxed text-white"
                style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
              >
                {m.text}
              </div>
            ) : (
              <AssistantBubble key={i} />
            ),
          )}

          <div className="flex max-w-[95%] flex-wrap gap-2 self-start">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border px-3.5 py-2 text-[11.5px] font-semibold"
                style={{ background: 'var(--surface)', borderColor: 'rgba(180,76,246,.4)', color: 'var(--accent-link)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-3.5 flex items-center gap-2 rounded-full border py-1.5 pl-4.5 pr-1.5"
          style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask about your money…"
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: 'var(--text)' }}
          />
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}
          >
            <Mic size={17} strokeWidth={1.8} />
          </div>
          <button
            onClick={() => send(input)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)' }}
          >
            <ArrowUp size={17} strokeWidth={2.2} color="#fff" />
          </button>
        </div>
      </div>
    </Screen>
  )
}

function AssistantBubble() {
  return (
    <div
      className="max-w-[88%] self-start rounded-[20px] rounded-bl-[6px] border p-3.5"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
        Dining bulan ini <b className="tnum" style={{ color: 'var(--text)' }}>Rp 2.360.000</b> — naik{' '}
        <b className="tnum" style={{ color: '#F87171' }}>18%</b> dari Juni (Rp 2.000.000). Penyebab utama: 4× weekend
        brunch &gt; Rp 250k.
      </div>
      <div className="mt-3 rounded-[14px] p-3" style={{ background: 'var(--surface-2)' }}>
        <div className="flex justify-between text-[10.5px]" style={{ color: 'var(--text-3)' }}>
          <div>Jun</div>
          <div>Jul (to date)</div>
        </div>
        <div className="mt-2 flex h-[52px] items-end gap-2">
          <div className="flex-1 rounded-t-[8px] rounded-b-[3px]" style={{ background: '#3A3A44', height: '72%' }} />
          <div
            className="flex-1 rounded-t-[8px] rounded-b-[3px]"
            style={{ background: 'linear-gradient(180deg,#B44CF6,#7C3AED)', height: '92%' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-bold tnum">
          <div style={{ color: 'var(--text-3)' }}>Rp 2,0 jt</div>
          <div>Rp 2,36 jt</div>
        </div>
      </div>
      <div className="mt-2.5 text-[10px]" style={{ color: '#5C5C66' }}>
        from 23 transactions · owner: All
      </div>
    </div>
  )
}
