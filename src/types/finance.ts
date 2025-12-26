export type TransactionType = 'income' | 'expense';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: Date;
  icon: string;
  isRecurring?: boolean;
  recurringId?: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  icon: string;
  frequency: RecurringFrequency;
  startDate: Date;
  nextDue: Date;
  isActive: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
];

export const CATEGORIES = {
  income: [
    { name: 'Salary', icon: '💼' },
    { name: 'Freelance', icon: '💻' },
    { name: 'Investment', icon: '📈' },
    { name: 'Gift', icon: '🎁' },
    { name: 'Other', icon: '💰' },
  ],
  expense: [
    { name: 'Food', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Entertainment', icon: '🎮' },
    { name: 'Bills', icon: '📄' },
    { name: 'Health', icon: '💊' },
    { name: 'Education', icon: '📚' },
    { name: 'Other', icon: '💸' },
  ],
};
