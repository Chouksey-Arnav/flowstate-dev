import type { Task, Habit, FocusSession, Settings } from "@/types";

export interface ExportPayload {
  exportedAt: string;
  version: 1;
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  settings: Settings;
}

export function buildExportPayload(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  settings: Settings
): ExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    tasks,
    habits,
    focusSessions,
    settings,
  };
}

export function downloadJson(payload: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
