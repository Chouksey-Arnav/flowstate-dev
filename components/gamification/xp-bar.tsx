"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useXpStore } from "@/store/xpStore";
import { getLevelProgress, getLevelTitle } from "@/lib/xp";
import { cn } from "@/lib/utils";

interface XpBarProps {
  collapsed?: boolean;
}

export function XpBar({ collapsed }: XpBarProps) {
  const totalXp = useXpStore((s) => s.totalXp);
  const hasHydrated = useXpStore((s) => s.hasHydrated);
  if (!hasHydrated) return null;

  const { level, xpIntoLevel, xpForNextLevel, progress } = getLevelProgress(totalXp);
  const title = getLevelTitle(level);
  const almostThere = progress >= 0.85;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 px-2 py-3" title={`Level ${level} · ${title}`}>
        <div className={cn("relative flex h-8 w-8 items-center justify-center rounded-full bg-secondary", almostThere && "glow-ring")}>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">Lv{level}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 px-3 py-3">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Sparkles className={cn("h-3.5 w-3.5 text-primary", almostThere && "animate-pulse-slow")} />
          Level {level}
        </span>
        <span className="text-muted-foreground">{title}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={false}
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
      <p className="text-right text-[10px] tabular-nums text-muted-foreground">
        {almostThere ? `${xpForNextLevel - xpIntoLevel} XP to level up!` : `${xpIntoLevel}/${xpForNextLevel} XP`}
      </p>
    </div>
  );
}

export function XpChip({ className }: { className?: string }) {
  const totalXp = useXpStore((s) => s.totalXp);
  const hasHydrated = useXpStore((s) => s.hasHydrated);
  if (!hasHydrated) return null;
  const { level } = getLevelProgress(totalXp);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary",
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      Lv{level}
    </span>
  );
}
