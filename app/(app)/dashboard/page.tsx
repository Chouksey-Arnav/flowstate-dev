"use client";

import { useTaskStore } from "@/store/taskStore";
import { useHabitStore } from "@/store/habitStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { Greeting } from "@/components/dashboard/greeting";
import { DateCounter } from "@/components/dashboard/date-counter";
import { StreakCard } from "@/components/dashboard/streak-card";
import { DailyGoalEditable } from "@/components/dashboard/daily-goal-editable";
import { TopTasksCard } from "@/components/dashboard/top-tasks-card";
import { PomodoroMiniWidget } from "@/components/dashboard/pomodoro-mini-widget";
import { MotivationalQuote } from "@/components/dashboard/motivational-quote";
import { CommitmentCard } from "@/components/dashboard/commitment-card";
import { AvoidedTasksCard } from "@/components/dashboard/avoided-tasks-card";
import { ReflectionInsightCard } from "@/components/dashboard/reflection-insight-card";
import { TodayProgressCard } from "@/components/dashboard/today-progress-card";
import { HabitStatusRow } from "@/components/dashboard/habit-status-row";
import { WeeklyChartMini } from "@/components/dashboard/weekly-chart-mini";
import { QuickAddButton } from "@/components/dashboard/quick-add-button";
import { getTopTasks, getActiveTasks, getAvoidedTasks } from "@/lib/tasks";
import { calculateTaskStreak } from "@/lib/streaks";
import { getWeeklySeries } from "@/lib/stats";
import { getDashboardQuote } from "@/lib/quotes";
import { toDateKey } from "@/lib/dates";

export default function DashboardPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const completeTask = useTaskStore((s) => s.completeTask);
  const habits = useHabitStore((s) => s.habits);
  const reflectionEntries = useReflectionStore((s) => s.entries);
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const name = useSettingsStore((s) => s.name);
  const firstDayOfWeek = useSettingsStore((s) => s.firstDayOfWeek);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const commitTaskId = useSettingsStore((s) => s.commitTaskId);
  const commitDate = useSettingsStore((s) => s.commitDate);
  const setCommitment = useSettingsStore((s) => s.setCommitment);

  const activeTasks = getActiveTasks(tasks);
  const topTasks = getTopTasks(tasks, 3);
  const avoidedTasks = getAvoidedTasks(tasks, 3);
  const streak = calculateTaskStreak(tasks);
  const weeklySeries = getWeeklySeries(tasks, firstDayOfWeek);

  const todayKey = toDateKey();
  const completedToday = tasks.filter(
    (t) => t.completedAt && toDateKey(new Date(t.completedAt)) === todayKey
  ).length;
  const totalToday = activeTasks.length + completedToday;

  const isCommittedToday = commitDate === todayKey && !!commitTaskId;
  const committedTask = tasks.find((t) => t.id === commitTaskId);
  const isCompletedToday = committedTask?.status === "completed";

  const streakAtRisk = streak.current > 0 && completedToday === 0 && new Date().getHours() >= 15;
  const quote = getDashboardQuote({ hasAvoidedTask: avoidedTasks.length > 0, streakAtRisk });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Greeting name={name} />
          <DateCounter />
        </div>
        <QuickAddButton />
      </div>

      <MotivationalQuote quote={quote} intense={avoidedTasks.length > 0 || streakAtRisk} />

      <CommitmentCard
        activeTasks={activeTasks}
        committedTask={committedTask}
        isCommittedToday={isCommittedToday}
        isCompletedToday={isCompletedToday}
        onCommit={(taskId) => setCommitment(taskId, todayKey)}
        onComplete={completeTask}
      />

      <AvoidedTasksCard tasks={avoidedTasks} />

      <ReflectionInsightCard entries={reflectionEntries} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StreakCard current={streak.current} best={streak.best} />
        <DailyGoalEditable goal={dailyGoal} onSave={(goal) => updateSettings({ dailyGoal: goal })} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TodayProgressCard completedToday={completedToday} totalToday={totalToday} />
        <PomodoroMiniWidget />
      </div>

      <TopTasksCard tasks={topTasks} onComplete={completeTask} />

      <HabitStatusRow habits={[...habits].sort((a, b) => a.order - b.order)} />

      <WeeklyChartMini data={weeklySeries} />
    </div>
  );
}
