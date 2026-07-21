import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { seedIfEmpty, startSync, stopSync, getHubUrl, setHubUrl, pingHub, type SyncState } from './db'

interface SyncContextValue {
  state: SyncState
  hubUrl: string
  ready: boolean
  saveHubUrl: (url: string) => void
  reconnect: () => void
  testHub: () => Promise<boolean>
  /** bumps whenever replication pulls a change, so views can refetch */
  changeTick: number
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined)

export function SyncProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SyncState>('offline')
  const [hubUrl, setUrl] = useState(getHubUrl())
  const [ready, setReady] = useState(false)
  const [changeTick, setChangeTick] = useState(0)
  const stopRef = useRef<() => void>(() => {})

  useEffect(() => {
    let cancelled = false
    seedIfEmpty().finally(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    stopRef.current = startSync(setState, () => setChangeTick((t) => t + 1))
    return () => stopRef.current()
    // re-run when the hub URL changes
  }, [hubUrl])

  function saveHubUrl(url: string) {
    setHubUrl(url)
    setUrl(getHubUrl())
  }

  function reconnect() {
    stopSync()
    stopRef.current = startSync(setState, () => setChangeTick((t) => t + 1))
  }

  return (
    <SyncContext.Provider value={{ state, hubUrl, ready, saveHubUrl, reconnect, testHub: pingHub, changeTick }}>
      {children}
    </SyncContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSync() {
  const ctx = useContext(SyncContext)
  if (!ctx) throw new Error('useSync must be used within SyncProvider')
  return ctx
}
