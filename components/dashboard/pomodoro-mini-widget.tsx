"use client";

import { usePomodoro } from "@/hooks/usePomodoro";
import { PomodoroWidget } from "@/components/focus/pomodoro-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Deliberately a separate, unsynced usePomodoro() instance from the Focus page. */
export function PomodoroMiniWidget() {
  const pomodoro = usePomodoro();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick focus</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PomodoroWidget
          phase={pomodoro.phase}
          running={pomodoro.running}
          remainingMs={pomodoro.remainingMs}
          totalMs={pomodoro.totalMs}
          cyclesCompleted={pomodoro.cyclesCompleted}
          onStart={pomodoro.start}
          onPause={pomodoro.pause}
          onReset={pomodoro.reset}
          onSkip={pomodoro.skip}
          compact
        />
      </CardContent>
    </Card>
  );
}
