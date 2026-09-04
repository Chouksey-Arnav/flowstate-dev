"use client";

import { useEffect, useRef, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useHabitStore } from "@/store/habitStore";
import { useFocusStore } from "@/store/focusStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useLedgerStore } from "@/store/ledgerStore";
import { ReckoningModal } from "./reckoning-modal";
import {
  MAX_RECKONING_DAYS,
  getUnacknowledged,
  getUnsealedDates,
  sealDay,
} from "@/lib/reckoning";
import { toDateKey } from "@/lib/dates";
import type { DayRecord } from "@/types";

/**
 * Closes out days that have passed and, if any of them were let slide, puts
 * them in front of the user before anything else.
 *
 * Sealing runs once per session per date. It is deliberately separated from
 * *showing*: the ledger gets the truth about every day either way, and only
 * the most recent few actually stop the user — being confronted about a
 * fortnight you already know went badly is noise, and noise is what teaches
 * people to click through without reading.
 */
export function ReckoningGate() {
  const tasksHydrated = useTaskStore((s) => s.hasHydrated);
  const habitsHydrated = useHabitStore((s) => s.hasHydrated);
  const focusHydrated = useFocusStore((s) => s.hasHydrated);
  const settingsHydrated = useSettingsStore((s) => s.hasHydrated);
  const ledgerHydrated = useLedgerStore((s) => s.hasHydrated);

  const records = useLedgerStore((s) => s.records);
  const acknowledge = useLedgerStore((s) => s.acknowledge);

  const intensity = useSettingsStore((s) => s.guiltIntensity);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const [sealed, setSealed] = useState(false);
  const sealRunFor = useRef<string | null>(null);

  const ready =
    tasksHydrated && habitsHydrated && focusHydrated && settingsHydrated && ledgerHydrated;

  useEffect(() => {
    if (!ready) return;
    const today = toDateKey();
    if (sealRunFor.current === today) return;
    sealRunFor.current = today;

    const ledger = useLedgerStore.getState();
    const pending = getUnsealedDates(ledger.lastSealedDate, today);
    if (pending.length === 0) {
      setSealed(true);
      return;
    }

    const habits = useHabitStore.getState().habits;
    const sessions = useFocusStore.getState().sessions;
    const settings = useSettingsStore.getState();

    // Walk the days oldest-first against a locally-evolving copy of the tasks,
    // so "you've missed this 3 days running" counts correctly across a gap
    // rather than reporting a first offence three times over.
    let workingTasks = useTaskStore.getState().tasks;
    const fresh: DayRecord[] = [];
    const missesByDay: { date: string; taskIds: string[] }[] = [];

    for (const date of pending) {
      const record = sealDay(date, { tasks: workingTasks, habits, sessions, settings });
      fresh.push(record);
      const taskIds = record.missed.map((m) => m.taskId);
      if (taskIds.length > 0) {
        missesByDay.push({ date, taskIds });
        const ids = new Set(taskIds);
        workingTasks = workingTasks.map((t) =>
          ids.has(t.id) && !(t.missedDays ?? []).includes(date)
            ? { ...t, missedDays: [...(t.missedDays ?? []), date].sort() }
            : t
        );
      }
    }

    const recordMissedDay = useTaskStore.getState().recordMissedDay;
    for (const { date, taskIds } of missesByDay) recordMissedDay(taskIds, date);

    // Older slides are filed, not litigated one screen at a time.
    const confrontable = new Set(pending.slice(-MAX_RECKONING_DAYS));
    ledger.sealDays(
      fresh.map((r) => (confrontable.has(r.date) ? r : { ...r, acknowledged: true })),
      pending[pending.length - 1]
    );
    setSealed(true);
  }, [ready]);

  if (!ready || !sealed) return null;

  const queue = getUnacknowledged(records);
  const current = queue[0];
  if (!current) return null;

  function settle(taskIds: string[], action: "carry" | "letGo") {
    const store = useTaskStore.getState();
    if (taskIds.length > 0) {
      if (action === "carry") store.carryForward(taskIds);
      else store.letGo(taskIds);
    }
    acknowledge(current.date);
  }

  return (
    <ReckoningModal
      record={current}
      intensity={intensity}
      soundEnabled={soundEnabled}
      remaining={queue.length - 1}
      onCarryForward={(ids) => settle(ids, "carry")}
      onLetGo={(ids) => settle(ids, "letGo")}
    />
  );
}
