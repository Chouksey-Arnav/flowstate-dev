import { isPast } from "./dates";
import type { Task } from "@/types";

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status !== "active") return false;
  return isPast(task.dueDate);
}

export function estimatedMinutesRemaining(tasks: Task[]): number {
  return tasks
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0);
}
