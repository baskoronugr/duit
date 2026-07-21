import { useEffect, useState, useCallback } from 'react'
import { listByType, type DocType, type Stored } from './db'
import { useSync } from './SyncContext'

/**
 * Reads a PouchDB collection into React state and refetches whenever the local
 * DB changes (a sync pull, or a local write that bumps changeTick via reload()).
 */
export function useCollection<T extends { id: string }>(docType: DocType) {
  const { changeTick, ready } = useSync()
  const [items, setItems] = useState<Stored<T>[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const rows = await listByType<T>(docType)
    setItems(rows)
    setLoading(false)
  }, [docType])

  useEffect(() => {
    if (ready) reload()
  }, [ready, changeTick, reload])

  return { items, loading, reload }
}
