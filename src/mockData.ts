import { Transaction, Wallet, Category, Budget, ReminderSetting, Bill, UserProfile, PersonalizationSettings, FinanceSettings } from './types';

export const MOCK_BILLS: Bill[] = [
  { id: '1', name: 'Electricity Bill', amount: 85.50, paidAmount: 0, dueDate: '2026-07-15', isPaid: false, reminderEnabled: true, reminderTime: '09:00', category: 'Utilities' },
  { id: '2', name: 'Rent Payment', amount: 1500.00, paidAmount: 1500.00, dueDate: '2026-07-01', isPaid: true, reminderEnabled: true, reminderTime: '10:00', category: 'Housing' },
  { id: '3', name: 'Internet Subscription', amount: 60.00, paidAmount: 0, dueDate: '2026-07-20', isPaid: false, reminderEnabled: false, reminderTime: '08:00', category: 'Utilities' },
  { id: '4', name: 'Water Bill', amount: 45.20, paidAmount: 0, dueDate: '2026-07-12', isPaid: false, reminderEnabled: true, reminderTime: '09:30', category: 'Utilities' },
  { id: '5', name: 'Gym Membership', amount: 50.00, paidAmount: 50.00, dueDate: '2026-07-05', isPaid: true, reminderEnabled: true, reminderTime: '08:00', category: 'Health' },
  { id: '6', name: 'Credit Card Payment', amount: 450.00, paidAmount: 0, dueDate: '2026-07-25', isPaid: false, reminderEnabled: true, reminderTime: '11:00', category: 'Shopping' },
];

export const MOCK_USER_PROFILE: UserProfile = {
  username: 'parasu',
  fullName: 'Parasu',
  email: 'parasu@example.com'
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
  defaultWallet: 'HDFC Bank',
  monthlyBudget: 2000,
  financialYear: 'April - March',
  decimalPrecision: 2
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    trn_id: 'TRN001',
    date: '2026-07-03',
    description: 'Grocery Shopping',
    category: 'Food',
    amount: 120.50,
    type: 'expense'
  },
  {
    trn_id: 'TRN002',
    date: '2026-07-02',
    description: 'Salary Deposit',
    category: 'Salary',
    amount: 4500.00,
    type: 'income'
  },
  {
    trn_id: 'TRN003',
    date: '2026-07-01',
    description: 'Monthly Rent',
    category: 'Housing',
    amount: 1500.00,
    type: 'expense'
  },
  {
    trn_id: 'TRN011',
    date: '2026-07-01',
    description: 'Stock Dividend',
    category: 'Investment',
    amount: 125.40,
    type: 'income'
  },
  {
    trn_id: 'TRN004',
    date: '2026-06-30',
    description: 'Internet Bill',
    category: 'Utilities',
    amount: 60.00,
    type: 'expense'
  },
  {
    trn_id: 'TRN012',
    date: '2026-06-30',
    description: 'Movie Night',
    category: 'Entertainment',
    amount: 35.00,
    type: 'expense'
  },
  {
    trn_id: 'TRN005',
    date: '2026-06-29',
    description: 'Freelance Project',
    category: 'Freelance',
    amount: 800.00,
    type: 'income'
  },
  {
    trn_id: 'TRN006',
    date: '2026-06-28',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: 15.99,
    type: 'expense'
  },
  {
    trn_id: 'TRN013',
    date: '2026-06-28',
    description: 'Uber Ride',
    category: 'Transport',
    amount: 22.50,
    type: 'expense'
  },
  {
    trn_id: 'TRN007',
    date: '2026-06-27',
    description: 'Gas Station',
    category: 'Transport',
    amount: 45.00,
    type: 'expense'
  },
  {
    trn_id: 'TRN014',
    date: '2026-06-27',
    description: 'Pharmacy Store',
    category: 'Health',
    amount: 12.80,
    type: 'expense'
  },
  {
    trn_id: 'TRN008',
    date: '2026-06-26',
    description: 'Coffee Shop',
    category: 'Food',
    amount: 5.50,
    type: 'expense'
  },
  {
    trn_id: 'TRN015',
    date: '2026-06-26',
    description: 'Birthday Gift',
    category: 'Gift',
    amount: 50.00,
    type: 'income'
  },
  {
    trn_id: 'TRN009',
    date: '2026-06-25',
    description: 'Gym Membership',
    category: 'Health',
    amount: 50.00,
    type: 'expense'
  },
  {
    trn_id: 'TRN010',
    date: '2026-06-24',
    description: 'Amazon Purchase',
    category: 'Shopping',
    amount: 85.20,
    type: 'expense'
  },
  {
    trn_id: 'TRN016',
    date: '2026-06-23',
    description: 'Vegetable Market',
    category: 'Food',
    amount: 18.40,
    type: 'expense'
  },
  {
    trn_id: 'TRN017',
    date: '2026-06-22',
    description: 'Consulting Fee',
    category: 'Freelance',
    amount: 300.00,
    type: 'income'
  }
];

