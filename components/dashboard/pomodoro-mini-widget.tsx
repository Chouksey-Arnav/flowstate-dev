"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePomodoro } from "@/hooks/usePomodoro";
import { PomodoroWidget } from "@/components/focus/pomodoro-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** Reads the same global timer as the Focus page — starting it here keeps it running everywhere. */
export function PomodoroMiniWidget() {
  const pomodoro = usePomodoro();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Quick focus</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
          <Link href="/focus">
            Full timer <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
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
