"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";
import { useXpStore } from "@/store/xpStore";
import { useSettingsStore } from "@/store/settingsStore";
import { getLevelProgress, getLevelTitle } from "@/lib/xp";
import { fireLevelUpConfetti } from "@/lib/confetti";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

/**
 * Watches totalXp for a level crossing and celebrates it once, full-screen.
 * Mounted once at the app root so it fires regardless of which page triggered the XP.
 */
export function LevelUpModal() {
  const totalXp = useXpStore((s) => s.totalXp);
  const hasHydrated = useXpStore((s) => s.hasHydrated);
  const lastSeenLevel = useXpStore((s) => s.lastSeenLevel);
  const acknowledgeLevel = useXpStore((s) => s.acknowledgeLevel);
  const confettiEnabled = useSettingsStore((s) => s.confettiEnabled);
  const [celebrating, setCelebrating] = useState<number | null>(null);

  const { level } = getLevelProgress(totalXp);

  useEffect(() => {
    if (!hasHydrated) return;
    if (level > lastSeenLevel) {
      setCelebrating(level);
      if (confettiEnabled) fireLevelUpConfetti();
    }
  }, [hasHydrated, level, lastSeenLevel, confettiEnabled]);

  useBodyScrollLock(celebrating !== null);

  function close() {
    if (celebrating !== null) acknowledgeLevel(celebrating);
    setCelebrating(null);
  }

  return (
    <AnimatePresence>
      {celebrating !== null && (
        <motion.div
          key="level-up-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-primary/25 bg-card p-8 text-center shadow-card-hover"
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-16 w-16 animate-level-up-pop items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-ring">
              <PartyPopper className="h-8 w-8 text-primary-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium text-muted-foreground">Level up</p>
            <p className="text-gradient text-4xl font-bold tracking-tight">Level {celebrating}</p>
            <p className="mt-1 text-sm text-muted-foreground">{getLevelTitle(celebrating)}</p>

            <button
              onClick={close}
              className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Keep going
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
