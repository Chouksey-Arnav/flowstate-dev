import type { Task, Habit, FocusSession, Settings, DayRecord } from "@/types";

export interface ExportPayload {
  exportedAt: string;
  version: 2;
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  settings: Settings;
  /** Sealed day verdicts — the accountability history, exported alongside the wins. */
  ledger: DayRecord[];
}

export function buildExportPayload(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  settings: Settings,
  ledger: DayRecord[] = []
): ExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    version: 2,
    tasks,
    habits,
    focusSessions,
    settings,
    ledger,
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
