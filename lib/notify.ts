import { useSettingsStore } from "@/store/settingsStore";
import type { PomodoroPhase } from "@/store/pomodoroStore";

/**
 * The web Notification API is what actually surfaces a native OS
 * notification here — in a normal browser tab it shows the platform's
 * banner, and inside the Electron shell Chromium routes the same call
 * straight to a native macOS/Windows/Linux notification, so one code path
 * covers both.
 */
function isSupported(): boolean {
  return typeof window !== "undefined" && typeof Notification !== "undefined";
}

/** Ask for permission once a session actually starts, not on page load. */
export function requestNotificationPermission() {
  if (!isSupported() || Notification.permission !== "default") return;
  Notification.requestPermission().catch(() => {});
}

const PHASE_COPY: Record<PomodoroPhase, { title: string; body: (nextPhase: PomodoroPhase) => string }> = {
  work: {
    title: "Focus session complete",
    body: (next) => (next === "longBreak" ? "Nice work — take a long break." : "Take a short break."),
  },
  break: { title: "Break's over", body: () => "Back to focus." },
  longBreak: { title: "Long break's over", body: () => "Ready for the next round." },
};

export function notifyPomodoroPhaseComplete(finishedPhase: PomodoroPhase, nextPhase: PomodoroPhase) {
  if (!isSupported()) return;
  if (!useSettingsStore.getState().desktopNotificationsEnabled) return;
  if (Notification.permission !== "granted") return;

  const copy = PHASE_COPY[finishedPhase];
  // A stable tag replaces the previous notification instead of stacking a
  // new one every ~25 minutes.
  new Notification(copy.title, { body: copy.body(nextPhase), icon: "/icon-192.png", tag: "flowstate-pomodoro" });
}
