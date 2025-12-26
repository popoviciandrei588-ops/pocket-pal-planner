import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
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
        <Button 
          size="icon" 
          className="fixed z-50 w-14 h-14 rounded-full shadow-xl glow"
          style={{ bottom: 'calc(7rem + env(safe-area-inset-bottom, 0px))', right: '1rem' }}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
          <SheetTitle className="text-center text-xl">Add Transaction</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-5 pb-6">
            {/* Type Toggle */}
            <div className="flex gap-2 p-1.5 bg-secondary rounded-xl">
              <button
                onClick={() => { setType('expense'); setSelectedCategory(null); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all",
                  type === 'expense' 
                    ? 'bg-expense text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
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
                    ? 'bg-income text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Plus className="w-4 h-4" />
                Income
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-foreground">
                  {currency.symbol}
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 text-2xl font-bold h-14 bg-secondary border-0 rounded-xl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <Input
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12 bg-secondary border-0 rounded-xl"
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <div className="grid grid-cols-4 gap-2.5">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all",
                      selectedCategory === category.name
                        ? type === 'income' 
                          ? 'bg-income/20 ring-2 ring-income' 
                          : 'bg-expense/20 ring-2 ring-expense'
                        : 'bg-secondary hover:bg-muted'
                    )}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-[11px] font-medium text-foreground leading-tight">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Submit Button */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
          <Button 
            onClick={handleSubmit} 
            className={cn(
              "w-full h-14 text-lg font-semibold rounded-xl",
              type === 'income' ? "bg-income hover:bg-income/90" : "bg-expense hover:bg-expense/90"
            )}
          >
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
