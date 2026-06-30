"use client";

import { useEffect } from "react";
import { usePomodoroStore } from "@/store/pomodoroStore";

/**
 * Lives once at the app-shell level (not inside a route page), so the
 * pomodoro keeps counting down via absolute endTimestamp math even while
 * the user navigates between Dashboard/Tasks/Habits/etc.
 */
export function PomodoroEngine() {
  useEffect(() => {
    const interval = setInterval(() => usePomodoroStore.getState().tick(), 250);
    return () => clearInterval(interval);
  }, []);

  return null;
}
