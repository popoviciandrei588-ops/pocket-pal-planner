import { BalanceCard } from '@/components/BalanceCard';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { BottomNav } from '@/components/BottomNav';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { IncomeExpenseChart } from '@/components/IncomeExpenseChart';
import { ExpenseChart } from '@/components/ExpenseChart';
import { SpendingInsights } from '@/components/SpendingInsights';
import { useFinance } from '@/context/FinanceContext';
import { ChevronRight, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { savingsGoals, recurringTransactions } = useFinance();

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-4 pt-safe pb-6">
        <div className="pt-4">
          <p className="text-muted-foreground text-sm">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground">Your Finances</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Balance Card */}
        <BalanceCard />

        {/* Spending Insights */}
        <SpendingInsights />

        {/* Charts Section */}
        <section className="grid grid-cols-1 gap-4">
          <IncomeExpenseChart />
          <ExpenseChart />
        </section>

        {/* Recurring Transactions Preview */}
        {recurringTransactions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Repeat className="w-4 h-4 text-primary" />
                Recurring
              </h3>
              <Link 
                to="/recurring" 
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Manage <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-muted-foreground text-sm">
                {recurringTransactions.filter(r => r.isActive).length} active recurring transactions
              </p>
            </div>
          </section>
        )}

        {/* Quick Savings Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Savings Goals</h3>
            <Link 
              to="/savings" 
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {savingsGoals.slice(0, 2).map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <Link 
              to="/calendar" 
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <TransactionList limit={5} showEdit showDelete />
        </section>
      </main>

      {/* FAB for adding transactions */}
      <AddTransactionSheet />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
