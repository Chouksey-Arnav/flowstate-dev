"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { History } from "lucide-react";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useFocusStore } from "@/store/focusStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTaskStore } from "@/store/taskStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { PomodoroWidget } from "@/components/focus/pomodoro-widget";
import { SessionTaskPicker } from "@/components/focus/session-task-picker";
import { MotivationVideos } from "@/components/focus/motivation-videos";
import { FullFocusMode } from "@/components/focus/full-focus-mode";
import { AmbientSoundControl } from "@/components/focus/ambient-sound-control";
import { IntentionDialog } from "@/components/focus/intention-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { toDateKey } from "@/lib/dates";
import type { AmbientSound } from "@/types";

export default function FocusPage() {
  const searchParams = useSearchParams();
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [intentionOpen, setIntentionOpen] = useState(false);

  const ambientSound = useSettingsStore((s) => s.ambientSound);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const sessions = useFocusStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const lastIntentionDate = useReflectionStore((s) => s.lastIntentionDate);
  const setLastIntentionDate = useReflectionStore((s) => s.setLastIntentionDate);
  const addReflection = useReflectionStore((s) => s.addEntry);

  const pomodoro = usePomodoro();
  const { setTaskId } = pomodoro;
  useAmbientSound(ambientSound, ambientEnabled, ambientVolume);

  function handleStart() {
    if (pomodoro.phase === "work" && lastIntentionDate !== toDateKey()) {
      setIntentionOpen(true);
      return;
    }
    pomodoro.start();
  }

  function handleIntentionConfirm(payload: { whyItMatters: string; ifUrgePlan: string }) {
    addReflection({
      context: "intention",
      reason: "other",
      taskId: pomodoro.taskId,
      note: payload.whyItMatters || undefined,
      ifUrgePlan: payload.ifUrgePlan,
    });
    setLastIntentionDate(toDateKey());
    setIntentionOpen(false);
    pomodoro.start();
  }

  useEffect(() => {
    const queryTaskId = searchParams.get("taskId");
    if (queryTaskId) setTaskId(queryTaskId);
  }, [searchParams, setTaskId]);

  function handleSoundChange(sound: AmbientSound) {
    updateSettings({ ambientSound: sound });
  }

  const recentSessions = [...sessions]
    .sort((a, b) => b.endedAt.localeCompare(a.endedAt))
    .slice(0, 5);

  const widget = (
    <PomodoroWidget
      phase={pomodoro.phase}
      running={pomodoro.running}
      remainingMs={pomodoro.remainingMs}
      totalMs={pomodoro.totalMs}
      cyclesCompleted={pomodoro.cyclesCompleted}
      onStart={handleStart}
      onPause={pomodoro.pause}
      onReset={pomodoro.reset}
      onSkip={pomodoro.skip}
      onMaximize={!focusModeOpen ? () => setFocusModeOpen(true) : undefined}
    />
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Focus</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pomodoro timer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <SessionTaskPicker value={pomodoro.taskId} onChange={setTaskId} />
          {widget}
        </CardContent>
      </Card>

      <AmbientSoundControl
        sound={ambientSound}
        onSoundChange={handleSoundChange}
        enabled={ambientEnabled}
        onEnabledChange={setAmbientEnabled}
        volume={ambientVolume}
        onVolumeChange={setAmbientVolume}
      />

      <MotivationVideos />

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <EmptyState
              icon={History}
              title="No sessions yet"
              description="Completed pomodoros will show up here."
            />
          ) : (
            <ul className="space-y-2">
              {recentSessions.map((session) => {
                const task = tasks.find((t) => t.id === session.taskId);
                return (
                  <li key={session.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{task?.title ?? "No task"}</span>
                    <span className="text-muted-foreground">
                      {session.durationMinutes} min · {new Date(session.endedAt).toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <FullFocusMode open={focusModeOpen} onClose={() => setFocusModeOpen(false)}>
        {widget}
      </FullFocusMode>

      <IntentionDialog
        open={intentionOpen}
        taskTitle={tasks.find((t) => t.id === pomodoro.taskId)?.title}
        onOpenChange={setIntentionOpen}
        onConfirm={handleIntentionConfirm}
      />
    </div>
  );
}
