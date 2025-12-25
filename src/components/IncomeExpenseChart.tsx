import { useFinance } from '@/context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export function IncomeExpenseChart() {
  const { totalIncome, totalExpenses, currency } = useFinance();

  const data = [
    { name: 'Income', value: totalIncome, color: 'hsl(160, 84%, 45%)' },
    { name: 'Expenses', value: totalExpenses, color: 'hsl(0, 72%, 51%)' },
  ];

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${currency.symbol}${(value / 1000).toFixed(1)}k`;
    }
    return `${currency.symbol}${value}`;
  };

  return (
    <div className="glass-card rounded-xl p-4 animate-scale-in">
      <h4 className="font-semibold text-foreground mb-4">Income vs Expenses</h4>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barGap={8}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
              width={70}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 8, 8, 0]}
              barSize={28}
              label={{ 
                position: 'right', 
                formatter: formatValue,
                fill: 'hsl(0, 0%, 98%)',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
