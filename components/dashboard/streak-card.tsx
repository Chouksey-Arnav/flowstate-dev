import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCardProps {
  current: number;
  best: number;
}

export function StreakCard({ current, best }: StreakCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flow-yellow/10">
          <Flame className="h-6 w-6 text-flow-yellow" fill="currentColor" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{current}-day streak</p>
          <p className="text-xs text-muted-foreground">Best: {best} days</p>
        </div>
      </CardContent>
    </Card>
  );
}
