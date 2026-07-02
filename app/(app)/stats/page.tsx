"use client";

import { CheckCircle2, Clock, Repeat, Flame } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useHabitStore } from "@/store/habitStore";
import { useFocusStore } from "@/store/focusStore";
import { useSettingsStore } from "@/store/settingsStore";
import { StatCard } from "@/components/stats/stat-card";
import { CategoryDonut } from "@/components/stats/category-donut";
import { WeeklyBarChart } from "@/components/stats/weekly-bar-chart";
import { Heatmap } from "@/components/stats/heatmap";
import { getCompletedTasks } from "@/lib/tasks";
import { calculateGoalStreak } from "@/lib/streaks";
import {
  getTotalFocusMinutes,
  getHabitCompletionRate,
  getCategoryBreakdown,
  getWeeklySeries,
} from "@/lib/stats";

export default function StatsPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const sessions = useFocusStore((s) => s.sessions);
  const firstDayOfWeek = useSettingsStore((s) => s.firstDayOfWeek);
  const dailyTaskGoal = useSettingsStore((s) => s.dailyTaskGoal);

  const completedTasks = getCompletedTasks(tasks);
  const streak = calculateGoalStreak(tasks, dailyTaskGoal);
  const totalFocusMinutes = getTotalFocusMinutes(sessions);
  const habitRate = getHabitCompletionRate(habits, 30);
  const categoryBreakdown = getCategoryBreakdown(tasks);
  const weeklySeries = getWeeklySeries(tasks, firstDayOfWeek);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Stats</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Tasks completed" value={String(completedTasks.length)} />
        <StatCard
          icon={Clock}
          label="Focus time"
          value={`${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m`}
        />
        <StatCard icon={Repeat} label="Habit rate (30d)" value={`${habitRate}%`} />
        <StatCard icon={Flame} label="Task streak" value={`${streak.current}d`} hint={`Best: ${streak.best}d`} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WeeklyBarChart data={weeklySeries} />
        <CategoryDonut data={categoryBreakdown} />
      </div>

      <Heatmap tasks={tasks} />
    </div>
  );
}
