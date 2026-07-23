export type GoalUrgency = "met" | "calm" | "nudge" | "warning" | "critical";

export interface GoalStatus {
  tier: GoalUrgency;
  tasksRemaining: number;
  hoursRemaining: number;
}

/**
 * How urgently to warn about today's Perfect Day, based on the clock, not
 * just the task count — the same "2 tasks left" means very different things
 * at 10am vs 10pm, and the messaging should escalate accordingly (but only
 * after the day is actually at risk, never before). `totalDueToday` is the
 * count of tasks due today (see `getTasksDueOn`), not an arbitrary goal.
 */
export function getGoalStatus(completedToday: number, totalDueToday: number, now: Date = new Date()): GoalStatus {
  const tasksRemaining = Math.max(0, totalDueToday - completedToday);
  const minutesLeftToday = 24 * 60 - (now.getHours() * 60 + now.getMinutes());
  const hoursRemaining = Math.max(0, Math.round((minutesLeftToday / 60) * 10) / 10);

  if (totalDueToday <= 0 || tasksRemaining === 0) {
    return { tier: "met", tasksRemaining: 0, hoursRemaining };
  }

  const hour = now.getHours();
  let tier: GoalUrgency = "calm";
  if (hour >= 21) tier = "critical";
  else if (hour >= 18) tier = "warning";
  else if (hour >= 14) tier = "nudge";

  return { tier, tasksRemaining, hoursRemaining };
}
