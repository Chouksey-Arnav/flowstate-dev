"use client";

import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PerfectDayBadge } from "@/components/habits/perfect-day-badge";
import { getHabitIcon } from "@/lib/habit-icons";
import { calculateHabitStreak, isCompletedToday } from "@/lib/habits";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types";

interface HabitStatusRowProps {
  habits: Habit[];
  onToggle: (id: string) => void;
}

export function HabitStatusRow({ habits, onToggle }: HabitStatusRowProps) {
  const doneCount = habits.filter(isCompletedToday).length;
  const allDone = habits.length > 0 && doneCount === habits.length;

  return (
    <Card className={cn(allDone && "border-flow-green/40 bg-flow-green/[0.04]")}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Today&apos;s habits</CardTitle>
          {habits.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">Tap one to check it off — this is the part that compounds.</p>
          )}
        </div>
        {habits.length > 0 &&
          (allDone ? (
            <PerfectDayBadge />
          ) : (
            <span className="shrink-0 rounded-full border border-border/60 bg-secondary/60 px-2.5 py-1 text-xs font-bold tabular-nums text-muted-foreground">
              {doneCount}/{habits.length}
            </span>
          ))}
      </CardHeader>
      <CardContent className={habits.length === 0 ? undefined : "flex flex-wrap gap-x-5 gap-y-4"}>
        {habits.length === 0 && (
          <EmptyState
            icon={Flame}
            title="No habits yet"
            description="Add one to start tracking your streak."
            className="py-8"
          />
        )}
        {habits.map((habit) => {
          const Icon = getHabitIcon(habit.icon);
          const done = isCompletedToday(habit);
          const { current: streak } = calculateHabitStreak(habit);
          return (
            <button
              key={habit.id}
              type="button"
              onClick={() => onToggle(habit.id)}
              title={done ? `Uncheck ${habit.name}` : `Check off ${habit.name}`}
              className="group flex w-[78px] flex-col items-center gap-1.5 focus-visible:outline-none"
            >
              <div
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-200 ease-out group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background",
                  done
                    ? "border-flow-green bg-flow-green text-white shadow-[0_0_0_5px_rgba(34,197,94,0.14),0_10px_24px_-10px_rgba(34,197,94,0.7)]"
                    : "border-border bg-secondary/40 text-muted-foreground group-hover:border-flow-green/50 group-hover:text-foreground"
                )}
              >
                <Icon className="h-7 w-7" />
                {streak > 0 && (
                  <span
                    className={cn(
                      "absolute -bottom-1.5 -right-1.5 flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none",
                      done
                        ? "border-flow-yellow/40 bg-background text-flow-yellow"
                        : "border-flow-yellow/25 bg-background/90 text-flow-yellow"
                    )}
                  >
                    <Flame className="h-2.5 w-2.5" fill="currentColor" />
                    {streak}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "max-w-[78px] truncate text-center text-[11.5px] leading-tight",
                  done ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {habit.name}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
