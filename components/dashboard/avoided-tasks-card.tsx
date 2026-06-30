"use client";

import { useRouter } from "next/navigation";
import { Flame, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { daysSinceCreated } from "@/lib/tasks";
import { usePomodoroStore } from "@/store/pomodoroStore";
import type { Task } from "@/types";

interface AvoidedTasksCardProps {
  tasks: Task[];
}

export function AvoidedTasksCard({ tasks }: AvoidedTasksCardProps) {
  const router = useRouter();
  const setPomodoroTaskId = usePomodoroStore((s) => s.setTaskId);

  if (tasks.length === 0) return null;

  function doItNow(taskId: string) {
    setPomodoroTaskId(taskId);
    router.push(`/focus?taskId=${taskId}`);
  }

  return (
    <Card className="border-flow-red/25 bg-flow-red/[0.03]">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-flow-red">
          <Flame className="h-4 w-4" /> Tasks you&apos;re avoiding
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-flow-red/20 bg-card p-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <PriorityBadge priority={task.priority} />
                  <span className="text-xs text-muted-foreground">
                    sitting {daysSinceCreated(task)}d
                  </span>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => doItNow(task.id)}>
                Do it now <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
