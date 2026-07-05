import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Wallet as WalletIcon, 
  Building2, 
  CreditCard, 
  X,
  CheckCircle2,
  Smile,
  Hash,
  MapPin,
  Smartphone,
  CreditCard as CardIcon,
  History,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { MOCK_WALLETS } from '../../data/mockData';
import { Wallet, FinanceSettings as FinanceType } from '../../types';

export default function WalletsPage({ 
  wallets, 
  setWallets, 
  setActiveTab,
  financeSettings
}: { 
  wallets: Wallet[], 
  setWallets: (wallets: Wallet[]) => void, 
  setActiveTab: (tab: string) => void,
  financeSettings: FinanceType
}) {
  const [showForm, setShowForm] = useState(false);
  const [walletType, setWalletType] = useState<'cash' | 'bank'>('cash');
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';
  
  // Form States
  const [cashForm, setCashForm] = useState({
    name: '',
    description: '',
    emoji: '',
    amount: ''
  });

  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    bankName: '',
    branchName: '',
    upiId: '',
    cardNumber: '',
    cardType: 'debit' as 'debit' | 'credit',
    amount: ''
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (walletType === 'cash') {
      if (!cashForm.name.trim()) newErrors.name = 'Wallet name is required';
      if (!cashForm.amount) {
        newErrors.amount = 'Initial balance is required';
      } else if (Number(cashForm.amount) < 0) {
        newErrors.amount = 'Amount cannot be negative';
      }
    } else {
      if (!bankForm.bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!bankForm.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder is required';
      if (!bankForm.amount) {
        newErrors.amount = 'Initial balance is required';
      } else if (Number(bankForm.amount) < 0) {
        newErrors.amount = 'Amount cannot be negative';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const amount = Number(walletType === 'cash' ? cashForm.amount : bankForm.amount);
    
    if (editingWallet) {
      const updatedWallets = wallets.map(w => {
        if (w.id === editingWallet.id) {
          return {
            ...w,
            type: walletType,
            balance: amount,
            ...(walletType === 'cash' ? {
              name: cashForm.name.trim(),
              description: cashForm.description.trim(),
              emoji: cashForm.emoji.trim()
            } : {
              accountHolderName: bankForm.accountHolderName.trim(),
              bankName: bankForm.bankName.trim(),
              branchName: bankForm.branchName.trim(),
              upiId: bankForm.upiId.trim(),
              cardNumber: bankForm.cardNumber.trim(),
              cardType: bankForm.cardType
            })
          } as Wallet;
        }
        return w;
      });
      setWallets(updatedWallets);
    } else {
      const newWallet: Wallet = {
        id: Math.random().toString(36).substr(2, 9),
        type: walletType,
        balance: amount,
        ...(walletType === 'cash' ? {
          name: cashForm.name.trim(),
          description: cashForm.description.trim(),
          emoji: cashForm.emoji.trim()
        } : {
          accountHolderName: bankForm.accountHolderName.trim(),
          bankName: bankForm.bankName.trim(),
          branchName: bankForm.branchName.trim(),
          upiId: bankForm.upiId.trim(),
          cardNumber: bankForm.cardNumber.trim(),
          cardType: bankForm.cardType
        })
      };
      setWallets([...wallets, newWallet]);
    }

    setShowForm(false);
    setEditingWallet(null);
    setErrors({});
    resetForms();
  };

  const resetForms = () => {
    setCashForm({ name: '', description: '', emoji: '', amount: '' });
    setBankForm({ accountHolderName: '', bankName: '', branchName: '', upiId: '', cardNumber: '', cardType: 'debit', amount: '' });
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setWalletType(wallet.type);
    if (wallet.type === 'cash') {
      setCashForm({
        name: wallet.name || '',
        description: wallet.description || '',
        emoji: wallet.emoji || '',
        amount: wallet.balance.toString()
      });
    } else {
      setBankForm({
        accountHolderName: wallet.accountHolderName || '',
        bankName: wallet.bankName || '',
        branchName: wallet.branchName || '',
        upiId: wallet.upiId || '',
        cardNumber: wallet.cardNumber || '',
        cardType: wallet.cardType || 'debit',
        amount: wallet.balance.toString()
      });
    }
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      setWallets(wallets.filter(w => w.id !== id));
    }
  };

  const WalletCard = ({ wallet, ...props }: { wallet: Wallet, [key: string]: any }) => (
    <motion.div
      {...props}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/50 md:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-50 text-2xl dark:bg-zinc-900 md:h-14 md:w-14 md:text-3xl">
            {wallet.type === 'cash' ? (wallet.emoji || '💵') : <Building2 className="h-6 w-6 text-emerald-600 md:h-7 md:w-7" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white md:text-base">
              {wallet.type === 'cash' ? wallet.name : wallet.bankName}
            </h3>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              {wallet.type} Wallet
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setActiveTab('transactions')}
            className="p-2 text-zinc-400 hover:text-emerald-600"
            title="View Transactions"
          >
            <History className="h-4 w-4" />
          </button>
          <button className="p-2 text-zinc-400 hover:text-zinc-600">
            <Settings className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEdit(wallet)}
            className="p-2 text-zinc-400 hover:text-emerald-600"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(wallet.id)}
            className="p-2 text-zinc-400 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2 md:mt-6 md:space-y-3">
        {wallet.type === 'bank' ? (
          <>
            <div className="flex items-center justify-between text-[11px] md:text-sm">
              <span className="text-zinc-500">Account Name</span>
              <span className="font-medium text-zinc-900 dark:text-white">{wallet.accountHolderName}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] md:text-sm">
              <span className="text-zinc-500">Account No</span>
              <span className="font-mono text-zinc-900 dark:text-white">{wallet.accountNumber || 'XXXX-1234'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] md:text-sm">
              <span className="text-zinc-500">Bank Name</span>
              <span className="font-medium text-zinc-900 dark:text-white">{wallet.bankName}</span>
            </div>
          </>
        ) : (
          <p className="text-[11px] text-zinc-500 line-clamp-2 min-h-[32px] md:text-sm md:min-h-[40px]">
            {wallet.description || 'No description provided.'}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800 md:mt-6 md:pt-4">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Balance</span>
        <span className="text-xl font-bold text-zinc-900 dark:text-white md:text-2xl">
          {currencySymbol}{wallet.balance.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4 pb-24 md:space-y-8 md:pb-8">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
          Wallet
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 md:mt-2 md:text-sm">
          Manage your cash and bank accounts in one place.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {wallets.map(w => (
          <WalletCard key={w.id} wallet={w} />
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 md:bottom-8 md:right-8 transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Wallet Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="my-8 w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl dark:bg-zinc-950 md:p-8"
            >
              <div className="mb-4 flex items-center justify-between md:mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white md:text-2xl">
                  {editingWallet ? 'Edit Wallet' : 'Add Wallet'}
                </h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingWallet(null);
                    resetForms();
                  }} 
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4 md:space-y-6">
                {/* Toggle: Cash vs Bank */}
                <div className="flex rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900 md:p-1.5">
                  <button
                    onClick={() => setWalletType('cash')}
                    className={cn(
                      "flex-1 rounded-xl py-2 text-xs font-bold transition-all md:py-3 md:text-sm",
                      walletType === 'cash'
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                    )}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setWalletType('bank')}
                    className={cn(
                      "flex-1 rounded-xl py-2 text-xs font-bold transition-all md:py-3 md:text-sm",
                      walletType === 'bank'
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                    )}
                  >
                    Bank
                  </button>
                </div>

                {walletType === 'cash' ? (
                  <div className="grid gap-3 md:gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Wallet Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Daily Cash"
                        value={cashForm.name}
                        onChange={(e) => {
                          setCashForm({ ...cashForm, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm",
                          errors.name ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                        )}
                      />
                      {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Emoji</label>
                        <input
                          type="text"
                          placeholder="Paste emoji"
                          value={cashForm.emoji}
                          onChange={(e) => setCashForm({ ...cashForm, emoji: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Initial Amount</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={cashForm.amount}
                          onChange={(e) => {
                            setCashForm({ ...cashForm, amount: e.target.value });
                            if (errors.amount) setErrors({ ...errors, amount: '' });
                          }}
                          className={cn(
                            "w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm",
                            errors.amount ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                          )}
                        />
                        {errors.amount && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.amount}</p>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                      <textarea
                        placeholder="What is this wallet for?"
                        rows={2}
                        value={cashForm.description}
                        onChange={(e) => setCashForm({ ...cashForm, description: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none md:px-4 md:py-3 md:text-sm md:rows-3"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 md:gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Holder</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={bankForm.accountHolderName}
                        onChange={(e) => {
                          setBankForm({ ...bankForm, accountHolderName: e.target.value });
                          if (errors.accountHolderName) setErrors({ ...errors, accountHolderName: '' });
                        }}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm",
                          errors.accountHolderName ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                        )}
                      />
                      {errors.accountHolderName && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.accountHolderName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bank Name</label>
                        <input
                          type="text"
                          placeholder="e.g. HDFC"
                          value={bankForm.bankName}
                          onChange={(e) => {
                            setBankForm({ ...bankForm, bankName: e.target.value });
                            if (errors.bankName) setErrors({ ...errors, bankName: '' });
                          }}
                          className={cn(
                            "w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm",
                            errors.bankName ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                          )}
                        />
                        {errors.bankName && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.bankName}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Branch</label>
                        <input
                          type="text"
                          placeholder="Downtown"
                          value={bankForm.branchName}
                          onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">UPI ID</label>
                        <input
                          type="text"
                          placeholder="name@upi"
                          value={bankForm.upiId}
                          onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Initial Amount</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={bankForm.amount}
                          onChange={(e) => {
                            setBankForm({ ...bankForm, amount: e.target.value });
                            if (errors.amount) setErrors({ ...errors, amount: '' });
                          }}
                          className={cn(
                            "w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm",
                            errors.amount ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                          )}
                        />
                        {errors.amount && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.amount}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          placeholder="XXXX 1234"
                          value={bankForm.cardNumber}
                          onChange={(e) => setBankForm({ ...bankForm, cardNumber: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Card Type</label>
                        <select
                          value={bankForm.cardType}
                          onChange={(e) => setBankForm({ ...bankForm, cardType: e.target.value as any })}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
                        >
                          <option value="debit">Debit Card</option>
                          <option value="credit">Credit Card</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )  }

                <div className="flex gap-3 pt-2 md:gap-4 md:pt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-2xl border border-zinc-200 bg-white py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 md:py-4 md:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-2xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 md:py-4 md:text-sm"
                  >
                    Save Wallet
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
