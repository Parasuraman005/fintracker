import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Calendar as CalendarIcon, 
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Transaction, FinanceSettings, Bill } from '../../types';
import { cn } from '../../lib/utils';

interface BillsReportPageProps {
  bills: Bill[];
  financeSettings: FinanceSettings;
  onBack: () => void;
}

export const BillsReportPage: React.FC<BillsReportPageProps> = ({ 
  bills, 
  financeSettings,
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const billDate = new Date(bill.dueDate);
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const matchesDate = billDate >= start && billDate <= end;
    return matchesSearch && matchesDate;
  });

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = filteredBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = filteredBills.filter(b => !b.isPaid && new Date(b.dueDate) >= new Date()).reduce((sum, b) => sum + b.amount, 0);
  const overdueAmount = filteredBills.filter(b => !b.isPaid && new Date(b.dueDate) < new Date()).reduce((sum, b) => sum + b.amount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 p-4 lg:p-8"
    >
      {/* Header */}
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
              Bills Report
            </h1>
            <p className="text-sm font-medium text-zinc-500">Summary of upcoming and past dues</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
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
          <button 
            onClick={handlePrint}
            className="rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-500 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Obligations</p>
          <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">{currencySymbol}{totalAmount.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Paid Amount</p>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{currencySymbol}{paidAmount.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pending Amount</p>
          <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">{currencySymbol}{pendingAmount.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Overdue Amount</p>
          <p className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">{currencySymbol}{overdueAmount.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative print:hidden">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search by bill name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-white"
        />
      </motion.div>

      {/* Table Section */}
      <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:bg-zinc-900/50">
                <th className="px-6 py-4">Bill Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {filteredBills.map(bill => (
                <tr key={bill.id} className="group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-900">
                        <FileText className="h-4 w-4 text-zinc-500" />
                      </div>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{bill.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-zinc-500">{bill.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                        bill.isPaid ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" :
                        new Date(bill.dueDate) < new Date() ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10" :
                        "bg-amber-50 text-amber-600 dark:bg-amber-500/10"
                      )}>
                        {bill.isPaid ? 'paid' : new Date(bill.dueDate) < new Date() ? 'overdue' : 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {currencySymbol}{bill.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-zinc-200" />
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No matching bills found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
