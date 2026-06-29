"use client";

import { useState } from "react";
import { Download, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "./confirm-dialog";
import { useTaskStore } from "@/store/taskStore";
import { useHabitStore } from "@/store/habitStore";
import { useFocusStore } from "@/store/focusStore";
import { useSettingsStore, getSettingsSnapshot } from "@/store/settingsStore";
import { buildExportPayload, downloadJson } from "@/lib/export";

type ActiveDialog = "clearCompleted" | "resetHabits" | "resetEverything" | null;

export function DataSection() {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const handleExport = () => {
    const taskState = useTaskStore.getState();
    const habitState = useHabitStore.getState();
    const focusState = useFocusStore.getState();
    const settingsState = useSettingsStore.getState();
    const payload = buildExportPayload(
      taskState.tasks,
      habitState.habits,
      focusState.sessions,
      getSettingsSnapshot(settingsState)
    );
    downloadJson(payload, `flowstate-export-${new Date().toISOString().slice(0, 10)}.json`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export data as JSON
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setActiveDialog("clearCompleted")}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear completed tasks
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setActiveDialog("resetHabits")}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset habit streaks
        </Button>
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={() => setActiveDialog("resetEverything")}
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> Reset everything
        </Button>
      </CardContent>

      <ConfirmDialog
        open={activeDialog === "clearCompleted"}
        onOpenChange={(open) => setActiveDialog(open ? "clearCompleted" : null)}
        title="Clear completed tasks?"
        description="This permanently removes every task marked as completed. This can't be undone."
        confirmLabel="Clear completed"
        onConfirm={() => useTaskStore.getState().clearCompleted()}
      />
      <ConfirmDialog
        open={activeDialog === "resetHabits"}
        onOpenChange={(open) => setActiveDialog(open ? "resetHabits" : null)}
        title="Reset habit streaks?"
        description="This clears all completion history for your habits, resetting every streak to zero. Your habits themselves stay."
        confirmLabel="Reset streaks"
        onConfirm={() => useHabitStore.getState().resetCompletions()}
      />
      <ConfirmDialog
        open={activeDialog === "resetEverything"}
        onOpenChange={(open) => setActiveDialog(open ? "resetEverything" : null)}
        title="Reset everything?"
        description="This permanently deletes all tasks, habits, focus sessions, and restores default settings. This can't be undone."
        confirmLabel="Reset everything"
        onConfirm={() => {
          useTaskStore.getState().resetAll();
          useHabitStore.getState().resetAll();
          useFocusStore.getState().resetAll();
          useSettingsStore.getState().resetAll();
        }}
      />
    </Card>
  );
}
