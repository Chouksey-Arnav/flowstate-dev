"use client";

import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { Plus, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HabitList } from "@/components/habits/habit-list";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { PerfectDayBadge } from "@/components/habits/perfect-day-badge";
import { useHabitStore } from "@/store/habitStore";
import { useSettingsStore } from "@/store/settingsStore";
import { getWeekStart, getWeekdayLabels, toDateKey } from "@/lib/dates";
import { isPerfectDay, reorderHabits } from "@/lib/habits";
import type { Habit } from "@/types";

export default function HabitsPage() {
  const habits = useHabitStore((s) => s.habits);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const reorderAll = useHabitStore((s) => s.reorderAll);
  const seedDefaultsIfEmpty = useHabitStore((s) => s.seedDefaultsIfEmpty);

  const firstDayOfWeek = useSettingsStore((s) => s.firstDayOfWeek);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  useEffect(() => {
    seedDefaultsIfEmpty();
  }, [seedDefaultsIfEmpty]);

  const weekStart = getWeekStart(firstDayOfWeek);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekdayLabels = getWeekdayLabels(firstDayOfWeek);
  const sorted = [...habits].sort((a, b) => a.order - b.order);
  const perfectDay = isPerfectDay(habits, toDateKey());

  function handleReorder(draggedId: string, targetId: string) {
    reorderAll(reorderHabits(habits, draggedId, targetId));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Habits</h1>
          {perfectDay && <PerfectDayBadge />}
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingHabit(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" /> New habit
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No habits yet"
          description="Add your first habit above to start building streaks."
        />
      ) : (
        <HabitList
          habits={sorted}
          weekDates={weekDates}
          weekdayLabels={weekdayLabels}
          onToggleDay={toggleCompletion}
          onEdit={(habit) => {
            setEditingHabit(habit);
            setDialogOpen(true);
          }}
          onDelete={deleteHabit}
          onReorder={handleReorder}
        />
      )}

      <HabitFormDialog open={dialogOpen} onOpenChange={setDialogOpen} habit={editingHabit} />
    </div>
  );
}
