"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { DifficultyBadge } from "@/components/tasks/difficulty-badge";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface CommitmentCardProps {
  activeTasks: Task[];
  committedTask?: Task;
  isCommittedToday: boolean;
  isCompletedToday: boolean;
  onCommit: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function CommitmentCard({
  activeTasks,
  committedTask,
  isCommittedToday,
  isCompletedToday,
  onCommit,
  onComplete,
}: CommitmentCardProps) {
  const router = useRouter();
  const setPomodoroTaskId = usePomodoroStore((s) => s.setTaskId);
  const [pickedId, setPickedId] = useState<string | undefined>(undefined);

  function startFocus(taskId: string) {
    setPomodoroTaskId(taskId);
    router.push(`/focus?taskId=${taskId}`);
  }

  if (isCommittedToday && isCompletedToday) {
    return (
      <Card className="border-flow-green/30 bg-flow-green/5">
        <CardContent className="flex items-center gap-3 p-5">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-flow-green" />
          <div>
            <p className="text-sm font-semibold text-foreground">Today&apos;s One Thing — done.</p>
            <p className="text-xs text-muted-foreground">
              You committed, and you delivered. That&apos;s the whole game.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCommittedToday && committedTask) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/20 via-card to-card p-6 shadow-glow animate-pulse-gentle">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
              <Lock className="h-3.5 w-3.5" />
            </div>
            Today&apos;s One Thing
          </div>
          <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-primary ring-1 ring-inset ring-primary/20">
            Locked In
          </div>
        </div>
        <h2 className="relative mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {committedTask.title}
        </h2>
        <p className="relative mt-2 text-base text-muted-foreground/90">
          This is your mountain. Everything else is just noise. Focus, finish, and feel the win.
        </p>
        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={committedTask.priority} />
          <DifficultyBadge difficulty={committedTask.difficulty} />
          {committedTask.category && (
            <span className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {committedTask.category}
            </span>
          )}
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <Button size="lg" className="h-12 px-8 text-base shadow-glow" onClick={() => startFocus(committedTask.id)}>
            Enter Flow State <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="secondary" className="h-12 px-6 text-base" onClick={() => onComplete(committedTask.id)}>
            <CheckCircle2 className="mr-2 h-5 w-5" /> Mark as Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-dashed border-primary/30">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Target className="h-3.5 w-3.5" />
          Today&apos;s One Thing
        </div>
        <p className="text-sm text-muted-foreground">
          Pick the one task you will not let slide today. Lock it in — it&apos;s the first thing
          you&apos;ll see until it&apos;s done.
        </p>
        {activeTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add a task first, then commit to it.</p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={pickedId} onValueChange={setPickedId}>
              <SelectTrigger className={cn("sm:w-[280px]")}>
                <SelectValue placeholder="Choose a task…" />
              </SelectTrigger>
              <SelectContent>
                {activeTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!pickedId} onClick={() => pickedId && onCommit(pickedId)}>
              <Lock className="mr-1.5 h-4 w-4" /> Lock it in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
