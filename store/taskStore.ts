import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, SubTask } from "@/types";
import { generateId } from "@/lib/id";
import { getNextOrder } from "@/lib/tasks";

interface TaskState {
  tasks: Task[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "status" | "subtasks" | "tags" | "order"> & {
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
          status: "active",
          dueDate: input.dueDate,
          estimatedMinutes: input.estimatedMinutes,
          subtasks: input.subtasks ?? [],
          tags: input.tags ?? [],
          order: getNextOrder(get().tasks),
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

      resetAll: () => set({ tasks: [] }),
    }),
    {
      name: "flowstate-tasks",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
