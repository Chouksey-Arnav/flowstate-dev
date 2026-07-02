import type { Difficulty, Priority } from "@/types";

const DIFFICULTY_XP: Record<Difficulty, number> = { EASY: 10, MEDIUM: 20, HARD: 35 };
const PRIORITY_MULTIPLIER: Record<Priority, number> = { LOW: 1, MEDIUM: 1.2, HIGH: 1.5 };

/** Harder, higher-priority tasks are worth more — XP should reward tackling the real work, not just checking boxes. */
export function xpForTaskCompletion(difficulty: Difficulty, priority: Priority): number {
  return Math.round(DIFFICULTY_XP[difficulty] * PRIORITY_MULTIPLIER[priority]);
}

export const HABIT_CHECKIN_XP = 15;
export const FOCUS_XP_PER_MINUTE = 2;
export const DAILY_GOAL_BONUS_XP = 50;

export function xpForFocusSession(durationMinutes: number): number {
  return Math.round(durationMinutes * FOCUS_XP_PER_MINUTE);
}

/** XP needed to clear a level, growing ~1.45x per level so early levels come fast and later ones feel earned. */
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.45));
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0-1
}

export function getLevelProgress(totalXp: number): LevelProgress {
  let level = 1;
  let floor = 0;
  while (floor + xpForLevel(level) <= totalXp) {
    floor += xpForLevel(level);
    level++;
  }
  const xpForNextLevel = xpForLevel(level);
  return {
    level,
    xpIntoLevel: totalXp - floor,
    xpForNextLevel,
    progress: Math.min(1, (totalXp - floor) / xpForNextLevel),
  };
}

const LEVEL_TITLES: [number, string][] = [
  [1, "Novice"],
  [3, "Apprentice"],
  [6, "Focused"],
  [10, "Disciplined"],
  [15, "Relentless"],
  [21, "Unstoppable"],
  [28, "Elite"],
  [36, "Legend"],
];

export function getLevelTitle(level: number): string {
  let title = LEVEL_TITLES[0][1];
  for (const [threshold, name] of LEVEL_TITLES) {
    if (level >= threshold) title = name;
  }
  return title;
}
