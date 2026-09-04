import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";
import type { Task, SubTask, Difficulty } from "@/types";
import { generateId } from "@/lib/id";
import { getNextOrder, isTaskCompletedOn } from "@/lib/tasks";
import { toDateKey } from "@/lib/dates";
import { xpForTask, xpForPerfectDay } from "@/lib/xp";
import { isPerfectDayComplete, calculatePerfectDayStreak } from "@/lib/streaks";
import { useXpStore } from "./xpStore";

interface TaskState {
  tasks: Task[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "status" | "subtasks" | "tags" | "order" | "timesSkipped" | "difficulty" | "xpOverride" | "completions" | "missedDays" | "originalDueDate"> & {
    difficulty?: Difficulty;
    subtasks?: SubTask[];
    tags?: string[];
    xpOverride?: number;
  }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  /** Checks/unchecks a scheduled (recurring) task for one specific day without ever removing it from the list. */
  toggleTodayCompletion: (id: string, dateKey?: string) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  reorderAll: (tasks: Task[]) => void;
  clearCompleted: () => void;
  skipTask: (id: string) => void;
  /**
   * Writes the permanent record of a broken promise. Append-only and
   * idempotent — a day can never be marked missed twice, and a miss can
   * never be erased by later edits.
   */
  recordMissedDay: (taskIds: string[], dateKey: string) => void;
  /** Re-dues missed tasks for today. The miss stays on the record; only the deadline moves. */
  carryForward: (taskIds: string[], dateKey?: string) => void;
  /** Explicitly gives up on tasks instead of pretending they'll happen — archives them. */
  letGo: (taskIds: string[]) => void;
  resetAll: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addTask: (input) => {
        const task: Task = {
          id: generateId(),
          title: input.title,
          description: input.description,
          category: input.category,
          priority: input.priority,
          difficulty: input.difficulty ?? "MEDIUM",
          status: "active",
          dueDate: input.dueDate,
          estimatedMinutes: input.estimatedMinutes,
          subtasks: input.subtasks ?? [],
          tags: input.tags ?? [],
          order: getNextOrder(get().tasks),
          timesSkipped: 0,
          createdAt: new Date().toISOString(),
          xpOverride: input.xpOverride,
          reward: input.reward,
          schedule: input.schedule,
          completions: [],
          missedDays: [],
          originalDueDate: input.dueDate,
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task || task.status === "completed") return;

        const todayKey = toDateKey();
        const wasPerfectBefore = isPerfectDayComplete(get().tasks, todayKey);

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t
          ),
        }));

        useXpStore.getState().awardXp(xpForTask(task), "task", `Completed "${task.title}"`);

        if (!wasPerfectBefore && isPerfectDayComplete(get().tasks, todayKey)) {
          const streak = calculatePerfectDayStreak(get().tasks);
          useXpStore.getState().awardXp(
            xpForPerfectDay(streak.current),
            "perfectDay",
            "Perfect day — everything due today, done!"
          );
        }
      },

      uncompleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task || task.status !== "completed") return;

        const todayKey = toDateKey();
        const wasCompletedToday = !!task.completedAt && toDateKey(new Date(task.completedAt)) === todayKey;
        const wasPerfectBefore = isPerfectDayComplete(get().tasks, todayKey);
        const streakBefore = calculatePerfectDayStreak(get().tasks);

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "active", completedAt: undefined } : t
          ),
        }));

        useXpStore.getState().revokeXp(xpForTask(task), "task", `Unchecked "${task.title}"`);

        if (wasCompletedToday && wasPerfectBefore) {
          useXpStore.getState().revokeXp(
            xpForPerfectDay(streakBefore.current),
            "perfectDay",
            "Lost today's perfect-day bonus"
          );
        }
      },

      toggleTodayCompletion: (id, dateKey = toDateKey()) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        const wasDone = isTaskCompletedOn(task, dateKey);
        const asOf = new Date(`${dateKey}T00:00:00`);
        const wasPerfectBefore = isPerfectDayComplete(get().tasks, dateKey);
        const streakBefore = calculatePerfectDayStreak(get().tasks, asOf);

        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const completions = wasDone
              ? t.completions.filter((k) => k !== dateKey)
              : [...t.completions, dateKey];
            return { ...t, completions };
          }),
        }));

        if (wasDone) {
          useXpStore.getState().revokeXp(xpForTask(task), "task", `Unchecked "${task.title}"`);
          if (wasPerfectBefore) {
            useXpStore.getState().revokeXp(
              xpForPerfectDay(streakBefore.current),
              "perfectDay",
              "Lost today's perfect-day bonus"
            );
          }
          return;
        }

        useXpStore.getState().awardXp(xpForTask(task), "task", `Completed "${task.title}"`);

        if (!wasPerfectBefore && isPerfectDayComplete(get().tasks, dateKey)) {
          const streak = calculatePerfectDayStreak(get().tasks, asOf);
          useXpStore.getState().awardXp(
            xpForPerfectDay(streak.current),
            "perfectDay",
            "Perfect day — everything due today, done!"
          );
        }
      },

      archiveTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: "archived" } : t)),
        })),

      unarchiveTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: "active" } : t)),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : t
          ),
        })),

      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, { id: generateId(), title, completed: false }] }
              : t
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) }
              : t
          ),
        })),

      reorderAll: (tasks) => set({ tasks }),

      clearCompleted: () =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.status !== "completed") })),

      skipTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, timesSkipped: t.timesSkipped + 1 } : t
          ),
        })),

      recordMissedDay: (taskIds, dateKey) => {
        const ids = new Set(taskIds);
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (!ids.has(t.id)) return t;
            const missedDays = t.missedDays ?? [];
            if (missedDays.includes(dateKey)) return t;
            return {
              ...t,
              missedDays: [...missedDays, dateKey].sort(),
              originalDueDate: t.originalDueDate ?? t.dueDate ?? dateKey,
            };
          }),
        }));
      },

      carryForward: (taskIds, dateKey = toDateKey()) => {
        const ids = new Set(taskIds);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            // Scheduled tasks recur on their own — moving their due date would
            // corrupt the recurrence window, so they're left alone.
            ids.has(t.id) && t.status === "active" && !t.schedule
              ? { ...t, dueDate: dateKey, originalDueDate: t.originalDueDate ?? t.dueDate }
              : t
          ),
        }));
      },

      letGo: (taskIds) => {
        const ids = new Set(taskIds);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            ids.has(t.id) && t.status === "active" ? { ...t, status: "archived" } : t
          ),
        }));
      },

      resetAll: () => set({ tasks: [] }),
    }),
    {
      name: "flowstate-tasks",
      storage: createJSONStorage(() => supabaseKvStorage),
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as { tasks?: Partial<Task>[] };
        const tasks: Task[] = (state.tasks ?? []).map((t) => ({
          difficulty: "MEDIUM" as Difficulty,
          timesSkipped: 0,
          completions: [],
          ...t,
          // Existing tasks start with a clean record — the accountability
          // ledger only ever judges days it actually watched.
          missedDays: t.missedDays ?? [],
          originalDueDate: t.originalDueDate ?? t.dueDate,
        })) as Task[];
        return { ...state, tasks };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
