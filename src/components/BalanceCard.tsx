import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';

export function BalanceCard() {
  const { totalBalance, totalIncome, totalExpenses, currency } = useFinance();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 animate-fade-in" style={{
      background: 'linear-gradient(135deg, hsl(160 84% 45% / 0.15), hsl(180 70% 40% / 0.1))',
    }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Total Balance</span>
        </div>
        
        <h2 className="text-4xl font-bold text-foreground mb-6">
          {currency.symbol}{formatAmount(totalBalance)}
        </h2>
        
        <div className="flex gap-4">
          <div className="flex-1 glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-income/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-income" />
              </div>
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <p className="text-lg font-bold text-income">
              +{currency.symbol}{formatAmount(totalIncome)}
            </p>
          </div>
          
          <div className="flex-1 glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-expense" />
              </div>
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
            <p className="text-lg font-bold text-expense">
              -{currency.symbol}{formatAmount(totalExpenses)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
