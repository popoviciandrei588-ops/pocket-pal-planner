import { BottomNav } from '@/components/BottomNav';
import { CurrencySelector } from '@/components/CurrencySelector';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { Trophy, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { achievements } = useFinance();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-4 pt-safe pb-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">Customize your experience</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Currency Selector */}
        <CurrencySelector />

        {/* Achievements Link */}
        <Link 
          to="/achievements"
          className="glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-achievement/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-achievement" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Achievements</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-savings text-savings" />
                <span>{unlockedCount} / {totalCount} unlocked</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">MoneyTracker v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Made with ❤️</p>
        </div>
      </main>

      <AddTransactionSheet />
      <BottomNav />
    </div>
  );
}
