"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./category-badge";
import { PriorityBadge } from "./priority-badge";
import { DifficultyBadge } from "./difficulty-badge";
import { OverdueBadge } from "./overdue-badge";
import { AvoidedBadge } from "./avoided-badge";
import { isOverdue } from "@/lib/overdue";
import { getAvoidanceScore, daysSinceCreated, AVOIDANCE_THRESHOLD } from "@/lib/tasks";
import { usePomodoroStore } from "@/store/pomodoroStore";
import type { Task } from "@/types";

interface FocusPickCardProps {
  task: Task;
  onAnother: () => void;
  canShowAnother: boolean;
}

function reasonFor(task: Task): string {
  if (getAvoidanceScore(task) >= AVOIDANCE_THRESHOLD) return "You keep skipping this one. Today it goes first.";
  if (isOverdue(task)) return "It's overdue — clearing this unblocks everything else.";
  if (task.priority === "HIGH") return "Highest priority on your list right now.";
  if (task.estimatedMinutes && task.estimatedMinutes <= 15) return "A quick win — done in under 15 minutes.";
  return "Next best use of your next focus block.";
}

export function FocusPickCard({ task, onAnother, canShowAnother }: FocusPickCardProps) {
  const router = useRouter();
  const setTaskId = usePomodoroStore((s) => s.setTaskId);

  function startFocus() {
    setTaskId(task.id);
    router.push(`/focus?taskId=${task.id}`);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Do this next
        </div>
        {canShowAnother && (
          <button
            type="button"
            onClick={onAnother}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" /> Show another
          </button>
        )}
      </div>

      <p className="relative mt-2 text-lg font-semibold text-foreground">{task.title}</p>
      <p className="relative mt-1 text-sm text-muted-foreground">{reasonFor(task)}</p>

      <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={task.category} />
        <PriorityBadge priority={task.priority} />
        <DifficultyBadge difficulty={task.difficulty} />
        {isOverdue(task) && <OverdueBadge />}
        {getAvoidanceScore(task) >= AVOIDANCE_THRESHOLD && <AvoidedBadge days={daysSinceCreated(task)} />}
        {task.estimatedMinutes && (
          <span className="text-xs text-muted-foreground">~{task.estimatedMinutes} min</span>
        )}
      </div>

      <Button onClick={startFocus} className="relative mt-4 w-full sm:w-auto">
        Start a focus session <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  );
}
