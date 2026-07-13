import { BarChart3, Check, Flame, ListTodo, Pause, Play, Sparkles, Timer } from "lucide-react";
import { FeatureRow } from "@/components/marketing/feature-row";

export function FeaturesIntro() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 pt-10 text-center">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
        The system
      </span>
      <h2 className="mx-auto mt-4 max-w-[18ch] text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl md:text-5xl">
        Four tools. One loop that keeps you moving.
      </h2>
      <p className="mx-auto mt-4 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
        Capture the work, focus on one thing, show up daily, and see the proof. Each part feeds the next.
      </p>
    </section>
  );
}

export function TasksFeature() {
  return (
    <FeatureRow
      icon={ListTodo}
      eyebrow="Tasks"
      eyebrowClassName="bg-primary/12 text-primary"
      title="Kill the task you keep avoiding."
      description="Full CRUD with subtasks, categories, priorities, and due dates — plus a brain-dump box for rapid capture and drag-to-reorder when your head is finally clear."
      bulletClassName="text-primary"
      bullets={[
        "Avoidance scoring surfaces the task you've dodged too long",
        "Confetti, a chime, and an undo toast on every completion",
        "Filters, sorting, bulk actions, and an archive view",
      ]}
    >
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/60 px-3 py-2.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-[13px] text-muted-foreground">Brain-dump: type it all, sort it later…</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 border-l-[3px] border-l-flow-red bg-background/60 p-3">
            <span className="mt-0.5 h-[19px] w-[19px] shrink-0 rounded-full border-2 border-muted-foreground/40" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium">Submit the tax documents</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-flow-red/30 px-2 py-0.5 text-[10.5px] font-semibold text-flow-red">
                  High
                </span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
                  52 XP
                </span>
                <span className="rounded-full border border-flow-red/30 bg-flow-red/10 px-2 py-0.5 text-[10.5px] font-semibold text-flow-red">
                  Avoided 9d
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 border-l-[3px] border-l-flow-yellow bg-background/60 p-3">
            <span className="mt-0.5 h-[19px] w-[19px] shrink-0 rounded-full border-2 border-muted-foreground/40" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium">Reply to the recruiter</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-flow-blue/15 px-2 py-0.5 text-[10.5px] font-semibold text-flow-blue">
                  Work
                </span>
                <span className="rounded-full border border-flow-blue/30 bg-flow-blue/10 px-2 py-0.5 text-[10.5px] font-semibold text-flow-blue">
                  Quick win
                </span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
                  24 XP
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-flow-green/25 border-l-[3px] border-l-flow-green bg-flow-green/5 p-3 opacity-70">
            <span className="mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-flow-green">
              <Check className="h-3 w-3 text-background" strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-muted-foreground line-through">Book the flights</p>
              <div className="mt-1.5 h-1 w-28 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-full bg-flow-green" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}

export function FocusFeature() {
  return (
    <FeatureRow
      icon={Timer}
      eyebrow="Focus"
      eyebrowClassName="bg-accent/12 text-accent"
      title="One timer. Zero tabs open to nowhere."
      description="A drift-free Pomodoro — work, break, long-break — with an SVG ring, a session log, and a distraction-free Full Focus Mode. Ambient sound is synthesized live with the Web Audio API: no files, no embeds, no autoplay ads."
      bulletClassName="text-accent"
      reverse
      bullets={[
        "Timer keeps perfect time even if the tab sleeps",
        "Attach a task and an intention before you start",
        "Earns 2 XP per focused minute — time on task pays",
      ]}
    >
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card p-8 shadow-card">
        <div className="relative h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]">
          <svg viewBox="0 0 240 240" className="-rotate-90">
            <circle cx="120" cy="120" r="108" fill="none" stroke="hsl(var(--secondary))" strokeWidth="12" />
            <circle
              cx="120"
              cy="120"
              r="108"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="678.6"
              strokeDashoffset="230"
              style={{ filter: "drop-shadow(0 0 8px hsl(217,91%,63%,0.6))" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">18:42</span>
            <span className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">Focus</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
            <Pause className="h-[18px] w-[18px] fill-current" />
          </span>
          <span className="flex h-11 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[hsl(217,84%,52%)] shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.8)]">
            <Play className="h-[18px] w-[18px] fill-white text-white" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Timer className="h-[17px] w-[17px]" />
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["Lofi", "Rain", "Brown noise"].map((sound) => (
            <span
              key={sound}
              className="rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground"
            >
              {sound}
            </span>
          ))}
        </div>
      </div>
    </FeatureRow>
  );
}

const HABIT_ROWS = [
  {
    label: "Read 20 pages",
    streak: 28,
    days: [true, true, true, true, true, "today", false],
  },
  {
    label: "Workout",
    streak: 12,
    days: [true, false, true, true, false, "today", false],
  },
  {
    label: "Meditate",
    streak: 7,
    days: [true, true, true, false, true, "today", false],
  },
];

export function HabitsFeature() {
  return (
    <FeatureRow
      icon={Flame}
      eyebrow="Habits"
      eyebrowClassName="bg-flow-yellow/12 text-flow-yellow"
      title="Show up daily. Watch the chain grow."
      description="A weekly completion grid, current and best streaks with a flame that grows as you go, a Perfect Day badge for clearing them all, and six sensible defaults so you start with momentum, not a blank page."
      bulletClassName="text-flow-yellow"
      bullets={[
        "15 XP per check-in, streaks that visibly compound",
        "Drag to reorder, custom icons, weekly cadence",
        "Perfect Day badge when every habit is done",
      ]}
    >
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold">This week</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flow-green/12 px-2.5 py-1 text-[11.5px] font-bold text-flow-green">
            <Check className="h-3 w-3" strokeWidth={3} />
            Perfect Day
          </span>
        </div>
        <div className="flex flex-col gap-3.5">
          {HABIT_ROWS.map((habit) => (
            <div key={habit.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13.5px] font-medium">{habit.label}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-flow-yellow/25 bg-flow-yellow/10 px-2 py-0.5 text-[11px] font-bold text-flow-yellow">
                  <Flame className="h-2.5 w-2.5" fill="currentColor" />
                  {habit.streak}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {habit.days.map((day, i) =>
                  day === "today" ? (
                    <div key={i} className="h-[30px] rounded-lg border-[1.5px] border-primary/60 bg-primary/10" />
                  ) : day ? (
                    <div key={i} className="flex h-[30px] items-center justify-center rounded-lg bg-flow-green">
                      <Check className="h-3.5 w-3.5 text-background" strokeWidth={3} />
                    </div>
                  ) : (
                    <div key={i} className="h-[30px] rounded-lg border border-border/60 bg-background/40" />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureRow>
  );
}

export function StatsFeature() {
  const bars = [
    { day: "M", height: "42%" },
    { day: "T", height: "66%" },
    { day: "W", height: "52%" },
    { day: "T", height: "88%", highlight: true },
    { day: "F", height: "74%" },
    { day: "S", height: "34%" },
    { day: "S", height: "58%" },
  ];

  return (
    <FeatureRow
      icon={BarChart3}
      eyebrow="Stats"
      eyebrowClassName="bg-flow-green/12 text-flow-green"
      title="Receipts, not vibes."
      description="Completion rate, focus hours, habit consistency, and streaks — plus a category donut, a weekly bar chart, and a month-by-month heatmap. Proof you're moving, or proof you're stalling. Both are useful."
      bulletClassName="text-flow-green"
      reverse
      bullets={[
        "CSS-grid heatmap with month navigation",
        "Category breakdown so you see where time really goes",
        "Export everything as JSON, any time",
      ]}
    >
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="mb-4 grid grid-cols-2 gap-3">
          {[
            { label: "Tasks done", value: "312" },
            { label: "Focus time", value: "86", unit: "h" },
            { label: "Habit rate", value: "91", unit: "%" },
            { label: "Best streak", value: "28", unit: "d" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/60 bg-background/60 p-3.5">
              <p className="text-[11.5px] text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-extrabold">
                {stat.value}
                {stat.unit && <span className="text-sm font-medium text-muted-foreground">{stat.unit}</span>}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="mb-3.5 flex items-center justify-between">
            <p className="text-[12.5px] font-bold text-foreground/90">This week</p>
            <span className="text-[11px] text-muted-foreground/70">+18% vs last</span>
          </div>
          <div className="flex h-24 items-end justify-between gap-2.5">
            {bars.map((bar, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className={`w-full rounded-t-md ${
                    bar.highlight
                      ? "bg-gradient-to-t from-[hsl(217,84%,52%)] to-accent"
                      : "bg-gradient-to-t from-[hsl(252,80%,52%)] to-primary"
                  }`}
                  style={{ height: bar.height }}
                />
                <span className={`text-[10px] ${bar.highlight ? "text-foreground/80" : "text-muted-foreground/70"}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
