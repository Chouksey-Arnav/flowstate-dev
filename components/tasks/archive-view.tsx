"use client";

import { Archive } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskList } from "./list";
import { useTaskStore } from "@/store/taskStore";
import { getArchivedTasks } from "@/lib/tasks";

export function ArchiveView() {
  const tasks = useTaskStore((s) => s.tasks);
  const unarchiveTask = useTaskStore((s) => s.unarchiveTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);

  const archived = getArchivedTasks(tasks);

  if (archived.length === 0) {
    return <EmptyState icon={Archive} title="No archived tasks" description="Archived tasks will show up here." />;
  }

  return (
    <TaskList
      tasks={archived}
      onComplete={() => undefined}
      onUncomplete={() => undefined}
      onEdit={() => undefined}
      onArchive={() => undefined}
      onUnarchive={unarchiveTask}
      onDelete={deleteTask}
      onToggleSubtask={toggleSubtask}
    />
  );
}
