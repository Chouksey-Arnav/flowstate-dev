import { formatDisplayDate, fromDateKey } from "./dates";
import { getYearPosition, timesMissed, daysInDebt, type LedgerSummary } from "./reckoning";
import type { DayRecord, GuiltIntensity, Task } from "@/types";

/**
 * The voice of the accountability system.
 *
 * Two rules hold everywhere in this file, and both are load-bearing:
 *
 * 1. **Attack the choice, never the person.** "You didn't do it" is guilt, and
 *    guilt moves people. "You're lazy" is shame, and shame makes people close
 *    the app and never come back. Every line here targets a specific, reversible
 *    decision — never the user's character, worth, or capability.
 * 2. **Never end on the wound.** Every confrontation resolves into something
 *    the user can do in the next sixty seconds. Guilt without a way out is
 *    just cruelty with a progress bar.
 *
 * Intensity is the user's call, set in Settings. `honest` is the default:
 * direct enough to sting, measured enough to be fair.
 */

export interface IntensityMeta {
  value: GuiltIntensity;
  label: string;
  description: string;
}

export const GUILT_INTENSITIES: IntensityMeta[] = [
  {
    value: "gentle",
    label: "Gentle",
    description: "States plainly what happened and moves on. No sting, no drama.",
  },
  {
    value: "honest",
    label: "Honest",
    description: "Names the choice you made and what it cost. Direct, never cruel.",
  },
  {
    value: "brutal",
    label: "Brutal",
    description: "No softening, no excuses accepted. Only pick this if it fuels you.",
  },
];

