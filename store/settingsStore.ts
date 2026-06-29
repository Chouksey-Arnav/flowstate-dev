import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types";

const DEFAULT_SETTINGS: Settings = {
  name: "",
  dailyGoal: "",
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroLongBreak: 15,
  soundEnabled: true,
  confettiEnabled: true,
  ambientSound: "none",
  timerSoundType: "bell",
  autoStartNext: false,
  firstDayOfWeek: "monday",
};

interface SettingsState extends Settings {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
      resetAll: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: "flowstate-settings",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function getSettingsSnapshot(state: SettingsState): Settings {
  const { name, dailyGoal, pomodoroWork, pomodoroBreak, pomodoroLongBreak, soundEnabled, confettiEnabled, ambientSound, timerSoundType, autoStartNext, firstDayOfWeek } = state;
  return { name, dailyGoal, pomodoroWork, pomodoroBreak, pomodoroLongBreak, soundEnabled, confettiEnabled, ambientSound, timerSoundType, autoStartNext, firstDayOfWeek };
}
