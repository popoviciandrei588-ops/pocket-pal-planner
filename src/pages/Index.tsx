import { BalanceCard } from '@/components/BalanceCard';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { BottomNav } from '@/components/BottomNav';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { useFinance } from '@/context/FinanceContext';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { savingsGoals } = useFinance();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <p className="text-muted-foreground text-sm">Welcome back 👋</p>
        <h1 className="text-2xl font-bold text-foreground">Your Finances</h1>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Balance Card */}
        <BalanceCard />

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
          <TransactionList limit={5} />
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
