"use client";

import { GripVertical, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WeeklyGrid } from "./weekly-grid";
import { StreakFlame } from "./streak-flame";
import { getHabitIcon } from "@/lib/habit-icons";
import { calculateHabitStreak, calculateHabitWeekStreak, getWeekProgress } from "@/lib/habits";
import type { FirstDayOfWeek, Habit } from "@/types";

interface HabitItemProps {
  habit: Habit;
  weekDates: Date[];
  weekdayLabels: string[];
  firstDayOfWeek: FirstDayOfWeek;
  draggable?: boolean;
  onToggleDay: (dateKey: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandlers?: {
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

export function HabitItem({
  habit,
  weekDates,
  weekdayLabels,
  firstDayOfWeek,
  draggable,
  onToggleDay,
  onEdit,
  onDelete,
  dragHandlers,
}: HabitItemProps) {
  const Icon = getHabitIcon(habit.icon);
  const isDaily = (habit.timesPerWeek ?? 7) >= 7;
  const { current } = isDaily
    ? calculateHabitStreak(habit)
    : calculateHabitWeekStreak(habit, firstDayOfWeek);
  const weekProgress = getWeekProgress(habit, firstDayOfWeek);

  return (
    <div
      draggable={draggable}
      onDragStart={dragHandlers?.onDragStart}
      onDragOver={dragHandlers?.onDragOver}
      onDrop={dragHandlers?.onDrop}
      className="rounded-xl border border-border/60 bg-card p-3.5 shadow-card transition-all hover:border-border hover:shadow-card-hover"
    >
      <div className="flex items-center gap-3">
        {draggable && <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{habit.name}</p>
          <p className="text-xs text-muted-foreground">
            {habit.category}
            {!isDaily && (
              <span className={weekProgress.met ? "ml-1.5 text-flow-green" : "ml-1.5"}>
                · {weekProgress.completed}/{weekProgress.target} this week
              </span>
            )}
          </p>
        </div>
        <StreakFlame streak={current} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-flow-red">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3">
        <WeeklyGrid
          weekDates={weekDates}
          weekdayLabels={weekdayLabels}
          completions={habit.completions}
          onToggle={onToggleDay}
        />
      </div>
    </div>
  );
}
