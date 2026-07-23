"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlarmClock, Flame, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GoalUrgency } from "@/lib/dailyGoal";

interface StreakWarningBannerProps {
  tier: GoalUrgency;
  tasksRemaining: number;
  hoursRemaining: number;
  streak: number;
}

const COPY: Partial<Record<GoalUrgency, { title: (t: number) => string; icon: typeof AlarmClock }>> = {
  nudge: {
    title: (t) => `${t} task${t === 1 ? "" : "s"} left for a perfect day.`,
    icon: AlarmClock,
  },
  warning: {
    title: (t) => `Still ${t} task${t === 1 ? "" : "s"} short of a perfect day — the day's running out.`,
    icon: TriangleAlert,
  },
  critical: {
    title: (t) => `${t} task${t === 1 ? "" : "s"} left. Do it now or the streak ends today.`,
    icon: Flame,
  },
};

const TIER_CLASSES: Record<string, string> = {
  nudge: "border-primary/25 bg-primary/[0.06] text-foreground",
  warning: "border-flow-yellow/35 bg-flow-yellow/[0.08] text-foreground",
  critical: "border-flow-red/40 bg-flow-red/[0.09] text-foreground",
};

export function StreakWarningBanner({ tier, tasksRemaining, hoursRemaining, streak }: StreakWarningBannerProps) {
  const copy = COPY[tier];
  const show = !!copy && streak > 0;

  return (
    <AnimatePresence initial={false}>
      {show && copy && (
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
            <copy.icon className={cn("h-4 w-4 shrink-0", tier === "critical" && "text-flow-red")} />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{copy.title(tasksRemaining)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {streak}-day streak on the line · ~{hoursRemaining}h left today
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
