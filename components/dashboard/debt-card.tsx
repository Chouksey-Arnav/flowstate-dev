"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, History, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { useTaskStore } from "@/store/taskStore";
import { getDebtLine, getDebtHeadline } from "@/lib/guilt";
import { getDebtWeight, timesMissed } from "@/lib/reckoning";
import { cn } from "@/lib/utils";
import type { GuiltIntensity, Task } from "@/types";

interface DebtCardProps {
  tasks: Task[];
  intensity: GuiltIntensity;
}

const WEIGHT_CLASS = {
  none: "",
  light: "border-flow-yellow/25",
  heavy: "border-flow-red/30 bg-flow-red/[0.03]",
  crushing: "border-flow-red/50 bg-flow-red/[0.06]",
} as const;

/**
 * Standing debt: tasks that have already been promised on a specific day and
 * not delivered. This is separate from the existing "avoided" card, which
 * measures how long something has *sat*. Debt measures how many times you
 * personally said you'd do it — and that's the number that actually stings.
 */
export function DebtCard({ tasks, intensity }: DebtCardProps) {
  const router = useRouter();
  const setPomodoroTaskId = usePomodoroStore((s) => s.setTaskId);
  const letGo = useTaskStore((s) => s.letGo);

  if (tasks.length === 0) return null;

  const shown = tasks.slice(0, 4);
  const totalBroken = tasks.reduce((sum, t) => sum + timesMissed(t), 0);

  function doItNow(taskId: string) {
    setPomodoroTaskId(taskId);
    router.push(`/focus?taskId=${taskId}`);
  }

  return (
    <Card className="border-flow-red/30 bg-flow-red/[0.04]">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-flow-red">
          <History className="h-4 w-4" /> {getDebtHeadline(tasks.length, intensity)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {totalBroken} broken {totalBroken === 1 ? "promise" : "promises"} still open. They don&apos;t
          expire — they just follow you.
        </p>

        <ul className="space-y-2">
          {shown.map((task) => {
            const weight = getDebtWeight(task);
            return (
              <li
                key={task.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border border-l-[3px] border-border/60 border-l-flow-red bg-card p-2.5",
                  WEIGHT_CLASS[weight]
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <PriorityBadge priority={task.priority} />
                    <span
                      className={cn(
                        "text-xs",
                        weight === "crushing"
                          ? "font-medium text-flow-red animate-debt-throb"
                          : "text-muted-foreground"
                      )}
                    >
                      {getDebtLine(task, intensity)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {weight === "crushing" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Admit you're not going to do this and archive it"
                      className="h-8 w-8 text-muted-foreground hover:text-flow-red"
                      onClick={() => letGo([task.id])}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => doItNow(task.id)}>
                    Do it now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        {tasks.length > shown.length && (
          <p className="text-xs text-muted-foreground">
            …and {tasks.length - shown.length} more carrying debt.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
