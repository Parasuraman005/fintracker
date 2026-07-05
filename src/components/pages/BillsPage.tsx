import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Receipt, 
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  Wallet as WalletIcon,
  Bell,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { MOCK_BILLS, MOCK_WALLETS, CATEGORIES } from '../../data/mockData';
import { Bill, Wallet, FinanceSettings as FinanceType } from '../../types';

export default function BillsPage({ 
  bills,
  setBills,
  wallets, 
  financeSettings,
  onPay
}: { 
  bills: Bill[],
  setBills: (bills: Bill[]) => void,
  wallets: Wallet[], 
  financeSettings: FinanceType,
  onPay: (billId: string, amount: number, walletId: string) => void
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState<Bill | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});

  const currencySymbol = financeSettings.defaultCurrency.split('(')[1]?.replace(')', '') || '$';
  
  // Form State
  const [billForm, setBillForm] = useState({
    name: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    reminderEnabled: false,
    reminderTime: '09:00'
  });

  // Pay Form State
  const [payForm, setPayForm] = useState({
    amountPaid: '',
    walletId: wallets[0]?.id || ''
  });

  const validateBill = () => {
    const newErrors: Record<string, string> = {};
    if (!billForm.name.trim()) newErrors.name = 'Bill name is required';
    if (!billForm.amount || Number(billForm.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!billForm.dueDate) newErrors.dueDate = 'Due date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveBill = () => {
    if (!validateBill()) return;
    
    if (editingBill) {
      setBills(bills.map(b => 
        b.id === editingBill.id ? {
          ...b,
          name: billForm.name.trim(),
          amount: Number(billForm.amount),
          dueDate: billForm.dueDate,
          reminderEnabled: billForm.reminderEnabled,
          reminderTime: billForm.reminderTime
        } : b
      ));
    } else {
      const bill: Bill = {
        id: Math.random().toString(36).substr(2, 9),
        name: billForm.name.trim(),
        amount: Number(billForm.amount),
        paidAmount: 0,
        dueDate: billForm.dueDate,
        isPaid: false,
        reminderEnabled: billForm.reminderEnabled,
        reminderTime: billForm.reminderTime
      };
      setBills([...bills, bill]);
    }

    closeAddForm();
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setEditingBill(null);
    setErrors({});
    setBillForm({ name: '', amount: '', dueDate: new Date().toISOString().split('T')[0], reminderEnabled: false, reminderTime: '09:00' });
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setErrors({});
    setBillForm({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      reminderEnabled: bill.reminderEnabled,
      reminderTime: bill.reminderTime
    });
    setShowAddForm(true);
  };

  const validatePay = () => {
    const newErrors: Record<string, string> = {};
    const amountNum = Number(payForm.amountPaid);
    
    if (!payForm.amountPaid || amountNum <= 0) {
      newErrors.amount = 'Valid amount is required';
    } else if (payForm.walletId) {
      const wallet = wallets.find(w => w.id === payForm.walletId);
      if (wallet && amountNum > wallet.balance) {
        newErrors.amount = `Insufficient funds (Balance: ${currencySymbol}${wallet.balance.toLocaleString()})`;
      }
    }

    if (!payForm.walletId) newErrors.wallet = 'Select a wallet';
    
    setPayErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayBill = () => {
    if (!showPayForm || !validatePay()) return;
    
    const amountToPay = Number(payForm.amountPaid);
    if (amountToPay <= 0) return;

    // Record the payment in global state
    onPay(showPayForm.id, amountToPay, payForm.walletId);
    
    setShowPayForm(null);
    setPayErrors({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      setBills(bills.filter(b => b.id !== id));
    }
  };

  const BillCard = ({ bill, ...props }: { bill: Bill, [key: string]: any }) => {
    const remaining = bill.amount - bill.paidAmount;
    const progress = (bill.paidAmount / bill.amount) * 100;

    return (
      <motion.div
        {...props}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "group relative rounded-3xl border bg-white p-6 shadow-sm transition-all dark:bg-zinc-950",
          bill.isPaid 
            ? "border-emerald-500/20 opacity-75" 
            : bill.paidAmount > 0 
              ? "border-amber-500/20" 
              : "border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              bill.isPaid ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : bill.paidAmount > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10" : "bg-zinc-50 text-zinc-400 dark:bg-zinc-900"
            )}>
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">{bill.name}</h3>
              <p className="text-xs font-medium text-zinc-500">
                Due on {bill.dueDate}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleEdit(bill)}
              className="p-2 text-zinc-400 hover:text-emerald-600"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDelete(bill.id)}
              className="p-2 text-zinc-400 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar for Partial Payments */}
        {!bill.isPaid && bill.amount > 0 && (
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <span>Paid: {currencySymbol}{bill.paidAmount.toLocaleString()}</span>
              <span>Left: {currencySymbol}{remaining.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  bill.paidAmount > 0 ? "bg-amber-500" : "bg-zinc-300"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Total Amount</span>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {currencySymbol}{bill.amount.toLocaleString()}
            </p>
          </div>
          
          {bill.isPaid ? (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10">
              <CheckCircle2 className="h-3 w-3" />
              Paid
            </div>
          ) : (
            <button
              onClick={() => {
                setShowPayForm(bill);
                setPayForm({ ...payForm, amountPaid: remaining.toString() });
              }}
              className={cn(
                "rounded-full px-6 py-2 text-xs font-bold text-white transition-all",
                bill.paidAmount > 0 
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" 
                  : "bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              )}
            >
              {bill.paidAmount > 0 ? 'Pay Balance' : 'Pay Now'}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Bills
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Track and pay your upcoming bills.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bills.map(b => (
          <BillCard key={b.id} bill={b} />
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 md:bottom-8 md:right-8 transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Bill Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-zinc-950"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {editingBill ? 'Edit Bill' : 'Add Bill'}
                </h3>
                <button onClick={closeAddForm} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Bill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Electric Bill"
                    value={billForm.name}
                    onChange={(e) => {
                      setBillForm({ ...billForm, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={cn(
                      "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white",
                      errors.name ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                    )}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={billForm.amount}
                      onChange={(e) => {
                        setBillForm({ ...billForm, amount: e.target.value });
                        if (errors.amount) setErrors({ ...errors, amount: '' });
                      }}
                      className={cn(
                        "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white",
                        errors.amount ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                      )}
                    />
                    {errors.amount && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.amount}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={billForm.dueDate}
                      onChange={(e) => {
                        setBillForm({ ...billForm, dueDate: e.target.value });
                        if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
                      }}
                      className={cn(
                        "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white",
                        errors.dueDate ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                      )}
                    />
                    {errors.dueDate && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.dueDate}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Set Reminder</span>
                  </div>
                  <button
                    onClick={() => setBillForm({ ...billForm, reminderEnabled: !billForm.reminderEnabled })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      billForm.reminderEnabled ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                      billForm.reminderEnabled ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>

                {billForm.reminderEnabled && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Reminder Time
                    </label>
                    <input
                      type="time"
                      value={billForm.reminderTime}
                      onChange={(e) => setBillForm({ ...billForm, reminderTime: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={closeAddForm}
                    className="flex-1 rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBill}
                    className="flex-1 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                  >
                    {editingBill ? 'Save Changes' : 'Add Bill'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pay Bill Form Modal */}
      <AnimatePresence>
        {showPayForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-zinc-950"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Pay Bill</h3>
                  <p className="text-sm text-zinc-500">{showPayForm.name}</p>
                </div>
                <button onClick={() => setShowPayForm(null)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Total Amount</label>
                    <div className="flex h-12 w-full items-center rounded-xl bg-zinc-50 px-4 text-sm font-bold text-zinc-900 dark:bg-zinc-900 dark:text-white">
                      {currencySymbol}{showPayForm.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Remaining</label>
                    <div className="flex h-12 w-full items-center rounded-xl bg-amber-50 px-4 text-sm font-bold text-amber-600 dark:bg-amber-500/10">
                      {currencySymbol}{(showPayForm.amount - showPayForm.paidAmount).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Amount to Pay</label>
                  <input
                    type="number"
                    value={payForm.amountPaid}
                    max={showPayForm.amount - showPayForm.paidAmount}
                    onChange={(e) => {
                      setPayForm({ ...payForm, amountPaid: e.target.value });
                      if (payErrors.amount) setPayErrors({ ...payErrors, amount: '' });
                    }}
                    className={cn(
                      "w-full rounded-xl border bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-zinc-950 dark:text-white",
                      payErrors.amount ? "border-rose-500 focus:ring-rose-500/20" : "border-zinc-200 dark:border-zinc-800"
                    )}
                  />
                  {payErrors.amount && <p className="text-[10px] font-bold text-rose-500 uppercase">{payErrors.amount}</p>}
                  <p className="text-[10px] text-zinc-400">
                    Entering less than the remaining amount will record a partial payment.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Select Wallet</label>
                  <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    {wallets.map(w => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setPayForm({ ...payForm, walletId: w.id });
                          if (payErrors.wallet) setPayErrors({ ...payErrors, wallet: '' });
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-4 transition-all",
                          payForm.walletId === w.id
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
                            : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800",
                          payErrors.wallet && "border-rose-500/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <WalletIcon className="h-4 w-4 text-zinc-400" />
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {w.type === 'cash' ? w.name : w.bankName}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          {currencySymbol}{w.balance.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setShowPayForm(null)}
                    className="flex-1 rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayBill}
                    className="flex-1 rounded-2xl bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    Pay Bill
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
