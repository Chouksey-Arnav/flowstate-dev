import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseKvStorage } from "@/lib/supabase/kvStorage";
import type { Task, SubTask, Difficulty } from "@/types";
import { generateId } from "@/lib/id";
import { getNextOrder, isTaskCompletedOn } from "@/lib/tasks";
import { toDateKey } from "@/lib/dates";
import { xpForTask, DAILY_GOAL_BONUS_XP } from "@/lib/xp";
import { useXpStore } from "./xpStore";
import { useSettingsStore } from "./settingsStore";

interface TaskState {
  tasks: Task[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "status" | "subtasks" | "tags" | "order" | "timesSkipped" | "difficulty" | "xpOverride" | "completions"> & {
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
          schedule: input.schedule,
          completions: [],
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
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t
          ),
        }));

        useXpStore.getState().awardXp(
          xpForTask(task),
          "task",
          `Completed "${task.title}"`
        );

        const todayKey = toDateKey();
        const completedToday = get().tasks.filter(
          (t) => t.completedAt && toDateKey(new Date(t.completedAt)) === todayKey
        ).length;
        const goal = useSettingsStore.getState().dailyTaskGoal;
        if (goal > 0 && completedToday === goal) {
          useXpStore.getState().awardXp(DAILY_GOAL_BONUS_XP, "dailyGoal", "Hit today's task goal!");
        }
      },

      uncompleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task || task.status !== "completed") return;

        const todayKey = toDateKey();
        const wasCompletedToday = !!task.completedAt && toDateKey(new Date(task.completedAt)) === todayKey;
        const goal = useSettingsStore.getState().dailyTaskGoal;
        const completedTodayBeforeUndo = get().tasks.filter(
          (t) => t.completedAt && toDateKey(new Date(t.completedAt)) === todayKey
        ).length;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "active", completedAt: undefined } : t
          ),
        }));

        useXpStore.getState().revokeXp(xpForTask(task), "task", `Unchecked "${task.title}"`);

        if (wasCompletedToday && goal > 0 && completedTodayBeforeUndo === goal) {
          useXpStore.getState().revokeXp(DAILY_GOAL_BONUS_XP, "dailyGoal", "Lost today's task goal bonus");
        }
      },

      toggleTodayCompletion: (id, dateKey = toDateKey()) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        const wasDone = isTaskCompletedOn(task, dateKey);
        const completedTodayBefore = get().tasks.filter((t) => isTaskCompletedOn(t, dateKey)).length;
        const goal = useSettingsStore.getState().dailyTaskGoal;

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
          if (goal > 0 && completedTodayBefore === goal) {
            useXpStore.getState().revokeXp(DAILY_GOAL_BONUS_XP, "dailyGoal", "Lost today's task goal bonus");
          }
          return;
        }

        useXpStore.getState().awardXp(xpForTask(task), "task", `Completed "${task.title}"`);

        if (goal > 0) {
          const completedToday = get().tasks.filter((t) => isTaskCompletedOn(t, dateKey)).length;
          if (completedToday === goal) {
            useXpStore.getState().awardXp(DAILY_GOAL_BONUS_XP, "dailyGoal", "Hit today's task goal!");
          }
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

      resetAll: () => set({ tasks: [] }),
    }),
    {
      name: "flowstate-tasks",
      storage: createJSONStorage(() => supabaseKvStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as { tasks?: Partial<Task>[] };
        const tasks: Task[] = (state.tasks ?? []).map((t) => ({
          difficulty: "MEDIUM" as Difficulty,
          timesSkipped: 0,
          completions: [],
          ...t,
        })) as Task[];
        return { ...state, tasks };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
