"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { getReckoningCopy, getYearLine } from "@/lib/guilt";
import { getYearPosition } from "@/lib/reckoning";
import { fromDateKey } from "@/lib/dates";
import { playReckoningTone } from "@/lib/audio";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { DayRecord, GuiltIntensity } from "@/types";

interface ReckoningModalProps {
  record: DayRecord;
  intensity: GuiltIntensity;
  soundEnabled: boolean;
  /** How many days are queued behind this one, for the "next" affordance. */
  remaining: number;
  onCarryForward: (taskIds: string[]) => void;
  onLetGo: (taskIds: string[]) => void;
}

/**
 * The closed-day screen.
 *
 * Everything here is tuned against the celebration modals on purpose. Those
 * pop, glow and confetti; this fades up slowly, sits in desaturated red-grey,
 * and has no close button in the corner. There is no way past it except
 * through one of two decisions — carry the work forward, or say out loud that
 * you're dropping it. That absence of an escape hatch is the whole design:
 * a dismissable guilt screen is a guilt screen people learn to swipe away.
 */
export function ReckoningModal({
  record,
  intensity,
  soundEnabled,
  remaining,
  onCarryForward,
  onLetGo,
}: ReckoningModalProps) {
  const [confirmingLetGo, setConfirmingLetGo] = useState(false);
  const copy = useMemo(() => getReckoningCopy(record, intensity), [record, intensity]);
  const year = getYearPosition(fromDateKey(record.date));

  const carryableIds = record.missed.filter((m) => !m.recurring).map((m) => m.taskId);
  const allIds = record.missed.map((m) => m.taskId);

  useBodyScrollLock(true);

  useEffect(() => {
    setConfirmingLetGo(false);
    if (soundEnabled) playReckoningTone();
  }, [record.date, soundEnabled]);

  function handlePrimary() {
    onCarryForward(carryableIds);
  }

  function handleSecondary() {
    if (carryableIds.length === 0) {
      onLetGo([]);
      return;
    }
    if (!confirmingLetGo) {
      setConfirmingLetGo(true);
      return;
    }
    onLetGo(allIds);
  }

  return (
    <AnimatePresence>
      <motion.div
        key={record.date}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reckoning-headline"
        className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md"
      >
        {/* A cold wash behind the card — the room's lights going down. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,hsl(0_60%_30%/0.20),transparent_65%)]"
        />

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-flow-red/25 bg-card shadow-card-hover"
        >
          <div className="border-b border-border/60 px-6 py-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-flow-red/80">
              <CalendarX2 className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </div>
            <h2
              id="reckoning-headline"
              className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground"
            >
              {copy.headline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.body}</p>
          </div>

          <div className="space-y-4 px-6 py-5">
            {/* The named work. Struck through in a dead grey — never the
                satisfying green strike that means "done". */}
            <ul className="space-y-1.5">
              {record.missed.slice(0, 6).map((m) => (
                <li
                  key={m.taskId}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-secondary/25 px-3 py-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                      {m.title}
                    </span>
                    {(m.wasCommitment || m.timesMissedBefore > 0) && (
                      <span className="mt-0.5 block text-xs text-flow-red/80">
                        {[
                          m.wasCommitment ? "the one thing you locked in" : null,
                          m.timesMissedBefore > 0
                            ? `${m.timesMissedBefore + 1} days running`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground/70">
                    −{m.xpForfeited} XP
                  </span>
                </li>
              ))}
              {record.missed.length > 6 && (
                <li className="px-3 pt-1 text-xs text-muted-foreground">
                  …and {record.missed.length - 6} more.
                </li>
              )}
            </ul>

            <p className="text-xs leading-relaxed text-muted-foreground">{copy.costLine}</p>

            {copy.whyLine && (
              <div className="flex gap-2.5 rounded-lg border border-flow-yellow/20 bg-flow-yellow/[0.05] px-3 py-2.5">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flow-yellow/80" />
                <p className="text-sm leading-relaxed text-foreground/90">{copy.whyLine}</p>
              </div>
            )}

            {/* The year bar: one thin sliver of a finite thing, already spent. */}
            <div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-flow-red/60 to-flow-red"
                  style={{ width: `${year.percentGone}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                {getYearLine(intensity, fromDateKey(record.date))}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-foreground">{copy.closing}</p>
          </div>

          <div className="flex flex-col gap-2 border-t border-border/60 px-6 py-4">
            <button
              onClick={handlePrimary}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {copy.primaryAction}
              {remaining > 0 && <span className="ml-1.5 opacity-70">· {remaining} more day{remaining === 1 ? "" : "s"} to face</span>}
            </button>
            <button
              onClick={handleSecondary}
              className={cn(
                "w-full rounded-lg py-2 text-xs font-medium transition-colors",
                confirmingLetGo
                  ? "bg-flow-red/10 text-flow-red hover:bg-flow-red/15"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {confirmingLetGo
                ? `Yes — drop ${record.missed.length === 1 ? "it" : "them"} for good`
                : copy.secondaryAction}
            </button>
            {confirmingLetGo && (
              <p className="text-center text-xs text-muted-foreground">
                They get archived, not finished. That&apos;s a decision too.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
