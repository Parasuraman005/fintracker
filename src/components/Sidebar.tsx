import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PlusCircle, 
  BarChart3, 
  Wallet, 
  Tags, 
  Briefcase, 
  Bell, 
  FileText, 
  Settings,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'add', label: 'Add Transaction', icon: PlusCircle },
  { id: 'wallets', label: 'Wallets', icon: Wallet },
  { id: 'budgets', label: 'Budgets', icon: Briefcase },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'bills', label: 'Bills', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen && (
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            fintracker
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="mt-4 space-y-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-2.5 transition-colors",
              activeTab === item.id
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
              !isOpen && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
