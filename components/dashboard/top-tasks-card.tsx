import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
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
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <Checkbox onCheckedChange={() => onComplete(task.id)} />
                <span className="text-sm text-foreground">{task.title}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
