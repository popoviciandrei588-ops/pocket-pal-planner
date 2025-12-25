import { useFinance } from '@/context/FinanceContext';
import { CURRENCIES, Currency } from '@/types/finance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign } from 'lucide-react';

export function CurrencySelector() {
  const { currency, setCurrency } = useFinance();

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Currency</h4>
          <p className="text-sm text-muted-foreground">Select your preferred currency</p>
        </div>
      </div>
      
      <Select 
        value={currency.code} 
        onValueChange={(code) => {
          const newCurrency = CURRENCIES.find(c => c.code === code);
          if (newCurrency) setCurrency(newCurrency);
        }}
      >
        <SelectTrigger className="w-full bg-secondary border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="glass-card border-border">
          {CURRENCIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              <span className="flex items-center gap-2">
                <span className="font-mono">{c.symbol}</span>
                <span>{c.name}</span>
                <span className="text-muted-foreground">({c.code})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
