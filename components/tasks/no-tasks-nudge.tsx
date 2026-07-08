"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoTasksNudgeProps {
  onAddTask: () => void;
}

/** Fills the "Do this next" slot when there's nothing queued up — the reminder to act should never just vanish. */
export function NoTasksNudge({ onAddTask }: NoTasksNudgeProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
      />
      <div className="relative flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Do this next
      </div>
      <p className="relative mt-2 text-lg font-semibold text-foreground">Nothing queued up today.</p>
      <p className="relative mt-1 text-sm text-muted-foreground">
        An empty list won&apos;t build momentum on its own — add a task now and give yourself something to win today.
      </p>
      <Button onClick={onAddTask} className="relative mt-4 w-full sm:w-auto">
        Add a task <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  );
}
