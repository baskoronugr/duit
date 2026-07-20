import { Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Dashboard } from './pages/Dashboard'
import { QuickAdd } from './pages/QuickAdd'
import { Accounts } from './pages/Accounts'
import { Transactions } from './pages/Transactions'
import { Budgets } from './pages/Budgets'
import { Goals } from './pages/Goals'
import { Investments } from './pages/Investments'
import { ReceiptScan } from './pages/ReceiptScan'
import { Reprioritize } from './pages/Reprioritize'
import { AssistantChat } from './pages/AssistantChat'
import { More } from './pages/More'

export default function App() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quick-add" element={<QuickAdd />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/receipt-scan" element={<ReceiptScan />} />
        <Route path="/reprioritize" element={<Reprioritize />} />
        <Route path="/assistant" element={<AssistantChat />} />
        <Route path="/more" element={<More />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
