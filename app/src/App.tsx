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
import { AddHub } from './pages/AddHub'
import { Income } from './pages/Income'
import { Subscriptions } from './pages/Subscriptions'
import { SuggestBudgets } from './pages/SuggestBudgets'
import { AddIncome } from './pages/add/AddIncome'
import { AddTransfer } from './pages/add/AddTransfer'
import { AddSubscription } from './pages/add/AddSubscription'
import { AddGoal } from './pages/add/AddGoal'
import { AddBudget } from './pages/add/AddBudget'

export default function App() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddHub />} />
        <Route path="/add/expense" element={<QuickAdd />} />
        <Route path="/add/income" element={<AddIncome />} />
        <Route path="/add/transfer" element={<AddTransfer />} />
        <Route path="/add/subscription" element={<AddSubscription />} />
        <Route path="/add/goal" element={<AddGoal />} />
        <Route path="/add/budget" element={<AddBudget />} />
        <Route path="/quick-add" element={<QuickAdd />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/income" element={<Income />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/budgets/suggest" element={<SuggestBudgets />} />
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
