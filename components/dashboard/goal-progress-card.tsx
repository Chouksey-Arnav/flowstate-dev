"use client";

import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GoalUrgency } from "@/lib/dailyGoal";

interface GoalProgressCardProps {
  completedToday: number;
  totalToday: number;
  tier: GoalUrgency;
}

const TIER_STYLES: Record<GoalUrgency, { bar: string; ring: string }> = {
  met: { bar: "bg-flow-green", ring: "border-flow-green/25" },
  calm: { bar: "bg-primary", ring: "border-border/60" },
  nudge: { bar: "bg-primary", ring: "border-border/60" },
  warning: { bar: "bg-flow-yellow", ring: "border-flow-yellow/30" },
  critical: { bar: "bg-flow-red", ring: "border-flow-red/40" },
};

/** Progress toward today's Perfect Day — every task due today, checked off. No editable target: the day sets its own bar. */
export function GoalProgressCard({ completedToday, totalToday, tier }: GoalProgressCardProps) {
  const pct = totalToday === 0 ? 0 : Math.min(100, Math.round((completedToday / totalToday) * 100));
  const styles = TIER_STYLES[tier];

  return (
    <Card className={cn("transition-colors", styles.ring)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Target className="h-4 w-4" />
          <span className="text-xs">Due today</span>
        </div>

        <p className="mt-2 text-2xl font-semibold text-foreground">
          {completedToday}
          <span className="text-muted-foreground">/{totalToday}</span>
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
          {totalToday === 0
            ? "Nothing due today — add a task to put today on the board."
            : tier === "met"
              ? "Perfect day — streak protected."
              : `${pct}% of today cleared`}
        </p>
      </CardContent>
    </Card>
  );
}
