import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, SavingsGoal, Achievement, Currency, CURRENCIES } from '@/types/finance';

interface FinanceContextType {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  achievements: Achievement[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  transactions: 'moneytracker_transactions',
  savingsGoals: 'moneytracker_savingsGoals',
  achievements: 'moneytracker_achievements',
  currency: 'moneytracker_currency',
};

const defaultSavingsGoals: SavingsGoal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 0, icon: '🏦', color: 'primary' },
  { id: '2', name: 'Vacation', targetAmount: 3000, currentAmount: 0, icon: '✈️', color: 'savings' },
  { id: '3', name: 'New Laptop', targetAmount: 2000, currentAmount: 0, icon: '💻', color: 'achievement' },
];

const defaultAchievements: Achievement[] = [
  { id: '1', name: 'First Steps', description: 'Add your first transaction', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1 },
  { id: '2', name: 'Saver', description: 'Save $1,000 total', icon: '💎', unlocked: false, progress: 0, maxProgress: 1000 },
  { id: '3', name: 'Budget Master', description: 'Track 50 transactions', icon: '👑', unlocked: false, progress: 0, maxProgress: 50 },
  { id: '4', name: 'Goal Getter', description: 'Complete a savings goal', icon: '🏆', unlocked: false, progress: 0, maxProgress: 1 },
  { id: '5', name: 'Streak Champion', description: 'Log transactions for 7 days in a row', icon: '🔥', unlocked: false, progress: 0, maxProgress: 7 },
  { id: '6', name: 'Big Saver', description: 'Save $10,000 total', icon: '💰', unlocked: false, progress: 0, maxProgress: 10000 },
];

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Handle date conversion for transactions
      if (key === STORAGE_KEYS.transactions) {
        return parsed.map((t: any) => ({ ...t, date: new Date(t.date) })) as T;
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromStorage(STORAGE_KEYS.transactions, [])
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => 
    loadFromStorage(STORAGE_KEYS.savingsGoals, defaultSavingsGoals)
  );
  const [achievements, setAchievements] = useState<Achievement[]>(() => 
    loadFromStorage(STORAGE_KEYS.achievements, defaultAchievements)
  );
  const [currency, setCurrencyState] = useState<Currency>(() => 
    loadFromStorage(STORAGE_KEYS.currency, CURRENCIES[0])
  );

  // Autosave transactions
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  // Autosave savings goals
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.savingsGoals, savingsGoals);
  }, [savingsGoals]);

  // Autosave achievements
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.achievements, achievements);
  }, [achievements]);

  // Autosave currency
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.currency, currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        savingsGoals,
        achievements,
        currency,
        setCurrency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        totalBalance,
        totalIncome,
        totalExpenses,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
