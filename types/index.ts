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
  /**
   * Local date keys this task was due on and *not* done — written once, at
   * day-seal, and never rewritten. This is the permanent record of a broken
   * promise: it drives the debt UI, and it pins history in place so carrying
   * a task forward can never retroactively turn a failed day into a clean one.
   */
  missedDays: string[];
  /** The date this task was originally promised for, kept across every carry-forward. */
  originalDueDate?: string;
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
  pomodoroWork: number; // minutes
  pomodoroBreak: number;
  pomodoroLongBreak: number;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  desktopNotificationsEnabled: boolean;
  ambientSound: AmbientSound;
  timerSoundType: TimerSoundType;
  autoStartNext: boolean;
  firstDayOfWeek: FirstDayOfWeek;
  commitTaskId?: string;
  commitDate?: string; // local date key, YYYY-MM-DD
  /** How hard the accountability system is allowed to hit. See `lib/guilt.ts`. */
  guiltIntensity: GuiltIntensity;
  /** The user's own answer to "what are you actually doing this for" — quoted back at them when they slip. */
  why?: string;
  whySetAt?: string; // ISO
}

/**
 * How blunt the accountability copy gets. This is a real setting, not a
 * decoration: "brutal" is opt-in on purpose, because language that lands as
 * a push for one person lands as a kick for another.
 */
export type GuiltIntensity = "gentle" | "honest" | "brutal";

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

export type XpSource = "task" | "habit" | "focus" | "perfectDay" | "milestone";

export interface XpEvent {
  id: string;
  source: XpSource;
  amount: number;
  label: string;
  at: string; // ISO
}

/**
 * How a closed day is judged. `empty` means nothing was ever due — that is
 * never held against anyone, because guilt you didn't earn is just noise,
 * and noise is what people learn to ignore.
 */
export type DayVerdict = "clean" | "partial" | "broken" | "empty";

/** One task that was due on a sealed day and wasn't done, frozen at seal time. */
export interface MissedTaskRecord {
  taskId: string;
  title: string;
  priority: Priority;
  /** XP this task would have paid out had it been finished. */
  xpForfeited: number;
  /** How many times this exact task had already been missed when the day closed. */
  timesMissedBefore: number;
  /** Whether this was the task the user explicitly locked in for that day. */
  wasCommitment: boolean;
  /** Scheduled tasks recur on their own, so they're never offered a carry-forward. */
  recurring: boolean;
}

/**
 * An immutable verdict on one finished day. Written once when the day is
 * sealed and never edited again — the whole emotional weight of the system
 * rests on the fact that a closed day cannot be quietly rewritten later.
 */
export interface DayRecord {
  date: string; // local date key, YYYY-MM-DD
  verdict: DayVerdict;
  dueCount: number;
  doneCount: number;
  missed: MissedTaskRecord[];
  focusMinutes: number;
  habitsDue: number;
  habitsDone: number;
  xpEarned: number;
  xpForfeited: number;
  commitmentTitle?: string;
  commitmentKept?: boolean;
  /** The Perfect Day streak that was running when this day began. */
  streakBefore: number;
  /** The user's stated "why" at the time, so the reckoning quotes what they meant then. */
  whyAtTheTime?: string;
  /** True once the user has actually looked this day in the face. */
  acknowledged: boolean;
  sealedAt: string; // ISO
}
