import { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Transaction } from '../../types';

type ViewType = 'daily' | 'weekly' | 'monthly';

export default function CalendarPage({ transactions, onAddClick }: { transactions: Transaction[], onAddClick: (date?: string) => void }) {
  const [view, setView] = useState<ViewType>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && 
                        currentDate.getFullYear() === new Date().getFullYear();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDayTransactions = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return transactions.filter(t => t.date === dateStr);
  };

  const getDayData = (day: number) => {
    const dayTransactions = getDayTransactions(day);
    
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, count: dayTransactions.length };
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  const monthTotals = useMemo(() => {
    const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return transactions
      .filter(t => t.date.startsWith(monthStr))
      .reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      }, { income: 0, expense: 0 });
  }, [transactions, currentDate]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDay) return [];
    return getDayTransactions(selectedDay);
  }, [selectedDay, currentDate, transactions]);

  const handleDayDoubleClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onAddClick(dateStr);
  };

  const handleQuickAdd = () => {
    if (selectedDay) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      onAddClick(dateStr);
    } else {
      onAddClick();
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Calendar
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Timeline of your financial activity.
          </p>
        </div>

        {/* View Toggle removed per user selection */}
      </header>

      {/* Calendar Component */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              {!isCurrentMonth && (
                <button 
                  onClick={goToToday}
                  className="rounded-lg bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Today
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <ChevronLeft className="h-5 w-5 text-zinc-600" />
              </button>
              <button 
                onClick={nextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <ChevronRight className="h-5 w-5 text-zinc-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 py-2">
                {d}
              </div>
            ))}

            {/* Padding for first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const data = getDayData(day);
              const isToday = day === new Date().getDate() && isCurrentMonth;
              const isSelected = selectedDay === day;

              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  onDoubleClick={() => handleDayDoubleClick(day)}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-2xl border transition-all p-1",
                    isToday && !isSelected && "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5",
                    isSelected 
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                      : "border-zinc-100 hover:border-zinc-300 dark:border-zinc-900 dark:hover:border-zinc-800"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold",
                    isSelected ? "text-white" : isToday ? "text-emerald-600" : "text-zinc-500"
                  )}>
                    {day}
                  </span>
                  
                  <div className="mt-1 flex gap-0.5">
                    {data.income > 0 && (
                      <div className={cn(
                        "h-1 w-1 rounded-full",
                        isSelected ? "bg-white" : "bg-emerald-500"
                      )} />
                    )}
                    {data.expense > 0 && (
                      <div className={cn(
                        "h-1 w-1 rounded-full",
                        isSelected ? "bg-white/60" : "bg-rose-500"
                      )} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day View */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              {selectedDay ? (
                `${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`
              ) : (
                'Select a date'
              )}
            </h3>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {selectedDayTransactions.length} Transactions
            </p>
          </div>

          <div className="mb-6">
            <button 
              onClick={handleQuickAdd}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedDayTransactions.length > 0 ? (
              selectedDayTransactions.map(t => (
                <div key={t.trn_id} className="group rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800/50 dark:bg-zinc-900/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-400 truncate max-w-[120px]">{t.category}</span>
                    <span className={cn(
                      "text-xs font-bold",
                      t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">
                    {t.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <CalendarIcon className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-500">No transactions recorded for this day.</p>
              </div>
            )}
          </div>

          {selectedDayTransactions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                <span className="text-zinc-400">Day Total</span>
                <span className={cn(
                  "text-zinc-900 dark:text-white",
                  selectedDayTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0) >= 0 
                    ? "text-emerald-600" : "text-rose-600"
                )}>
                  ${selectedDayTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{monthNames[currentDate.getMonth()]} Income</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">${monthTotals.income.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{monthNames[currentDate.getMonth()]} Expense</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">${monthTotals.expense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
