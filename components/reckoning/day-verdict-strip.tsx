"use client";

import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/dates";
import { getSlideLine } from "@/lib/guilt";
import { summarizeLedger, getRecentRecords } from "@/lib/reckoning";
import type { DayRecord, DayVerdict, GuiltIntensity } from "@/types";

/** Below this, there's no shape to read — just a coloured stripe that looks like an alert. */
const MIN_DAYS_FOR_SHAPE = 4;

interface DayVerdictStripProps {
  records: DayRecord[];
  intensity: GuiltIntensity;
  days?: number;
}

const VERDICT_CLASS: Record<DayVerdict, string> = {
  clean: "bg-flow-green/70",
  partial: "bg-flow-yellow/60",
  broken: "bg-flow-red/70",
  empty: "bg-secondary",
};

const VERDICT_LABEL: Record<DayVerdict, string> = {
  clean: "everything done",
  partial: "finished short",
  broken: "nothing done",
  empty: "nothing was due",
};

/**
 * The last two weeks as a row of marks. No numbers, no chart — just a shape
 * you can read in half a second, sitting where you can't avoid it. A run of
 * red is meant to be the thing you notice before you've decided to look.
 */
export function DayVerdictStrip({ records, intensity, days = 14 }: DayVerdictStripProps) {
  const recent = getRecentRecords(records, days);
  if (recent.length < MIN_DAYS_FOR_SHAPE) return null;

  const summary = summarizeLedger(recent);
  const slideLine = getSlideLine(summary, intensity);

  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Last {recent.length} days
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {summary.cleanDays} clean · {summary.partialDays + summary.brokenDays} short
        </span>
      </div>

      <div className="mt-2.5 flex items-end justify-start gap-1">
        {recent.map((r) => (
          <div
            key={r.date}
            title={`${formatDisplayDate(r.date)} — ${VERDICT_LABEL[r.verdict]}`}
            className={cn(
              "h-6 min-w-[6px] max-w-[44px] flex-1 rounded-sm transition-opacity",
              VERDICT_CLASS[r.verdict],
              r.verdict === "empty" && "h-3 self-center"
            )}
          />
        ))}
      </div>

      {slideLine && (
        <p className="mt-2.5 text-xs font-medium text-flow-red/90">{slideLine}</p>
      )}
    </div>
  );
}
