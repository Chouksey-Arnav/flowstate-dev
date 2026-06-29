"use client";

import { Play, Pause, RotateCcw, SkipForward, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PomodoroRing } from "./pomodoro-ring";
import type { PomodoroPhase } from "@/hooks/usePomodoro";

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  work: "Focus",
  break: "Short break",
  longBreak: "Long break",
};

const PHASE_COLOR: Record<PomodoroPhase, string> = {
  work: "#3B82F6",
  break: "#22C55E",
  longBreak: "#EAB308",
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface PomodoroWidgetProps {
  phase: PomodoroPhase;
  running: boolean;
  remainingMs: number;
  totalMs: number;
  cyclesCompleted: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onMaximize?: () => void;
  compact?: boolean;
}

export function PomodoroWidget({
  phase,
  running,
  remainingMs,
  totalMs,
  cyclesCompleted,
  onStart,
  onPause,
  onReset,
  onSkip,
  onMaximize,
  compact = false,
}: PomodoroWidgetProps) {
  const progress = totalMs === 0 ? 0 : remainingMs / totalMs;

  return (
    <div className="flex flex-col items-center gap-4">
      <PomodoroRing progress={progress} size={compact ? 160 : 240} color={PHASE_COLOR[phase]}>
        <div className="flex flex-col items-center">
          <span className={compact ? "text-2xl font-semibold" : "text-4xl font-semibold"}>
            {formatTime(remainingMs)}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{PHASE_LABEL[phase]}</span>
        </div>
      </PomodoroRing>

      <div className="flex items-center gap-2">
        {running ? (
          <Button size={compact ? "sm" : "default"} onClick={onPause}>
            <Pause className="mr-1.5 h-4 w-4" /> Pause
          </Button>
        ) : (
          <Button size={compact ? "sm" : "default"} onClick={onStart}>
            <Play className="mr-1.5 h-4 w-4" /> Start
          </Button>
        )}
        <Button size={compact ? "sm" : "default"} variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size={compact ? "sm" : "default"} variant="outline" onClick={onSkip}>
          <SkipForward className="h-4 w-4" />
        </Button>
        {onMaximize && (
          <Button size={compact ? "sm" : "default"} variant="outline" onClick={onMaximize}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-muted-foreground">{cyclesCompleted} pomodoro{cyclesCompleted === 1 ? "" : "s"} completed</p>
      )}
    </div>
  );
}
