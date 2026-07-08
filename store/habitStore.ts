import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";
import type { Habit, HabitCategory } from "@/types";
import { generateId } from "@/lib/id";
import { getNextOrder } from "@/lib/habits";
import { toDateKey } from "@/lib/dates";
import { HABIT_CHECKIN_XP } from "@/lib/xp";
import { useXpStore } from "./xpStore";

interface HabitState {
  habits: Habit[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addHabit: (input: { name: string; icon: string; category: HabitCategory; timesPerWeek?: number }) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, dateKey?: string) => void;
  reorderAll: (habits: Habit[]) => void;
  resetCompletions: () => void;
  resetAll: () => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addHabit: (input) => {
        const habit: Habit = {
          id: generateId(),
          name: input.name,
          icon: input.icon,
          category: input.category,
          completions: [],
          timesPerWeek: input.timesPerWeek ?? 7,
          order: getNextOrder(get().habits),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ habits: [...state.habits, habit] }));
        return habit;
      },

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),

      toggleCompletion: (id, dateKey = toDateKey()) => {
        const habit = get().habits.find((h) => h.id === id);
        const wasCompleted = habit?.completions.includes(dateKey) ?? false;
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const completed = h.completions.includes(dateKey);
            return {
              ...h,
              completions: completed
                ? h.completions.filter((k) => k !== dateKey)
                : [...h.completions, dateKey],
            };
          }),
        }));
        if (habit && !wasCompleted) {
          useXpStore.getState().awardXp(HABIT_CHECKIN_XP, "habit", `${habit.name} checked in`);
        }
      },

      reorderAll: (habits) => set({ habits }),

      resetCompletions: () =>
        set((state) => ({ habits: state.habits.map((h) => ({ ...h, completions: [] })) })),

      resetAll: () => set({ habits: [] }),
    }),
    {
      name: "flowstate-habits",
      storage: createJSONStorage(() => supabaseKvStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as { habits?: Partial<Habit>[] };
        const habits: Habit[] = (state.habits ?? []).map((h) => ({
          timesPerWeek: 7,
          ...h,
        })) as Habit[];
        return { ...state, habits };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
