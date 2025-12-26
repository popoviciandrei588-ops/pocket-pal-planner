import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/context/FinanceContext';
import { Transaction, TransactionType, CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';

interface EditTransactionSheetProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionSheet({ transaction, open, onOpenChange }: EditTransactionSheetProps) {
  const { currency, updateTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setSelectedCategory(transaction.category);
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !transaction) return;

    const category = CATEGORIES[type].find(c => c.name === selectedCategory);
    if (!category) return;

    updateTransaction(transaction.id, {
      amount: parseFloat(amount),
      type,
      category: selectedCategory,
      description: description || selectedCategory,
      icon: category.icon,
    });

    onOpenChange(false);
  };

  const categories = CATEGORIES[type];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-center text-xl">Edit Transaction</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl">
            <button
              onClick={() => {
                setType('expense');
                setSelectedCategory(null);
              }}
              className={cn(
                "flex-1 py-3 rounded-lg font-semibold transition-all",
                type === 'expense' 
                  ? "bg-expense text-white shadow-lg" 
                  : "text-muted-foreground"
              )}
            >
              Expense
            </button>
            <button
              onClick={() => {
                setType('income');
                setSelectedCategory(null);
              }}
              className={cn(
                "flex-1 py-3 rounded-lg font-semibold transition-all",
                type === 'income' 
                  ? "bg-income text-white shadow-lg" 
                  : "text-muted-foreground"
              )}
            >
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
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-12 text-2xl font-bold h-16 bg-secondary border-0"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <Input
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 bg-secondary border-0"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                    selectedCategory === category.name
                      ? type === 'income' 
                        ? "bg-income/20 ring-2 ring-income" 
                        : "bg-expense/20 ring-2 ring-expense"
                      : "bg-secondary hover:bg-muted"
                  )}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs font-medium text-foreground">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || !selectedCategory}
            className={cn(
              "w-full h-14 text-lg font-semibold",
              type === 'income' ? "bg-income hover:bg-income/90" : "bg-expense hover:bg-expense/90"
            )}
          >
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
