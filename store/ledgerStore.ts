import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";
import type { DayRecord } from "@/types";

/** Roughly a year of sealed days — enough for real history, small enough to sync cheaply. */
const MAX_RECORDS = 400;

interface LedgerState {
  /** Immutable verdicts on finished days, newest first. */
  records: DayRecord[];
  /** The last day that has been judged. Everything after it is still open. */
  lastSealedDate?: string;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  /**
   * Files verdicts for days that just closed. Existing records are never
   * overwritten — a sealed day is final, which is the entire point of it.
   */
  sealDays: (records: DayRecord[], throughDate: string) => void;
  acknowledge: (date: string) => void;
  acknowledgeAll: () => void;
  resetAll: () => void;
}

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set) => ({
      records: [],
      lastSealedDate: undefined,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      sealDays: (records, throughDate) =>
        set((state) => {
          const known = new Set(state.records.map((r) => r.date));
          const fresh = records.filter((r) => !known.has(r.date));
          const merged = [...fresh, ...state.records]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, MAX_RECORDS);
          return { records: merged, lastSealedDate: throughDate };
        }),

      acknowledge: (date) =>
        set((state) => ({
          records: state.records.map((r) => (r.date === date ? { ...r, acknowledged: true } : r)),
        })),

      acknowledgeAll: () =>
        set((state) => ({
          records: state.records.map((r) => (r.acknowledged ? r : { ...r, acknowledged: true })),
        })),

      resetAll: () => set({ records: [], lastSealedDate: undefined }),
    }),
    {
      name: "flowstate-ledger",
      storage: createJSONStorage(() => supabaseKvStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
