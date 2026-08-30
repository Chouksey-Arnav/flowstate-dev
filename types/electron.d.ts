import type { PomodoroPhase } from "@/store/pomodoroStore";

export interface FlowstateDesktopBridge {
  /** Pushes the live timer state to the Electron main process so it can render it in the macOS menu bar. */
  updatePomodoro: (state: { running: boolean; phase: PomodoroPhase; remainingMs: number }) => void;
  /** Registers a callback for the tray's Pause/Resume menu item; returns an unsubscribe function. */
  onToggleRequest: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    /** Only present when running inside the Electron desktop shell (see electron/preload.js). */
    flowstateDesktop?: FlowstateDesktopBridge;
  }
}
