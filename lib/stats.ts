import { eachDayOfInterval } from "date-fns";
import {
  toDateKey,
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
  getWeekdayLabels,
} from "./dates";
import { completionDateKeys, isTaskCompleted } from "./tasks";
import type { Task, Habit, FocusSession, Category, FirstDayOfWeek } from "@/types";

export function getTasksCompletedInRange(tasks: Task[], start: Date, end: Date): Task[] {
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);
  return tasks.filter((t) =>
    completionDateKeys(t).some((key) => key >= startKey && key <= endKey)
  );
}

export function countTasksCompletedOn(tasks: Task[], dateKey: string): number {
  return tasks.filter((t) => completionDateKeys(t).includes(dateKey)).length;
}

export function getFocusMinutesInRange(sessions: FocusSession[], start: Date, end: Date): number {
  return sessions
    .filter((s) => {
      const d = new Date(s.startedAt);
      return d >= start && d <= end;
    })
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function getTotalFocusMinutes(sessions: FocusSession[]): number {
  return sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function getFocusMinutesOn(sessions: FocusSession[], dateKey: string): number {
  return sessions
    .filter((s) => toDateKey(new Date(s.startedAt)) === dateKey)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

/** Percentage (0-100) of habit-days completed over the last `days` days, across all habits. */
export function getHabitCompletionRate(habits: Habit[], days: number, today: Date = new Date()): number {
  if (habits.length === 0 || days <= 0) return 0;
  const keys: string[] = [];
  for (let i = 0; i < days; i++) {
    keys.push(toDateKey(new Date(today.getTime() - i * 86400000)));
  }
  const totalSlots = habits.length * days;
  if (totalSlots === 0) return 0;
  let completed = 0;
  for (const habit of habits) {
    const set = new Set(habit.completions);
    for (const k of keys) {
      if (set.has(k)) completed++;
    }
  }
  return Math.round((completed / totalSlots) * 100);
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getMostProductiveWeekday(tasks: Task[]): { weekday: string; count: number } | null {
  const counts = new Array(7).fill(0);
  for (const t of tasks) {
    for (const key of completionDateKeys(t)) {
      counts[new Date(`${key}T00:00:00`).getDay()]++;
    }
  }
  let maxIdx = 0;
  for (let i = 1; i < 7; i++) if (counts[i] > counts[maxIdx]) maxIdx = i;
  if (counts[maxIdx] === 0) return null;
  return { weekday: WEEKDAY_NAMES[maxIdx], count: counts[maxIdx] };
}

export function getMostProductiveHour(tasks: Task[]): { hour: number; count: number } | null {
  const completed = tasks.filter((t) => t.completedAt);
  if (completed.length === 0) return null;
  const counts = new Array(24).fill(0);
  for (const t of completed) {
    counts[new Date(t.completedAt!).getHours()]++;
  }
  let maxIdx = 0;
  for (let i = 1; i < 24; i++) if (counts[i] > counts[maxIdx]) maxIdx = i;
  if (counts[maxIdx] === 0) return null;
  return { hour: maxIdx, count: counts[maxIdx] };
}

export interface CategoryCount {
  category: Category;
  count: number;
}

export function getCategoryBreakdown(tasks: Task[]): CategoryCount[] {
  const counts = new Map<Category, number>();
  for (const t of tasks) {
    if (!isTaskCompleted(t)) continue;
    counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export interface DaySeriesPoint {
  dateKey: string;
  label: string;
  count: number;
}

/** Shared by the Dashboard mini chart and the Stats full weekly chart. */
export function getWeeklySeries(
  tasks: Task[],
  firstDayOfWeek: FirstDayOfWeek,
  date: Date = new Date()
): DaySeriesPoint[] {
  const start = getWeekStart(firstDayOfWeek, date);
  const end = getWeekEnd(firstDayOfWeek, date);
  const labels = getWeekdayLabels(firstDayOfWeek);
  const days = eachDayOfInterval({ start, end });
  return days.map((d, i) => ({
    dateKey: toDateKey(d),
    label: labels[i],
    count: countTasksCompletedOn(tasks, toDateKey(d)),
  }));
}

export interface HeatmapDay {
  dateKey: string;
  count: number;
}

export function getMonthHeatmap(tasks: Task[], monthDate: Date = new Date()): HeatmapDay[] {
  const start = getMonthStart(monthDate);
  const end = getMonthEnd(monthDate);
  const days = eachDayOfInterval({ start, end });
  return days.map((d) => ({
    dateKey: toDateKey(d),
    count: countTasksCompletedOn(tasks, toDateKey(d)),
  }));
}