export const MOCK_CHART_DATA = [
  { name: 'Mon', income: 4000, expense: 2400 },
  { name: 'Tue', income: 3000, expense: 1398 },
  { name: 'Wed', income: 2000, expense: 9800 },
  { name: 'Thu', income: 2780, expense: 3908 },
  { name: 'Fri', income: 1890, expense: 4800 },
  { name: 'Sat', income: 2390, expense: 3800 },
  { name: 'Sun', income: 3490, expense: 4300 },
];

export const MOCK_WALLETS: Wallet[] = [
  { 
    id: '1', 
    type: 'cash', 
    name: 'Daily Cash', 
    balance: 500, 
    emoji: '💵', 
    description: 'Pocket money' 
  },
  { 
    id: '2', 
    type: 'bank', 
    accountHolderName: 'John Doe', 
    bankName: 'HDFC Bank', 
    accountNumber: 'XXXX-XXXX-1234', 
    balance: 12500, 
    branchName: 'Downtown',
    upiId: 'john@okaxis',
    cardNumber: '4532-XXXX-XXXX-5678',
    cardType: 'debit'
  },
  { 
    id: '3', 
    type: 'bank', 
    accountHolderName: 'John Doe', 
    bankName: 'SBI Savings', 
    accountNumber: 'XXXX-XXXX-9876', 
    balance: 45000, 
    branchName: 'Uptown',
    upiId: 'john@oksbi',
    cardNumber: '4111-XXXX-XXXX-1111',
    cardType: 'credit'
  },
];

export const REMINDER_SETTINGS: ReminderSetting[] = [
  { id: '1', title: 'Expense Reminder', description: 'Get reminded to record daily expenses.', isEnabled: true, time: '20:00', frequency: 'Daily' },
  { id: '2', title: 'Budget Reminder', description: 'Select a budget and receive alerts based on the chosen budget.', isEnabled: false, time: '10:00', frequency: 'Custom', budgetSelection: 'Food' },
  { id: '3', title: 'Bill Payment Reminder', description: 'Receive reminders before upcoming bill due dates.', isEnabled: true, time: '09:00', frequency: 'Before Due' },
  { id: '4', title: 'Weekly Expense Summary', description: 'Get a weekly summary of your total expenses.', isEnabled: true, time: '21:00', frequency: 'Weekly (Sun)' },
  { id: '5', title: 'Weekly Wallet Balance Reminder', description: 'Receive a weekly update on your remaining wallet balance.', isEnabled: false, time: '08:00', frequency: 'Weekly (Mon)' },
  { id: '6', title: 'Daily Wallet Balance Reminder', description: 'Get notified daily about your current wallet balance.', isEnabled: false, time: '07:00', frequency: 'Daily' },
  { id: '7', title: 'Monthly Expense Summary', description: 'Receive a summary of your total monthly expenses at the end of each month.', isEnabled: true, time: '23:00', frequency: 'Monthly (Last Day)' },
];

export const CATEGORIES_LIST: Category[] = [
  { id: '1', name: 'Salary', description: 'Monthly paycheck', emoji: '💰', type: 'income' },
  { id: '2', name: 'Freelance', description: 'Side gigs', emoji: '💻', type: 'income' },
  { id: '3', name: 'Food', description: 'Dining and groceries', emoji: '🍔', type: 'expense' },
  { id: '4', name: 'Housing', description: 'Rent and maintenance', emoji: '🏠', type: 'expense' },
  { id: '5', name: 'Transport', description: 'Fuel and commute', emoji: '🚗', type: 'expense' },
  { id: '6', name: 'Entertainment', description: 'Movies and games', emoji: '🎮', type: 'expense' },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: '1', category: 'Food', limit: 500, spent: 320, fromDate: '2026-07-01', toDate: '2026-07-31', isMonthly: true },
  { id: '2', category: 'Transport', limit: 200, spent: 150, fromDate: '2026-07-01', toDate: '2026-07-31', isMonthly: true },
  { id: '3', category: 'Entertainment', limit: 150, spent: 45, fromDate: '2026-07-01', toDate: '2026-07-31', isMonthly: true },
];

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Housing', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Education', 'Other']
};
