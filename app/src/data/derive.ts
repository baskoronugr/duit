import { ShoppingCart, Coffee, Car, Zap, Home, Heart, Repeat, TrendingUp, Wallet, MoreHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Transaction } from './mockData'

/** Rough IDR-equivalent for non-IDR amounts (mock FX until the FX feed is wired). */
const FX_TO_IDR: Record<string, number> = { IDR: 1, USD: 16_250, JPY: 108, SGD: 12_050, CNY: 2_250 }

export function toIdr(amount: number, currency: string): number {
  return amount * (FX_TO_IDR[currency] ?? 1)
}

export function inMonth(dateISO: string, year: number, month0: number): boolean {
  const d = new Date(dateISO)
  return d.getFullYear() === year && d.getMonth() === month0
}

export function monthTotals(txns: Transaction[], year: number, month0: number) {
  let spent = 0
  let income = 0
  for (const t of txns) {
    if (!inMonth(t.date, year, month0)) continue
    const idr = toIdr(t.amount, t.currency)
    if (t.type === 'income' || idr > 0) income += Math.max(0, idr)
    else if (t.type === 'expense') spent += Math.abs(idr)
  }
  return { spent, income }
}

/** Sum of expense transactions per category name for a given month. */
export function spentByCategory(txns: Transaction[], year: number, month0: number): Record<string, number> {
  const out: Record<string, number> = {}
  for (const t of txns) {
    if (t.type !== 'expense' || !inMonth(t.date, year, month0)) continue
    out[t.category] = (out[t.category] ?? 0) + Math.abs(toIdr(t.amount, t.currency))
  }
  return out
}

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Groceries: ShoppingCart,
  Dining: Coffee,
  Transport: Car,
  Utilities: Zap,
  Household: Home,
  Health: Heart,
  Subscription: Repeat,
  Income: TrendingUp,
}

export function iconForCategory(category: string): LucideIcon {
  return CATEGORY_ICON[category] ?? Wallet
}

export const fallbackIcon = MoreHorizontal
