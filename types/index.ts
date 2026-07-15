export type Category =
  | "Business"
  | "CAC/Projects"
  | "Learning"
  | "Personal"
  | "Other";

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type TaskStatus = "active" | "completed" | "archived";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

/** A task that recurs across consecutive days instead of being done once. */
export interface TaskSchedule {
  startDate: string; // local date key, YYYY-MM-DD
  /** How many consecutive days (including startDate) this task is active for. 1 = a single day. */
  repeatDays: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  difficulty: Difficulty;
  status: TaskStatus;
  dueDate?: string; // local date key, YYYY-MM-DD
  estimatedMinutes?: number;
  subtasks: SubTask[];
  tags: string[];
  order: number;
  timesSkipped: number;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp — one-off (non-scheduled) tasks only
  /** Manual XP override — when set, this exact amount is awarded instead of the computed value. */
  xpOverride?: number;
  /** Optional personal reward the user promises themselves for finishing this task — entirely optional, on top of XP. */
  reward?: string;
  /** When set, this task recurs across `schedule`'s window instead of being completed once. */
  schedule?: TaskSchedule;
  /**
   * Local date keys (YYYY-MM-DD) this task was checked off on. For scheduled
   * tasks this is the whole point — checking a day off never removes the
   * task, it just records that day as done and it can be unchecked any time.
   */
  completions: string[];
}

export type HabitCategory = "Health" | "Business" | "Learning" | "Mental" | "Misc";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  completions: string[]; // local date keys, YYYY-MM-DD
  /** How many days per week this habit is expected — 7 means every day. */
  timesPerWeek: number;
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
  /** Number of tasks you need to complete today to keep your streak alive. */
  dailyTaskGoal: number;
  pomodoroWork: number; // minutes
  pomodoroBreak: number;
  pomodoroLongBreak: number;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  ambientSound: AmbientSound;
  timerSoundType: TimerSoundType;
  autoStartNext: boolean;
  firstDayOfWeek: FirstDayOfWeek;
  commitTaskId?: string;
  commitDate?: string; // local date key, YYYY-MM-DD
}

export type SortBy = "smart" | "dueDate" | "priority" | "created" | "manual";

export interface TaskFilters {
  category?: Category;
  priority?: Priority;
  difficulty?: Difficulty;
  status?: TaskStatus;
}

/** Why someone is stalling, in their own words — kept short and honest. */
export type ReflectionReason =
  | "unclear-start"
  | "boredom-distraction"
  | "too-hard"
  | "low-energy"
  | "fear-perfectionism"
  | "not-urgent"
  | "other";

export type ReflectionContext = "skip" | "intention";

export interface ReflectionEntry {
  id: string;
  taskId?: string;
  context: ReflectionContext;
  reason: ReflectionReason;
  note?: string;
  /** For "intention" entries: the plan for when the urge to check a distraction hits. */
  ifUrgePlan?: string;
  createdAt: string; // ISO
}

/** A domain the user wants blocked on this machine, e.g. "youtube.com". */
export interface BlockedSite {
  id: string;
  domain: string;
}

export interface BlockerSchedule {
  enabled: boolean;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  days: number[]; // 0 (Sun) - 6 (Sat)
}

export type XpSource = "task" | "habit" | "focus" | "dailyGoal";

export interface XpEvent {
  id: string;
  source: XpSource;
  amount: number;
  label: string;
  at: string; // ISO
}
