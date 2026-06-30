import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSettingsStore } from "./settingsStore";
import { useFocusStore } from "./focusStore";
import { playBeep } from "@/lib/audio";

export type PomodoroPhase = "work" | "break" | "longBreak";

function getDurations(): Record<PomodoroPhase, number> {
  const s = useSettingsStore.getState();
  return {
    work: s.pomodoroWork * 60_000,
    break: s.pomodoroBreak * 60_000,
    longBreak: s.pomodoroLongBreak * 60_000,
  };
}

interface PomodoroState {
  phase: PomodoroPhase;
  running: boolean;
  remainingMs: number;
  cyclesCompleted: number;
  taskId?: string;
  /** Absolute ms timestamp the running phase ends at — survives tab switches, reloads, and route changes. */
  endTimestamp: number | null;
  startedAt: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setTaskId: (taskId?: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  /** Called on an interval by <PomodoroEngine/>, which stays mounted for the whole app session. */
  tick: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      phase: "work",
      running: false,
      remainingMs: getDurations().work,
      cyclesCompleted: 0,
      taskId: undefined,
      endTimestamp: null,
      startedAt: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setTaskId: (taskId) => set({ taskId }),

      start: () => {
        const { remainingMs, phase, startedAt } = get();
        const now = Date.now();
        set({
          running: true,
          endTimestamp: now + remainingMs,
          startedAt: phase === "work" ? startedAt ?? new Date(now).toISOString() : startedAt,
        });
      },

      pause: () => {
        const { endTimestamp, remainingMs } = get();
        set({
          remainingMs: endTimestamp != null ? Math.max(0, endTimestamp - Date.now()) : remainingMs,
          running: false,
          endTimestamp: null,
        });
      },

      reset: () => {
        const { phase } = get();
        set({ running: false, endTimestamp: null, startedAt: null, remainingMs: getDurations()[phase] });
      },

      skip: () => {
        set({ running: false });
        completePhase(set, get);
      },

      tick: () => {
        const { running, endTimestamp } = get();
        if (!running || endTimestamp == null) return;
        const remaining = endTimestamp - Date.now();
        if (remaining <= 0) {
          set({ remainingMs: 0 });
          completePhase(set, get);
        } else {
          set({ remainingMs: remaining });
        }
      },
    }),
    {
      name: "flowstate-pomodoro",
      partialize: (state) => ({
        phase: state.phase,
        running: state.running,
        remainingMs: state.remainingMs,
        cyclesCompleted: state.cyclesCompleted,
        taskId: state.taskId,
        endTimestamp: state.endTimestamp,
        startedAt: state.startedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

function completePhase(
  set: (partial: Partial<PomodoroState>) => void,
  get: () => PomodoroState
) {
  const { phase: finishedPhase, startedAt, taskId, cyclesCompleted } = get();
  const settings = useSettingsStore.getState();

  if (finishedPhase === "work" && startedAt) {
    useFocusStore.getState().logSession({
      taskId,
      durationMinutes: settings.pomodoroWork,
      type: "pomodoro",
      startedAt,
      endedAt: new Date().toISOString(),
    });
  }
  if (settings.soundEnabled) playBeep(settings.timerSoundType);

  const nextCycles = finishedPhase === "work" ? cyclesCompleted + 1 : cyclesCompleted;
  const nextPhase: PomodoroPhase =
    finishedPhase === "work" ? (nextCycles % 4 === 0 ? "longBreak" : "break") : "work";
  const durations = getDurations();

  if (settings.autoStartNext) {
    const now = Date.now();
    set({
      cyclesCompleted: nextCycles,
      phase: nextPhase,
      remainingMs: durations[nextPhase],
      endTimestamp: now + durations[nextPhase],
      startedAt: nextPhase === "work" ? new Date(now).toISOString() : null,
      running: true,
    });
  } else {
    set({
      cyclesCompleted: nextCycles,
      phase: nextPhase,
      remainingMs: durations[nextPhase],
      endTimestamp: null,
      startedAt: null,
      running: false,
    });
  }
}
