import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";
import type { XpEvent, XpSource } from "@/types";
import { generateId } from "@/lib/id";
import { useXpToastStore } from "./xpToastStore";

interface XpState {
  totalXp: number;
  events: XpEvent[];
  /** Last level the level-up modal was shown for, so we only celebrate once per level. */
  lastSeenLevel: number;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  awardXp: (amount: number, source: XpSource, label: string) => void;
  acknowledgeLevel: (level: number) => void;
  resetAll: () => void;
}

export const useXpStore = create<XpState>()(
  persist(
    (set) => ({
      totalXp: 0,
      events: [],
      lastSeenLevel: 1,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      awardXp: (amount, source, label) => {
        if (amount <= 0) return;
        const event: XpEvent = { id: generateId(), source, amount, label, at: new Date().toISOString() };
        set((state) => ({
          totalXp: state.totalXp + amount,
          events: [event, ...state.events].slice(0, 50),
        }));
        useXpToastStore.getState().push(amount, label);
      },

      acknowledgeLevel: (level) => set({ lastSeenLevel: level }),

      resetAll: () => set({ totalXp: 0, events: [], lastSeenLevel: 1 }),
    }),
    {
      name: "flowstate-xp",
      storage: createJSONStorage(() => supabaseKvStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
