import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, SavingsGoal, Achievement, Currency, CURRENCIES, RecurringTransaction, RecurringFrequency, CATEGORIES } from '@/types/finance';
import { addDays, addWeeks, addMonths, addYears, isBefore, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FinanceContextType {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  achievements: Achievement[];
  recurringTransactions: RecurringTransaction[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id'>) => void;
  toggleRecurringTransaction: (id: string) => void;
  deleteRecurringTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  transactions: 'moneytracker_transactions',
  savingsGoals: 'moneytracker_savingsGoals',
  achievements: 'moneytracker_achievements',
  currency: 'moneytracker_currency',
  recurringTransactions: 'moneytracker_recurring',
};

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
      if (key === STORAGE_KEYS.transactions) {
        return parsed.map((t: any) => ({ ...t, date: new Date(t.date) })) as T;
      }
      if (key === STORAGE_KEYS.recurringTransactions) {
        return parsed.map((r: any) => ({ 
          ...r, 
          startDate: new Date(r.startDate),
          nextDue: new Date(r.nextDue)
        })) as T;
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

const getNextDueDate = (currentDate: Date, frequency: RecurringFrequency): Date => {
  switch (frequency) {
    case 'daily': return addDays(currentDate, 1);
    case 'weekly': return addWeeks(currentDate, 1);
    case 'monthly': return addMonths(currentDate, 1);
    case 'yearly': return addYears(currentDate, 1);
    default: return addMonths(currentDate, 1);
  }
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromStorage(STORAGE_KEYS.transactions, [])
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => 
    loadFromStorage(STORAGE_KEYS.savingsGoals, [])
  );
  const [achievements, setAchievements] = useState<Achievement[]>(() => 
    loadFromStorage(STORAGE_KEYS.achievements, defaultAchievements)
  );
  const [currency, setCurrencyState] = useState<Currency>(() => 
    loadFromStorage(STORAGE_KEYS.currency, CURRENCIES[0])
  );
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => 
    loadFromStorage(STORAGE_KEYS.recurringTransactions, [])
  );

  // Load data from database when user logs in
  const loadFromDatabase = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load transactions
      const { data: dbTransactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (txError) throw txError;
      
      if (dbTransactions && dbTransactions.length > 0) {
        const mappedTransactions: Transaction[] = dbTransactions.map(t => {
          // Find the icon from categories
          const categories = t.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
          const categoryData = categories.find(c => c.name === t.category);
          return {
            id: t.id,
            description: t.description,
            amount: Number(t.amount),
            type: t.type as 'income' | 'expense',
            category: t.category,
            date: new Date(t.date),
            icon: categoryData?.icon || '💰',
            isRecurring: t.is_recurring || false,
            recurringId: t.recurring_id || undefined,
          };
        });
        setTransactions(mappedTransactions);
      }

      // Load savings goals
      const { data: dbGoals, error: goalsError } = await supabase
        .from('savings_goals')
        .select('*');
      
      if (goalsError) throw goalsError;
      
      if (dbGoals) {
        const mappedGoals: SavingsGoal[] = dbGoals.map(g => ({
          id: g.id,
          name: g.name,
          targetAmount: Number(g.target_amount),
          currentAmount: Number(g.current_amount),
          icon: g.icon,
          color: g.color,
        }));
        setSavingsGoals(mappedGoals);
      }

      // Load recurring transactions
      const { data: dbRecurring, error: recurringError } = await supabase
        .from('recurring_transactions')
        .select('*');
      
      if (recurringError) throw recurringError;
      
      if (dbRecurring) {
        const mappedRecurring: RecurringTransaction[] = dbRecurring.map(r => {
          const categories = r.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
          const categoryData = categories.find(c => c.name === r.category);
          return {
            id: r.id,
            description: r.description,
            amount: Number(r.amount),
            type: r.type as 'income' | 'expense',
            category: r.category,
            icon: categoryData?.icon || '💰',
            frequency: r.frequency as RecurringFrequency,
            startDate: new Date(r.start_date),
            nextDue: new Date(r.next_date),
            isActive: r.is_active,
          };
        });
        setRecurringTransactions(mappedRecurring);
      }

      // Load user settings
      const { data: dbSettings } = await supabase
        .from('user_settings')
        .select('*')
        .single();
      
      if (dbSettings && dbSettings.currency) {
        const foundCurrency = CURRENCIES.find(c => c.code === dbSettings.currency);
        if (foundCurrency) {
          setCurrencyState(foundCurrency);
          // Also save to localStorage for consistency
          saveToStorage(STORAGE_KEYS.currency, foundCurrency);
        }
      }
    } catch (error) {
      console.error('Error loading from database:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Sync local data to database when user signs up/logs in
  const syncToDatabase = useCallback(async () => {
    if (!user) return;

    const localTransactions = loadFromStorage<Transaction[]>(STORAGE_KEYS.transactions, []);
    const localGoals = loadFromStorage<SavingsGoal[]>(STORAGE_KEYS.savingsGoals, []);
    const localRecurring = loadFromStorage<RecurringTransaction[]>(STORAGE_KEYS.recurringTransactions, []);

    try {
      // Sync transactions
      if (localTransactions.length > 0) {
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('id');
        
        const existingIds = new Set(existingTx?.map(t => t.id) || []);
        const newTransactions = localTransactions.filter(t => !existingIds.has(t.id));

        if (newTransactions.length > 0) {
          await supabase.from('transactions').insert(
            newTransactions.map(t => ({
              id: t.id,
              user_id: user.id,
              description: t.description,
              amount: t.amount,
              type: t.type,
              category: t.category,
              date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date,
              is_recurring: t.isRecurring || false,
              recurring_id: t.recurringId || null,
            }))
          );
        }
      }

      // Sync savings goals
      if (localGoals.length > 0) {
        const { data: existingGoals } = await supabase
          .from('savings_goals')
          .select('id');
        
        const existingIds = new Set(existingGoals?.map(g => g.id) || []);
        const newGoals = localGoals.filter(g => !existingIds.has(g.id));

        if (newGoals.length > 0) {
          await supabase.from('savings_goals').insert(
            newGoals.map(g => ({
              id: g.id,
              user_id: user.id,
              name: g.name,
              target_amount: g.targetAmount,
              current_amount: g.currentAmount,
              icon: g.icon,
              color: g.color,
            }))
          );
        }
      }

      // Sync recurring transactions
      if (localRecurring.length > 0) {
        const { data: existingRecurring } = await supabase
          .from('recurring_transactions')
          .select('id');
        
        const existingIds = new Set(existingRecurring?.map(r => r.id) || []);
        const newRecurring = localRecurring.filter(r => !existingIds.has(r.id));

        if (newRecurring.length > 0) {
          await supabase.from('recurring_transactions').insert(
            newRecurring.map(r => ({
              id: r.id,
              user_id: user.id,
              description: r.description,
              amount: r.amount,
              type: r.type,
              category: r.category,
              frequency: r.frequency,
              start_date: r.startDate instanceof Date ? r.startDate.toISOString().split('T')[0] : r.startDate,
              next_date: r.nextDue instanceof Date ? r.nextDue.toISOString().split('T')[0] : r.nextDue,
              is_active: r.isActive,
            }))
          );
        }
      }

      // Sync currency setting
      const localCurrency = loadFromStorage<Currency>(STORAGE_KEYS.currency, CURRENCIES[0]);
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        currency: localCurrency.code,
      }, { onConflict: 'user_id' });

      toast({
        title: 'Data synced',
        description: 'Your local data has been saved to your account.',
      });
    } catch (error) {
      console.error('Error syncing to database:', error);
    }
  }, [user, toast]);

  // Load from database when user changes
  useEffect(() => {
    if (user) {
      loadFromDatabase();
      syncToDatabase();
    }
  }, [user, loadFromDatabase, syncToDatabase]);

  // Process recurring transactions on load
  useEffect(() => {
    const today = startOfDay(new Date());
    let hasChanges = false;
    const newTransactions: Transaction[] = [];

    const updatedRecurring = recurringTransactions.map(recurring => {
      if (!recurring.isActive) return recurring;

      let nextDue = new Date(recurring.nextDue);
      while (isBefore(nextDue, today) || nextDue.getTime() === today.getTime()) {
        newTransactions.push({
          id: `${recurring.id}-${nextDue.getTime()}`,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          description: recurring.description,
          date: nextDue,
          icon: recurring.icon,
          isRecurring: true,
          recurringId: recurring.id,
        });
        nextDue = getNextDueDate(nextDue, recurring.frequency);
        hasChanges = true;
      }

      return { ...recurring, nextDue };
    });

    if (hasChanges) {
      const existingIds = new Set(transactions.map(t => t.id));
      const uniqueNewTransactions = newTransactions.filter(t => !existingIds.has(t.id));
      
      if (uniqueNewTransactions.length > 0) {
        setTransactions(prev => [...uniqueNewTransactions, ...prev]);
      }
      setRecurringTransactions(updatedRecurring);
    }
  }, []);

  // Autosave to local storage (for non-logged-in users)
  useEffect(() => {
    if (!user) {
      saveToStorage(STORAGE_KEYS.transactions, transactions);
    }
  }, [transactions, user]);

  useEffect(() => {
    if (!user) {
      saveToStorage(STORAGE_KEYS.savingsGoals, savingsGoals);
    }
  }, [savingsGoals, user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.achievements, achievements);
  }, [achievements]);

  // Always save currency to localStorage for persistence
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.currency, currency);
  }, [currency]);

  useEffect(() => {
    if (!user) {
      saveToStorage(STORAGE_KEYS.recurringTransactions, recurringTransactions);
    }
  }, [recurringTransactions, user]);

  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    saveToStorage(STORAGE_KEYS.currency, newCurrency);
    if (user) {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        currency: newCurrency.code,
      }, { onConflict: 'user_id' });
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    if (user) {
      await supabase.from('transactions').insert({
        id: newTransaction.id,
        user_id: user.id,
        description: newTransaction.description,
        amount: newTransaction.amount,
        type: newTransaction.type,
        category: newTransaction.category,
        date: newTransaction.date instanceof Date ? newTransaction.date.toISOString().split('T')[0] : newTransaction.date,
        is_recurring: newTransaction.isRecurring || false,
        recurring_id: newTransaction.recurringId || null,
      });
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );

    if (user) {
      const dbUpdates: any = {};
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.date !== undefined) dbUpdates.date = updates.date instanceof Date ? updates.date.toISOString().split('T')[0] : updates.date;
      
      await supabase.from('transactions').update(dbUpdates).eq('id', id);
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));

    if (user) {
      await supabase.from('transactions').delete().eq('id', id);
    }
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    setSavingsGoals(prev => [...prev, newGoal]);

    if (user) {
      await supabase.from('savings_goals').insert({
        id: newGoal.id,
        user_id: user.id,
        name: newGoal.name,
        target_amount: newGoal.targetAmount,
        current_amount: newGoal.currentAmount,
        icon: newGoal.icon,
        color: newGoal.color,
      });
    }
  };

  const updateSavingsGoal = async (id: string, amount: number) => {
    setSavingsGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );

    if (user) {
      const goal = savingsGoals.find(g => g.id === id);
      if (goal) {
        const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        await supabase.from('savings_goals').update({ current_amount: newAmount }).eq('id', id);
      }
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));

    if (user) {
      await supabase.from('savings_goals').delete().eq('id', id);
    }
  };

  const addRecurringTransaction = async (recurring: Omit<RecurringTransaction, 'id'>) => {
    const newRecurring = {
      ...recurring,
      id: crypto.randomUUID(),
    };
    setRecurringTransactions(prev => [...prev, newRecurring]);

    if (user) {
      await supabase.from('recurring_transactions').insert({
        id: newRecurring.id,
        user_id: user.id,
        description: newRecurring.description,
        amount: newRecurring.amount,
        type: newRecurring.type,
        category: newRecurring.category,
        frequency: newRecurring.frequency,
        start_date: newRecurring.startDate instanceof Date ? newRecurring.startDate.toISOString().split('T')[0] : newRecurring.startDate,
        next_date: newRecurring.nextDue instanceof Date ? newRecurring.nextDue.toISOString().split('T')[0] : newRecurring.nextDue,
        is_active: newRecurring.isActive,
      });
    }

    // Also add the first transaction immediately
    addTransaction({
      amount: recurring.amount,
      type: recurring.type,
      category: recurring.category,
      description: recurring.description,
      date: new Date(),
      icon: recurring.icon,
      isRecurring: true,
      recurringId: newRecurring.id,
    });
  };

  const toggleRecurringTransaction = async (id: string) => {
    const recurring = recurringTransactions.find(r => r.id === id);
    if (!recurring) return;

    setRecurringTransactions(prev =>
      prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );

    if (user) {
      await supabase.from('recurring_transactions').update({ is_active: !recurring.isActive }).eq('id', id);
    }
  };

  const deleteRecurringTransaction = async (id: string) => {
    setRecurringTransactions(prev => prev.filter(r => r.id !== id));

    if (user) {
      await supabase.from('recurring_transactions').delete().eq('id', id);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        savingsGoals,
        achievements,
        recurringTransactions,
        currency,
        setCurrency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addRecurringTransaction,
        toggleRecurringTransaction,
        deleteRecurringTransaction,
        totalBalance,
        totalIncome,
        totalExpenses,
        isLoading,
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
