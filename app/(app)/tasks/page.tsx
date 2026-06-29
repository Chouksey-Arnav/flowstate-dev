"use client";

import { useState } from "react";
import { Plus, Archive, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskFormDialog } from "@/components/tasks/form-dialog";
import { TaskFiltersBar } from "@/components/tasks/filters";
import { SortControl } from "@/components/tasks/sort-control";
import { TaskList } from "@/components/tasks/list";
import { BulkActionsBar } from "@/components/tasks/bulk-actions-bar";
import { BrainDumpInput } from "@/components/tasks/brain-dump-input";
import { ArchiveView } from "@/components/tasks/archive-view";
import { UndoToast } from "@/components/tasks/undo-toast";
import { useTaskStore } from "@/store/taskStore";
import { useSettingsStore } from "@/store/settingsStore";
import { getActiveTasks, filterTasks, sortTasks, reorderTasks } from "@/lib/tasks";
import { fireTaskCompleteConfetti } from "@/lib/confetti";
import { playCompletionChime } from "@/lib/audio";
import type { Task, TaskFilters, SortBy } from "@/types";

export default function TasksPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const archiveTask = useTaskStore((s) => s.archiveTask);
  const unarchiveTask = useTaskStore((s) => s.unarchiveTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const reorderAll = useTaskStore((s) => s.reorderAll);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const confettiEnabled = useSettingsStore((s) => s.confettiEnabled);

  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortBy, setSortBy] = useState<SortBy>("manual");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"active" | "archive">("active");
  const [undo, setUndo] = useState<{ taskId: string } | null>(null);

  const activeTasks = getActiveTasks(tasks);
  const filtered = filterTasks(activeTasks, filters);
  const sorted = sortTasks(filtered, sortBy);
  const draggable = sortBy === "manual" && !filters.category && !filters.priority;

  function handleComplete(id: string) {
    completeTask(id);
    if (confettiEnabled) fireTaskCompleteConfetti();
    if (soundEnabled) playCompletionChime();
    setUndo({ taskId: id });
  }

  function handleReorder(draggedId: string, targetId: string) {
    const reordered = reorderTasks(activeTasks, draggedId, targetId);
    const others = tasks.filter((t) => t.status !== "active");
    reorderAll([...reordered, ...others]);
  }

  function toggleSelect(id: string, selected: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function bulkComplete() {
    selectedIds.forEach((id) => completeTask(id));
    setSelectedIds(new Set());
  }
  function bulkArchive() {
    selectedIds.forEach((id) => archiveTask(id));
    setSelectedIds(new Set());
  }
  function bulkDelete() {
    selectedIds.forEach((id) => deleteTask(id));
    setSelectedIds(new Set());
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView((v) => (v === "active" ? "archive" : "active"))}
          >
            <Archive className="mr-1.5 h-4 w-4" />
            {view === "active" ? "Archive" : "Back to tasks"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingTask(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> New task
          </Button>
        </div>
      </div>

      {view === "archive" ? (
        <ArchiveView />
      ) : (
        <>
          <BrainDumpInput />

          <div className="flex items-center justify-between gap-2">
            <TaskFiltersBar filters={filters} onChange={setFilters} />
            <SortControl value={sortBy} onChange={setSortBy} />
          </div>

          <BulkActionsBar
            count={selectedIds.size}
            onComplete={bulkComplete}
            onArchive={bulkArchive}
            onDelete={bulkDelete}
            onClear={() => setSelectedIds(new Set())}
          />

          {sorted.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              description="Add your first task above to get started."
            />
          ) : (
            <TaskList
              tasks={sorted}
              draggable={draggable}
              selectedIds={selectedIds}
              onSelectChange={toggleSelect}
              onComplete={handleComplete}
              onUncomplete={uncompleteTask}
              onEdit={(task) => {
                setEditingTask(task);
                setDialogOpen(true);
              }}
              onArchive={archiveTask}
              onUnarchive={unarchiveTask}
              onDelete={deleteTask}
              onToggleSubtask={toggleSubtask}
              onReorder={handleReorder}
            />
          )}
        </>
      )}

      <TaskFormDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} />

      {undo && (
        <UndoToast
          message="Task completed"
          onUndo={() => uncompleteTask(undo.taskId)}
          onDismiss={() => setUndo(null)}
        />
      )}
    </div>
  );
}
