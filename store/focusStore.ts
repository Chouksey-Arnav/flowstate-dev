import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FocusSession, FocusSessionType } from "@/types";
import { generateId } from "@/lib/id";
import { xpForFocusSession } from "@/lib/xp";
import { useXpStore } from "./xpStore";

interface FocusState {
  sessions: FocusSession[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  logSession: (input: {
    taskId?: string;
    durationMinutes: number;
    type: FocusSessionType;
    startedAt: string;
    endedAt: string;
  }) => FocusSession;
  deleteSession: (id: string) => void;
  resetAll: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set) => ({
      sessions: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      logSession: (input) => {
        const session: FocusSession = {
          id: generateId(),
          taskId: input.taskId,
          durationMinutes: input.durationMinutes,
          type: input.type,
          startedAt: input.startedAt,
          endedAt: input.endedAt,
        };
        set((state) => ({ sessions: [...state.sessions, session] }));
        useXpStore.getState().awardXp(
          xpForFocusSession(session.durationMinutes),
          "focus",
          `${session.durationMinutes}-minute focus session`
        );
        return session;
      },

      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      resetAll: () => set({ sessions: [] }),
    }),
    {
      name: "flowstate-focus",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
