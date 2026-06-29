import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit, HabitCategory } from "@/types";
import { generateId } from "@/lib/id";
import { getNextOrder, createDefaultHabits } from "@/lib/habits";
import { toDateKey } from "@/lib/dates";

interface HabitState {
  habits: Habit[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addHabit: (input: { name: string; icon: string; category: HabitCategory }) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, dateKey?: string) => void;
  reorderAll: (habits: Habit[]) => void;
  seedDefaultsIfEmpty: () => void;
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

      toggleCompletion: (id, dateKey = toDateKey()) =>
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
        })),

      reorderAll: (habits) => set({ habits }),

      seedDefaultsIfEmpty: () => {
        if (get().habits.length === 0) {
          set({ habits: createDefaultHabits() });
        }
      },

      resetAll: () => set({ habits: [] }),
    }),
    {
      name: "flowstate-habits",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
