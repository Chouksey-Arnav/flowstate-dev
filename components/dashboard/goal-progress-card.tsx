"use client";

import { Minus, Plus, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GoalUrgency } from "@/lib/dailyGoal";

interface GoalProgressCardProps {
  completedToday: number;
  goal: number;
  tier: GoalUrgency;
  onChangeGoal: (goal: number) => void;
}

const TIER_STYLES: Record<GoalUrgency, { bar: string; ring: string }> = {
  met: { bar: "bg-flow-green", ring: "border-flow-green/25" },
  calm: { bar: "bg-primary", ring: "border-border/60" },
  nudge: { bar: "bg-primary", ring: "border-border/60" },
  warning: { bar: "bg-flow-yellow", ring: "border-flow-yellow/30" },
  critical: { bar: "bg-flow-red", ring: "border-flow-red/40" },
};

export function GoalProgressCard({ completedToday, goal, tier, onChangeGoal }: GoalProgressCardProps) {
  const pct = goal === 0 ? 0 : Math.min(100, Math.round((completedToday / goal) * 100));
  const styles = TIER_STYLES[tier];

  return (
    <Card className={cn("transition-colors", styles.ring)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="text-xs">Today&apos;s task goal</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onChangeGoal(Math.max(1, goal - 1))}
              aria-label="Lower goal"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onChangeGoal(Math.min(20, goal + 1))}
              aria-label="Raise goal"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <p className="mt-2 text-2xl font-semibold text-foreground">
          {completedToday}
          <span className="text-muted-foreground">/{goal}</span>
        </p>

        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className={cn("h-full rounded-full", styles.bar)}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>

        <p className="mt-1.5 text-xs text-muted-foreground">
          {tier === "met" ? "Goal hit — streak protected today." : `${pct}% of today's goal`}
        </p>
      </CardContent>
    </Card>
  );
}
