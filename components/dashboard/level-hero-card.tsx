"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp } from "lucide-react";
import { useXpStore } from "@/store/xpStore";
import { getLevelProgress, getLevelTitle } from "@/lib/xp";
import { toDateKey } from "@/lib/dates";
import { cn } from "@/lib/utils";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LevelHeroCard() {
  const totalXp = useXpStore((s) => s.totalXp);
  const events = useXpStore((s) => s.events);
  const hasHydrated = useXpStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <div className="h-[168px] animate-pulse rounded-2xl border border-border/60 bg-card" />;
  }

  const { level, xpIntoLevel, xpForNextLevel, progress } = getLevelProgress(totalXp);
  const title = getLevelTitle(level);
  const todayKey = toDateKey();
  const xpToday = events
    .filter((e) => e.at.slice(0, 10) === todayKey)
    .reduce((sum, e) => sum + e.amount, 0);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-card sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
            <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="hsl(var(--secondary))" strokeWidth="7" />
            <motion.circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="url(#level-ring-gradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={false}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />
            <defs>
              <linearGradient id="level-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(252 87% 67%)" />
                <stop offset="100%" stopColor="hsl(217 91% 63%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold leading-none tracking-tight text-foreground">{level}</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Level</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary sm:justify-start">
            <Sparkles className="h-3.5 w-3.5" />
            {title}
          </div>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {totalXp.toLocaleString()} <span className="text-base font-medium text-muted-foreground">total XP</span>
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={false}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {xpIntoLevel}/{xpForNextLevel} XP to level {level + 1}
          </p>
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl border border-border/60 bg-card/70 px-4 py-3 text-center backdrop-blur-sm",
            xpToday > 0 && "border-flow-green/30 bg-flow-green/5"
          )}
        >
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", xpToday > 0 ? "bg-flow-green/15" : "bg-secondary")}>
            {xpToday > 0 ? (
              <TrendingUp className="h-4 w-4 text-flow-green" />
            ) : (
              <Zap className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="text-left">
            <p className={cn("text-lg font-bold leading-none tabular-nums", xpToday > 0 ? "text-flow-green" : "text-foreground")}>
              +{xpToday}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">XP today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
