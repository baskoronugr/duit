import type { CurrencyCode } from './currency'

export const members = {
  me: { initial: 'A', name: 'Adit', color: '#B44CF6' },
  wife: { initial: 'N', name: 'Nadia', color: '#F472B6' },
}

export interface Account {
  id: string
  name: string
  institution: string
  masked: string
  type: 'bank' | 'pocket' | 'emoney' | 'cash' | 'credit_card'
  currency: CurrencyCode
  balance: number
  owner: 'Me' | 'Wife' | 'Joint'
  color: string
  creditLimit?: number
  dueDate?: string
  parentId?: string
}

export const accounts: Account[] = [
  { id: 'bca-utama', name: 'BCA Utama', institution: 'BCA', masked: '**** 4821', type: 'bank', currency: 'IDR', balance: 42_180_000, owner: 'Joint', color: '#60A5FA' },
  { id: 'bca-emergency', name: 'Emergency pocket', institution: 'BCA', masked: '', type: 'pocket', currency: 'IDR', balance: 38_500_000, owner: 'Joint', color: '#60A5FA', parentId: 'bca-utama' },
  { id: 'jago-trip', name: 'Trip Jepang pocket', institution: 'Jago', masked: '**** 7216', type: 'pocket', currency: 'IDR', balance: 18_800_000, owner: 'Joint', color: '#F6CE45' },
  { id: 'gopay', name: 'GoPay', institution: 'GoPay', masked: '', type: 'emoney', currency: 'IDR', balance: 620_000, owner: 'Me', color: '#34D399' },
  { id: 'bca-visa', name: 'BCA Visa', institution: 'BCA', masked: '**** 2210', type: 'credit_card', currency: 'IDR', balance: -4_820_000, owner: 'Joint', color: '#B44CF6', creditLimit: 25_000_000, dueDate: '5 Aug' },
  { id: 'usd-savings', name: 'USD Savings', institution: 'Wise', masked: '**** 9042', type: 'bank', currency: 'USD', balance: 3_920.4, owner: 'Me', color: '#34D399' },
]

export interface Transaction {
  id: string
  merchant: string
  category: string
  categoryColor: string
  account: string
  amount: number
  currency: CurrencyCode
  date: string
  owner: 'Me' | 'Wife' | 'Joint'
  source: 'manual' | 'telegram' | 'screenshot'
  type: 'expense' | 'income' | 'transfer'
}

export const transactions: Transaction[] = [
  { id: 't1', merchant: 'Superindo', category: 'Groceries', categoryColor: '#2DD4BF', account: 'BCA Utama', amount: -187_500, currency: 'IDR', date: '2026-07-18', owner: 'Joint', source: 'screenshot', type: 'expense' },
  { id: 't2', merchant: 'Kopi Kenangan', category: 'Dining', categoryColor: '#60A5FA', account: 'GoPay', amount: -38_000, currency: 'IDR', date: '2026-07-18', owner: 'Wife', source: 'telegram', type: 'expense' },
  { id: 't3', merchant: 'Salary', category: 'Income', categoryColor: '#34D399', account: 'BCA Utama', amount: 28_500_000, currency: 'IDR', date: '2026-07-17', owner: 'Me', source: 'manual', type: 'income' },
  { id: 't4', merchant: 'Grab', category: 'Transport', categoryColor: '#F472B6', account: 'GoPay', amount: -45_000, currency: 'IDR', date: '2026-07-17', owner: 'Me', source: 'manual', type: 'expense' },
  { id: 't5', merchant: 'Netflix', category: 'Subscription', categoryColor: '#FB923C', account: 'BCA Visa', amount: -186_000, currency: 'IDR', date: '2026-07-16', owner: 'Joint', source: 'manual', type: 'expense' },
  { id: 't6', merchant: 'Indomaret', category: 'Groceries', categoryColor: '#2DD4BF', account: 'GoPay', amount: -62_300, currency: 'IDR', date: '2026-07-16', owner: 'Me', source: 'screenshot', type: 'expense' },
]

export interface BudgetCategory {
  id: string
  name: string
  icon: string
  color: string
  weight: number
  spent: number
  budget: number
}

export const budgetCategories: BudgetCategory[] = [
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: '#2DD4BF', weight: 28, spent: 2_920_000, budget: 5_040_000 },
  { id: 'dining', name: 'Dining', icon: 'utensils', color: '#60A5FA', weight: 10, spent: 2_360_000, budget: 1_800_000 },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#F472B6', weight: 12, spent: 1_910_000, budget: 1_840_000 },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'repeat', color: '#FB923C', weight: 8, spent: 520_000, budget: 1_440_000 },
  { id: 'household', name: 'Household', icon: 'home', color: '#3A3A44', weight: 15, spent: 1_240_000, budget: 2_700_000 },
  { id: 'health', name: 'Health', icon: 'heart-pulse', color: '#34D399', weight: 12, spent: 780_000, budget: 2_160_000 },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: '#8E8E99', weight: 15, spent: 1_510_000, budget: 2_700_000 },
]

