"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlarmClock, ArrowRight, PartyPopper, Plus, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/taskStore";
import { cn } from "@/lib/utils";

interface DailyReminderCardProps {
  totalToday: number;
  completedToday: number;
  hour?: number;
}

function timeOfDayCopy(hour: number): { label: string; icon: typeof SunMedium } {
  if (hour < 12) return { label: "Morning check-in", icon: SunMedium };
  if (hour < 18) return { label: "Afternoon check-in", icon: AlarmClock };
  return { label: "Evening check-in", icon: AlarmClock };
}

/**
 * Always-on nudge shown at the top of the dashboard, every single day, whether or not
 * there's anything scheduled — the goal is that FlowState never goes quiet on you.
 */
export function DailyReminderCard({ totalToday, completedToday, hour = new Date().getHours() }: DailyReminderCardProps) {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const { label, icon: Icon } = timeOfDayCopy(hour);
  const remaining = Math.max(0, totalToday - completedToday);
  const allDone = totalToday > 0 && remaining === 0;

  function submitQuickTask() {
    if (!title.trim()) return;
    addTask({ title: title.trim(), category: "Other", priority: "MEDIUM" });
    setTitle("");
    setAdding(false);
  }

  let heading: string;
  let body: string;

  if (totalToday === 0) {
    heading = "Nothing on the books for today.";
    body = "An empty list isn't a day off — it's a day you haven't planned yet. Add a task now so today doesn't slip by.";
  } else if (allDone) {
    heading = "Today's tasks are all done.";
    body = `You cleared all ${totalToday} task${totalToday === 1 ? "" : "s"} today. Add one more if you've got room to keep the momentum going.`;
  } else {
    heading = `${remaining} task${remaining === 1 ? "" : "s"} left to do today.`;
    body = "Do them, don't just plan them — a finished task beats a perfect plan every time.";
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-14 h-52 w-52 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        {allDone ? <PartyPopper className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>

      <p className="relative mt-2 text-lg font-semibold text-foreground">{heading}</p>
      <p className="relative mt-1 text-sm text-muted-foreground">{body}</p>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        {adding ? (
          <>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitQuickTask();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="What do you need to do today?"
              className="max-w-xs"
            />
            <Button size="sm" onClick={submitQuickTask} disabled={!title.trim()}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={() => setAdding(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add a task
            </Button>
            {totalToday > 0 && !allDone && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push("/tasks")}
                className={cn("shrink-0")}
              >
                Go do it <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
