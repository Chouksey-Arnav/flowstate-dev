"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, X } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useStreakStore } from "@/store/streakStore";
import { useXpStore } from "@/store/xpStore";
import { useSettingsStore } from "@/store/settingsStore";
import { calculatePerfectDayStreak, getPerfectDayKeys } from "@/lib/streaks";
import { getNewlyEarnedBadges, type StreakBadge } from "@/lib/badges";
import { fireLevelUpConfetti } from "@/lib/confetti";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

/**
 * Watches the Perfect Day streak for newly-crossed badge thresholds and
 * celebrates each one, full-screen, once. Mounted at app root so it fires
 * regardless of which page the qualifying task was completed on. Renders
 * above `LevelUpModal` (z-[70] vs z-[60]) so if a badge and a level-up land
 * on the same tick, the badge shows first and closing it reveals the
 * level-up modal underneath — a free queue, no cross-component signaling.
 */
export function StreakMilestoneModal() {
  const tasks = useTaskStore((s) => s.tasks);
  const tasksHydrated = useTaskStore((s) => s.hasHydrated);
  const earnedBadgeIds = useStreakStore((s) => s.earnedBadgeIds);
  const streakHydrated = useStreakStore((s) => s.hasHydrated);
  const recordBadge = useStreakStore((s) => s.recordBadge);
  const recordStreakStats = useStreakStore((s) => s.recordStreakStats);
  const awardXp = useXpStore((s) => s.awardXp);
  const confettiEnabled = useSettingsStore((s) => s.confettiEnabled);

  const [queue, setQueue] = useState<StreakBadge[]>([]);

  useEffect(() => {
    if (!tasksHydrated || !streakHydrated) return;
    const { current } = calculatePerfectDayStreak(tasks);
    recordStreakStats(current, getPerfectDayKeys(tasks).size);

    const newly = getNewlyEarnedBadges(current, earnedBadgeIds);
    if (newly.length === 0) return;
    for (const badge of newly) {
      recordBadge(badge.id);
      awardXp(badge.bonusXp, "milestone", `${badge.name} badge — ${badge.threshold}-day streak!`);
    }
    setQueue((prev) => [...prev, ...newly]);
    if (confettiEnabled) fireLevelUpConfetti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, tasksHydrated, streakHydrated, earnedBadgeIds]);

  useBodyScrollLock(queue.length > 0);

  const current = queue[0] ?? null;

  function dismiss() {
    setQueue((prev) => prev.slice(1));
  }

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/85 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-flow-yellow/30 bg-card p-8 text-center shadow-card-hover"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-flow-yellow/25 blur-3xl"
            />
            <button
              onClick={dismiss}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative mx-auto flex h-16 w-16 animate-level-up-pop items-center justify-center rounded-2xl bg-gradient-to-br from-flow-yellow to-flow-red glow-ring">
              <Flame className="h-8 w-8 text-white" fill="currentColor" />
            </div>

            <p className="relative mt-4 text-sm font-medium text-muted-foreground">
              {current.threshold}-day streak badge
            </p>
            <p className="relative text-gradient text-4xl font-bold tracking-tight">{current.name}</p>
            <p className="relative mt-2 text-sm text-muted-foreground">{current.tagline}</p>

            <div className="relative mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-flow-yellow/10 px-3 py-2 text-sm font-bold text-flow-yellow">
              <Flame className="h-3.5 w-3.5" fill="currentColor" />
              +{current.bonusXp} XP
            </div>

            <button
              onClick={dismiss}
              className="relative mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {queue.length > 1 ? "Next badge" : "Keep the streak alive"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
