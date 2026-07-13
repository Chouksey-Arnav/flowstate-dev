import { Sparkles, Trophy } from "lucide-react";

const XP_SOURCES = [
  { label: "Task done", value: "+10–52", className: "text-primary" },
  { label: "Per focus min", value: "+2", className: "text-accent" },
  { label: "Habit check-in", value: "+15", className: "text-flow-green" },
];

const TITLES = [
  { name: "Novice", level: 1 },
  { name: "Focused", level: 6 },
  { name: "Disciplined", level: 10 },
  { name: "Relentless", level: 15, active: true },
  { name: "Elite", level: 28 },
  { name: "Legend", level: 36, legend: true },
];

export function GamificationSection() {
  return (
    <section
      id="gamification"
      className="relative mt-6 border-y border-border/50 bg-gradient-to-b from-primary/[0.06] to-transparent"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          Gamification
        </span>
        <h2 className="mx-auto mt-4 max-w-[20ch] text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl md:text-5xl">
          Your discipline, scored.
        </h2>
        <p className="mx-auto mt-4 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
          Every finished task, focused minute, and habit check-in earns XP. Levels come fast at first, then get
          earned. Titles climb from Novice to Legend.
        </p>

        <div className="mt-11 grid grid-cols-1 gap-5 text-left lg:grid-cols-[1.3fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-card to-card p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
            />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-28 w-28 shrink-0 sm:h-[118px] sm:w-[118px]">
                <svg viewBox="0 0 96 96" className="-rotate-90">
                  <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="7" />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#gami-ring)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="263.9"
                    strokeDashoffset="74"
                  />
                  <defs>
                    <linearGradient id="gami-ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="hsl(var(--primary))" />
                      <stop offset="1" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold leading-none sm:text-[34px]">15</span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Level
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary sm:justify-start">
                  <Sparkles className="h-3.5 w-3.5" />
                  Relentless
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight sm:text-[30px]">
                  14,320 <span className="text-base font-medium text-muted-foreground">total XP</span>
                </p>
                <div className="mt-3.5 h-[9px] overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
                <p className="mt-2 text-[13px] text-muted-foreground">2,140 / 2,980 XP to level 16</p>
              </div>
            </div>
            <div className="relative mt-6 grid grid-cols-3 gap-3">
              {XP_SOURCES.map((source) => (
                <div key={source.label} className="rounded-xl border border-border/50 bg-background/50 p-3.5">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{source.label}</p>
                  <p className={`mt-1.5 text-lg font-extrabold ${source.className}`}>{source.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <p className="text-sm font-bold">The title ladder</p>
            <p className="mb-4 mt-1 text-[13px] text-muted-foreground">Level up and your rank changes with you.</p>
            <div className="flex flex-col gap-2">
              {TITLES.map((title) => (
                <div
                  key={title.name}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13.5px] ${
                    title.active
                      ? "border-primary/40 bg-primary/15 font-bold text-foreground"
                      : title.legend
                        ? "border-flow-yellow/25 bg-gradient-to-r from-flow-yellow/10 to-transparent font-bold text-flow-yellow"
                        : "border-border/60 bg-background/50 text-muted-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {title.active && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                    {title.legend && <Trophy className="h-3.5 w-3.5 text-flow-yellow" />}
                    {title.name}
                  </span>
                  <span className={`font-mono text-xs ${title.active ? "text-primary" : ""}`}>Lv {title.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
