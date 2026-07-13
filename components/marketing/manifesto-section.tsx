const PILLARS = [
  {
    title: "Avoidance radar",
    description:
      "Every task you skip climbs an avoidance score. The one you're dreading gets surfaced first — no hiding it at the bottom of the list.",
  },
  {
    title: "Tough-love copy",
    description:
      "70+ hand-written nudges that talk to you like a coach who's out of patience — not a mascot that celebrates opening the app.",
  },
  {
    title: "Real receipts",
    description:
      "XP, streaks, and stats are evidence you can trust yourself — the proof that shuts up the voice saying you never follow through.",
  },
];

export function ManifestoSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="max-w-[760px]">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          Why it exists
        </span>
        <h2 className="mt-4 text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl md:text-5xl">
          Most productivity apps are just prettier places to procrastinate.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          You don&apos;t need another inbox to organize your avoidance. You need something that notices the task you
          keep skipping, calls it out, and makes finishing it feel like winning. FlowState is built around a single,
          uncomfortable truth:
        </p>
        <p className="mt-5 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
          The work doesn&apos;t care how you feel about it. So the app doesn&apos;t either — it just helps you{" "}
          <span className="text-gradient">start</span>.
        </p>
      </div>

      <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="rounded-2xl border border-border/60 bg-card p-6">
            <p className="text-[34px] font-extrabold leading-tight tracking-tight text-gradient">{pillar.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
