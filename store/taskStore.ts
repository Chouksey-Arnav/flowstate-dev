import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, SubTask, Difficulty } from "@/types";
import { generateId } from "@/lib/id";
import { getNextOrder } from "@/lib/tasks";

interface TaskState {
  tasks: Task[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "status" | "subtasks" | "tags" | "order" | "timesSkipped" | "difficulty"> & {
    difficulty?: Difficulty;
    subtasks?: SubTask[];
    tags?: string[];
  }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
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

      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t
          ),
        })),

      uncompleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "active", completedAt: undefined } : t
          ),
        })),

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
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as { tasks?: Partial<Task>[] };
        const tasks: Task[] = (state.tasks ?? []).map((t) => ({
          difficulty: "MEDIUM" as Difficulty,
          timesSkipped: 0,
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
