import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";

interface StreakState {
  /** Badge ids ever unlocked — permanent, never revoked even if the streak later resets. */
  earnedBadgeIds: string[];
  /** Monotonic personal records — only ever grow, so trophies survive if old task data is later cleared. */
  longestStreakEver: number;
  totalPerfectDays: number;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  recordBadge: (badgeId: string) => void;
  recordStreakStats: (currentStreak: number, perfectDayCount: number) => void;
  resetAll: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      earnedBadgeIds: [],
      longestStreakEver: 0,
      totalPerfectDays: 0,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      recordBadge: (badgeId) =>
        set((state) =>
          state.earnedBadgeIds.includes(badgeId)
            ? state
            : { earnedBadgeIds: [...state.earnedBadgeIds, badgeId] }
        ),

      recordStreakStats: (currentStreak, perfectDayCount) =>
        set((state) => ({
          longestStreakEver: Math.max(state.longestStreakEver, currentStreak),
          totalPerfectDays: Math.max(state.totalPerfectDays, perfectDayCount),
        })),

      resetAll: () => set({ earnedBadgeIds: [], longestStreakEver: 0, totalPerfectDays: 0 }),
    }),
    {
      name: "flowstate-streaks",
      storage: createJSONStorage(() => supabaseKvStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
