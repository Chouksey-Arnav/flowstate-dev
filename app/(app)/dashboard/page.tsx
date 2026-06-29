"use client";

import { useTaskStore } from "@/store/taskStore";
import { useHabitStore } from "@/store/habitStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Greeting } from "@/components/dashboard/greeting";
import { DateCounter } from "@/components/dashboard/date-counter";
import { StreakCard } from "@/components/dashboard/streak-card";
import { DailyGoalEditable } from "@/components/dashboard/daily-goal-editable";
import { TopTasksCard } from "@/components/dashboard/top-tasks-card";
import { PomodoroMiniWidget } from "@/components/dashboard/pomodoro-mini-widget";
import { MotivationalQuote } from "@/components/dashboard/motivational-quote";
import { HabitStatusRow } from "@/components/dashboard/habit-status-row";
import { WeeklyChartMini } from "@/components/dashboard/weekly-chart-mini";
import { QuickAddButton } from "@/components/dashboard/quick-add-button";
import { getTopTasks } from "@/lib/tasks";
import { calculateTaskStreak } from "@/lib/streaks";
import { getWeeklySeries } from "@/lib/stats";

export default function DashboardPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const completeTask = useTaskStore((s) => s.completeTask);
  const habits = useHabitStore((s) => s.habits);
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const name = useSettingsStore((s) => s.name);
  const firstDayOfWeek = useSettingsStore((s) => s.firstDayOfWeek);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const topTasks = getTopTasks(tasks, 3);
  const streak = calculateTaskStreak(tasks);
  const weeklySeries = getWeeklySeries(tasks, firstDayOfWeek);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Greeting name={name} />
          <DateCounter />
        </div>
        <QuickAddButton />
      </div>

      <MotivationalQuote />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StreakCard current={streak.current} best={streak.best} />
        <DailyGoalEditable goal={dailyGoal} onSave={(goal) => updateSettings({ dailyGoal: goal })} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopTasksCard tasks={topTasks} onComplete={completeTask} />
        <PomodoroMiniWidget />
      </div>

      <HabitStatusRow habits={[...habits].sort((a, b) => a.order - b.order)} />

      <WeeklyChartMini data={weeklySeries} />
    </div>
  );
}
