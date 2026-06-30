"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { usePomodoroStore, type PomodoroPhase } from "@/store/pomodoroStore";

export type { PomodoroPhase };

/**
 * Thin selector hook over the global pomodoro store. All instances across
 * the app (dashboard mini widget, focus page, status pill) read the same
 * timer, which keeps counting down via <PomodoroEngine/> regardless of
 * which page is mounted — navigating away no longer resets or pauses it.
 */
export function usePomodoro() {
  const pomodoroWork = useSettingsStore((s) => s.pomodoroWork);
  const pomodoroBreak = useSettingsStore((s) => s.pomodoroBreak);
  const pomodoroLongBreak = useSettingsStore((s) => s.pomodoroLongBreak);

  const phase = usePomodoroStore((s) => s.phase);
  const running = usePomodoroStore((s) => s.running);
  const remainingMs = usePomodoroStore((s) => s.remainingMs);
  const cyclesCompleted = usePomodoroStore((s) => s.cyclesCompleted);
  const taskId = usePomodoroStore((s) => s.taskId);
  const setTaskId = usePomodoroStore((s) => s.setTaskId);
  const start = usePomodoroStore((s) => s.start);
  const pause = usePomodoroStore((s) => s.pause);
  const reset = usePomodoroStore((s) => s.reset);
  const skip = usePomodoroStore((s) => s.skip);

  const durations: Record<PomodoroPhase, number> = {
    work: pomodoroWork * 60_000,
    break: pomodoroBreak * 60_000,
    longBreak: pomodoroLongBreak * 60_000,
  };

  return {
    phase,
    running,
    remainingMs,
    totalMs: durations[phase],
    cyclesCompleted,
    taskId,
    setTaskId,
    start,
    pause,
    reset,
    skip,
  };
}
