"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence initial={false}>
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <HabitItem
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
