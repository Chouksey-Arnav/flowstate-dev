import { toDateKey, fromDateKey, daysInYear, dayOfYear } from "./dates";
import { isTaskCompletedOn, isTaskCompleted } from "./tasks";
import { getTasksDueOn, calculatePerfectDayStreak } from "./streaks";
import { xpForTask } from "./xp";
import type {
  DayRecord,
  DayVerdict,
  FocusSession,
  Habit,
  MissedTaskRecord,
  Settings,
  Task,
} from "@/types";

/**
 * A returning user should get one honest reckoning, not sixty modals. Days
 * older than this still get sealed into the ledger (the history stays true),
 * they just don't each demand a separate confrontation.
 */
export const MAX_RECKONING_DAYS = 5;

/** Never seal further back than this — a first-ever launch shouldn't invent a year of failure. */
const MAX_SEAL_LOOKBACK_DAYS = 60;

function keyToTime(key: string): number {
  return Date.parse(`${key}T00:00:00`);
}

export function daysBetweenKeys(from: string, to: string): number {
  return Math.round((keyToTime(to) - keyToTime(from)) / 86400000);
}

export function shiftKey(key: string, days: number): string {
  return toDateKey(new Date(keyToTime(key) + days * 86400000));
}

/**
 * Every day that has fully passed and hasn't been judged yet, oldest first.
 * `lastSealedDate` is exclusive — the day after it is the first one open.
 */
export function getUnsealedDates(lastSealedDate: string | undefined, today: string = toDateKey()): string[] {
  const earliestAllowed = shiftKey(today, -MAX_SEAL_LOOKBACK_DAYS);
  let cursor = lastSealedDate ? shiftKey(lastSealedDate, 1) : shiftKey(today, -1);
  if (keyToTime(cursor) < keyToTime(earliestAllowed)) cursor = earliestAllowed;

  const dates: string[] = [];
  while (keyToTime(cursor) < keyToTime(today)) {
    dates.push(cursor);
    cursor = shiftKey(cursor, 1);
  }
  return dates;
}

export function verdictFor(dueCount: number, doneCount: number): DayVerdict {
  if (dueCount === 0) return "empty";
  if (doneCount >= dueCount) return "clean";
  if (doneCount === 0) return "broken";
  return "partial";
}

/** A day only demands a reckoning if a real promise was actually broken. */
export function isReckonable(record: DayRecord): boolean {
  return record.verdict === "broken" || record.verdict === "partial";
}

