import { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  ChevronRight,
  Filter,
  Download,
  PieChart,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Transaction, TransactionType, FinanceSettings as FinanceType } from '../types';

export default function CategoryReportPage({ 
  transactions, 
  financeSettings,
  onBack 
}: { 
  transactions: Transaction[], 
  financeSettings: FinanceType,
  onBack: () => void 
}) {
  const [type, setType] = useState<TransactionType>('expense');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';

  // Filter transactions based on date and type
  const filteredByTypeAndDate = useMemo(() => {
    let result = transactions.filter(t => t.type === type);
    if (fromDate) result = result.filter(t => t.date >= fromDate);
    if (toDate) result = result.filter(t => t.date <= toDate);
    return result;
  }, [transactions, type, fromDate, toDate]);

  const totalAmount = useMemo(() => {
    return filteredByTypeAndDate.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredByTypeAndDate]);

  // Calculate totals per category
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredByTypeAndDate.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    // Sort by amount descending
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [filteredByTypeAndDate]);

  // Selected category transactions
  const categoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return filteredByTypeAndDate.filter(t => t.category === selectedCategory);
  }, [filteredByTypeAndDate, selectedCategory]);

  // Automatically select first category if none selected or if type changes
  useMemo(() => {
    if (categoryTotals.length > 0) {
      if (!selectedCategory || !categoryTotals.find(([cat]) => cat === selectedCategory)) {
        setSelectedCategory(categoryTotals[0][0]);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [categoryTotals]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 pb-24 md:pb-8"
    >
       {/* Header Section */}
       <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="group rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-500 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Category Wise Report
            </h1>
            <p className="text-sm font-medium text-zinc-500">Analysis by category</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border-none bg-transparent pl-10 pr-2 py-1.5 text-xs font-bold outline-none dark:text-white"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">to</span>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border-none bg-transparent pl-10 pr-2 py-1.5 text-xs font-bold outline-none dark:text-white"
            />
          </div>
        </div>
      </header>

      {/* Toggle Section */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="flex w-full max-w-md rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900 shadow-inner">
          {(['income', 'expense'] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-bold transition-all",
                type === t
                  ? "bg-white text-zinc-900 shadow-md dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Category Boxes Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {categoryTotals.map(([cat, amount]) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all relative overflow-hidden",
                isSelected 
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-zinc-950" 
                  : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-tight text-center truncate w-full px-1">{cat}</span>
              <span className={cn(
                "text-sm font-black",
                isSelected 
                  ? (type === 'income' ? "text-emerald-400" : "text-rose-400") 
                  : (type === 'income' ? "text-emerald-600" : "text-rose-600")
              )}>
                {currencySymbol}{amount.toLocaleString()}
              </span>
              {isSelected && (
                <motion.div 
                  layoutId="active-indicator"
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 w-full",
                    type === 'income' ? "bg-emerald-500" : "bg-rose-500"
                  )} 
                />
              )}
            </button>
          );
        })}
        {categoryTotals.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-3xl dark:border-zinc-800">
             <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-zinc-200" />
             <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No categories found</p>
          </div>
        )}
      </motion.div>

      {/* Detailed Table Section */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {selectedCategory ? (
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden"
            >
              <div className="border-b border-zinc-100 p-6 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {selectedCategory} Details
                  </h3>
                  <p className="text-sm text-zinc-500">Transaction history for this category</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category Total</p>
                  <p className={cn(
                    "text-xl font-bold",
                    type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {currencySymbol}{categoryTotals.find(([cat]) => cat === selectedCategory)?.[1].toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:bg-zinc-900/50">
                      <th className="px-6 py-4">Tr. ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                    {categoryTransactions.map(t => (
                      <tr key={t.trn_id} className="group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-[10px] text-zinc-400">{t.trn_id}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{t.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{t.description}</td>
                        <td className={cn(
                          "px-6 py-4 text-right text-sm font-bold",
                          type === 'income' ? "text-emerald-600" : "text-zinc-900 dark:text-white"
                        )}>
                          {currencySymbol}{t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/20">
              <PieChart className="h-10 w-10 text-zinc-200 mb-4" />
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Select a category box above</p>
              <p className="mt-1 text-xs text-zinc-500">To view detailed transaction breakdown</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
