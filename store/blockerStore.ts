import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";
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
  /** Fingerprint of `sites` as of the last script download — lets the UI warn when the installed script has drifted out of sync. */
  lastDownloadedSitesFingerprint: string | null;
  /** Fingerprint of `schedule` as of the last plist download. */
  lastDownloadedScheduleFingerprint: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addSite: (domain: string) => void;
  removeSite: (id: string) => void;
  updateSchedule: (updates: Partial<BlockerSchedule>) => void;
  markScriptDownloaded: (fingerprint: string) => void;
  markScheduleDownloaded: (fingerprint: string) => void;
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
      lastDownloadedSitesFingerprint: null,
      lastDownloadedScheduleFingerprint: null,
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

      markScriptDownloaded: (fingerprint) => set({ lastDownloadedSitesFingerprint: fingerprint }),
      markScheduleDownloaded: (fingerprint) => set({ lastDownloadedScheduleFingerprint: fingerprint }),

      resetAll: () =>
        set({
          sites: DEFAULT_SITES,
          schedule: DEFAULT_SCHEDULE,
          lastDownloadedSitesFingerprint: null,
          lastDownloadedScheduleFingerprint: null,
        }),
    }),
    {
      name: "flowstate-blocker",
      storage: createJSONStorage(() => supabaseKvStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
