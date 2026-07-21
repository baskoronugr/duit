import { useState } from 'react'
import { Cloud, RefreshCw } from 'lucide-react'
import { Surface } from './Screen'
import { SyncBadge } from './SyncBadge'
import { useSync } from '../data/SyncContext'

/**
 * "Sync with PC" panel. The user points the app at their home hub
 * (e.g. https://duit.local:5984/db). Data stays local; this just turns on
 * two-way replication whenever the PC is reachable on the WiFi.
 */
export function SyncSection() {
  const { hubUrl, saveHubUrl, reconnect, testHub } = useSync()
  const [draft, setDraft] = useState(hubUrl)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<null | boolean>(null)

  async function onTest() {
    saveHubUrl(draft)
    setTesting(true)
    setTestResult(null)
    const ok = await testHub()
    setTestResult(ok)
    setTesting(false)
    if (ok) reconnect()
  }

  return (
    <>
      <div className="mt-5 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-3)' }}>
        Sync with PC
      </div>
      <Surface className="mt-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'rgba(96,165,250,.14)', color: '#60A5FA' }}
          >
            <Cloud size={18} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold">Home hub</div>
            <div className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
              your data lives on this device; syncs to your PC over WiFi
            </div>
          </div>
          <SyncBadge />
        </div>

        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://duit.local:5984/db"
          spellCheck={false}
          autoCapitalize="none"
          className="mt-3 w-full rounded-[14px] border px-4 py-3 text-[13px] outline-none"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />

        <button
          onClick={onTest}
          disabled={testing}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[13px] font-bold text-white"
          style={{ background: 'linear-gradient(140deg,#B44CF6,#7C3AED)', opacity: testing ? 0.7 : 1 }}
        >
          <RefreshCw size={15} strokeWidth={2.2} className={testing ? 'animate-spin' : ''} />
          {testing ? 'Testing…' : 'Test & connect'}
        </button>

        {testResult !== null && (
          <div
            className="mt-2.5 rounded-[12px] p-2.5 text-[11.5px]"
            style={{
              background: testResult ? 'rgba(52,211,153,.12)' : 'rgba(248,113,113,.12)',
              color: testResult ? '#34D399' : '#F87171',
            }}
          >
            {testResult
              ? 'Hub reachable — syncing is on. Changes now flow both ways when your PC is on.'
              : "Couldn't reach the hub. Check the PC is on, on the same WiFi, and the address is right (see SETUP.md)."}
          </div>
        )}

        <div className="mt-2.5 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
          Leave this empty to stay fully local (no sync). When set, the app replicates to your hub whenever it's
          reachable — otherwise it queues changes and syncs next time.
        </div>
      </Surface>
    </>
  )
}