export interface Goal {
  id: string
  name: string
  owner: 'Me' | 'Wife' | 'Joint'
  weight: number
  target: number
  saved: number
  currency: CurrencyCode
  status: 'on-track' | 'behind'
  statusText: string
  color: string
}

export const goals: Goal[] = [
  { id: 'trip-jepang', name: 'Trip Jepang', owner: 'Joint', weight: 30, target: 40_000_000, saved: 18_800_000, currency: 'IDR', status: 'behind', statusText: '2 months behind', color: '#F59E0B' },
  { id: 'emergency', name: 'Dana Darurat', owner: 'Joint', weight: 45, target: 60_000_000, saved: 38_500_000, currency: 'IDR', status: 'on-track', statusText: 'on track · Nov 2026', color: '#34D399' },
  { id: 'phone', name: 'New Phone', owner: 'Me', weight: 15, target: 15_000_000, saved: 4_200_000, currency: 'IDR', status: 'on-track', statusText: 'on track · Jan 2027', color: '#34D399' },
  { id: 'umrah', name: 'Umrah', owner: 'Wife', weight: 10, target: 45_000_000, saved: 6_100_000, currency: 'IDR', status: 'behind', statusText: '1 month behind', color: '#F59E0B' },
]

export interface Holding {
  id: string
  name: string
  assetClass: 'Gold' | 'Stocks' | 'Reksadana' | 'Crypto'
  quantity: number
  unit: string
  priceCurrency: CurrencyCode
  invested: number
  currentValue: number
  gainPercent: number
  owner: 'Me' | 'Wife' | 'Joint'
}

export const holdings: Holding[] = [
  { id: 'antam', name: 'Antam Gold', assetClass: 'Gold', quantity: 25.5, unit: 'gram', priceCurrency: 'IDR', invested: 28_800_000, currentValue: 32_640_000, gainPercent: 13.3, owner: 'Joint' },
  { id: 'bbca', name: 'BBCA', assetClass: 'Stocks', quantity: 400, unit: 'share', priceCurrency: 'IDR', invested: 3_600_000, currentValue: 4_120_000, gainPercent: 14.4, owner: 'Me' },
  { id: 'reksa-saham', name: 'Sucorinvest Equity', assetClass: 'Reksadana', quantity: 12_400, unit: 'unit', priceCurrency: 'IDR', invested: 12_000_000, currentValue: 13_450_000, gainPercent: 12.1, owner: 'Wife' },
  { id: 'btc', name: 'Bitcoin', assetClass: 'Crypto', quantity: 0.042, unit: 'coin', priceCurrency: 'USD', invested: 1_650, currentValue: 2_180, gainPercent: 32.1, owner: 'Me' },
]

export interface Subscription {
  id: string
  name: string
  initial: string
  color: string
  amount: number
  currency: CurrencyCode
  renewsInDays: number
  owner: 'Me' | 'Wife' | 'Joint'
}

export const subscriptions: Subscription[] = [
  { id: 'netflix', name: 'Netflix', initial: 'N', color: '#F87171', amount: 186_000, currency: 'IDR', renewsInDays: 3, owner: 'Joint' },
  { id: 'icloud', name: 'iCloud+', initial: 'i', color: '#60A5FA', amount: 2.99, currency: 'USD', renewsInDays: 9, owner: 'Me' },
  { id: 'spotify', name: 'Spotify', initial: 'S', color: '#34D399', amount: 54_990, currency: 'IDR', renewsInDays: 14, owner: 'Wife' },
]

export const netWorth = {
  idr: 223_930_000,
  changePercent: 2.4,
  fxDate: '18 Jul 2026',
}

export const monthlySpending = {
  spent: 11_240_000,
  budget: 18_000_000,
  percent: 62,
  vsLastMonthPercent: -8,
  vsLastYearPercent: 12,
  trend: [14, 10, 16, 8, 12, 5],
  breakdown: [
    { name: 'Groceries', color: '#2DD4BF', amount: 2_920_000, percent: 26 },
    { name: 'Dining', color: '#60A5FA', amount: 2_360_000, percent: 21 },
    { name: 'Transport', color: '#F472B6', amount: 1_910_000, percent: 17 },
    { name: 'Subscriptions', color: '#FB923C', amount: 1_460_000, percent: 13 },
    { name: 'Other', color: '#3A3A44', amount: 2_590_000, percent: 23 },
  ],
}

export const portfolio = {
  currentValue: 84_250_000,
  gain: 7_850_000,
  gainPercent: 10.3,
}
