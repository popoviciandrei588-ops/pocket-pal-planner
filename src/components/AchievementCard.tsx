import { Achievement } from '@/types/finance';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const progress = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-4 transition-all duration-300 animate-scale-in",
        achievement.unlocked 
          ? "border-2 border-achievement/50" 
          : "opacity-60"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-3xl relative",
          achievement.unlocked 
            ? "bg-achievement/20" 
            : "bg-secondary"
        )}>
          {achievement.unlocked ? (
            achievement.icon
          ) : (
            <>
              <span className="opacity-30">{achievement.icon}</span>
              <Lock className="w-4 h-4 absolute text-muted-foreground" />
            </>
          )}
        </div>
        <div className="flex-1">
          <h4 className={cn(
            "font-semibold",
            achievement.unlocked ? "text-foreground" : "text-muted-foreground"
          )}>
            {achievement.name}
          </h4>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        </div>
      </div>

      {!achievement.unlocked && (
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2 bg-secondary"
          />
          <p className="text-xs text-muted-foreground text-right">
            {achievement.progress} / {achievement.maxProgress}
          </p>
        </div>
      )}

      {achievement.unlocked && achievement.unlockedAt && (
        <p className="text-xs text-achievement font-medium">
          Unlocked!
        </p>
      )}
    </div>
  );
}
