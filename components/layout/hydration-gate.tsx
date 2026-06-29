"use client";

import { useTaskStore } from "@/store/taskStore";
import { useHabitStore } from "@/store/habitStore";
import { useFocusStore } from "@/store/focusStore";
import { useSettingsStore } from "@/store/settingsStore";
import { SplashSkeleton } from "./splash-skeleton";

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const tasksHydrated = useTaskStore((s) => s.hasHydrated);
  const habitsHydrated = useHabitStore((s) => s.hasHydrated);
  const focusHydrated = useFocusStore((s) => s.hasHydrated);
  const settingsHydrated = useSettingsStore((s) => s.hasHydrated);

  const ready = tasksHydrated && habitsHydrated && focusHydrated && settingsHydrated;

  if (!ready) return <SplashSkeleton />;
  return <>{children}</>;
}
