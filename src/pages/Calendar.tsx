import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { BottomNav } from '@/components/BottomNav';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { format, isSameDay } from 'date-fns';

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

  // Get dates that have transactions for highlighting
  const transactionDates = transactions.map(t => format(t.date, 'yyyy-MM-dd'));

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

        {/* Day Summary */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-income/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Income</p>
              <p className="text-lg font-bold text-income">
                +{currency.symbol}{dayIncome.toFixed(2)}
              </p>
            </div>
            <div className="bg-expense/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Expenses</p>
              <p className="text-lg font-bold text-expense">
                -{currency.symbol}{dayExpenses.toFixed(2)}
              </p>
            </div>
          </div>
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
