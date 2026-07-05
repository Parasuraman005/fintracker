import { Menu, X, LayoutDashboard, ArrowLeftRight, PlusCircle, BarChart3, Wallet } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { navItems } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bottomNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Header with Hamburger */}
      <header className="fixed left-0 top-0 z-40 flex h-14 w-full items-center border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/80">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="ml-3 text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          fintracker
        </span>
      </header>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl md:hidden dark:bg-zinc-950"
            >
              <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Menu
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-2 space-y-1 overflow-y-auto px-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors",
                      activeTab === item.id
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="ml-3 font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Fixed Nav */}
      <nav className="fixed bottom-0 left-0 z-40 flex h-14 w-full border-t border-zinc-200 bg-white/80 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/80">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center space-y-0.5 transition-colors",
              activeTab === item.id
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
