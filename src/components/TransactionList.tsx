import { useFinance } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface TransactionListProps {
  limit?: number;
  showDelete?: boolean;
  filterDate?: Date;
}

export function TransactionList({ limit, showDelete = false, filterDate }: TransactionListProps) {
  const { transactions, currency, deleteTransaction } = useFinance();

  let filteredTransactions = [...transactions];
  
  if (filterDate) {
    filteredTransactions = filteredTransactions.filter(
      t => format(t.date, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd')
    );
  }

  const displayTransactions = limit 
    ? filteredTransactions.slice(0, limit) 
    : filteredTransactions;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className="glass-card rounded-xl p-4 flex items-center gap-4 animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
            {transaction.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">
              {transaction.description}
            </h4>
            <p className="text-sm text-muted-foreground">
              {transaction.category} • {format(transaction.date, 'MMM d')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <p className={cn(
              "font-bold text-lg",
              transaction.type === 'income' ? 'text-income' : 'text-expense'
            )}>
              {transaction.type === 'income' ? '+' : '-'}
              {currency.symbol}{formatAmount(transaction.amount)}
            </p>
            
            {showDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTransaction(transaction.id)}
                className="text-muted-foreground hover:text-expense"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
