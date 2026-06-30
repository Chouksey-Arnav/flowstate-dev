import type { Habit } from "@/types";
import { toDateKey } from "./dates";
import { calculateStreakFromDateSet, type Streak } from "./streaks";

export function isCompletedOn(habit: Habit, dateKey: string): boolean {
  return habit.completions.includes(dateKey);
}

export function isCompletedToday(habit: Habit): boolean {
  return isCompletedOn(habit, toDateKey());
}

export function calculateHabitStreak(habit: Habit, today: Date = new Date()): Streak {
  return calculateStreakFromDateSet(new Set(habit.completions), today);
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
