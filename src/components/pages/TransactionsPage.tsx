import { useState, useMemo } from 'react';
import { 
  Search, 
  FileDown, 
  Filter, 
  Plus, 
  Calendar as CalendarIcon,
  ChevronDown,
  ArrowUpDown,
  List,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { CATEGORIES } from '../../data/mockData';
import { Transaction, FinanceSettings as FinanceType } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TransactionsPageProps {
  transactions: Transaction[];
  financeSettings: FinanceType;
  onAddClick: () => void;
  onEditClick: (trn: Transaction) => void;
  onDeleteClick: (id: string) => void;
}

export default function TransactionsPage({ 
  transactions, 
  financeSettings,
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}: TransactionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'amount' | 'date'>('date');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.trn_id.toLowerCase().includes(lowerSearch) || 
        t.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Date range
    if (fromDate) {
      result = result.filter(t => t.date >= fromDate);
    }
    if (toDate) {
      result = result.filter(t => t.date <= toDate);
    }

    // Sort
    result.sort((a, b) => {
      const valA = sortBy === 'amount' ? a.amount : new Date(a.date).getTime();
      const valB = sortBy === 'amount' ? b.amount : new Date(b.date).getTime();
      
      if (sortOrder === 'asc') return valA - valB;
      return valB - valA;
    });

    return result;
  }, [searchTerm, selectedCategory, fromDate, toDate, sortOrder, sortBy, transactions]);

  const summary = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income');
    const expense = filteredTransactions.filter(t => t.type === 'expense');

    return {
      incomeCount: income.length,
      expenseCount: expense.length,
      incomeTotal: income.reduce((acc, t) => acc + t.amount, 0),
      expenseTotal: expense.reduce((acc, t) => acc + t.amount, 0)
    };
  }, [filteredTransactions]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Transaction Report', 14, 22);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Transactions: ${filteredTransactions.length}`, 14, 35);
    doc.text(`Total Income: ${currencySymbol}${summary.incomeTotal.toLocaleString()}`, 14, 40);
    doc.text(`Total Expense: ${currencySymbol}${summary.expenseTotal.toLocaleString()}`, 14, 45);

    if (selectedCategory) {
      doc.text(`Category: ${selectedCategory}`, 14, 50);
    }

    // Add table
    const tableData = filteredTransactions.map(t => [
      t.trn_id,
      t.date,
      t.description,
      t.category,
      `${t.type === 'income' ? '+' : '-'}${currencySymbol}${t.amount.toLocaleString()}`,
      t.type.charAt(0).toUpperCase() + t.type.slice(1)
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['ID', 'Date', 'Description', 'Category', 'Amount', 'Type']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Emerald-500 approx
      styles: { fontSize: 8 },
    });

    doc.save(`transactions_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Transactions
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              selectedCategory 
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            )}
          >
            <List className="h-4 w-4" />
            {selectedCategory || 'All Categories'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <span>{sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</span>
            <ArrowUpDown className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Income Count</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{summary.incomeCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Expense Count</p>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{summary.expenseCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Income</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white truncate">{currencySymbol}{summary.incomeTotal.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Expense</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white truncate">{currencySymbol}{summary.expenseTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {/* Mobile View: Cards */}
        <div className="grid gap-3 md:hidden">
          {filteredTransactions.map((t) => (
            <div 
              key={t.trn_id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      t.type === 'income' ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {t.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500">
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                      {t.category}
                    </span>
                    <span>•</span>
                    <span>{t.date}</span>
                    <span>•</span>
                    <span className="font-mono">{t.trn_id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-black",
                    t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
                  )}>
                    {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEditClick(t)}
                      className="rounded-lg bg-zinc-50 p-1.5 text-zinc-400 hover:text-emerald-600 dark:bg-zinc-900"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => onDeleteClick(t.trn_id)}
                      className="rounded-lg bg-zinc-50 p-1.5 text-zinc-400 hover:text-rose-600 dark:bg-zinc-900"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
              <p className="text-sm text-zinc-500">No transactions found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 font-medium">Trn ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredTransactions.map((t) => (
                  <tr key={t.trn_id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {t.trn_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {t.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                      {t.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 font-semibold text-right",
                      t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
                    )}>
                      {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        t.type === 'income' 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400" 
                          : "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400"
                      )}>
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEditClick(t)}
                          className="p-1 text-zinc-400 hover:text-emerald-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteClick(t.trn_id)}
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
      </div>

      {/* Floating Add Button */}
      <button
        onClick={onAddClick}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 md:bottom-8 md:right-8 transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Filter by Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategoryModal(false);
                }}
                className={cn(
                  "w-full rounded-xl border py-2.5 text-sm font-bold transition-all",
                  selectedCategory === null
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                )}
              >
                Show All Categories
              </button>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600">Income Categories</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.income.map(c => (
                    <button 
                      key={c} 
                      onClick={() => {
                        setSelectedCategory(c);
                        setShowCategoryModal(false);
                      }}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-all",
                        selectedCategory === c
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-rose-600">Expense Categories</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.expense.map(c => (
                    <button 
                      key={c} 
                      onClick={() => {
                        setSelectedCategory(c);
                        setShowCategoryModal(false);
                      }}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-all",
                        selectedCategory === c
                          ? "border-rose-600 bg-rose-600 text-white"
                          : "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
