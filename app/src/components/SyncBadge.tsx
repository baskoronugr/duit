import { Cloud, CloudOff, RefreshCw, Check, AlertTriangle } from 'lucide-react'
import { useSync } from '../data/SyncContext'

const META: Record<string, { label: string; color: string; icon: typeof Cloud }> = {
  offline: { label: 'Local only', color: '#8E8E99', icon: CloudOff },
  connecting: { label: 'Connecting…', color: '#F59E0B', icon: RefreshCw },
  syncing: { label: 'Syncing…', color: '#60A5FA', icon: RefreshCw },
  synced: { label: 'Synced', color: '#34D399', icon: Check },
  error: { label: 'Sync error', color: '#F87171', icon: AlertTriangle },
}

export function SyncBadge({ compact = false }: { compact?: boolean }) {
  const { state } = useSync()
  const m = META[state] ?? META.offline
  const Icon = m.icon
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ background: `${m.color}22`, color: m.color }}
    >
      <Icon size={12} strokeWidth={2.2} className={state === 'syncing' || state === 'connecting' ? 'animate-spin' : ''} />
      {!compact && m.label}
    </div>
  )
}
