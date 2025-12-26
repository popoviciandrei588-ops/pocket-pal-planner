import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { BottomNav } from '@/components/BottomNav';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { format, isSameDay } from 'date-fns';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { transactions, currency } = useFinance();

  // Get transactions for selected date
  const dayTransactions = transactions.filter(t => 
    isSameDay(t.date, selectedDate)
  );

  const dayIncome = dayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const dayExpenses = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeCount = dayTransactions.filter(t => t.type === 'income').length;
  const expenseCount = dayTransactions.filter(t => t.type === 'expense').length;

  // Get dates that have transactions for highlighting
  const transactionDates = transactions.map(t => format(t.date, 'yyyy-MM-dd'));

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground text-sm">Track your daily transactions</p>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Calendar */}
        <div className="glass-card rounded-2xl p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
            modifiers={{
              hasTransaction: (date) => 
                transactionDates.includes(format(date, 'yyyy-MM-dd')),
            }}
            modifiersStyles={{
              hasTransaction: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                textDecorationColor: 'hsl(var(--primary))',
              },
            }}
          />
        </div>

        {/* Day Summary - Redesigned */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4 text-lg">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Income Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-income/20 to-income/5 p-4 border border-income/20">
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 rounded-full bg-income/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-income" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-income" />
                <span className="text-sm font-medium text-income">Income</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {currency.symbol}{formatAmount(dayIncome)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {incomeCount} transaction{incomeCount !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Expense Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-expense/20 to-expense/5 p-4 border border-expense/20">
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-expense" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-expense" />
                <span className="text-sm font-medium text-expense">Expenses</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {currency.symbol}{formatAmount(dayExpenses)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {expenseCount} transaction{expenseCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Net Balance for the day */}
          {(dayIncome > 0 || dayExpenses > 0) && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Net for this day</span>
                <span className={`text-lg font-bold ${dayIncome - dayExpenses >= 0 ? 'text-income' : 'text-expense'}`}>
                  {dayIncome - dayExpenses >= 0 ? '+' : '-'}
                  {currency.symbol}{formatAmount(Math.abs(dayIncome - dayExpenses))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Transactions for Selected Day */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-3">Transactions</h3>
          <TransactionList filterDate={selectedDate} showDelete showEdit />
        </section>
      </main>

      <AddTransactionSheet />
      <BottomNav />
    </div>
  );
}
