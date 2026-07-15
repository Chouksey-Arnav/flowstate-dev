"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, MoreVertical, Pencil, Archive, ArchiveRestore, Trash2, Clock, Zap, Check, Timer, Target, Sparkles, Repeat, Gift } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityBadge } from "./priority-badge";
import { DifficultyBadge } from "./difficulty-badge";
import { CategoryBadge } from "./category-badge";
import { OverdueBadge } from "./overdue-badge";
import { AvoidedBadge } from "./avoided-badge";
import { SubtaskList } from "./subtask-list";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/dates";
import { isOverdue } from "@/lib/overdue";
import { getAvoidanceScore, daysSinceCreated, AVOIDANCE_THRESHOLD, isTaskCompletedOn, getScheduleDayLabel } from "@/lib/tasks";
import { xpForTask } from "@/lib/xp";
import { toDateKey } from "@/lib/dates";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  draggable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onComplete: () => void;
  onUncomplete: () => void;
  onToggleToday?: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  dragHandlers?: {
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

export function TaskItem({
  task,
  draggable,
  selected,
  onSelectChange,
  onComplete,
  onUncomplete,
  onToggleToday,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onToggleSubtask,
  dragHandlers,
}: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const setPomodoroTaskId = usePomodoroStore((s) => s.setTaskId);
  const setCommitment = useSettingsStore((s) => s.setCommitment);
  const commitTaskId = useSettingsStore((s) => s.commitTaskId);
  const commitDate = useSettingsStore((s) => s.commitDate);
  const today = toDateKey();
  const archived = task.status === "archived";
  const completed = task.schedule ? isTaskCompletedOn(task, today) : task.status === "completed";
  const scheduleLabel = task.schedule ? getScheduleDayLabel(task.schedule, today) : null;

  function handleToggle() {
    if (task.schedule) {
      onToggleToday?.();
    } else if (completed) {
      onUncomplete();
    } else {
      onComplete();
    }
  }
  const overdue = isOverdue(task);
  const subtaskDone = task.subtasks.filter((s) => s.completed).length;
  const quickWin = !completed && !!task.estimatedMinutes && task.estimatedMinutes <= 15;
  const avoided = !completed && !archived && getAvoidanceScore(task) >= AVOIDANCE_THRESHOLD;
  const taskXp = xpForTask(task);
  const isTodaysFocus = commitTaskId === task.id && commitDate === toDateKey();

  const PRIORITY_ACCENT: Record<string, string> = {
    HIGH: "border-l-flow-red",
    MEDIUM: "border-l-flow-yellow",
    LOW: "border-l-border",
  };

  function startFocus(e: React.MouseEvent) {
    e.stopPropagation();
    setPomodoroTaskId(task.id);
    router.push(`/focus?taskId=${task.id}`);
  }

  return (
    <div
      draggable={draggable}
      onDragStart={dragHandlers?.onDragStart}
      onDragOver={dragHandlers?.onDragOver}
      onDrop={dragHandlers?.onDrop}
      className={cn(
        "group rounded-xl border border-l-[3px] border-border/60 bg-card p-3.5 shadow-card transition-all hover:border-border hover:shadow-card-hover",
        PRIORITY_ACCENT[task.priority],
        overdue && !completed && "bg-flow-red/[0.03]",
        completed && "border-l-flow-green bg-flow-green/5 opacity-60 hover:shadow-card"
      )}
    >
      <div className="flex items-start gap-3">
        {draggable && <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />}
        {onSelectChange && (
          <Checkbox
            checked={selected}
            onCheckedChange={(v) => onSelectChange(Boolean(v))}
            title="Select for bulk actions"
            className="mt-1 rounded-[3px] border-muted-foreground/40"
          />
        )}
        <Checkbox
          checked={completed}
          onCheckedChange={handleToggle}
          title={completed ? "Uncheck today" : task.schedule ? "Check off today" : "Mark complete"}
          className={cn(
            "mt-1 rounded-full transition-transform",
            completed && "border-flow-green bg-flow-green text-primary-foreground"
          )}
        />

        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
          <p className={cn("text-sm font-medium text-foreground transition-colors", completed && "line-through decoration-flow-green/70 text-muted-foreground")}>
            {task.title}
          </p>
          {task.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
            <DifficultyBadge difficulty={task.difficulty} />
            {overdue && <OverdueBadge />}
            {avoided && <AvoidedBadge days={daysSinceCreated(task)} />}
            {isTodaysFocus && !completed && (
              <span className="flex items-center gap-1 rounded-full border border-flow-red/30 bg-flow-red/10 px-2 py-0.5 text-xs font-medium text-flow-red">
                <Target className="h-3 w-3" /> Today&apos;s focus
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
              <Sparkles className="h-3 w-3" /> {taskXp} XP
            </span>
            {quickWin && (
              <span className="flex items-center gap-1 rounded-full border border-flow-blue/30 bg-flow-blue/10 px-2 py-0.5 text-xs font-medium text-flow-blue">
                <Zap className="h-3 w-3" /> Quick win
              </span>
            )}
            {scheduleLabel && (
              <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                <Repeat className="h-3 w-3" /> {scheduleLabel}
              </span>
            )}
            {completed && (
              <span className="flex items-center gap-1 rounded-full border border-flow-green/30 bg-flow-green/10 px-2 py-0.5 text-xs font-medium text-flow-green">
                <Check className="h-3 w-3" /> {task.schedule ? "Done today" : "Done"}
              </span>
            )}
            {task.dueDate && (
              <span className="text-xs text-muted-foreground">{formatDisplayDate(task.dueDate)}</span>
            )}
            {task.estimatedMinutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {task.estimatedMinutes}m
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {subtaskDone}/{task.subtasks.length} subtasks
              </span>
            )}
            {task.reward && (
              <span className="flex max-w-[220px] items-center gap-1 truncate rounded-full border border-flow-yellow/30 bg-flow-yellow/10 px-2 py-0.5 text-xs font-medium text-flow-yellow">
                <Gift className="h-3 w-3 shrink-0" /> <span className="truncate">{task.reward}</span>
              </span>
            )}
          </div>
          {task.subtasks.length > 0 && (
            <div className="mt-2 h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-flow-green transition-all duration-300"
                style={{ width: `${(subtaskDone / task.subtasks.length) * 100}%` }}
              />
            </div>
          )}
          {expanded && task.subtasks.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <SubtaskList subtasks={task.subtasks} onToggle={onToggleSubtask} />
            </div>
          )}
        </div>

        {!completed && !archived && (
          <Button
            variant="ghost"
            size="icon"
            title="Start a focus session for this task"
            className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary focus-visible:opacity-100"
            onClick={startFocus}
          >
            <Timer className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!completed && !archived && (
              <DropdownMenuItem onClick={() => setCommitment(task.id, toDateKey())}>
                <Target className="mr-2 h-4 w-4" /> {isTodaysFocus ? "Today's focus" : "Do this next"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {archived ? (
              <DropdownMenuItem onClick={onUnarchive}>
                <ArchiveRestore className="mr-2 h-4 w-4" /> Unarchive
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-flow-red">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
