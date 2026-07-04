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
                Category Report
              </h1>
              <p className="text-sm font-medium text-zinc-500">Deep dive into your {type} patterns</p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
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
           <button className="rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-500 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900">
             <Download className="h-5 w-5" />
           </button>
         </div>
       </header>

       {/* Summary Bar */}
       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
         <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
           <div className="flex items-center gap-3">
             <div className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
               <Filter className="h-4 w-4 text-zinc-500" />
             </div>
             <span className="text-sm font-medium text-zinc-500">Report Type</span>
           </div>
           <div className="mt-4 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
             {(['income', 'expense'] as TransactionType[]).map((t) => (
               <button
                 key={t}
                 onClick={() => setType(t)}
                 className={cn(
                   "flex-1 rounded-lg py-2 text-xs font-bold transition-all",
                   type === t
                     ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                     : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                 )}
               >
                 {t.charAt(0).toUpperCase() + t.slice(1)}
               </button>
             ))}
           </div>
         </motion.div>

         <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
           <div className="flex items-center gap-3">
             <div className={cn(
               "rounded-xl p-2",
               type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
             )}>
               {type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
             </div>
             <span className="text-sm font-medium text-zinc-500">Total {type}</span>
           </div>
           <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
             {currencySymbol}{totalAmount.toLocaleString()}
           </p>
         </motion.div>

         <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
           <div className="flex items-center gap-3">
             <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10">
               <PieChart className="h-4 w-4" />
             </div>
             <span className="text-sm font-medium text-zinc-500">Categories</span>
           </div>
           <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
             {categoryTotals.length}
           </p>
         </motion.div>

         <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
           <div className="flex items-center gap-3">
             <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/10">
               <TrendingUp className="h-4 w-4" />
             </div>
             <span className="text-sm font-medium text-zinc-500">Primary Source</span>
           </div>
           <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white truncate">
             {categoryTotals[0]?.[0] || 'N/A'}
           </p>
         </motion.div>
       </div>

       {/* Main Dashboard Layout */}
       <div className="grid gap-8 lg:grid-cols-12">
         {/* Categories Side Bar */}
         <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">
           <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
             <div className="mb-6 flex items-center justify-between">
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Categories</h3>
               <ListFilter className="h-4 w-4 text-zinc-300" />
             </div>
             <div className="space-y-3">
               {categoryTotals.map(([cat, amount]) => {
                 const percentage = ((amount / totalAmount) * 100).toFixed(1);
                 const isSelected = selectedCategory === cat;
                 return (
                   <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={cn(
                       "group flex w-full flex-col gap-3 rounded-2xl p-4 transition-all text-left relative overflow-hidden",
                       isSelected 
                        ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 dark:bg-zinc-100 dark:text-zinc-950" 
                        : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
                     )}
                   >
                     {isSelected && (
                       <motion.div 
                         layoutId="active-cat"
                         className={cn(
                           "absolute left-0 top-0 h-full w-1",
                           type === 'income' ? "bg-emerald-500" : "bg-rose-500"
                         )} 
                       />
                     )}
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-bold">{cat}</span>
                       <span className={cn(
                         "text-sm font-bold",
                         isSelected ? (type === 'income' ? "text-emerald-400" : "text-rose-400") : (type === 'income' ? "text-emerald-600" : "text-rose-600")
                       )}>
                         {currencySymbol}{amount.toLocaleString()}
                       </span>
                     </div>
                     <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${percentage}%` }}
                         className={cn(
                           "h-full transition-all duration-500",
                           isSelected ? (type === 'income' ? "bg-emerald-400" : "bg-rose-400") : (type === 'income' ? "bg-emerald-500" : "bg-rose-500")
                         )}
                       />
                     </div>
                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-60">
                       <span>{percentage}% of {type}</span>
                       <ChevronRight className={cn(
                         "h-3 w-3 transition-transform",
                         isSelected ? "translate-x-1" : "group-hover:translate-x-1"
                       )} />
                     </div>
                   </button>
                 );
               })}
               {categoryTotals.length === 0 && (
                 <div className="py-12 text-center">
                    <LayoutGrid className="mx-auto mb-3 h-8 w-8 text-zinc-200" />
                    <p className="text-xs font-medium text-zinc-400">No data found</p>
                 </div>
               )}
             </div>
           </div>
         </motion.div>

         {/* Content Area */}
         <motion.div variants={itemVariants} className="lg:col-span-8">
           <AnimatePresence mode="wait">
             {selectedCategory ? (
               <motion.div 
                 key={selectedCategory}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 h-full"
               >
                  <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                          {selectedCategory}
                        </h3>
                        <span className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                          type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                        )}>
                          {type}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">History of transactions in this category</p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/50 text-right min-w-[150px]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Volume</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {currencySymbol}{categoryTotals.find(([cat]) => cat === selectedCategory)?.[1].toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:border-zinc-800">
                          <th className="px-4 py-4">Transaction ID</th>
                          <th className="px-4 py-4">Date</th>
                          <th className="px-4 py-4">Description</th>
                          <th className="px-4 py-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                        {categoryTransactions.map(t => (
                          <tr key={t.trn_id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                            <td className="px-4 py-5 font-mono text-[10px] text-zinc-400 group-hover:text-zinc-600 transition-colors">{t.trn_id}</td>
                            <td className="px-4 py-5 text-sm text-zinc-600 dark:text-zinc-400">{t.date}</td>
                            <td className="px-4 py-5 text-sm font-medium text-zinc-900 dark:text-white">{t.description}</td>
                            <td className={cn(
                              "px-4 py-5 text-right text-sm font-bold",
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
               <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/20">
                 <div className="rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900 mb-4">
                   <LayoutGrid className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                 </div>
                 <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Select category</p>
                 <p className="mt-1 text-xs text-zinc-500">Pick a category from the sidebar to see details</p>
               </div>
             )}
           </AnimatePresence>
         </motion.div>
       </div>
    </motion.div>
  );
}
