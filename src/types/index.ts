export type TransactionType = 'income' | 'expense';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export interface Transaction {
  trn_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  ref?: string;
  party?: string;
  wallet_id?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  fromDate: string;
  toDate: string;
  isMonthly: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: TransactionType;
}

export interface Wallet {
  id: string;
  type: 'cash' | 'bank';
  balance: number;
  name?: string;
  description?: string;
  emoji?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  upiId?: string;
  cardNumber?: string;
  cardType?: 'credit' | 'debit';
  accountNumber?: string;
  icon?: string;
}

export interface ReminderSetting {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
  time: string;
  frequency: string;
  budgetSelection?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  isPaid: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  category?: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
}

export interface PersonalizationSettings {
  language: string;
  region: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: string;
}

export interface FinanceSettings {
  defaultCurrency: string;
  firstDayOfWeek: string;
  defaultWallet: string;
  monthlyBudget: number;
  financialYear: string;
  decimalPrecision: number;
}
