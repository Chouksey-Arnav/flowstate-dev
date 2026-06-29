"use client";

import { useState } from "react";
import { HabitItem } from "./habit-item";
import type { Habit } from "@/types";

interface HabitListProps {
  habits: Habit[];
  weekDates: Date[];
  weekdayLabels: string[];
  onToggleDay: (habitId: string, dateKey: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
}

export function HabitList({
  habits,
  weekDates,
  weekdayLabels,
  onToggleDay,
  onEdit,
  onDelete,
  onReorder,
}: HabitListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          weekDates={weekDates}
          weekdayLabels={weekdayLabels}
          draggable
          onToggleDay={(dateKey) => onToggleDay(habit.id, dateKey)}
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit.id)}
          dragHandlers={{
            onDragStart: () => setDraggedId(habit.id),
            onDragOver: (e) => e.preventDefault(),
            onDrop: (e) => {
              e.preventDefault();
              if (draggedId && draggedId !== habit.id) onReorder(draggedId, habit.id);
              setDraggedId(null);
            },
          }}
        />
      ))}
    </div>
  );
}
