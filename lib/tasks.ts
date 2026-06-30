import { toDateKey } from "./dates";
import { isOverdue } from "./overdue";
import type { Task, TaskFilters, SortBy, Priority } from "@/types";

const PRIORITY_ORDER: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const PRIORITY_SCORE: Record<Priority, number> = { HIGH: 300, MEDIUM: 150, LOW: 0 };

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((t) => {
    if (filters.category && t.category !== filters.category) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.status && t.status !== filters.status) return false;
    return true;
  });
}

/**
 * Ranks "what should I actually do right now" — overdue work outranks
 * everything, then priority, then due-today urgency, with a small nudge
 * toward quick wins so the list doesn't always favor the scariest task.
 */
export function getFocusScore(task: Task, today: string = toDateKey()): number {
  let score = PRIORITY_SCORE[task.priority];
  if (isOverdue(task)) score += 1000;
  else if (task.dueDate === today) score += 200;
  if (task.estimatedMinutes && task.estimatedMinutes <= 15) score += 20;
  return score;
}

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  const list = [...tasks];
  switch (sortBy) {
    case "dueDate":
      return list.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority":
      return list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    case "created":
      return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "smart": {
      const today = toDateKey();
      return list.sort((a, b) => {
        const diff = getFocusScore(b, today) - getFocusScore(a, today);
        return diff !== 0 ? diff : a.createdAt.localeCompare(b.createdAt);
      });
    }
    case "manual":
    default:
      return list.sort((a, b) => a.order - b.order);
  }
}

/** The single best task to start on right now, for the "Do this next" hero. */
export function getFocusPick(tasks: Task[], excludeId?: string): Task | null {
  const active = getActiveTasks(tasks).filter((t) => t.id !== excludeId);
  if (active.length === 0) return null;
  return sortTasks(active, "smart")[0];
}

export function getActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === "active");
}

export function getCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === "completed");
}

export function getArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === "archived");
}

export function getTopTasks(tasks: Task[], count = 3): Task[] {
  return sortTasks(getActiveTasks(tasks), "smart").slice(0, count);
}

export function getNextOrder(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map((t) => t.order)) + 1;
}

export function reorderTasks(tasks: Task[], draggedId: string, targetId: string): Task[] {
  const list = [...tasks].sort((a, b) => a.order - b.order);
  const fromIndex = list.findIndex((t) => t.id === draggedId);
  const toIndex = list.findIndex((t) => t.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return tasks;
  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  return list.map((t, i) => ({ ...t, order: i }));
}
