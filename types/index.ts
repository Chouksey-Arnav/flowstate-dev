export type Category =
  | "Business"
  | "CAC/Projects"
  | "Learning"
  | "Personal"
  | "Other";

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type TaskStatus = "active" | "completed" | "archived";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string; // local date key, YYYY-MM-DD
  estimatedMinutes?: number;
  subtasks: SubTask[];
  tags: string[];
  order: number;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

export type HabitCategory = "Health" | "Business" | "Learning" | "Mental" | "Misc";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  completions: string[]; // local date keys, YYYY-MM-DD
  order: number;
  createdAt: string;
}

export type FocusSessionType = "pomodoro" | "custom";

export interface FocusSession {
  id: string;
  taskId?: string;
  durationMinutes: number;
  type: FocusSessionType;
  startedAt: string; // ISO
  endedAt: string; // ISO
}

export type TimerSoundType = "bell" | "digital" | "silent";
export type AmbientSound = "none" | "lofi" | "rain" | "white" | "brown";
export type FirstDayOfWeek = "sunday" | "monday";

export interface Settings {
  name: string;
  dailyGoal: string;
  pomodoroWork: number; // minutes
  pomodoroBreak: number;
  pomodoroLongBreak: number;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  ambientSound: AmbientSound;
  timerSoundType: TimerSoundType;
  autoStartNext: boolean;
  firstDayOfWeek: FirstDayOfWeek;
}

export type SortBy = "smart" | "dueDate" | "priority" | "created" | "manual";

export interface TaskFilters {
  category?: Category;
  priority?: Priority;
  status?: TaskStatus;
}
