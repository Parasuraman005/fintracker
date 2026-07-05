import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Search, 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  Download,
  FileText,
  Filter
} from 'lucide-react';
import { Transaction, FinanceSettings } from '../../types';
import { cn } from '../../lib/utils';

interface IncomeReportPageProps {
  transactions: Transaction[];
  financeSettings: FinanceSettings;
}

export const IncomeReportPage: React.FC<IncomeReportPageProps> = ({ 
  transactions, 
  financeSettings 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';

  const incomeTransactions = useMemo(() => {
    return transactions.filter(t => t.type === 'income');
  }, [transactions]);

  const filteredIncome = useMemo(() => {
    return incomeTransactions.filter(t => {
      const matchesSearch = 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.trn_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery);
      
      const matchesDate = t.date >= fromDate && t.date <= toDate;
      
      return matchesSearch && matchesDate;
    });
  }, [incomeTransactions, searchQuery, fromDate, toDate]);

  const totalIncome = useMemo(() => {
    return filteredIncome.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredIncome]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Income Report
          </h1>
          <p className="text-sm text-zinc-500">Analyze your earnings and revenue streams</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          <Download className="h-4 w-4" />
          Generate PDF
        </button>
      </div>

      {/* Summary Box */}
      <div className="rounded-3xl bg-emerald-600 p-8 text-white shadow-xl shadow-emerald-600/20 dark:bg-emerald-500">
        <div className="flex items-center gap-3 opacity-80">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Total Income for Selected Period</span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-black">{currencySymbol}{totalIncome.toLocaleString()}</span>
          <span className="text-emerald-100/60 font-medium">from {filteredIncome.length} transactions</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="grid gap-4 lg:grid-cols-12 print:hidden">
        {/* Search */}
        <div className="relative lg:col-span-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by ID, description, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        {/* Date Selection */}
        <div className="flex items-center gap-3 lg:col-span-6">
          <div className="relative flex-1">
            <CalendarIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <span className="text-zinc-400 text-xs font-bold uppercase">To</span>
          <div className="relative flex-1">
            <CalendarIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden print:border-none print:shadow-none">
        <div className="border-b border-zinc-200 p-6 dark:border-zinc-800 print:px-0">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-zinc-400" />
            Transaction Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Trn ID</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Description</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredIncome.map((t) => (
                <tr key={t.trn_id} className="hover:bg-zinc-50 transition-colors dark:hover:bg-zinc-900/50">
                  <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {t.date}
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-zinc-400">
                    {t.trn_id}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {t.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-right text-emerald-600 dark:text-emerald-400">
                    {currencySymbol}{t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {filteredIncome.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No income transactions found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredIncome.length > 0 && (
              <tfoot className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <td colSpan={4} className="px-6 py-4 font-bold text-zinc-500 text-right">Total</td>
                  <td className="px-6 py-4 font-black text-right text-emerald-600 dark:text-emerald-400">
                    {currencySymbol}{totalIncome.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* PDF Button at the end */}
      <div className="flex justify-end pt-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-lg"
        >
          <Download className="h-4 w-4" />
          Generate PDF Report
        </button>
      </div>
    </div>
  );
};
