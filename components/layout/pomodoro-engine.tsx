"use client";

import { useEffect, useRef } from "react";
import { usePomodoroStore, type PomodoroPhase } from "@/store/pomodoroStore";
import { requestNotificationPermission } from "@/lib/notify";

const STORAGE_KEY = "flowstate-pomodoro";
const LEADER_KEY = "flowstate-pomodoro-leader";
const LEADER_TTL_MS = 1500;
const TICK_MS = 250;

const PHASE_ICON: Record<PomodoroPhase, string> = {
  work: "🎯",
  break: "☕",
  longBreak: "🌿",
};

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function readLeader(): { tabId: string; ts: number } | null {
  try {
    const raw = localStorage.getItem(LEADER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Lives once at the app-shell level (not inside a route page), so the
 * pomodoro keeps counting down via absolute endTimestamp math even while
 * the user navigates between Dashboard/Tasks/Habits/etc.
 *
 * It's also the one place responsible for everything that must happen
 * exactly once per tick, no matter how many tabs/windows are open:
 * advancing the timer, mirroring it into the document title, and pushing
 * it to the desktop app's menu bar tray. When multiple tabs are open, only
 * the elected "leader" tab calls tick() — every other tab just re-reads
 * the persisted state the leader writes on each tick (via zustand's
 * `persist` + the `storage` event), so phase-completion side effects
 * (XP logging, the beep, the notification) only ever fire once.
 */
export function PomodoroEngine() {
  const tabIdRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );

  useEffect(() => {
    const tabId = tabIdRef.current;
    const baseTitle = document.title;

    const claimOrRenewLeadership = () => {
      const now = Date.now();
      const current = readLeader();
      const isLeader = !current || current.tabId === tabId || now - current.ts > LEADER_TTL_MS;
      if (isLeader) {
        try {
          localStorage.setItem(LEADER_KEY, JSON.stringify({ tabId, ts: now }));
        } catch {
          // Storage unavailable (e.g. private-browsing quota) — worst case
          // every open tab ticks independently, which is still correct.
        }
      }
      return isLeader;
    };

    const syncTitleAndTray = () => {
      const { running, phase, remainingMs } = usePomodoroStore.getState();
      document.title = running ? `${formatTime(remainingMs)} ${PHASE_ICON[phase]} — FlowState` : baseTitle;
      window.flowstateDesktop?.updatePomodoro({ running, phase, remainingMs });
    };

    const interval = setInterval(() => {
      if (claimOrRenewLeadership()) {
        usePomodoroStore.getState().tick();
      }
      syncTitleAndTray();
    }, TICK_MS);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      usePomodoroStore.persist.rehydrate();
      syncTitleAndTray();
    };
    window.addEventListener("storage", onStorage);

    const onVisibility = () => {
      if (document.visibilityState === "visible") claimOrRenewLeadership();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const unsubscribe = usePomodoroStore.subscribe((state, prevState) => {
      if (state.running && !prevState.running) requestNotificationPermission();
    });

    const offToggleRequest = window.flowstateDesktop?.onToggleRequest(() => {
      const { running, start, pause } = usePomodoroStore.getState();
      if (running) pause();
      else start();
    });

    syncTitleAndTray();

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      unsubscribe();
      offToggleRequest?.();
      document.title = baseTitle;
    };
  }, []);

  return null;
}
