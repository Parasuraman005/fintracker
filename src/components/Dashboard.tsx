import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { MOCK_TRANSACTIONS, MOCK_CHART_DATA } from '../mockData';
import { Transaction, TimeRange, Wallet, UserProfile, FinanceSettings as FinanceType } from '../types';

export default function Dashboard({ 
  transactions, 
  wallets, 
  userProfile,
  financeSettings,
  setActiveTab 
}: { 
  transactions: Transaction[], 
  wallets: Wallet[], 
  userProfile: UserProfile,
  financeSettings: FinanceType,
  setActiveTab: (tab: string) => void 
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [chartType, setChartType] = useState<'all' | 'income' | 'expense'>('all');

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';

  const totalWalletBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const recentTransactions = [...transactions].reverse().slice(0, 10);

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <header className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Hi, {userProfile.fullName.split(' ')[0]}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Here's what's happening with your money.
          </p>
        </div>


      </header>

      {/* Stats Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-3"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Net Balance</span>
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">
              {currencySymbol}{totalWalletBalance.toLocaleString()}
            </span>
            <div className="mt-1 flex items-center text-xs text-zinc-400">
              <span>Current available across all wallets</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Income</span>
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">
              {currencySymbol}{totalIncome.toLocaleString()}
            </span>
            <div className="mt-1 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Expense</span>
            <div className="rounded-full bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">
              {currencySymbol}{totalExpense.toLocaleString()}
            </span>
            <div className="mt-1 flex items-center text-xs text-rose-600 dark:text-rose-400">
              <TrendingDown className="mr-1 h-3 w-3" />
              <span>+4.2% from last month</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Financial Activity</h3>
          
          {/* Chart Representation Toggle */}
          <div className="relative inline-flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
            <motion.div
              className="absolute inset-y-1 rounded-lg bg-white shadow-sm dark:bg-zinc-800"
              initial={false}
              animate={{
                x: chartType === 'all' ? 0 : chartType === 'income' ? 58 : 124,
                width: chartType === 'all' ? 54 : chartType === 'income' ? 62 : 68
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={cn(
                  "relative z-10 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
                  chartType === type
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              {(chartType === 'all' || chartType === 'income') && (
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  strokeWidth={2}
                />
              )}
              {(chartType === 'all' || chartType === 'expense') && (
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#f43f5e" 
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-zinc-400" />
            Recent Transactions
          </h3>
          <button 
            onClick={() => setActiveTab('transactions')}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            View All
          </button>
        </div>
        
        {/* Mobile View: List */}
        <div className="divide-y divide-zinc-200 md:hidden dark:divide-zinc-800">
          {recentTransactions.map((t) => (
            <div key={t.trn_id} className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">{t.category}</span>
                  <span>{t.date}</span>
                </div>
              </div>
              <p className={cn(
                "text-sm font-black",
                t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
              )}>
                {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-6 py-4 font-medium">Trn ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentTransactions.map((t) => (
                <tr key={t.trn_id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">
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
                    "px-6 py-4 font-semibold",
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
