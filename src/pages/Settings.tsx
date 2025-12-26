import { BottomNav } from '@/components/BottomNav';
import { CurrencySelector } from '@/components/CurrencySelector';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Star, ChevronRight, Moon, Sun, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { achievements } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

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
        {/* Theme Toggle */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-primary" />
                ) : (
                  <Sun className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'light'}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

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

        {/* Account Section */}
        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Account</h3>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email || 'Not signed in'}
              </p>
            </div>
          </div>
          {user ? (
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="w-full gap-2">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

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
