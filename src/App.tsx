/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import AddTransactionPage from './components/AddTransactionPage';
import ReportsPage from './components/ReportsPage';
import BudgetsPage from './components/BudgetsPage';
import CategoriesPage from './components/CategoriesPage';
import WalletsPage from './components/WalletsPage';
import NotificationsPage from './components/NotificationsPage';
import BillsPage from './components/BillsPage';
import CalendarPage from './components/CalendarPage';
import CategoryReportPage from './components/CategoryReportPage';
import SettingsPage from './components/SettingsPage';
import { cn } from './lib/utils';
import { Transaction, Wallet, Bill } from './types';
import { MOCK_TRANSACTIONS, MOCK_WALLETS, MOCK_USER_PROFILE, MOCK_PERSONALIZATION, MOCK_FINANCE, MOCK_BILLS } from './mockData';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintracker_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('fintracker_wallets');
    return saved ? JSON.parse(saved) : MOCK_WALLETS;
  });
  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('fintracker_bills');
    return saved ? JSON.parse(saved) : MOCK_BILLS;
  });
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('fintracker_profile');
    return saved ? JSON.parse(saved) : MOCK_USER_PROFILE;
  });
  const [personalization, setPersonalization] = useState(() => {
    const saved = localStorage.getItem('fintracker_personalization');
    return saved ? JSON.parse(saved) : MOCK_PERSONALIZATION;
  });
  const [financeSettings, setFinanceSettings] = useState(() => {
    const saved = localStorage.getItem('fintracker_finance');
    return saved ? JSON.parse(saved) : MOCK_FINANCE;
  });
  const [initialDate, setInitialDate] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('fintracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintracker_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('fintracker_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('fintracker_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('fintracker_personalization', JSON.stringify(personalization));
  }, [personalization]);

  useEffect(() => {
    localStorage.setItem('fintracker_finance', JSON.stringify(financeSettings));
  }, [financeSettings]);

  // After splash, ensure sidebar is closed as requested
  useEffect(() => {
    if (!showSplash) {
      setIsSidebarOpen(false);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const handleEditTransaction = (trn: Transaction) => {
    setEditingTransaction(trn);
    setActiveTab('add');
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const transactionToDelete = transactions.find(t => t.trn_id === id);
      if (transactionToDelete && transactionToDelete.wallet_id) {
        setWallets(wallets.map(w => {
          if (w.id === transactionToDelete.wallet_id) {
            return {
              ...w,
              balance: transactionToDelete.type === 'income' 
                ? w.balance - transactionToDelete.amount 
                : w.balance + transactionToDelete.amount
            };
          }
          return w;
        }));
      }
      setTransactions(transactions.filter(t => t.trn_id !== id));
    }
  };

  const handleSaveTransaction = (trn: Transaction) => {
    if (editingTransaction) {
      // Revert old transaction impact on wallet
      if (editingTransaction.wallet_id) {
        setWallets(prevWallets => prevWallets.map(w => {
          if (w.id === editingTransaction.wallet_id) {
            return {
              ...w,
              balance: editingTransaction.type === 'income' 
                ? w.balance - editingTransaction.amount 
                : w.balance + editingTransaction.amount
            };
          }
          return w;
        }));
      }
      
      // Apply new transaction impact
      if (trn.wallet_id) {
        setWallets(prevWallets => prevWallets.map(w => {
          if (w.id === trn.wallet_id) {
            return {
              ...w,
              balance: trn.type === 'income' 
                ? w.balance + trn.amount 
                : w.balance - trn.amount
            };
          }
          return w;
        }));
      }

      setTransactions(transactions.map(t => t.trn_id === trn.trn_id ? trn : t));
    } else {
      // New transaction impact
      if (trn.wallet_id) {
        setWallets(prevWallets => prevWallets.map(w => {
          if (w.id === trn.wallet_id) {
            return {
              ...w,
              balance: trn.type === 'income' ? w.balance + trn.amount : w.balance - trn.amount
            };
          }
          return w;
        }));
      }
      setTransactions([trn, ...transactions]);
    }
    setEditingTransaction(null);
    setActiveTab('transactions');
  };

  const handleAddClick = (date?: string) => {
    setEditingTransaction(null);
    setInitialDate(date || null);
    setActiveTab('add');
  };

  const handlePayBill = (billId: string, amount: number, walletId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    // 1. Add Transaction
    const trn: Transaction = {
      trn_id: `BILL-PAY-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Bill Payment: ${bill.name}`,
      amount: amount,
      category: 'Utilities',
      type: 'expense',
      wallet_id: walletId
    };
    setTransactions(prev => [trn, ...prev]);

    // 2. Update Wallet
    setWallets(prev => prev.map(w => {
      if (w.id === walletId) {
        return { ...w, balance: w.balance - amount };
      }
      return w;
    }));

    // 3. Update Bills state
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        const newPaidAmount = b.paidAmount + amount;
        return {
          ...b,
          paidAmount: newPaidAmount,
          isPaid: newPaidAmount >= b.amount
        };
      }
      return b;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions} 
            wallets={wallets} 
            userProfile={userProfile}
            financeSettings={financeSettings}
            setActiveTab={setActiveTab} 
          />
        );
      case 'transactions':
        return (
          <TransactionsPage 
            transactions={transactions}
            financeSettings={financeSettings}
            onAddClick={handleAddClick} 
            onEditClick={handleEditTransaction}
            onDeleteClick={handleDeleteTransaction}
          />
        );
      case 'add':
        return (
          <AddTransactionPage 
            transaction={editingTransaction}
            initialDate={initialDate}
            wallets={wallets}
            financeSettings={financeSettings}
            onSave={handleSaveTransaction}
            onBack={() => {
              setEditingTransaction(null);
              setInitialDate(null);
              setActiveTab('transactions');
            }} 
          />
        );
      case 'reports':
        return <ReportsPage setActiveTab={setActiveTab} />;
      case 'category-report':
        return (
          <CategoryReportPage 
            transactions={transactions} 
            financeSettings={financeSettings}
            onBack={() => setActiveTab('reports')} 
          />
        );
      case 'budgets':
        return <BudgetsPage setActiveTab={setActiveTab} />;
      case 'categories':
        return <CategoriesPage setActiveTab={setActiveTab} />;
      case 'wallets':
        return (
          <WalletsPage 
            wallets={wallets} 
            setWallets={setWallets} 
            setActiveTab={setActiveTab}
            financeSettings={financeSettings}
          />
        );
      case 'notifications':
        return <NotificationsPage setActiveTab={setActiveTab} />;
      case 'bills':
        return (
          <BillsPage 
            bills={bills}
            setBills={setBills}
            wallets={wallets} 
            financeSettings={financeSettings} 
            onPay={handlePayBill} 
          />
        );
      case 'calendar':
        return <CalendarPage transactions={transactions} onAddClick={handleAddClick} />;
      case 'settings':
        return (
          <SettingsPage 
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            personalization={personalization}
            setPersonalization={setPersonalization}
            financeSettings={financeSettings}
            setFinanceSettings={setFinanceSettings}
            setActiveTab={setActiveTab} 
          />
        );
      default:
        return (
          <div className="flex h-[60vh] items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page
              </h2>
              <p className="mt-2 text-zinc-500">
                This feature is coming soon in the next update.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out pt-20 md:pt-8 px-4 md:px-8 max-w-7xl mx-auto",
          // Desktop sidebar offset
          "md:ml-20",
          isSidebarOpen && "md:ml-64"
        )}
      >
        {renderContent()}
      </main>
    </div>
  );
}
