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

const initialTransactions: Transaction[] = [];

const initialSavingsGoals: SavingsGoal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, icon: '🏦', color: 'primary' },
  { id: '2', name: 'Vacation', targetAmount: 3000, currentAmount: 1200, icon: '✈️', color: 'savings' },
  { id: '3', name: 'New Laptop', targetAmount: 2000, currentAmount: 800, icon: '💻', color: 'achievement' },
];

const initialAchievements: Achievement[] = [
  { id: '1', name: 'First Steps', description: 'Add your first transaction', icon: '🎯', unlocked: true, unlockedAt: new Date(), progress: 1, maxProgress: 1 },
  { id: '2', name: 'Saver', description: 'Save $1,000 total', icon: '💎', unlocked: true, unlockedAt: new Date(), progress: 1000, maxProgress: 1000 },
  { id: '3', name: 'Budget Master', description: 'Track 50 transactions', icon: '👑', unlocked: false, progress: 5, maxProgress: 50 },
  { id: '4', name: 'Goal Getter', description: 'Complete a savings goal', icon: '🏆', unlocked: false, progress: 0, maxProgress: 1 },
  { id: '5', name: 'Streak Champion', description: 'Log transactions for 7 days in a row', icon: '🔥', unlocked: false, progress: 3, maxProgress: 7 },
  { id: '6', name: 'Big Saver', description: 'Save $10,000 total', icon: '💰', unlocked: false, progress: 6500, maxProgress: 10000 },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

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
