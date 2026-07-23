import { Flame, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STREAK_BADGES } from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeCaseProps {
  earnedBadgeIds: string[];
  currentStreak: number;
}

export function BadgeCase({ earnedBadgeIds, currentStreak }: BadgeCaseProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Streak badges</CardTitle>
        <span className="text-xs text-muted-foreground">
          {earnedBadgeIds.length}/{STREAK_BADGES.length} earned
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {STREAK_BADGES.map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                title={`${badge.name} — ${badge.threshold}-day streak${earned ? " (earned)" : ""}`}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all",
                    earned
                      ? "border-flow-yellow bg-gradient-to-br from-flow-yellow/25 to-flow-red/20 text-flow-yellow shadow-[0_0_0_4px_rgba(234,179,8,0.1)]"
                      : "border-dashed border-border/60 bg-secondary/30 text-muted-foreground"
                  )}
                >
                  {earned ? (
                    <Flame className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-center text-[10px] font-semibold leading-tight",
                    earned ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {badge.name}
                </span>
                <span className="text-[9px] tabular-nums text-muted-foreground">{badge.threshold}d</span>
              </div>
            );
          })}
        </div>
        {currentStreak > 0 && (
          <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            Current streak: <span className="font-semibold text-foreground">{currentStreak} days</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
