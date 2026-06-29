"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/dates";

interface WeeklyGridProps {
  weekDates: Date[];
  weekdayLabels: string[];
  completions: string[];
  onToggle: (dateKey: string) => void;
}

export function WeeklyGrid({ weekDates, weekdayLabels, completions, onToggle }: WeeklyGridProps) {
  const todayKey = toDateKey();

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {weekDates.map((date, i) => {
        const key = toDateKey(date);
        const completed = completions.includes(key);
        const future = key > todayKey;
        return (
          <button
            key={key}
            type="button"
            disabled={future}
            onClick={() => onToggle(key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md py-1.5 text-xs transition-colors",
              future && "cursor-not-allowed opacity-30",
              !future && "cursor-pointer hover:bg-accent"
            )}
          >
            <span className="text-muted-foreground">{weekdayLabels[i]}</span>
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border",
                completed ? "border-transparent bg-flow-green text-white" : "border-border",
                key === todayKey && !completed && "border-primary"
              )}
            >
              {completed && <Check className="h-3.5 w-3.5" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
