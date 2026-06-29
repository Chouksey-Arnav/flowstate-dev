import { toDateKey, daysAgoKey } from "./dates";
import type { Task } from "@/types";

export interface Streak {
  current: number;
  best: number;
}

export function getCompletedDateKeys(tasks: Task[]): Set<string> {
  const keys = new Set<string>();
  for (const t of tasks) {
    if (t.completedAt) keys.add(toDateKey(new Date(t.completedAt)));
  }
  return keys;
}

export function calculateTaskStreak(tasks: Task[], today: Date = new Date()): Streak {
  return calculateStreakFromDateSet(getCompletedDateKeys(tasks), today);
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
