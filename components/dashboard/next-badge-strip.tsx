"use client";

import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getNextBadge, STREAK_BADGES } from "@/lib/badges";

interface NextBadgeStripProps {
  currentStreak: number;
  earnedBadgeIds: string[];
}

export function NextBadgeStrip({ currentStreak, earnedBadgeIds }: NextBadgeStripProps) {
  const next = getNextBadge(earnedBadgeIds);

  if (!next) {
    return (
      <Card className="border-flow-yellow/30 bg-flow-yellow/[0.06]">
        <CardContent className="flex items-center gap-3 p-4">
          <Trophy className="h-5 w-5 shrink-0 text-flow-yellow" />
          <p className="text-sm font-medium text-foreground">
            Every streak badge earned — {STREAK_BADGES.length}/{STREAK_BADGES.length}. Legendary.
          </p>
        </CardContent>
      </Card>
    );
  }

  const daysToGo = Math.max(0, next.threshold - currentStreak);
  const pct = Math.min(100, Math.round((currentStreak / next.threshold) * 100));

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4 text-flow-yellow" />
            <span className="text-xs">Next badge: {next.name}</span>
          </div>
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {daysToGo === 0 ? "Unlocking today" : `${daysToGo} day${daysToGo === 1 ? "" : "s"} to go`}
          </span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-flow-yellow to-flow-red"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
