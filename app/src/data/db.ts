import PouchDB from 'pouchdb-browser'
import {
  accounts as seedAccounts,
  transactions as seedTransactions,
  budgetCategories as seedBudgets,
  goals as seedGoals,
  holdings as seedHoldings,
  subscriptions as seedSubs,
  incomeEntries as seedIncome,
  type Account,
  type Transaction,
  type BudgetCategory,
  type Goal,
  type Holding,
  type Subscription,
  type IncomeEntry,
} from './mockData'

/**
 * Local-first data layer.
 *
 * Every read/write hits a local PouchDB (IndexedDB) so the app works fully
 * offline. When a hub URL is configured (the household PC), we run live
 * bidirectional replication to it. See PRD v3.0 §3.
 *
 * Documents are keyed `${docType}:${id}` and carry a `docType` field.
 */

export const db = new PouchDB('duit')

const HUB_KEY = 'duit-hub-url'

export function getHubUrl(): string {
  return localStorage.getItem(HUB_KEY) ?? ''
}
export function setHubUrl(url: string) {
  localStorage.setItem(HUB_KEY, url.trim().replace(/\/+$/, ''))
}

export type DocType = 'account' | 'transaction' | 'budget' | 'goal' | 'holding' | 'subscription' | 'income'

export type BaseDoc = { _id: string; _rev?: string; docType: DocType; id: string }
export type Stored<T> = T & BaseDoc

export function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ---- generic CRUD ---------------------------------------------------------

export async function listByType<T extends { id: string }>(docType: DocType): Promise<Stored<T>[]> {
  const res = await db.allDocs<Stored<T>>({
    include_docs: true,
    startkey: `${docType}:`,
    endkey: `${docType}:￰`,
  })
  return res.rows.map((r) => r.doc!).filter(Boolean)
}

export async function putEntity<T extends { id: string }>(docType: DocType, entity: T): Promise<void> {
  const _id = `${docType}:${entity.id}`
  let _rev: string | undefined
  try {
    _rev = (await db.get(_id))._rev
  } catch {
    /* new doc */
  }
  await db.put({ ...entity, _id, docType, ...(_rev ? { _rev } : {}) })
}

export async function removeEntity(docType: DocType, id: string): Promise<void> {
  const doc = await db.get(`${docType}:${id}`)
  await db.remove(doc)
}

// ---- seeding --------------------------------------------------------------

async function seedCollection<T extends { id: string }>(docType: DocType, rows: T[]): Promise<void> {
  const existing = await listByType<T>(docType)
  if (existing.length > 0) return
  await db.bulkDocs(rows.map((r) => ({ ...r, _id: `${docType}:${r.id}`, docType })))
}

/** Idempotently seed each collection from the mock data if it's empty. */
export async function seedIfEmpty(): Promise<void> {
  await seedCollection('account', seedAccounts)
  await seedCollection('transaction', seedTransactions)
  await seedCollection('budget', seedBudgets)
  await seedCollection('goal', seedGoals)
  await seedCollection('holding', seedHoldings)
  await seedCollection('subscription', seedSubs)
  await seedCollection('income', seedIncome)
}

// ---- typed helpers --------------------------------------------------------

export const listAccounts = () => listByType<Account>('account')
export const putAccount = (a: Account) => putEntity('account', a)
export const deleteAccount = (id: string) => removeEntity('account', id)

export const listTransactions = () => listByType<Transaction>('transaction')
export const putTransaction = (t: Transaction) => putEntity('transaction', t)

export const listBudgets = () => listByType<BudgetCategory>('budget')
export const putBudget = (b: BudgetCategory) => putEntity('budget', b)

export const listGoals = () => listByType<Goal>('goal')
export const putGoal = (g: Goal) => putEntity('goal', g)

export const listHoldings = () => listByType<Holding>('holding')

export const listSubscriptions = () => listByType<Subscription>('subscription')
export const putSubscription = (s: Subscription) => putEntity('subscription', s)

export const listIncome = () => listByType<IncomeEntry>('income')
export const putIncome = (i: IncomeEntry) => putEntity('income', i)

// ---- sync -----------------------------------------------------------------

export type SyncState = 'offline' | 'connecting' | 'synced' | 'syncing' | 'error'

let handler: PouchDB.Replication.Sync<object> | null = null

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
