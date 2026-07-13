const STACK = [
  { name: "Next.js 14", detail: "App Router · TypeScript" },
  { name: "Tailwind CSS", detail: "shadcn-style · Radix UI" },
  { name: "Zustand", detail: "7 persisted domain stores" },
  { name: "Supabase", detail: "Postgres · Auth · Edge Fns" },
  { name: "Recharts", detail: "Bar chart · donut" },
  { name: "Framer Motion", detail: "Transitions · list anims" },
  { name: "Web Audio API", detail: "Synthesized sound, no files" },
  { name: "canvas-confetti", detail: "Completion celebrations" },
];

export function TechStackSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pb-24">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          Under the hood
        </span>
        <h2 className="mx-auto mt-4 max-w-[20ch] text-2xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-3xl md:text-[42px]">
          Modern, boring-in-the-good-way stack.
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          Nothing exotic. Everything you&apos;d reach for to ship a fast, typed, real-time app — and easy to fork.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {STACK.map((item) => (
          <div key={item.name} className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-[15px] font-bold">{item.name}</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
