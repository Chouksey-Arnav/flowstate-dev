"use client";

import { useState } from "react";
import { CalendarX2, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/dates";
import { getRecentRecords, summarizeLedger } from "@/lib/reckoning";
import type { DayRecord } from "@/types";

interface ReckoningWallProps {
  records: DayRecord[];
}

/**
 * The unflattering half of Stats.
 *
 * Every other chart in this app is built to make progress look good. This one
 * exists to make sure the misses are just as legible as the wins — a stat
 * page that only counts completions quietly teaches you that the days you
 * dropped never happened. They did, and they're listed here by name.
 */
export function ReckoningWall({ records }: ReckoningWallProps) {
  const [expanded, setExpanded] = useState(false);

  const failed = records
    .filter((r) => r.verdict === "broken" || r.verdict === "partial")
    .sort((a, b) => b.date.localeCompare(a.date));

  const summary = summarizeLedger(records);
  const last90 = summarizeLedger(getRecentRecords(records, 90));

  if (records.length === 0) return null;

  const shown = expanded ? failed : failed.slice(0, 5);

  return (
    <Card className={cn(failed.length > 0 && "border-flow-red/20")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <CalendarX2 className="h-4 w-4 text-flow-red" /> The days you let go
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Days short" value={String(summary.partialDays + summary.brokenDays)} tone="bad" />
          <Stat label="Tasks missed" value={String(summary.tasksMissed)} tone="bad" />
          <Stat label="XP forfeited" value={String(summary.xpForfeited)} tone="bad" />
        </div>

        {failed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing on this wall yet. Every day FlowState has closed, you finished what you
            promised. Keep it empty.
          </p>
        ) : (
          <>
            <ul className="space-y-1.5">
              {shown.map((r) => (
                <li
                  key={r.date}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-secondary/20 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{formatDisplayDate(r.date)}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {r.missed.map((m) => m.title).join(" · ")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
                      r.verdict === "broken"
                        ? "border-flow-red/30 bg-flow-red/10 text-flow-red"
                        : "border-flow-yellow/30 bg-flow-yellow/10 text-flow-yellow"
                    )}
                  >
                    {r.doneCount}/{r.dueCount}
                  </span>
                </li>
              ))}
            </ul>

            {failed.length > 5 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
                {expanded ? "Show fewer" : `Show all ${failed.length}`}
              </button>
            )}
          </>
        )}

        <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
          Last 90 days: {last90.cleanDays} clean · {last90.partialDays} short ·{" "}
          {last90.brokenDays} lost entirely.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "bad" | "neutral" }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <p
        className={cn(
          "text-xl font-semibold tabular-nums",
          tone === "bad" ? "text-flow-red" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
