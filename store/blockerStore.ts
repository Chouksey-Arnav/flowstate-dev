import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BlockedSite, BlockerSchedule } from "@/types";
import { generateId } from "@/lib/id";

const DEFAULT_SITES: BlockedSite[] = [
  { id: generateId(), domain: "youtube.com" },
  { id: generateId(), domain: "www.youtube.com" },
];

const DEFAULT_SCHEDULE: BlockerSchedule = {
  enabled: false,
  startTime: "09:00",
  endTime: "17:00",
  days: [1, 2, 3, 4, 5],
};

interface BlockerState {
  sites: BlockedSite[];
  schedule: BlockerSchedule;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addSite: (domain: string) => void;
  removeSite: (id: string) => void;
  updateSchedule: (updates: Partial<BlockerSchedule>) => void;
  resetAll: () => void;
}

function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export const useBlockerStore = create<BlockerState>()(
  persist(
    (set, get) => ({
      sites: DEFAULT_SITES,
      schedule: DEFAULT_SCHEDULE,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addSite: (domain) => {
        const clean = normalizeDomain(domain);
        if (!clean) return;
        const exists = get().sites.some((s) => s.domain === clean);
        if (exists) return;
        set((state) => ({ sites: [...state.sites, { id: generateId(), domain: clean }] }));
      },

      removeSite: (id) => set((state) => ({ sites: state.sites.filter((s) => s.id !== id) })),

      updateSchedule: (updates) =>
        set((state) => ({ schedule: { ...state.schedule, ...updates } })),

      resetAll: () => set({ sites: DEFAULT_SITES, schedule: DEFAULT_SCHEDULE }),
    }),
    {
      name: "flowstate-blocker",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
