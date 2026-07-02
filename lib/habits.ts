import { subWeeks } from "date-fns";
import type { FirstDayOfWeek, Habit } from "@/types";
import { toDateKey, fromDateKey, getWeekStart } from "./dates";
import { calculateStreakFromDateSet, type Streak } from "./streaks";

export function isCompletedOn(habit: Habit, dateKey: string): boolean {
  return habit.completions.includes(dateKey);
}

export function isCompletedToday(habit: Habit): boolean {
  return isCompletedOn(habit, toDateKey());
}

/** Day-by-day streak — the right measure for habits expected every day (timesPerWeek === 7). */
export function calculateHabitStreak(habit: Habit, today: Date = new Date()): Streak {
  return calculateStreakFromDateSet(new Set(habit.completions), today);
}

export interface WeekProgress {
  completed: number;
  target: number;
  met: boolean;
}

/** How many check-ins this habit has this week against its weekly target. */
export function getWeekProgress(
  habit: Habit,
  firstDayOfWeek: FirstDayOfWeek,
  today: Date = new Date()
): WeekProgress {
  const target = habit.timesPerWeek ?? 7;
  const weekStartKey = toDateKey(getWeekStart(firstDayOfWeek, today));
  const completed = habit.completions.filter((key) => {
    const habitWeekStart = toDateKey(getWeekStart(firstDayOfWeek, fromDateKey(key)));
    return habitWeekStart === weekStartKey;
  }).length;
  return { completed, target, met: completed >= target };
}

/**
 * Consecutive-weeks streak for habits with a weekly target under 7 — the
 * week-level equivalent of calculateStreakFromDateSet's "doesn't break
 * until the period fully lapses" rule, applied at week granularity.
 */
export function calculateHabitWeekStreak(
  habit: Habit,
  firstDayOfWeek: FirstDayOfWeek,
  today: Date = new Date()
): Streak {
  const target = habit.timesPerWeek ?? 7;
  const counts = new Map<string, number>();
  for (const key of habit.completions) {
    const weekStartKey = toDateKey(getWeekStart(firstDayOfWeek, fromDateKey(key)));
    counts.set(weekStartKey, (counts.get(weekStartKey) ?? 0) + 1);
  }
  const metWeeks = new Set(
    Array.from(counts.entries())
      .filter(([, count]) => count >= target)
      .map(([key]) => key)
  );
  if (metWeeks.size === 0) return { current: 0, best: 0 };

  const currentWeekKey = toDateKey(getWeekStart(firstDayOfWeek, today));
  let cursor = metWeeks.has(currentWeekKey) ? 0 : 1;
  let current = 0;
  while (metWeeks.has(toDateKey(getWeekStart(firstDayOfWeek, subWeeks(today, cursor))))) {
    current++;
    cursor++;
  }

  const sortedWeeks = Array.from(metWeeks).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const weekKey of sortedWeeks) {
    if (prev === null) {
      run = 1;
    } else {
      const diffDays = (fromDateKey(weekKey).getTime() - fromDateKey(prev).getTime()) / 86400000;
      run = diffDays === 7 ? run + 1 : 1;
    }
    best = Math.max(best, run);
    prev = weekKey;
  }

  return { current, best: Math.max(best, current) };
}

export function isPerfectDay(habits: Habit[], dateKey: string = toDateKey()): boolean {
  if (habits.length === 0) return false;
  return habits.every((h) => isCompletedOn(h, dateKey));
}

export function getNextOrder(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  return Math.max(...habits.map((h) => h.order)) + 1;
}

export function reorderHabits(habits: Habit[], draggedId: string, targetId: string): Habit[] {
  const list = [...habits].sort((a, b) => a.order - b.order);
  const fromIndex = list.findIndex((h) => h.id === draggedId);
  const toIndex = list.findIndex((h) => h.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return habits;
  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  return list.map((h, i) => ({ ...h, order: i }));
}
