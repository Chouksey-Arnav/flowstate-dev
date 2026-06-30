import { Flame, Quote, Zap } from "lucide-react";
import { getHourlyQuote } from "@/lib/quotes";

interface MomentumBarProps {
  completedToday: number;
  totalToday: number;
  streak: number;
}

export function MomentumBar({ completedToday, totalToday, streak }: MomentumBarProps) {
  const pct = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-flow-yellow/15">
            <Flame className="h-5 w-5 text-flow-yellow" fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-semibold leading-none text-foreground">
              {streak > 0 ? `${streak}-day streak` : "Start your streak"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {completedToday}/{totalToday || 0} done today
            </p>
          </div>
        </div>

        {totalToday > 0 && (
          <div className="flex w-full max-w-[160px] flex-1 items-center gap-2 sm:w-auto">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-flow-green transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">{pct}%</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start gap-2 border-t border-border/60 pt-3 text-sm text-foreground">
        <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>{getHourlyQuote()}</span>
      </div>

      {completedToday === 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
          <Zap className="h-3.5 w-3.5" />
          <span>Pick the easiest task and finish it in the next 5 minutes.</span>
        </div>
      )}
    </div>
  );
}