function focusMinutesOn(sessions: FocusSession[], dateKey: string): number {
  return sessions
    .filter((s) => toDateKey(new Date(s.endedAt)) === dateKey)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

function habitCountsOn(habits: Habit[], dateKey: string): { due: number; done: number } {
  const existing = habits.filter((h) => h.createdAt.slice(0, 10) <= dateKey);
  return {
    due: existing.length,
    done: existing.filter((h) => h.completions.includes(dateKey)).length,
  };
}

/**
 * Judges one finished day and freezes the result. Deliberately pure: it reads
 * the world as it was and returns a record, so sealing is idempotent and can
 * be replayed without ever changing what a past day means.
 *
 * `timesMissedBefore` counts only misses *earlier* than this day, so a task's
 * first failure reads as a first failure even when the ledger is rebuilt later.
 */
export function sealDay(
  dateKey: string,
  input: {
    tasks: Task[];
    habits: Habit[];
    sessions: FocusSession[];
    settings: Pick<Settings, "commitTaskId" | "commitDate" | "why">;
  }
): DayRecord {
  const { tasks, habits, sessions, settings } = input;
  const due = getTasksDueOn(tasks, dateKey);
  const done = due.filter((t) => isTaskCompletedOn(t, dateKey));
  const missedTasks = due.filter((t) => !isTaskCompletedOn(t, dateKey));

  const wasCommitmentDay = settings.commitDate === dateKey;

  const missed: MissedTaskRecord[] = missedTasks.map((t) => ({
    taskId: t.id,
    title: t.title,
    priority: t.priority,
    xpForfeited: xpForTask(t),
    timesMissedBefore: (t.missedDays ?? []).filter((d) => d < dateKey).length,
    wasCommitment: wasCommitmentDay && settings.commitTaskId === t.id,
    recurring: !!t.schedule,
  }));

  const commitTask = wasCommitmentDay
    ? tasks.find((t) => t.id === settings.commitTaskId)
    : undefined;

  const habitCounts = habitCountsOn(habits, dateKey);

  return {
    date: dateKey,
    verdict: verdictFor(due.length, done.length),
    dueCount: due.length,
    doneCount: done.length,
    missed,
    focusMinutes: focusMinutesOn(sessions, dateKey),
    habitsDue: habitCounts.due,
    habitsDone: habitCounts.done,
    xpEarned: done.reduce((sum, t) => sum + xpForTask(t), 0),
    xpForfeited: missed.reduce((sum, m) => sum + m.xpForfeited, 0),
    commitmentTitle: commitTask?.title,
    commitmentKept: commitTask ? isTaskCompletedOn(commitTask, dateKey) : undefined,
    // The streak as it stood the evening before — what this day put at risk.
    streakBefore: calculatePerfectDayStreak(tasks, fromDateKey(shiftKey(dateKey, -1))).current,
    whyAtTheTime: settings.why,
    acknowledged: false,
    sealedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Debt — what an unkept promise leaves behind
// ---------------------------------------------------------------------------

/** How many separate days this task was promised for and not delivered. */
export function timesMissed(task: Task): number {
  return (task.missedDays ?? []).length;
}

/** The most recent day this task was promised for and skipped. */
export function lastMissedDay(task: Task): string | undefined {
  const days = [...(task.missedDays ?? [])].sort();
  return days[days.length - 1];
}

/**
 * Days elapsed since this task was *first* promised — the number that actually
 * stings, because it counts from the day the user said they'd do it, not from
 * whatever due date they've since quietly moved it to.
 */
export function daysInDebt(task: Task, today: string = toDateKey()): number {
  const first = [...(task.missedDays ?? [])].sort()[0] ?? task.originalDueDate;
  if (!first) return 0;
  return Math.max(0, daysBetweenKeys(first, today));
}

/** Active tasks carrying at least one broken promise, worst first. */
export function getDebtTasks(tasks: Task[], today: string = toDateKey()): Task[] {
  return tasks
    .filter((t) => t.status === "active" && timesMissed(t) > 0 && !isTaskCompletedOn(t, today))
    .sort((a, b) => {
      const diff = timesMissed(b) - timesMissed(a);
      return diff !== 0 ? diff : daysInDebt(b, today) - daysInDebt(a, today);
    });
}

export type DebtWeight = "none" | "light" | "heavy" | "crushing";

/** How loudly a single task's history should be allowed to shout on screen. */
export function getDebtWeight(task: Task): DebtWeight {
  const n = timesMissed(task);
  if (n <= 0) return "none";
  if (n === 1) return "light";
  if (n < 4) return "heavy";
  return "crushing";
}

// ---------------------------------------------------------------------------
// Ledger reads — the shape of a life, not just a day
// ---------------------------------------------------------------------------

export interface LedgerSummary {
  cleanDays: number;
  partialDays: number;
  brokenDays: number;
  tasksMissed: number;
  xpForfeited: number;
  /** Consecutive sealed days ending yesterday that were broken or partial. */
  slideLength: number;
}

export function summarizeLedger(records: DayRecord[]): LedgerSummary {
  const summary: LedgerSummary = {
    cleanDays: 0,
    partialDays: 0,
    brokenDays: 0,
    tasksMissed: 0,
    xpForfeited: 0,
    slideLength: 0,
  };

  for (const r of records) {
    if (r.verdict === "clean") summary.cleanDays++;
    else if (r.verdict === "partial") summary.partialDays++;
    else if (r.verdict === "broken") summary.brokenDays++;
    summary.tasksMissed += r.missed.length;
    summary.xpForfeited += r.xpForfeited;
  }

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  for (const r of sorted) {
    if (r.verdict === "empty") continue;
    if (r.verdict === "clean") break;
    summary.slideLength++;
  }

  return summary;
}

export function getRecentRecords(records: DayRecord[], days: number, today: string = toDateKey()): DayRecord[] {
  const cutoff = shiftKey(today, -days);
  return records.filter((r) => r.date >= cutoff).sort((a, b) => a.date.localeCompare(b.date));
}

export function findRecord(records: DayRecord[], date: string): DayRecord | undefined {
  return records.find((r) => r.date === date);
}

/** Sealed days still waiting to be looked at, oldest first. */
export function getUnacknowledged(records: DayRecord[]): DayRecord[] {
  return records
    .filter((r) => !r.acknowledged && isReckonable(r))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ---------------------------------------------------------------------------
// The year — the frame that makes a single wasted day feel finite
// ---------------------------------------------------------------------------

export interface YearPosition {
  dayNumber: number;
  totalDays: number;
  daysLeft: number;
  percentGone: number;
}

export function getYearPosition(date: Date = new Date()): YearPosition {
  const totalDays = daysInYear(date.getFullYear());
  const dayNumber = dayOfYear(date);
  return {
    dayNumber,
    totalDays,
    daysLeft: Math.max(0, totalDays - dayNumber),
    percentGone: Math.round((dayNumber / totalDays) * 100),
  };
}

/** Lifetime tasks abandoned outright — the number nobody wants to see, which is the point. */
export function countAbandoned(tasks: Task[]): number {
  return tasks.filter((t) => t.status === "archived" && !isTaskCompleted(t)).length;
}
