import { 
  FileText, 
  Tags, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Wallet 
} from 'lucide-react';
import { motion } from 'motion/react';

const reportOptions = [
  { id: 'transactions', label: 'Transactions Report', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'category', label: 'Category Wise Report', icon: Tags, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'bills', label: 'Bills Reports', icon: Receipt, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'income', label: 'Income Report', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'expense', label: 'Expense Report', icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'wallet', label: 'Wallet Wise Report', icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export default function ReportsPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const handleReportClick = (id: string) => {
    switch (id) {
      case 'transactions':
      case 'income':
      case 'expense':
        setActiveTab('transactions');
        break;
      case 'category':
        setActiveTab('category-report');
        break;
      case 'bills':
        setActiveTab('bills');
        break;
      case 'wallet':
        setActiveTab('wallets');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Visualize your financial health with detailed reports.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {reportOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleReportClick(option.id)}
            className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/50"
          >
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${option.bg} dark:bg-zinc-900 transition-transform group-hover:scale-110`}>
              <option.icon className={`h-7 w-7 ${option.color}`} />
            </div>
            <span className="text-center text-sm font-bold text-zinc-900 dark:text-white">
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
