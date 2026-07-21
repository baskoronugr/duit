import PouchDB from 'pouchdb-browser'
import { accounts as seedAccounts, type Account } from './mockData'

/**
 * Local-first data layer.
 *
 * All reads/writes hit a local PouchDB (IndexedDB) so the app works fully
 * offline. When a hub URL is configured (the household PC), we run live
 * bidirectional replication to it — sync happens whenever the PC is reachable
 * on the home WiFi. See PRD v3.0 §3.
 */

export const db = new PouchDB('duit')

const HUB_KEY = 'duit-hub-url'
const SEED_FLAG = '_local/seeded-v1'

export function getHubUrl(): string {
  return localStorage.getItem(HUB_KEY) ?? ''
}

export function setHubUrl(url: string) {
  localStorage.setItem(HUB_KEY, url.trim().replace(/\/+$/, ''))
}

// ---- document model -------------------------------------------------------

export interface AccountDoc extends Account {
  _id: string // `account:<id>`
  _rev?: string
  docType: 'account'
}

function toDoc(a: Account): AccountDoc {
  return { ...a, _id: `account:${a.id}`, docType: 'account' }
}

// ---- seeding --------------------------------------------------------------

/** One-time load of the mock accounts so a fresh device isn't empty. Idempotent. */
export async function seedIfEmpty(): Promise<void> {
  try {
    await db.get(SEED_FLAG)
    return // already seeded
  } catch {
    // not seeded yet
  }
  const docs = seedAccounts.map(toDoc)
  await db.bulkDocs(docs)
  await db.put({ _id: SEED_FLAG } as PouchDB.Core.PutDocument<object>)
}

// ---- accounts CRUD --------------------------------------------------------

export async function listAccounts(): Promise<AccountDoc[]> {
  const res = await db.allDocs<AccountDoc>({
    include_docs: true,
    startkey: 'account:',
    endkey: 'account:￰',
  })
  return res.rows.map((r) => r.doc!).filter(Boolean)
}

export async function putAccount(a: Account): Promise<void> {
  const _id = `account:${a.id}`
  let _rev: string | undefined
  try {
    const existing = await db.get<AccountDoc>(_id)
    _rev = existing._rev
  } catch {
    // new doc
  }
  await db.put({ ...toDoc(a), ...(_rev ? { _rev } : {}) })
}

export async function deleteAccount(id: string): Promise<void> {
  const doc = await db.get<AccountDoc>(`account:${id}`)
  await db.remove(doc)
}

// ---- sync -----------------------------------------------------------------

export type SyncState = 'offline' | 'connecting' | 'synced' | 'syncing' | 'error'

let handler: PouchDB.Replication.Sync<object> | null = null

/**
 * Start live two-way replication with the hub. Returns a stop() function.
 * onState reports connection/sync status for the UI badge.
 */
export function startSync(onState: (s: SyncState) => void, onChange?: () => void): () => void {
  const url = getHubUrl()
  if (!url) {
    onState('offline')
    return () => {}
  }
  stopSync()
  onState('connecting')
  const remote = new PouchDB(`${url}/duit`)
  handler = db.sync(remote, { live: true, retry: true }) as unknown as PouchDB.Replication.Sync<object>

  handler
    .on('active', () => onState('syncing'))
    .on('paused', (err?: unknown) => onState(err ? 'error' : 'synced'))
    .on('change', () => {
      onState('syncing')
      onChange?.()
    })
    .on('denied', () => onState('error'))
    .on('error', () => onState('error'))

  return stopSync
}

export function stopSync() {
  if (handler) {
    handler.cancel()
    handler = null
  }
}

/** Quick reachability probe against the hub's health endpoint. */
export async function pingHub(): Promise<boolean> {
  const url = getHubUrl()
  if (!url) return false
  try {
    const base = url.replace(/\/db$/, '')
    const res = await fetch(`${base}/hub/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}
