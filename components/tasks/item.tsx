"use client";

import { useState } from "react";
import { GripVertical, MoreVertical, Pencil, Archive, ArchiveRestore, Trash2, Clock, Zap, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityBadge } from "./priority-badge";
import { CategoryBadge } from "./category-badge";
import { OverdueBadge } from "./overdue-badge";
import { SubtaskList } from "./subtask-list";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/dates";
import { isOverdue } from "@/lib/overdue";
import type { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  draggable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onComplete: () => void;
  onUncomplete: () => void;
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
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onToggleSubtask,
  dragHandlers,
}: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const completed = task.status === "completed";
  const archived = task.status === "archived";
  const overdue = isOverdue(task);
  const subtaskDone = task.subtasks.filter((s) => s.completed).length;
  const quickWin = !completed && !!task.estimatedMinutes && task.estimatedMinutes <= 15;

  const PRIORITY_ACCENT: Record<string, string> = {
    HIGH: "border-l-flow-red",
    MEDIUM: "border-l-flow-yellow",
    LOW: "border-l-border",
  };

  return (
    <div
      draggable={draggable}
      onDragStart={dragHandlers?.onDragStart}
      onDragOver={dragHandlers?.onDragOver}
      onDrop={dragHandlers?.onDrop}
      className={cn(
        "rounded-lg border border-l-4 border-border bg-card p-3 shadow-sm transition-all hover:shadow-md",
        PRIORITY_ACCENT[task.priority],
        completed && "border-l-flow-green bg-flow-green/5 opacity-70 hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        {draggable && <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />}
        {onSelectChange && (
          <Checkbox
            checked={selected}
            onCheckedChange={(v) => onSelectChange(Boolean(v))}
            className="mt-1"
          />
        )}
        <Checkbox
          checked={completed}
          onCheckedChange={() => (completed ? onUncomplete() : onComplete())}
          className={cn(
            "mt-1 transition-transform",
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
            {overdue && <OverdueBadge />}
            {quickWin && (
              <span className="flex items-center gap-1 rounded-full border border-flow-blue/30 bg-flow-blue/10 px-2 py-0.5 text-xs font-medium text-flow-blue">
                <Zap className="h-3 w-3" /> Quick win
              </span>
            )}
            {completed && (
              <span className="flex items-center gap-1 rounded-full border border-flow-green/30 bg-flow-green/10 px-2 py-0.5 text-xs font-medium text-flow-green">
                <Check className="h-3 w-3" /> Done
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
          </div>
          {expanded && task.subtasks.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <SubtaskList subtasks={task.subtasks} onToggle={onToggleSubtask} />
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
