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
import { MomentumBar } from "@/components/tasks/momentum-bar";
import { FocusPickCard } from "@/components/tasks/focus-pick-card";
import { NoTasksNudge } from "@/components/tasks/no-tasks-nudge";
import { SkipReasonDialog } from "@/components/tasks/skip-reason-dialog";
import { useTaskStore } from "@/store/taskStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { getActiveTasks, getTodaysTasks, filterTasks, sortTasks, reorderTasks, getFocusPick, isTaskCompletedOn } from "@/lib/tasks";
import { fireTaskCompleteConfetti } from "@/lib/confetti";
import { playCompletionChime } from "@/lib/audio";
import { calculateGoalStreak } from "@/lib/streaks";
import { toDateKey } from "@/lib/dates";
import { getRandomCompletionLine } from "@/lib/quotes";
import type { Task, TaskFilters, SortBy } from "@/types";

export default function TasksPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const toggleTodayCompletion = useTaskStore((s) => s.toggleTodayCompletion);
  const archiveTask = useTaskStore((s) => s.archiveTask);
  const unarchiveTask = useTaskStore((s) => s.unarchiveTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const reorderAll = useTaskStore((s) => s.reorderAll);
  const skipTask = useTaskStore((s) => s.skipTask);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const confettiEnabled = useSettingsStore((s) => s.confettiEnabled);
  const dailyTaskGoal = useSettingsStore((s) => s.dailyTaskGoal);
  const addReflection = useReflectionStore((s) => s.addEntry);

  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortBy, setSortBy] = useState<SortBy>("smart");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"active" | "archive">("active");
  const [undo, setUndo] = useState<{ taskId: string; message: string } | null>(null);
  const [skippedFocusId, setSkippedFocusId] = useState<string | undefined>(undefined);
  const [skipReasonTaskId, setSkipReasonTaskId] = useState<string | undefined>(undefined);

  const todayKey = toDateKey();
  const activeTasks = getActiveTasks(tasks);
  const visibleTasks = getTodaysTasks(tasks, todayKey);
  const filtered = filterTasks(visibleTasks, filters);
  const sorted = sortTasks(filtered, sortBy);
  const draggable = sortBy === "manual" && !filters.category && !filters.priority && !filters.difficulty;

  const focusPick = getFocusPick(tasks, skippedFocusId) ?? getFocusPick(tasks);

  const completedToday = tasks.filter((t) => isTaskCompletedOn(t, todayKey)).length;
  const totalToday = visibleTasks.length;
  const streak = calculateGoalStreak(tasks, dailyTaskGoal).current;

  function handleComplete(id: string) {
    completeTask(id);
    if (confettiEnabled) fireTaskCompleteConfetti();
    if (soundEnabled) playCompletionChime();
    setUndo({ taskId: id, message: getRandomCompletionLine() });
  }

  function handleToggleToday(id: string) {
    const task = tasks.find((t) => t.id === id);
    const wasDone = task ? isTaskCompletedOn(task, todayKey) : false;
    toggleTodayCompletion(id);
    if (!wasDone) {
      if (confettiEnabled) fireTaskCompleteConfetti();
      if (soundEnabled) playCompletionChime();
    }
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
    selectedIds.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task?.schedule) toggleTodayCompletion(id);
      else completeTask(id);
    });
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
          <MomentumBar completedToday={completedToday} totalToday={totalToday} streak={streak} />

          {focusPick ? (
            <FocusPickCard
              task={focusPick}
              canShowAnother={activeTasks.length > 1}
              onAnother={() => {
                skipTask(focusPick.id);
                setSkippedFocusId(focusPick.id);
                setSkipReasonTaskId(focusPick.id);
              }}
            />
          ) : (
            <NoTasksNudge
              onAddTask={() => {
                setEditingTask(undefined);
                setDialogOpen(true);
              }}
            />
          )}

          <BrainDumpInput />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
              title="Clean slate"
              description="Add one task and take the first step — momentum starts with a single done."
            />
          ) : (
            <TaskList
              tasks={sorted}
              draggable={draggable}
              selectedIds={selectedIds}
              onSelectChange={toggleSelect}
              onComplete={handleComplete}
              onUncomplete={uncompleteTask}
              onToggleToday={handleToggleToday}
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

      <SkipReasonDialog
        open={!!skipReasonTaskId}
        taskTitle={tasks.find((t) => t.id === skipReasonTaskId)?.title ?? ""}
        onOpenChange={(open) => !open && setSkipReasonTaskId(undefined)}
        onSelect={(reason) =>
          skipReasonTaskId && addReflection({ context: "skip", reason, taskId: skipReasonTaskId })
        }
      />

      {undo && (
        <UndoToast
          message={undo.message}
          onUndo={() => uncompleteTask(undo.taskId)}
          onDismiss={() => setUndo(null)}
        />
      )}
    </div>
  );
}
