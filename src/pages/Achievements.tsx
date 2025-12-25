import { BottomNav } from '@/components/BottomNav';
import { AchievementCard } from '@/components/AchievementCard';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { useFinance } from '@/context/FinanceContext';
import { Trophy, Star } from 'lucide-react';

export default function AchievementsPage() {
  const { achievements } = useFinance();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground text-sm">Your financial milestones</p>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Stats Overview */}
        <div className="glass-card rounded-2xl p-6" style={{
          background: 'linear-gradient(135deg, hsl(280 68% 60% / 0.15), hsl(300 60% 50% / 0.1))',
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-achievement/20 flex items-center justify-center animate-float">
                <Trophy className="w-8 h-8 text-achievement" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
                <h2 className="text-3xl font-bold text-foreground">
                  {unlockedCount} <span className="text-lg text-muted-foreground">/ {totalCount}</span>
                </h2>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-savings mb-1">
                <Star className="w-4 h-4 fill-savings" />
                <span className="font-bold">{Math.round((unlockedCount / totalCount) * 100)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-savings fill-savings" />
            Unlocked
          </h3>
          <div className="space-y-3">
            {achievements.filter(a => a.unlocked).map((achievement, index) => (
              <div key={achievement.id} style={{ animationDelay: `${index * 100}ms` }}>
                <AchievementCard achievement={achievement} />
              </div>
            ))}
          </div>
        </section>

        {/* Locked Achievements */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            🔒 In Progress
          </h3>
          <div className="space-y-3">
            {achievements.filter(a => !a.unlocked).map((achievement, index) => (
              <div key={achievement.id} style={{ animationDelay: `${index * 100}ms` }}>
                <AchievementCard achievement={achievement} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <AddTransactionSheet />
      <BottomNav />
    </div>
  );
}
