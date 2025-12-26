import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const GOAL_ICONS = ['🏦', '✈️', '💻', '🏠', '🚗', '📚', '💎', '🎮', '👗', '🎵'];
const GOAL_COLORS = ['primary', 'savings', 'achievement'];

export default function SavingsPage() {
  const { savingsGoals, addSavingsGoal, currency } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [selectedColor, setSelectedColor] = useState('primary');

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleCreateGoal = () => {
    if (!goalName || !targetAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    addSavingsGoal({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      icon: selectedIcon,
      color: selectedColor,
    });

    toast.success('Savings goal created!');
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setGoalName('');
    setTargetAmount('');
    setSelectedIcon('🎯');
    setSelectedColor('primary');
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-4 pt-safe pb-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-muted-foreground text-sm">Track your financial goals</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Total Overview */}
        <div className="glass-card rounded-2xl p-6" style={{
          background: 'linear-gradient(135deg, hsl(45 93% 58% / 0.15), hsl(35 93% 50% / 0.1))',
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-savings/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-savings" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <h2 className="text-3xl font-bold text-foreground">
                {currency.symbol}{totalSaved.toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-semibold">{currency.symbol}{totalTarget.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-savings rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Add New Goal Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-14 border-dashed">
              <Plus className="w-5 h-5 mr-2" />
              Create New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Goal Name</label>
                <Input
                  placeholder="e.g., New Car"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="bg-secondary border-none"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    {currency.symbol}
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="pl-10 bg-secondary border-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        selectedIcon === icon 
                          ? 'bg-primary/20 ring-2 ring-primary' 
                          : 'bg-secondary'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Goals List */}
        <section className="space-y-3">
          {savingsGoals.map((goal) => (
            <SavingsGoalCard key={goal.id} goal={goal} showActions />
          ))}
        </section>
      </main>

      <AddTransactionSheet />
      <BottomNav />
    </div>
  );
}
