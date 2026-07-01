import { toDateKey } from "./dates";
import type { ReflectionEntry, ReflectionReason } from "@/types";

export interface ReasonMeta {
  value: ReflectionReason;
  label: string;
  emoji: string;
  /** The blunt, specific fix shown back to the user for this reason. */
  tip: string;
}

export const REFLECTION_REASONS: ReasonMeta[] = [
  {
    value: "unclear-start",
    label: "I don't know where to start",
    emoji: "🌀",
    tip: "Break it into a single 2-minute first step and do only that step.",
  },
  {
    value: "boredom-distraction",
    label: "I'm bored and want a distraction",
    emoji: "📱",
    tip: "Boredom is the itch right before focus kicks in — start a 5-minute timer and push through it.",
  },
  {
    value: "too-hard",
    label: "It feels too hard",
    emoji: "🧗",
    tip: "Split it into a smaller sub-task you already know how to do, and start there.",
  },
  {
    value: "low-energy",
    label: "I'm low on energy",
    emoji: "🔋",
    tip: "Do the easiest 5-minute version now; save the hard part for your next high-energy block.",
  },
  {
    value: "fear-perfectionism",
    label: "I'm afraid of doing it wrong",
    emoji: "😬",
    tip: "Give yourself permission to do a bad first draft — you can only fix something that exists.",
  },
  {
    value: "not-urgent",
    label: "It doesn't feel urgent",
    emoji: "🕰️",
    tip: "Ask what this costs you in 30 days if it stays undone — then act on that answer, not today's mood.",
  },
  {
    value: "other",
    label: "Something else",
    emoji: "💭",
    tip: "Naming the real reason is the first step — write it down next time so a pattern can show up.",
  },
];

export function getReasonMeta(reason: ReflectionReason): ReasonMeta {
  return REFLECTION_REASONS.find((r) => r.value === reason) ?? REFLECTION_REASONS[REFLECTION_REASONS.length - 1];
}

function daysAgo(n: number, today: string = toDateKey()): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return toDateKey(d);
}

export function entriesInLastDays(entries: ReflectionEntry[], days: number, today: string = toDateKey()): ReflectionEntry[] {
  const cutoff = daysAgo(days, today);
  return entries.filter((e) => e.createdAt.slice(0, 10) >= cutoff);
}

/** The most-logged avoidance reason in the given window, or null if nothing logged. */
export function getTopReason(entries: ReflectionEntry[], days = 7): { reason: ReflectionReason; count: number } | null {
  const recent = entriesInLastDays(entries, days).filter((e) => e.context === "skip");
  if (recent.length === 0) return null;
  const counts = new Map<ReflectionReason, number>();
  for (const e of recent) counts.set(e.reason, (counts.get(e.reason) ?? 0) + 1);
  let top: { reason: ReflectionReason; count: number } | null = null;
  for (const [reason, count] of counts) {
    if (!top || count > top.count) top = { reason, count };
  }
  return top;
}

/** Reason breakdown for the last N days, sorted by frequency, for charts. */
export function getReasonBreakdown(entries: ReflectionEntry[], days = 30): { reason: ReflectionReason; count: number }[] {
  const recent = entriesInLastDays(entries, days).filter((e) => e.context === "skip");
  const counts = new Map<ReflectionReason, number>();
  for (const e of recent) counts.set(e.reason, (counts.get(e.reason) ?? 0) + 1);
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}
