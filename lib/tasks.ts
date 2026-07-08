import { toDateKey } from "./dates";
import { isOverdue } from "./overdue";
import type { Task, TaskFilters, SortBy, Priority, Difficulty, TaskSchedule } from "@/types";

const PRIORITY_ORDER: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const PRIORITY_SCORE: Record<Priority, number> = { HIGH: 300, MEDIUM: 150, LOW: 0 };
const DIFFICULTY_ORDER: Record<Difficulty, number> = { HARD: 0, MEDIUM: 1, EASY: 2 };
const DIFFICULTY_SCORE: Record<Difficulty, number> = { EASY: 10, MEDIUM: 0, HARD: -10 };
const AVOIDANCE_PRIORITY_WEIGHT: Record<Priority, number> = { HIGH: 18, MEDIUM: 10, LOW: 5 };

/** Avoidance score crosses this threshold to be flagged/surfaced as "avoided". */
export const AVOIDANCE_THRESHOLD = 120;

function keyToDays(key: string): number {
  return Date.parse(`${key}T00:00:00`) / 86400000;
}

export function addDaysToKey(key: string, days: number): string {
  return toDateKey(new Date(Date.parse(`${key}T00:00:00`) + days * 86400000));
}

/** The last day (inclusive) a schedule's recurrence window covers. */
export function getScheduleEndKey(schedule: TaskSchedule): string {
  return addDaysToKey(schedule.startDate, Math.max(1, schedule.repeatDays) - 1);
}

/** Whether a scheduled task is within its recurrence window on the given day. */
export function isScheduleActiveOn(schedule: TaskSchedule, dateKey: string): boolean {
  const offset = keyToDays(dateKey) - keyToDays(schedule.startDate);
  return offset >= 0 && offset < Math.max(1, schedule.repeatDays);
}

/** 1-indexed "Day N of M" position within a schedule's window, clamped to the window. */
export function getScheduleDayLabel(schedule: TaskSchedule, dateKey: string): string {
  const offset = keyToDays(dateKey) - keyToDays(schedule.startDate);
  const day = Math.min(Math.max(offset + 1, 1), schedule.repeatDays);
  return `Day ${day} of ${schedule.repeatDays}`;
}

/** All the local dates (YYYY-MM-DD) a task counts as "done" on — the single source of truth for streaks/stats. */
export function completionDateKeys(task: Task): string[] {
  const keys = new Set(task.completions ?? []);
  if (task.completedAt) keys.add(toDateKey(new Date(task.completedAt)));
  return Array.from(keys);
}

/** Whether a task (scheduled or one-off) was checked off on the given day. */
export function isTaskCompletedOn(task: Task, dateKey: string): boolean {
  return completionDateKeys(task).includes(dateKey);
}

/** Whether a task counts as "done" at all, for stats that don't care which day. */
export function isTaskCompleted(task: Task): boolean {
  return task.status === "completed" || (task.completions?.length ?? 0) > 0;
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((t) => {
    if (filters.category && t.category !== filters.category) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
    if (filters.status && t.status !== filters.status) return false;
    return true;
  });
}

export function daysSinceCreated(task: Task, today: string = toDateKey()): number {
  const created = task.createdAt.slice(0, 10);
  const days = (Date.parse(today) - Date.parse(created)) / 86400000;
  return Math.max(0, Math.floor(days));
}

/**
 * "Heat" a task accumulates the longer it sits untouched and the more times
 * it gets passed over via "Show another" — the longer you dodge it, the
 * harder the app makes it to ignore.
 */
export function getAvoidanceScore(task: Task, today: string = toDateKey()): number {
  if (task.status !== "active" || isTaskCompletedOn(task, today)) return 0;
  return daysSinceCreated(task, today) * AVOIDANCE_PRIORITY_WEIGHT[task.priority] + task.timesSkipped * 40;
}

/** Active tasks that have crossed the avoidance threshold, worst offenders first. */
export function getAvoidedTasks(tasks: Task[], count = 3, today: string = toDateKey()): Task[] {
  return getActiveTasks(tasks)
    .map((t) => ({ task: t, score: getAvoidanceScore(t, today) }))
    .filter((x) => x.score >= AVOIDANCE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.task);
}

/**
 * Ranks "what should I actually do right now" — chronic avoidance is the
 * trump card (a task you keep dodging eventually outranks everything else),
 * then overdue work, then priority, then due-today urgency, with a small
 * nudge toward easy quick wins so the list doesn't always favor the scariest task.
 */
export function getFocusScore(task: Task, today: string = toDateKey()): number {
  if (isTaskCompletedOn(task, today)) return -Infinity;
  let score = PRIORITY_SCORE[task.priority] + DIFFICULTY_SCORE[task.difficulty];
  score += getAvoidanceScore(task, today);
  if (isOverdue(task)) score += 1000;
  else if (task.dueDate === today) score += 200;
  if (task.estimatedMinutes && task.estimatedMinutes <= 15) score += 20;
  return score;
}

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  const list = [...tasks];
  switch (sortBy) {
    case "dueDate":
      return list.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority":
      return list.sort((a, b) => {
        const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        return diff !== 0 ? diff : DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      });
    case "created":
      return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "smart": {
      const today = toDateKey();
      return list.sort((a, b) => {
        const diff = getFocusScore(b, today) - getFocusScore(a, today);
        return diff !== 0 ? diff : a.createdAt.localeCompare(b.createdAt);
      });
    }
    case "manual":
    default:
      return list.sort((a, b) => a.order - b.order);
  }
}

/** The single best task to start on right now, for the "Do this next" hero. */
export function getFocusPick(tasks: Task[], excludeId?: string): Task | null {
  const today = toDateKey();
  const active = getActiveTasks(tasks).filter(
    (t) => t.id !== excludeId && !isTaskCompletedOn(t, today)
  );
  if (active.length === 0) return null;
  return sortTasks(active, "smart")[0];
}

export function getActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === "active");
}

export function getCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter(isTaskCompleted);
}

export function getArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === "archived");
}

export function getTopTasks(tasks: Task[], count = 3): Task[] {
  const today = toDateKey();
  const eligible = getActiveTasks(tasks).filter((t) => !isTaskCompletedOn(t, today));
  return sortTasks(eligible, "smart").slice(0, count);
}

/**
 * What the Tasks page should render as "today's list": the whole active
 * backlog, plus anything (scheduled or one-off) checked off today — so
 * checking a task never makes it disappear, it just shows as done. Tasks
 * completed on earlier days roll off into Archive/history instead of
 * cluttering today's view forever.
 */
export function getTodaysTasks(tasks: Task[], today: string = toDateKey()): Task[] {
  return tasks.filter((t) => {
    if (t.status === "archived") return false;
    if (t.status === "active") return true;
    // status === "completed": only keep it visible if it was completed today.
    return isTaskCompletedOn(t, today);
  });
}

export function getNextOrder(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map((t) => t.order)) + 1;
}

export function reorderTasks(tasks: Task[], draggedId: string, targetId: string): Task[] {
  const list = [...tasks].sort((a, b) => a.order - b.order);
  const fromIndex = list.findIndex((t) => t.id === draggedId);
  const toIndex = list.findIndex((t) => t.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return tasks;
  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  return list.map((t, i) => ({ ...t, order: i }));
}
