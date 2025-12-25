import { useFinance } from '@/context/FinanceContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function IncomeExpenseChart() {
  const { totalIncome, totalExpenses, currency } = useFinance();

  const total = totalIncome + totalExpenses;
  const incomePercent = total > 0 ? (totalIncome / total) * 100 : 50;
  const expensePercent = total > 0 ? (totalExpenses / total) * 100 : 50;

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${currency.symbol}${(value / 1000).toFixed(1)}k`;
    }
    return `${currency.symbol}${value.toFixed(0)}`;
  };

  return (
    <div className="glass-card rounded-xl p-4 animate-scale-in">
      <h4 className="font-semibold text-foreground mb-4">Income vs Expenses</h4>
      
      <div className="space-y-4">
        {/* Income Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-income/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-income" />
              </div>
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <span className="font-bold text-income">{formatValue(totalIncome)}</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-income rounded-full transition-all duration-700 ease-out"
              style={{ width: `${incomePercent}%` }}
            />
          </div>
        </div>

        {/* Expense Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-expense" />
              </div>
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
            <span className="font-bold text-expense">{formatValue(totalExpenses)}</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-expense rounded-full transition-all duration-700 ease-out"
              style={{ width: `${expensePercent}%` }}
            />
          </div>
        </div>

        {/* Savings indicator */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Net Savings</span>
            <span className={`font-bold ${totalIncome - totalExpenses >= 0 ? 'text-income' : 'text-expense'}`}>
              {totalIncome - totalExpenses >= 0 ? '+' : ''}{formatValue(totalIncome - totalExpenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
