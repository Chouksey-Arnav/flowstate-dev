"use client";

import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Timer } from "lucide-react";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { useTaskStore } from "@/store/taskStore";
import { cn } from "@/lib/utils";

const PHASE_LABEL: Record<string, string> = {
  work: "Focusing",
  break: "On break",
  longBreak: "Long break",
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Floating reassurance that the timer kept running while you were elsewhere
 * in the app. Only shows once a session has actually been started.
 */
export function PomodoroStatusPill() {
  const router = useRouter();
  const pathname = usePathname();
  const phase = usePomodoroStore((s) => s.phase);
  const running = usePomodoroStore((s) => s.running);
  const remainingMs = usePomodoroStore((s) => s.remainingMs);
  const startedAt = usePomodoroStore((s) => s.startedAt);
  const taskId = usePomodoroStore((s) => s.taskId);
  const pause = usePomodoroStore((s) => s.pause);
  const start = usePomodoroStore((s) => s.start);
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId));

  const visible = (running || startedAt !== null) && pathname !== "/focus";
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="pomodoro-pill"
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        className="fixed right-4 top-4 z-30 flex items-center gap-2.5 rounded-full border border-border/60 bg-card/90 py-2 pl-3 pr-1.5 text-sm shadow-card backdrop-blur-md transition-colors hover:border-primary/40 md:right-8 md:top-6"
      >
        <button
          type="button"
          onClick={() => router.push("/focus")}
          className="flex items-center gap-2.5"
        >
          <span className={cn("flex h-2 w-2 rounded-full", running ? "animate-pulse bg-primary" : "bg-muted-foreground")} />
          <Timer className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono font-semibold tabular-nums text-foreground">{formatTime(remainingMs)}</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {PHASE_LABEL[phase]}
            {task ? ` · ${task.title}` : ""}
          </span>
        </button>
        <button
          type="button"
          onClick={() => (running ? pause() : start())}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
