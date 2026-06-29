"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useFocusStore } from "@/store/focusStore";
import { playBeep } from "@/lib/audio";

export type PomodoroPhase = "work" | "break" | "longBreak";

interface UsePomodoroOptions {
  taskId?: string;
}

/**
 * Ticks off an absolute endTimestamp (Date.now()-based) rather than naively
 * decrementing a counter, so backgrounded tabs don't drift.
 */
export function usePomodoro({ taskId }: UsePomodoroOptions = {}) {
  const pomodoroWork = useSettingsStore((s) => s.pomodoroWork);
  const pomodoroBreak = useSettingsStore((s) => s.pomodoroBreak);
  const pomodoroLongBreak = useSettingsStore((s) => s.pomodoroLongBreak);
  const autoStartNext = useSettingsStore((s) => s.autoStartNext);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const timerSoundType = useSettingsStore((s) => s.timerSoundType);
  const logSession = useFocusStore((s) => s.logSession);

  const durations = useMemo<Record<PomodoroPhase, number>>(
    () => ({
      work: pomodoroWork * 60_000,
      break: pomodoroBreak * 60_000,
      longBreak: pomodoroLongBreak * 60_000,
    }),
    [pomodoroWork, pomodoroBreak, pomodoroLongBreak]
  );

  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [running, setRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(durations.work);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const endTimestampRef = useRef<number | null>(null);
  const startedAtRef = useRef<string | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!running) setRemainingMs(durations[phase]);
  }, [durations, phase, running]);

  const completePhase = useCallback(() => {
    const finishedPhase = phaseRef.current;
    if (finishedPhase === "work" && startedAtRef.current) {
      logSession({
        taskId,
        durationMinutes: pomodoroWork,
        type: "pomodoro",
        startedAt: startedAtRef.current,
        endedAt: new Date().toISOString(),
      });
    }
    if (soundEnabled) playBeep(timerSoundType);

    const nextCycles = finishedPhase === "work" ? cyclesCompleted + 1 : cyclesCompleted;
    const nextPhase: PomodoroPhase =
      finishedPhase === "work" ? (nextCycles % 4 === 0 ? "longBreak" : "break") : "work";

    setCyclesCompleted(nextCycles);
    setPhase(nextPhase);
    setRemainingMs(durations[nextPhase]);
    endTimestampRef.current = null;
    startedAtRef.current = null;

    if (autoStartNext) {
      const now = Date.now();
      endTimestampRef.current = now + durations[nextPhase];
      if (nextPhase === "work") startedAtRef.current = new Date(now).toISOString();
      setRunning(true);
    } else {
      setRunning(false);
    }
  }, [cyclesCompleted, durations, soundEnabled, timerSoundType, autoStartNext, logSession, pomodoroWork, taskId]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (endTimestampRef.current == null) return;
      const remaining = endTimestampRef.current - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        completePhase();
      } else {
        setRemainingMs(remaining);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [running, completePhase]);

  const start = useCallback(() => {
    const now = Date.now();
    endTimestampRef.current = now + remainingMs;
    if (phase === "work") startedAtRef.current = new Date(now).toISOString();
    setRunning(true);
  }, [remainingMs, phase]);

  const pause = useCallback(() => {
    if (endTimestampRef.current != null) {
      setRemainingMs(Math.max(0, endTimestampRef.current - Date.now()));
    }
    endTimestampRef.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    endTimestampRef.current = null;
    startedAtRef.current = null;
    setRemainingMs(durations[phase]);
  }, [phase, durations]);

  const skip = useCallback(() => {
    setRunning(false);
    completePhase();
  }, [completePhase]);

  return {
    phase,
    running,
    remainingMs,
    totalMs: durations[phase],
    cyclesCompleted,
    start,
    pause,
    reset,
    skip,
  };
}
