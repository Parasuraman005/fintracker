import { Transaction, Wallet, Category, Budget, ReminderSetting, Bill, UserProfile, PersonalizationSettings, FinanceSettings } from '../types';

export const MOCK_USER_PROFILE: UserProfile = {
  username: 'parasu_raman',
  fullName: 'Parasu Raman',
  email: 'parasu.raman@example.com'
};

export const MOCK_PERSONALIZATION: PersonalizationSettings = {
  language: 'English',
  region: 'United States',
  timeZone: 'UTC-5',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  numberFormat: '1,000.00'
};

export const MOCK_FINANCE: FinanceSettings = {
  defaultCurrency: 'USD ($)',
  firstDayOfWeek: 'Monday',
  defaultWallet: 'HDFC Savings',
  monthlyBudget: 3500,
  financialYear: 'April - March',
  decimalPrecision: 2
};

export const MOCK_BILLS: Bill[] = [
  { id: '1', name: 'Electricity Bill', amount: 120, paidAmount: 0, dueDate: '2026-07-15', isPaid: false, reminderEnabled: true, reminderTime: '09:00', category: 'Utilities' },
  { id: '2', name: 'Internet / WiFi', amount: 60, paidAmount: 0, dueDate: '2026-07-10', isPaid: false, reminderEnabled: true, reminderTime: '10:00', category: 'Utilities' },
  { id: '3', name: 'Netflix Subscription', amount: 15, paidAmount: 15, dueDate: '2026-07-05', isPaid: true, reminderEnabled: false, reminderTime: '08:00', category: 'Entertainment' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { trn_id: 'TRN-001', type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Paycheck', date: '2026-07-01', wallet_id: '2', party: 'TechCorp Inc', ref: 'SAL-JULY' },
  { trn_id: 'TRN-002', type: 'expense', amount: 1200, category: 'Housing', description: 'House Rent', date: '2026-07-02', wallet_id: '2', party: 'Landlord', ref: 'RENT-01' },
  { trn_id: 'TRN-003', type: 'expense', amount: 85.50, category: 'Food', description: 'Grocery Shopping', date: '2026-07-03', wallet_id: '1', party: 'SuperMart', ref: 'BILL-442' },
  { trn_id: 'TRN-004', type: 'expense', amount: 45, category: 'Transport', description: 'Fuel Refill', date: '2026-07-03', wallet_id: '2', party: 'GasStation', ref: 'TX-99' },
  { trn_id: 'TRN-005', type: 'income', amount: 450, category: 'Freelance', description: 'Logo Design Project', date: '2026-07-04', wallet_id: '4', party: 'Client X', ref: 'INV-102' },
  { trn_id: 'TRN-006', type: 'expense', amount: 32.20, category: 'Food', description: 'Lunch with Team', date: '2026-07-04', wallet_id: '1', party: 'The Grill House', ref: 'FD-12' },
  { trn_id: 'TRN-007', type: 'expense', amount: 120, category: 'Shopping', description: 'New Running Shoes', date: '2026-07-05', wallet_id: '3', party: 'Nike Store', ref: 'SH-45' },
  { trn_id: 'TRN-008', type: 'expense', amount: 15, category: 'Entertainment', description: 'Cinema Ticket', date: '2026-07-05', wallet_id: '1', party: 'AMC Theaters', ref: 'MV-88' },
  { trn_id: 'TRN-009', type: 'expense', amount: 65, category: 'Health', description: 'Gym Supplement', date: '2026-07-05', wallet_id: '2', party: 'HealthStore', ref: 'VIT-10' },
  { trn_id: 'TRN-010', type: 'income', amount: 100, category: 'Gift', description: 'Birthday Gift', date: '2026-07-05', wallet_id: '4', party: 'Family', ref: 'GFT-01' },
];

export const MOCK_CHART_DATA = [
  { name: 'Mon', income: 5000, expense: 0 },
  { name: 'Tue', income: 0, expense: 1200 },
  { name: 'Wed', income: 0, expense: 130 },
  { name: 'Thu', income: 450, expense: 32 },
  { name: 'Fri', income: 100, expense: 200 },
  { name: 'Sat', income: 0, expense: 150 },
  { name: 'Sun', income: 0, expense: 45 },
];

export const MOCK_WALLETS: Wallet[] = [
  { 
    id: '1', 
    type: 'cash', 
    name: 'Daily Cash', 
    balance: 850.50, 
    emoji: '💵', 
    description: 'Pocket money and petty cash' 
  },
  { 
    id: '2', 
    type: 'bank', 
    accountHolderName: 'Parasu Raman', 
    bankName: 'HDFC Savings', 
    accountNumber: 'XXXX-XXXX-4521', 
    balance: 42500.00, 
    branchName: 'Downtown Branch',
    upiId: 'parasu@hdfc',
    cardNumber: 'XXXX-XXXX-XXXX-1122',
    cardType: 'debit'
  },
  { 
    id: '3', 
    type: 'bank', 
    accountHolderName: 'Parasu Raman', 
    bankName: 'ICICI Credit', 
    accountNumber: 'XXXX-XXXX-9988', 
    balance: 5000.00, 
    branchName: 'Corporate Hub',
    upiId: 'parasu@icici',
    cardNumber: 'XXXX-XXXX-XXXX-8877',
    cardType: 'credit'
  },
  { 
    id: '4', 
    type: 'cash', 
    name: 'Digital Wallet', 
    balance: 1250.75, 
    emoji: '📱', 
    description: 'Funds in PayPal / GPay' 
  },
];

export const REMINDER_SETTINGS: ReminderSetting[] = [
  { id: '1', title: 'Expense Reminder', description: 'Get reminded to record daily expenses.', isEnabled: true, time: '20:00', frequency: 'Daily' },
  { id: '2', title: 'Budget Reminder', description: 'Select a budget and receive alerts based on the chosen budget.', isEnabled: true, time: '10:00', frequency: 'Custom', budgetSelection: 'Food' },
  { id: '3', title: 'Bill Payment Reminder', description: 'Receive reminders before upcoming bill due dates.', isEnabled: true, time: '09:00', frequency: 'Before Due' },
  { id: '4', title: 'Weekly Expense Summary', description: 'Get a weekly summary of your total expenses.', isEnabled: true, time: '21:00', frequency: 'Weekly (Sun)' },
  { id: '5', title: 'Weekly Wallet Balance Reminder', description: 'Receive a weekly update on your remaining wallet balance.', isEnabled: false, time: '08:00', frequency: 'Weekly (Mon)' },
];

export const CATEGORIES_LIST: Category[] = [
  { id: '1', name: 'Salary', description: 'Monthly paycheck', emoji: '💰', type: 'income' },
  { id: '2', name: 'Freelance', description: 'Side gigs', emoji: '💻', type: 'income' },
  { id: '3', name: 'Food', description: 'Dining and groceries', emoji: '🍔', type: 'expense' },
  { id: '4', name: 'Housing', description: 'Rent and maintenance', emoji: '🏠', type: 'expense' },
  { id: '5', name: 'Transport', description: 'Fuel and commute', emoji: '🚗', type: 'expense' },
  { id: '6', name: 'Entertainment', description: 'Movies and games', emoji: '🎮', type: 'expense' },
  { id: '7', name: 'Shopping', description: 'Personal shopping', emoji: '🛍️', type: 'expense' },
  { id: '8', name: 'Health', description: 'Medical and wellness', emoji: '🏥', type: 'expense' },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: '1', category: 'Food', limit: 800, spent: 450.50, fromDate: '2026-07-01', toDate: '2026-07-31', isMonthly: true },
  { id: '2', category: 'Entertainment', limit: 200, spent: 15.00, fromDate: '2026-07-01', toDate: '2026-07-31', isMonthly: true },
  { id: '3', category: 'Transport', limit: 300, spent: 45.00, fromDate: '2026-07-01', toDate: '2026-07-31', isMonthly: true },
];

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Housing', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Education', 'Other']
};
