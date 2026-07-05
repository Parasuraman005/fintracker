import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Target, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  X,
  Save,
  CheckCircle2,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { MOCK_BUDGETS, CATEGORIES } from '../../data/mockData';
import { Budget } from '../../types';

export default function BudgetsPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  // Form State
  const [budgetForm, setBudgetForm] = useState({
    category: CATEGORIES.expense[0],
    limit: '',
    isMonthly: true,
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });

  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalBalance = totalBudget - totalSpent;

  const handleSave = () => {
    if (!budgetForm.limit) return;
    
    if (editingBudget) {
      setBudgets(budgets.map(b => 
        b.id === editingBudget.id ? {
          ...b,
          category: budgetForm.category,
          limit: Number(budgetForm.limit),
          fromDate: budgetForm.fromDate,
          toDate: budgetForm.toDate,
          isMonthly: budgetForm.isMonthly
        } : b
      ));
    } else {
      const budget: Budget = {
        id: Math.random().toString(36).substr(2, 9),
        category: budgetForm.category,
        limit: Number(budgetForm.limit),
        spent: 0,
        fromDate: budgetForm.fromDate,
        toDate: budgetForm.toDate,
        isMonthly: budgetForm.isMonthly
      };
      setBudgets([...budgets, budget]);
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBudget(null);
    setBudgetForm({
      category: CATEGORIES.expense[0],
      limit: '',
      isMonthly: true,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      category: budget.category,
      limit: budget.limit.toString(),
      isMonthly: budget.isMonthly,
      fromDate: budget.fromDate,
      toDate: budget.toDate
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
          Budgets
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 md:text-xs">
          Plan it. Track it. Crush it.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
          <div className="mb-1.5 flex items-center gap-2 text-zinc-500 md:mb-2">
            <Target className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="text-xs font-medium md:text-sm">Total Budget Fixed</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 dark:text-white md:text-2xl">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
          <div className="mb-1.5 flex items-center gap-2 text-zinc-500 md:mb-2">
            <ArrowDownCircle className="h-3.5 w-3.5 text-rose-500 md:h-4 md:w-4" />
            <span className="text-xs font-medium md:text-sm">Amount Spend</span>
          </div>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 md:text-2xl">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
          <div className="mb-1.5 flex items-center gap-2 text-zinc-500 md:mb-2">
            <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-500 md:h-4 md:w-4" />
            <span className="text-xs font-medium md:text-sm">Amount Balance</span>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 md:text-2xl">${totalBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Budget Table / List */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        {/* Mobile View: List */}
        <div className="divide-y divide-zinc-100 md:hidden dark:divide-zinc-900">
          {budgets.map((b) => (
            <div key={b.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{b.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('transactions')} className="p-1.5 text-zinc-400 hover:text-emerald-600"><History className="h-4 w-4" /></button>
                  <button onClick={() => handleEdit(b)} className="p-1.5 text-zinc-400 hover:text-emerald-600"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 text-zinc-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Budget Fixed</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">${b.limit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Amount Spend</p>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">${b.spent.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-medium text-zinc-400">{b.fromDate} to {b.toDate}</span>
                <span className={cn(
                  "text-xs font-bold",
                  (b.limit - b.spent) < 0 ? "text-rose-600" : "text-emerald-600"
                )}>
                  Bal: ${(b.limit - b.spent).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Budget Fixed</th>
                <th className="px-6 py-4 font-medium">Amount Spend</th>
                <th className="px-6 py-4 font-medium">Amount Balance</th>
                <th className="px-6 py-4 font-medium">From - Till</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {budgets.map((b) => (
                <tr key={b.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {b.category}
                  </td>
                  <td className="px-6 py-4 text-zinc-900 dark:text-white font-medium">
                    ${b.limit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-rose-600 dark:text-rose-400 font-medium">
                    ${b.spent.toLocaleString()}
                  </td>
                  <td className={cn(
                    "px-6 py-4 font-medium",
                    (b.limit - b.spent) < 0 ? "text-rose-600" : "text-emerald-600"
                  )}>
                    ${(b.limit - b.spent).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-xs">
                    {b.fromDate} to {b.toDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setActiveTab('transactions')}
                        className="p-1 text-zinc-400 hover:text-emerald-600"
                        title="View Transactions"
                      >
                        <History className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(b)}
                        className="p-1 text-zinc-400 hover:text-emerald-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 md:bottom-8 md:right-8 md:h-14 md:w-14 transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Budget Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950"
            >
              <div className="mb-4 flex items-center justify-between md:mb-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white md:text-xl">
                  {editingBudget ? 'Edit Budget' : 'Fix Budget'}
                </h3>
                <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-sm md:font-medium md:text-zinc-500">Expense Category</label>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-2.5 md:text-sm"
                  >
                    {CATEGORIES.expense.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-sm md:font-medium md:text-zinc-500">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={budgetForm.limit}
                    onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-2.5 md:text-sm"
                  />
                </div>

                <div className="flex items-center justify-between py-1 md:py-2">
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-300 md:text-sm">Monthly Budget</span>
                  <button
                    onClick={() => setBudgetForm({ ...budgetForm, isMonthly: !budgetForm.isMonthly })}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors md:h-6 md:w-11",
                      budgetForm.isMonthly ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all md:top-1",
                      budgetForm.isMonthly ? "left-4.5 md:left-6" : "left-0.5 md:left-1"
                    )} />
                  </button>
                </div>

                {!budgetForm.isMonthly && (
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-sm md:font-medium md:text-zinc-500">From Date</label>
                      <input
                        type="date"
                        value={budgetForm.fromDate}
                        onChange={(e) => setBudgetForm({ ...budgetForm, fromDate: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-2.5 md:text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-sm md:font-medium md:text-zinc-500">To Date</label>
                      <input
                        type="date"
                        value={budgetForm.toDate}
                        onChange={(e) => setBudgetForm({ ...budgetForm, toDate: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-2.5 md:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 md:gap-3 md:pt-6">
                  <button
                    onClick={closeForm}
                    className="flex-1 rounded-xl border border-zinc-200 bg-white py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 md:py-2.5 md:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 md:py-2.5 md:text-sm"
                  >
                    {editingBudget ? 'Save Changes' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
