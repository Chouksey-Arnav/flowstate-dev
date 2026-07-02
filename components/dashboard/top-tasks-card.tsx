"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { xpForTask } from "@/lib/xp";
import type { Task } from "@/types";

interface TopTasksCardProps {
  tasks: Task[];
  onComplete: (id: string) => void;
}

export function TopTasksCard({ tasks, onComplete }: TopTasksCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top priorities</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="Nothing on deck" description="Add a task to see it here." />
        ) : (
          <ul className="space-y-1.5">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/40"
              >
                <Checkbox onCheckedChange={() => onComplete(task.id)} className="rounded-full" />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{task.title}</span>
                <PriorityBadge priority={task.priority} />
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                  <Sparkles className="h-3 w-3" /> {xpForTask(task)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
