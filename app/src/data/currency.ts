export type CurrencyCode = 'IDR' | 'USD' | 'JPY' | 'SGD' | 'CNY'

interface CurrencyMeta {
  symbol: string
  decimals: number
  symbolPosition: 'prefix'
}

const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  IDR: { symbol: 'Rp', decimals: 0, symbolPosition: 'prefix' },
  USD: { symbol: '$', decimals: 2, symbolPosition: 'prefix' },
  JPY: { symbol: '¥', decimals: 0, symbolPosition: 'prefix' },
  SGD: { symbol: 'S$', decimals: 2, symbolPosition: 'prefix' },
  CNY: { symbol: '¥', decimals: 2, symbolPosition: 'prefix' },
}

/** Formats a number with dot thousand separators, comma decimals — Indonesian-style grouping used across the app regardless of currency. */
function groupNumber(value: number, decimals: number): string {
  const fixed = Math.abs(value).toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return decPart ? `${grouped},${decPart}` : grouped
}

export function formatAmount(value: number, currency: CurrencyCode): string {
  const meta = CURRENCIES[currency]
  const sign = value < 0 ? '-' : ''
  return `${sign}${meta.symbol} ${groupNumber(value, meta.decimals)}`
}

export function currencyTag(currency: CurrencyCode): string {
  return currency
}

/** Parses shorthand amount entry like "45k" -> 45000, "1.2m" -> 1200000. */
export function parseShorthandAmount(input: string): number | null {
  const trimmed = input.trim().toLowerCase().replace(/,/g, '.')
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(k|m)?$/)
  if (!match) return null
  const [, numStr, suffix] = match
  const num = parseFloat(numStr)
  if (suffix === 'k') return Math.round(num * 1_000)
  if (suffix === 'm') return Math.round(num * 1_000_000)
  return Math.round(num)
}
