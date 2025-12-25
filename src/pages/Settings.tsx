import { BottomNav } from '@/components/BottomNav';
import { CurrencySelector } from '@/components/CurrencySelector';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const settingsItems = [
  { icon: User, label: 'Profile', description: 'Manage your account' },
  { icon: Bell, label: 'Notifications', description: 'Customize alerts' },
  { icon: Shield, label: 'Privacy & Security', description: 'Protect your data' },
  { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
];

export default function SettingsPage() {
  const { transactions, savingsGoals, achievements, currency } = useFinance();

  const handleGmailShare = () => {
    const totalBalance = transactions.reduce((sum, t) => 
      t.type === 'income' ? sum + t.amount : sum - t.amount, 0
    );
    
    const subject = encodeURIComponent('My Finance Summary - MoneyTracker');
    const body = encodeURIComponent(
      `Here's my financial summary:\n\n` +
      `💰 Total Balance: ${currency.symbol}${totalBalance.toFixed(2)}\n` +
      `📈 Total Transactions: ${transactions.length}\n` +
      `🎯 Savings Goals: ${savingsGoals.length}\n` +
      `🏆 Achievements Unlocked: ${achievements.filter(a => a.unlocked).length}/${achievements.length}\n\n` +
      `Sent from MoneyTracker App`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    toast.success('Opening email client...');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Customize your experience</p>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* User Profile Preview */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">Guest User</h3>
              <p className="text-sm text-muted-foreground">Sign in to sync your data</p>
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>

        {/* Currency Selector */}
        <CurrencySelector />

        {/* Share via Gmail */}
        <button
          onClick={handleGmailShare}
          className="glass-card rounded-xl p-4 w-full flex items-center gap-4 hover:bg-card/90 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-expense/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-expense" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-foreground">Share via Gmail</h4>
            <p className="text-sm text-muted-foreground">Send your finance summary</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Settings Menu */}
        <div className="space-y-2">
          {settingsItems.map(({ icon: Icon, label, description }) => (
            <button
              key={label}
              onClick={() => toast.info(`${label} - Coming soon!`)}
              className="glass-card rounded-xl p-4 w-full flex items-center gap-4 hover:bg-card/90 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-foreground">{label}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">MoneyTracker v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Made with ❤️</p>
        </div>

        {/* Logout Button */}
        <Button variant="outline" className="w-full text-expense border-expense/20 hover:bg-expense/10">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </main>

      <AddTransactionSheet />
      <BottomNav />
    </div>
  );
}
