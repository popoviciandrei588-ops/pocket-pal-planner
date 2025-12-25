import { useFinance } from '@/context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export function ExpenseChart() {
  const { transactions, currency } = useFinance();

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    'hsl(160, 84%, 45%)',  // primary/income
    'hsl(0, 72%, 51%)',    // expense
    'hsl(45, 93%, 58%)',   // savings
    'hsl(280, 68%, 60%)',  // achievement
    'hsl(200, 70%, 50%)',  // blue
    'hsl(30, 80%, 55%)',   // orange
    'hsl(320, 70%, 50%)',  // pink
    'hsl(180, 60%, 45%)',  // teal
  ];

  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No expense data yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 animate-scale-in">
      <h4 className="font-semibold text-foreground mb-4">Spending by Category</h4>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value: string) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
