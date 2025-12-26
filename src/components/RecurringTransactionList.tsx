import { Repeat, Pause, Play, Trash2 } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from './ui/button';

export function RecurringTransactionList() {
  const { recurringTransactions, currency, toggleRecurringTransaction, deleteRecurringTransaction } = useFinance();

  const frequencyLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };

  if (recurringTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Repeat className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No recurring transactions yet</p>
        <p className="text-sm mt-1">Add subscriptions, bills, or regular income</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recurringTransactions.map((recurring) => (
        <div
          key={recurring.id}
          className={cn(
            "glass-card rounded-xl p-4 transition-all",
            !recurring.isActive && "opacity-50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
              recurring.type === 'income' ? "bg-income/20" : "bg-expense/20"
            )}>
              {recurring.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground truncate">{recurring.description}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground shrink-0">
                  {frequencyLabels[recurring.frequency]}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Next: {format(new Date(recurring.nextDue), 'MMM d, yyyy')}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className={cn(
                "font-bold text-lg",
                recurring.type === 'income' ? "text-income" : "text-expense"
              )}>
                {recurring.type === 'income' ? '+' : '-'}{currency.symbol}{recurring.amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleRecurringTransaction(recurring.id)}
              className="flex-1 gap-2"
            >
              {recurring.isActive ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Resume
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteRecurringTransaction(recurring.id)}
              className="text-expense hover:text-expense hover:bg-expense/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}