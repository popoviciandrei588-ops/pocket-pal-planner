import { BottomNav } from '@/components/BottomNav';
import { CurrencySelector } from '@/components/CurrencySelector';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Customize your experience</p>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Currency Selector */}
        <CurrencySelector />

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
