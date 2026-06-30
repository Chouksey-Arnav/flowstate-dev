import { Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  current: number;
  best: number;
}

export function StreakCard({ current, best }: StreakCardProps) {
  const active = current > 0;
  const isPersonalBest = active && current >= best;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        active && "border-flow-yellow/25 bg-gradient-to-br from-flow-yellow/10 via-card to-card"
      )}
    >
      {active && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-flow-yellow/20 blur-3xl"
        />
      )}
      <CardContent className="relative flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
            active ? "bg-flow-yellow/15 glow-ring" : "bg-secondary"
          )}
        >
          <Flame
            className={cn("h-7 w-7", active ? "text-flow-yellow animate-flame-flicker" : "text-muted-foreground")}
            fill="currentColor"
          />
        </div>
        <div className="min-w-0">
          <p className="text-3xl font-bold leading-none tracking-tight text-foreground">
            {current}
            <span className="ml-1.5 text-base font-medium text-muted-foreground">
              {current === 1 ? "day streak" : "day streak"}
            </span>
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            {isPersonalBest ? (
              <>
                <Trophy className="h-3.5 w-3.5 text-flow-yellow" />
                <span className="font-medium text-flow-yellow">Personal best!</span>
              </>
            ) : (
              <span>Best: {best} days</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
