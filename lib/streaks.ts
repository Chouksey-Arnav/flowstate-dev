import { toDateKey, daysAgoKey } from "./dates";
import { isTaskCompletedOn, isScheduleActiveOn, addDaysToKey } from "./tasks";
import type { Task } from "@/types";

export interface Streak {
  current: number;
  best: number;
}

/**
 * Tasks that count toward a given calendar day's Perfect Day requirement:
 * due exactly that day, or a recurring task active that day. Archived
 * tasks never count, including for the day they were archived.
 */
export function getTasksDueOn(tasks: Task[], dateKey: string): Task[] {
  return tasks.filter((t) => {
    if (t.status === "archived") return false;
    if (t.schedule) return isScheduleActiveOn(t.schedule, dateKey);
    // A missed day is a day this task *was* due, permanently. Carrying a task
    // forward moves `dueDate` but never erases the day it was promised for.
    return t.dueDate === dateKey || (t.missedDays ?? []).includes(dateKey);
  });
}

/**
 * Every calendar date (YYYY-MM-DD) that qualifies as a Perfect Day: at
 * least one task was due, and every task due that day was checked off on
 * that exact day. A day with nothing due is never a Perfect Day — no free
 * streak. This reads each task's actual historical `dueDate`, so it's
 * immutable once the day has passed: completing something late doesn't
 * retroactively rescue an earlier day.
 */
export function getPerfectDayKeys(tasks: Task[]): Set<string> {
  const dueByDay = new Map<string, Task[]>();
  for (const t of tasks) {
    if (t.status === "archived") continue;
    if (t.schedule) {
      for (let offset = 0; offset < Math.max(1, t.schedule.repeatDays); offset++) {
        pushToMap(dueByDay, addDaysToKey(t.schedule.startDate, offset), t);
      }
    } else {
      if (t.dueDate) pushToMap(dueByDay, t.dueDate, t);
      // Days this task was promised for and missed still count against those
      // days, even after it's been carried forward to a new due date.
      for (const missed of t.missedDays ?? []) {
        if (missed !== t.dueDate) pushToMap(dueByDay, missed, t);
      }
    }
  }

  const perfectDays = new Set<string>();
  for (const [dateKey, dueTasks] of dueByDay) {
    if (dueTasks.length > 0 && dueTasks.every((t) => isTaskCompletedOn(t, dateKey))) {
      perfectDays.add(dateKey);
    }
  }
  return perfectDays;
}

function pushToMap(map: Map<string, Task[]>, key: string, task: Task): void {
  const list = map.get(key);
  if (list) list.push(task);
  else map.set(key, [task]);
}

/** Whether a specific day is (so far) a Perfect Day — everything due, done. */
export function isPerfectDayComplete(tasks: Task[], dateKey: string): boolean {
  const due = getTasksDueOn(tasks, dateKey);
  return due.length > 0 && due.every((t) => isTaskCompletedOn(t, dateKey));
}

/** The headline streak: consecutive Perfect Days, unforgiving — no freezes, no grace period. */
export function calculatePerfectDayStreak(tasks: Task[], today: Date = new Date()): Streak {
  return calculateStreakFromDateSet(getPerfectDayKeys(tasks), today);
}

/**
 * Streak doesn't break just because today is incomplete — only after a full
 * day passes with nothing done. So the walk-back starts at today if present,
 * otherwise starts at yesterday.
 */
export function calculateStreakFromDateSet(dateKeys: Set<string>, today: Date = new Date()): Streak {
  if (dateKeys.size === 0) return { current: 0, best: 0 };

  const todayKey = toDateKey(today);
  let cursor = dateKeys.has(todayKey) ? 0 : 1;
  let current = 0;
  while (dateKeys.has(daysAgoKey(cursor, today))) {
    current++;
    cursor++;
  }

  const sorted = Array.from(dateKeys).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    if (prev === null) {
      run = 1;
    } else {
      const diff = (keyToTime(key) - keyToTime(prev)) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    }
    best = Math.max(best, run);
    prev = key;
  }

  return { current, best: Math.max(best, current) };
}

function keyToTime(key: string): number {
  return new Date(`${key}T00:00:00`).getTime();
}
