import {
  BarChart3,
  Check,
  Flame,
  LayoutDashboard,
  ListTodo,
  Play,
  Sparkles,
  Timer,
} from "lucide-react";
import { LogoMark } from "@/components/marketing/logo-mark";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ListTodo, label: "Tasks", active: false },
  { icon: Timer, label: "Focus", active: false },
  { icon: Flame, label: "Habits", active: false },
  { icon: BarChart3, label: "Stats", active: false },
];

const TOP_TASKS = [
  {
    title: "Call the dentist you've dodged 4 times",
    done: false,
    accent: "border-l-flow-red",
    tags: [
      { label: "Admin", className: "bg-flow-yellow/15 text-flow-yellow" },
      { label: "High", className: "border border-flow-red/30 text-flow-red" },
      { label: "30 XP", className: "border border-primary/30 bg-primary/10 text-primary" },
      { label: "Avoided 6d", className: "border border-flow-red/30 bg-flow-red/10 text-flow-red" },
    ],
  },
  {
    title: "Draft the Q3 proposal outline",
    done: false,
    accent: "border-l-flow-yellow",
    tags: [
      { label: "Work", className: "bg-flow-blue/15 text-flow-blue" },
      { label: "Hard", className: "border border-border text-muted-foreground" },
      { label: "52 XP", className: "border border-primary/30 bg-primary/10 text-primary" },
    ],
  },
  {
    title: "Inbox to zero",
    done: true,
    accent: "border-l-flow-green",
    tags: [
      { label: "Done", className: "border border-flow-green/30 bg-flow-green/10 text-flow-green" },
      { label: "Quick win", className: "border border-flow-blue/30 bg-flow-blue/10 text-flow-blue" },
    ],
  },
];

export function AppPreview() {
  return (
    <div className="mx-auto mt-2 max-w-6xl px-6">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card to-background shadow-[0_40px_120px_-40px_hsl(var(--primary)/0.4),0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        {/* window bar */}
        <div className="flex items-center gap-3.5 border-b border-border/60 bg-background/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-flow-red" />
            <span className="h-3 w-3 rounded-full bg-flow-yellow" />
            <span className="h-3 w-3 rounded-full bg-flow-green" />
          </div>
          <div className="mx-auto hidden max-w-xs flex-1 rounded-md border border-border/60 bg-secondary/50 px-3.5 py-1 text-center font-mono text-xs text-muted-foreground sm:block">
            flowstate.app/dashboard
          </div>
          <div className="w-[60px] shrink-0 sm:block hidden" />
        </div>

        {/* app body */}
        <div className="flex min-h-[420px] sm:min-h-[520px]">
          {/* sidebar */}
          <aside className="hidden w-[210px] shrink-0 flex-col gap-1.5 border-r border-border/60 bg-background/40 p-3.5 sm:flex">
            <div className="flex items-center gap-2 px-2 pb-3.5 pt-1">
              <LogoMark className="h-7 w-7" />
              <span className="text-[15px] font-bold">FlowState</span>
            </div>
            {SIDEBAR_ITEMS.map((item) => (
              <span
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium ${
                  item.active ? "bg-primary/15 text-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${item.active ? "text-primary" : ""}`} />
                {item.label}
              </span>
            ))}
            <div className="mt-auto border-t border-border/60 pt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Level 15
                </span>
                <span className="text-muted-foreground">Relentless</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-card px-2 py-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                  @
                </span>
                <span className="text-xs font-semibold">arnav</span>
              </div>
            </div>
          </aside>

          {/* main */}
          <main className="flex flex-1 flex-col gap-4 bg-background/60 p-4 sm:p-6">
            <div>
              <p className="text-lg font-bold tracking-tight sm:text-xl">Good evening, @arnav.</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Day 193 of 365 · 4 tasks left · the list won&apos;t shrink by staring at it.
              </p>
            </div>

            {/* level hero */}
            <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 via-card to-card p-4 sm:p-5">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative h-[70px] w-[70px] shrink-0 sm:h-[78px] sm:w-[78px]">
                <svg viewBox="0 0 96 96" className="-rotate-90">
                  <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="7" />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#hero-level-ring)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="263.9"
                    strokeDashoffset="74"
                  />
                  <defs>
                    <linearGradient id="hero-level-ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="hsl(var(--primary))" />
                      <stop offset="1" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold leading-none sm:text-2xl">15</span>
                  <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Level</span>
                </div>
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" />
                  Relentless
                </div>
                <p className="mt-1 text-lg font-extrabold tracking-tight sm:text-xl">
                  14,320 <span className="text-sm font-medium text-muted-foreground">total XP</span>
                </p>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
                <p className="mt-1.5 text-[11.5px] text-muted-foreground">2,140 / 2,980 XP to level 16</p>
              </div>
              <div className="relative hidden shrink-0 items-center gap-2 rounded-xl border border-flow-green/30 bg-flow-green/10 px-3.5 py-2.5 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-flow-green/15">
                  <Check className="h-3.5 w-3.5 text-flow-green" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-[17px] font-extrabold leading-none text-flow-green">+320</p>
                  <p className="mt-0.5 text-[9.5px] uppercase tracking-wide text-muted-foreground">XP today</p>
                </div>
              </div>
            </div>

            {/* streak + pomodoro row */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-flow-yellow/25 bg-gradient-to-br from-flow-yellow/10 via-card to-card p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-flow-yellow/15 shadow-[0_0_24px_-6px_hsl(45,93%,47%,0.6)]">
                  <Flame className="h-6 w-6 animate-flame-flicker text-flow-yellow" fill="currentColor" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold leading-none">
                    14 <span className="text-sm font-medium text-muted-foreground">day streak</span>
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-flow-yellow">Personal best!</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4">
                <div className="relative h-[66px] w-[66px] shrink-0 sm:h-[74px] sm:w-[74px]">
                  <svg viewBox="0 0 96 96" className="-rotate-90">
                    <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="263.9"
                      strokeDashoffset="100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold sm:text-base">
                    18:42
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-accent">Focus session</p>
                  <p className="mt-1 truncate text-sm font-semibold">Ship landing page</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                    <Play className="h-3 w-3" fill="currentColor" />
                    Running
                  </div>
                </div>
              </div>
            </div>

            {/* top tasks */}
            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Top 3 for today</p>
                <span className="text-xs text-muted-foreground/70">1 avoided</span>
              </div>
              <div className="flex flex-col gap-2">
                {TOP_TASKS.map((task) => (
                  <div
                    key={task.title}
                    className={`flex items-start gap-2.5 rounded-xl border border-border/60 border-l-[3px] bg-background/60 p-3 ${task.accent} ${
                      task.done ? "opacity-70" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full ${
                        task.done ? "bg-flow-green" : "border-2 border-muted-foreground/40"
                      }`}
                    >
                      {task.done && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13.5px] font-medium ${task.done ? "text-muted-foreground line-through" : ""}`}>
                        {task.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {task.tags.map((tag) => (
                          <span key={tag.label} className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${tag.className}`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