export interface ReckoningCopy {
  eyebrow: string;
  headline: string;
  body: string;
  costLine: string;
  whyLine?: string;
  closing: string;
  primaryAction: string;
  secondaryAction: string;
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function weekdayOf(dateKey: string): string {
  return fromDateKey(dateKey).toLocaleDateString(undefined, { weekday: "long" });
}

function headline(record: DayRecord, intensity: GuiltIntensity): string {
  const broken = record.verdict === "broken";
  const day = weekdayOf(record.date);

  if (intensity === "gentle") {
    return broken
      ? `${day} went by without any of it getting done.`
      : `${day} ended with work still on the table.`;
  }

  if (intensity === "brutal") {
    return broken
      ? `You did nothing you said you'd do on ${day}.`
      : `You started ${day} and quit halfway.`;
  }

  return broken
    ? `You didn't do a single thing you promised on ${day}.`
    : `${day} ended unfinished — and you knew it would.`;
}

function body(record: DayRecord, intensity: GuiltIntensity): string {
  const missedCount = record.missed.length;
  const listed = plural(missedCount, "task", "tasks");

  if (record.commitmentTitle && record.commitmentKept === false) {
    if (intensity === "gentle") {
      return `You'd picked ${quoteUser(record.commitmentTitle)} as the one thing for that day. It didn't happen.`;
    }
    if (intensity === "brutal") {
      return `You looked at your list, chose ${quoteUser(record.commitmentTitle)}, and locked it in as the one thing that mattered. Then you didn't touch it. Nobody made that call but you.`;
    }
    return `You chose ${quoteUser(record.commitmentTitle)} yourself. You locked it in as the one thing that had to happen. It didn't.`;
  }

  if (intensity === "gentle") {
    return `${listed} you'd set for that day are still sitting there, untouched.`;
  }
  if (intensity === "brutal") {
    return `${listed} sat there all day waiting for you. You had the whole day. You spent it somewhere else.`;
  }
  return `${listed} you set for yourself went untouched. Not blocked, not impossible — just not done.`;
}

function costLine(record: DayRecord, intensity: GuiltIntensity): string {
  const parts: string[] = [];

  if (record.xpForfeited > 0) parts.push(`${record.xpForfeited} XP left on the table`);
  if (record.streakBefore > 0) {
    parts.push(`a ${plural(record.streakBefore, "day", "day")} streak ended`);
  }
  if (record.focusMinutes === 0) parts.push("zero minutes of focused work");
  else parts.push(`only ${plural(record.focusMinutes, "minute", "minutes")} of focus`);

  const cost = parts.join(" · ");
  if (intensity === "gentle") return cost;
  return `${cost} · that day is not coming back`;
}

/** Quotes the user verbatim without doubling their own punctuation. */
function quoteUser(text: string): string {
  return `\u201c${text.trim().replace(/[.!?\s]+$/, "")}\u201d`;
}

function whyLine(record: DayRecord, intensity: GuiltIntensity): string | undefined {
  if (!record.whyAtTheTime?.trim()) return undefined;
  const quoted = quoteUser(record.whyAtTheTime);

  if (intensity === "gentle") return `You said you were doing this for: ${quoted}`;
  if (intensity === "brutal") return `This is what you told yourself you wanted: ${quoted} — and then you gave that day away.`;
  return `You wrote this down yourself: ${quoted}. That day did nothing for it.`;
}

function closing(record: DayRecord, intensity: GuiltIntensity, carryable: number): string {
  if (carryable === 0) {
    return intensity === "gentle"
      ? "It's closed. Today is the one you can still do something about."
      : "That day is closed and it stays closed. Today is the only one you still control.";
  }

  if (intensity === "gentle") {
    return "You can move it to today and give it another go.";
  }
  if (intensity === "brutal") {
    return "So it moves to today. Same task, one more day of your life on it. Do it or admit you never meant to.";
  }
  return "It moves to today — same task, one day later. The only way it stops following you is if you finish it.";
}

export function getReckoningCopy(record: DayRecord, intensity: GuiltIntensity): ReckoningCopy {
  const carryable = record.missed.filter((m) => !m.recurring).length;

  return {
    eyebrow: `${formatDisplayDate(record.date)} · closed`,
    headline: headline(record, intensity),
    body: body(record, intensity),
    costLine: costLine(record, intensity),
    whyLine: whyLine(record, intensity),
    closing: closing(record, intensity, carryable),
    primaryAction: carryable > 0 ? "Carry it to today" : "I own this",
    secondaryAction: carryable > 0 ? "Let them go" : "Close",
  };
}

/** The line under the year counter — the frame that makes one wasted day feel finite. */
export function getYearLine(intensity: GuiltIntensity, date: Date = new Date()): string {
  const { dayNumber, totalDays, daysLeft } = getYearPosition(date);

  if (intensity === "gentle") {
    return `Day ${dayNumber} of ${totalDays}. ${daysLeft} left this year.`;
  }
  if (intensity === "brutal") {
    return `That was day ${dayNumber} of ${totalDays}. You get ${daysLeft} more this year and not one extra.`;
  }
  return `Day ${dayNumber} of ${totalDays} is spent. ${daysLeft} left in the year.`;
}

/**
 * The escalating line for a task that keeps getting pushed. Reads off the
 * task's own history, so it gets harder to dismiss the longer it's dodged.
 */
export function getDebtLine(task: Task, intensity: GuiltIntensity, today?: string): string {
  const n = timesMissed(task);
  const days = daysInDebt(task, today);

  if (n <= 0) return "";

  if (n === 1) {
    if (intensity === "gentle") return "Moved from yesterday.";
    if (intensity === "brutal") return "You said yesterday. Yesterday's gone.";
    return "You promised this yesterday and didn't do it.";
  }

  if (n < 4) {
    if (intensity === "gentle") return `Carried ${plural(n, "day", "days")}.`;
    if (intensity === "brutal") return `${n} days. ${n} promises. ${n} times you didn't.`;
    return `You've pushed this ${plural(n, "time", "times")} now.`;
  }

  if (intensity === "gentle") return `Carried ${plural(n, "day", "days")} — maybe it needs breaking down.`;
  if (intensity === "brutal") {
    return `${n} broken promises over ${plural(days, "day", "days")}. At this point you're not doing this task. Finish it or delete it.`;
  }
  return `${n} times over ${plural(days, "day", "days")}. This isn't a scheduling problem any more.`;
}

/** Headline for the dashboard's debt card. */
export function getDebtHeadline(count: number, intensity: GuiltIntensity): string {
  if (intensity === "gentle") return `${plural(count, "task", "tasks")} carried over`;
  if (intensity === "brutal") return `${plural(count, "promise", "promises")} you've already broken`;
  return `${plural(count, "task", "tasks")} you said you'd do and didn't`;
}

/** The running-slide warning: consecutive closed days that went badly. */
export function getSlideLine(summary: LedgerSummary, intensity: GuiltIntensity): string | null {
  if (summary.slideLength < 2) return null;
  const n = summary.slideLength;

  if (intensity === "gentle") {
    return `${n} days in a row have ended unfinished. Worth resetting today.`;
  }
  if (intensity === "brutal") {
    return `${n} days in a row you've come up short. This is a pattern now, not a bad day.`;
  }
  return `${n} days in a row have ended short. That's a streak too — just the wrong one.`;
}

/** The line shown when the day is running out and work is still open. */
export function getEndOfDayLine(remaining: number, hoursLeft: number, intensity: GuiltIntensity): string {
  const tasks = plural(remaining, "task", "tasks");
  const hours = hoursLeft < 1 ? "under an hour" : `${Math.round(hoursLeft)}h`;

  if (intensity === "gentle") return `${tasks} left, ${hours} to go.`;
  if (intensity === "brutal") return `${tasks} left and ${hours} on the clock. Tomorrow you'll wish you'd started now.`;
  return `${tasks} left with ${hours} left. This is the hour it usually slips.`;
}

/** Copy for the "why are you doing this" prompt — the user's own words, held on file. */
export const WHY_PROMPT = {
  title: "What is this actually for?",
  description:
    "One or two sentences, in your own words. FlowState will hold onto it and show it back to you on the days you let slide — because nothing lands harder than your own reasons.",
  placeholder: "I want to ship my own product so I stop building someone else's…",
} as const;

export function getWhyReminder(why: string, intensity: GuiltIntensity): string {
  if (intensity === "gentle") return "This is what you're working toward.";
  if (intensity === "brutal") return "You wrote this. Every skipped day is a day you didn't mean it.";
  return "Your words, not ours. Today either serves this or it doesn't.";
}
