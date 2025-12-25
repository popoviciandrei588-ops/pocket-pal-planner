import { useFinance } from '@/context/FinanceContext';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface SavingsGoalCardProps {
  goal: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    icon: string;
    color: string;
  };
  showActions?: boolean;
}

export function SavingsGoalCard({ goal, showActions = false }: SavingsGoalCardProps) {
  const { currency, updateSavingsGoal, deleteSavingsGoal } = useFinance();
  const [addAmount, setAddAmount] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddSavings = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    updateSavingsGoal(goal.id, parseFloat(addAmount));
    toast.success(`Added ${currency.symbol}${addAmount} to ${goal.name}!`);
    setAddAmount('');
    setDialogOpen(false);
  };

  const colorClasses = {
    primary: 'bg-primary',
    savings: 'bg-savings',
    achievement: 'bg-achievement',
  };

  return (
    <div className="glass-card rounded-xl p-4 animate-scale-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
            {goal.icon}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{goal.name}</h4>
            <p className="text-sm text-muted-foreground">
              {currency.symbol}{formatAmount(remaining)} to go
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-1">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border">
                <DialogHeader>
                  <DialogTitle>Add to {goal.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                      {currency.symbol}
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="h-14 pl-10 text-2xl font-bold bg-secondary border-none"
                    />
                  </div>
                  <Button onClick={handleAddSavings} className="w-full">
                    Add Savings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-expense"
              onClick={() => deleteSavingsGoal(goal.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-secondary"
        />
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-foreground">
            {currency.symbol}{formatAmount(goal.currentAmount)}
          </span>
          <span className="text-muted-foreground">
            {currency.symbol}{formatAmount(goal.targetAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
