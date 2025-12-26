import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Insight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function SpendingInsights() {
  const { transactions, currency } = useFinance();

  const insights = useMemo(() => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // This month's data
    const thisMonthTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: thisMonthStart, end: thisMonthEnd })
    );
    const thisMonthExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Last month's data
    const lastMonthTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: lastMonthStart, end: lastMonthEnd })
    );
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const lastMonthIncome = lastMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown for this month
    const categoryExpenses: Record<string, number> = {};
    thisMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryExpenses)
      .sort(([, a], [, b]) => b - a)[0];

    const generatedInsights: Insight[] = [];

    // Expense trend
    if (lastMonthExpenses > 0) {
      const expenseChange = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      if (expenseChange < -10) {
        generatedInsights.push({
          type: 'positive',
          title: 'Great spending control!',
          description: `You've reduced spending by ${Math.abs(expenseChange).toFixed(0)}% compared to last month.`,
          icon: <TrendingDown className="w-5 h-5" />,
        });
      } else if (expenseChange > 20) {
        generatedInsights.push({
          type: 'negative',
          title: 'Spending increased',
          description: `Your expenses are up ${expenseChange.toFixed(0)}% from last month. Consider reviewing your budget.`,
          icon: <TrendingUp className="w-5 h-5" />,
        });
      }
    }

    // Savings rate
    if (thisMonthIncome > 0) {
      const savingsRate = ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100;
      if (savingsRate >= 20) {
        generatedInsights.push({
          type: 'positive',
          title: 'Strong savings!',
          description: `You're saving ${savingsRate.toFixed(0)}% of your income this month. Keep it up!`,
          icon: <TrendingUp className="w-5 h-5" />,
        });
      } else if (savingsRate < 10 && savingsRate >= 0) {
        generatedInsights.push({
          type: 'neutral',
          title: 'Low savings rate',
          description: `You're only saving ${savingsRate.toFixed(0)}% of income. Aim for at least 20%.`,
          icon: <AlertTriangle className="w-5 h-5" />,
        });
      } else if (savingsRate < 0) {
        generatedInsights.push({
          type: 'negative',
          title: 'Overspending alert',
          description: `You're spending more than you earn this month. Time to cut back!`,
          icon: <AlertTriangle className="w-5 h-5" />,
        });
      }
    }

    // Top spending category
    if (topCategory) {
      const percentage = thisMonthExpenses > 0 
        ? ((topCategory[1] / thisMonthExpenses) * 100).toFixed(0)
        : 0;
      generatedInsights.push({
        type: 'neutral',
        title: `Top spending: ${topCategory[0]}`,
        description: `${percentage}% of your expenses (${currency.symbol}${topCategory[1].toFixed(2)}) went to ${topCategory[0]}.`,
        icon: <Lightbulb className="w-5 h-5" />,
      });
    }

    // Income comparison
    if (lastMonthIncome > 0 && thisMonthIncome > lastMonthIncome) {
      const incomeGrowth = ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;
      generatedInsights.push({
        type: 'positive',
        title: 'Income boost!',
        description: `Your income grew by ${incomeGrowth.toFixed(0)}% compared to last month.`,
        icon: <ArrowUpRight className="w-5 h-5" />,
      });
    }

    return generatedInsights.slice(0, 4);
  }, [transactions, currency.symbol]);

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Spending Insights</h3>
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Add some transactions to see personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Spending Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl transition-all",
              insight.type === 'positive' && "bg-income/10 border border-income/20",
              insight.type === 'negative' && "bg-expense/10 border border-expense/20",
              insight.type === 'neutral' && "bg-secondary border border-border"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              insight.type === 'positive' && "bg-income/20 text-income",
              insight.type === 'negative' && "bg-expense/20 text-expense",
              insight.type === 'neutral' && "bg-muted text-muted-foreground"
            )}>
              {insight.icon}
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">{insight.title}</h4>
              <p className="text-muted-foreground text-xs mt-0.5">{insight.description}</p>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Keep tracking to unlock more insights!
          </div>
        )}
      </div>
    </div>
  );
}