"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TaskItem } from "./item";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  draggable?: boolean;
  selectedIds?: Set<string>;
  onSelectChange?: (id: string, selected: boolean) => void;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onToggleToday?: (id: string) => void;
  onEdit: (task: Task) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onReorder?: (draggedId: string, targetId: string) => void;
}

export function TaskList({
  tasks,
  draggable,
  selectedIds,
  onSelectChange,
  onComplete,
  onUncomplete,
  onToggleToday,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onToggleSubtask,
  onReorder,
}: TaskListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <TaskItem
              task={task}
              draggable={draggable}
              selected={selectedIds?.has(task.id)}
              onSelectChange={onSelectChange ? (v) => onSelectChange(task.id, v) : undefined}
              onComplete={() => onComplete(task.id)}
              onUncomplete={() => onUncomplete(task.id)}
              onToggleToday={onToggleToday ? () => onToggleToday(task.id) : undefined}
              onEdit={() => onEdit(task)}
              onArchive={() => onArchive(task.id)}
              onUnarchive={() => onUnarchive(task.id)}
              onDelete={() => onDelete(task.id)}
              onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
              dragHandlers={
                draggable && onReorder
                  ? {
                      onDragStart: () => setDraggedId(task.id),
                      onDragOver: (e) => e.preventDefault(),
                      onDrop: (e) => {
                        e.preventDefault();
                        if (draggedId && draggedId !== task.id) onReorder(draggedId, task.id);
                        setDraggedId(null);
                      },
                    }
                  : undefined
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
