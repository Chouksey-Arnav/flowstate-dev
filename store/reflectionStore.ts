import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReflectionContext, ReflectionEntry, ReflectionReason } from "@/types";
import { generateId } from "@/lib/id";

interface ReflectionState {
  entries: ReflectionEntry[];
  /** Local date key (YYYY-MM-DD) the focus-session intention was last captured. */
  lastIntentionDate?: string;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addEntry: (input: {
    context: ReflectionContext;
    reason: ReflectionReason;
    taskId?: string;
    note?: string;
    ifUrgePlan?: string;
  }) => void;
  setLastIntentionDate: (date: string) => void;
  resetAll: () => void;
}

export const useReflectionStore = create<ReflectionState>()(
  persist(
    (set) => ({
      entries: [],
      lastIntentionDate: undefined,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setLastIntentionDate: (date) => set({ lastIntentionDate: date }),

      addEntry: (input) =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: generateId(),
              context: input.context,
              reason: input.reason,
              taskId: input.taskId,
              note: input.note,
              ifUrgePlan: input.ifUrgePlan,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      resetAll: () => set({ entries: [], lastIntentionDate: undefined }),
    }),
    {
      name: "flowstate-reflection",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
