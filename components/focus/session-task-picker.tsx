"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore } from "@/store/taskStore";
import { getActiveTasks } from "@/lib/tasks";

const NONE = "__none__";

interface SessionTaskPickerProps {
  value?: string;
  onChange: (taskId?: string) => void;
}

export function SessionTaskPicker({ value, onChange }: SessionTaskPickerProps) {
  const tasks = useTaskStore((s) => s.tasks);
  const activeTasks = getActiveTasks(tasks);

  return (
    <Select value={value ?? NONE} onValueChange={(v) => onChange(v === NONE ? undefined : v)}>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="No task selected" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>No task</SelectItem>
        {activeTasks.map((task) => (
          <SelectItem key={task.id} value={task.id}>
            {task.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
