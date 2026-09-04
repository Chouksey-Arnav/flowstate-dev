"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlarmClock, Flame, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEndOfDayLine } from "@/lib/guilt";
import type { GuiltIntensity } from "@/types";
import type { GoalUrgency } from "@/lib/dailyGoal";

interface StreakWarningBannerProps {
  tier: GoalUrgency;
  tasksRemaining: number;
  hoursRemaining: number;
  streak: number;
  intensity: GuiltIntensity;
}

const ICONS: Partial<Record<GoalUrgency, typeof AlarmClock>> = {
  nudge: AlarmClock,
  warning: TriangleAlert,
  critical: Flame,
};

const TIER_CLASSES: Record<string, string> = {
  nudge: "border-primary/25 bg-primary/[0.06] text-foreground",
  warning: "border-flow-yellow/35 bg-flow-yellow/[0.08] text-foreground",
  critical: "border-flow-red/40 bg-flow-red/[0.09] text-foreground",
};

/**
 * The clock closing in on unfinished work.
 *
 * This used to require an active streak, which meant it went quiet for the one
 * person who needs it most — someone who already broke their streak and is
 * mid-slide. The streak is now a detail in the subtext, not the precondition:
 * what triggers the warning is unfinished work and a shrinking day.
 */
export function StreakWarningBanner({
  tier,
  tasksRemaining,
  hoursRemaining,
  streak,
  intensity,
}: StreakWarningBannerProps) {
  const Icon = ICONS[tier];
  const show = !!Icon && tasksRemaining > 0;

  return (
    <AnimatePresence initial={false}>
      {show && Icon && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
              TIER_CLASSES[tier],
              tier === "critical" && "animate-pulse-slow"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", tier === "critical" && "text-flow-red")} />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">
                {getEndOfDayLine(tasksRemaining, hoursRemaining, intensity)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {streak > 0
                  ? `${streak}-day streak on the line · ~${hoursRemaining}h left today`
                  : `~${hoursRemaining}h left today · a clean day today starts a new streak`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
