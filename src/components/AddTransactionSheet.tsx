import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useFinance } from '@/context/FinanceContext';
import { CATEGORIES, TransactionType } from '@/types/finance';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AddTransactionSheet() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addTransaction, currency } = useFinance();

  const categories = CATEGORIES[type];

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const category = categories.find(c => c.name === selectedCategory);
    
    addTransaction({
      amount: parseFloat(amount),
      type,
      category: selectedCategory,
      description,
      date: new Date(),
      icon: category?.icon || '💰',
    });

    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory(null);
    setType('expense');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-lg glow">
          <Plus className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl glass-card border-t border-border/50">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold">Add Transaction</SheetTitle>
        </SheetHeader>

        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-6">
          <button
            onClick={() => { setType('expense'); setSelectedCategory(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all",
              type === 'expense' 
                ? 'bg-expense text-foreground' 
                : 'text-muted-foreground'
            )}
          >
            <Minus className="w-4 h-4" />
            Expense
          </button>
          <button
            onClick={() => { setType('income'); setSelectedCategory(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all",
              type === 'income' 
                ? 'bg-income text-primary-foreground' 
                : 'text-muted-foreground'
            )}
          >
            <Plus className="w-4 h-4" />
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
              {currency.symbol}
            </span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-16 pl-12 text-3xl font-bold bg-secondary border-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Description</label>
          <Input
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12 bg-secondary border-none"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Category</label>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                  selectedCategory === category.name
                    ? type === 'income' 
                      ? 'bg-income/20 border-2 border-income' 
                      : 'bg-expense/20 border-2 border-expense'
                    : 'bg-secondary'
                )}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          size="lg" 
          className="w-full"
          variant={type === 'income' ? 'default' : 'destructive'}
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
