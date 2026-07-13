import { Database, DownloadCloud, ShieldCheck, ShieldOff } from "lucide-react";

const CARDS = [
  {
    icon: ShieldCheck,
    iconClassName: "bg-flow-green/12 text-flow-green",
    title: "Locked to you",
    description:
      "RLS means you can only ever read or write your own rows — enforced by the database, not just the app.",
  },
  {
    icon: Database,
    iconClassName: "bg-accent/12 text-accent",
    title: "Sync anywhere",
    description: "Nothing's tied to one browser. Sign in on your phone and pick up exactly where you left off.",
  },
  {
    icon: DownloadCloud,
    iconClassName: "bg-primary/12 text-primary",
    title: "Export any time",
    description: "One click dumps everything to JSON. It's your data — take a backup whenever you want.",
  },
  {
    icon: ShieldOff,
    iconClassName: "bg-flow-red/12 text-flow-red",
    title: "No surveillance",
    description: "No analytics pixels, no ad networks, no third-party embeds. Even the sounds are synthesized locally.",
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-flow-green">
            <span className="h-1.5 w-1.5 rounded-full bg-flow-green shadow-[0_0_10px_theme(colors.flow.green)]" />
            Privacy
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            Your data is yours. Full stop.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Real accounts with a simple <span className="font-mono text-primary">@username</span> and password — log
            in on any device and your work follows you. Every row is locked to your account with row-level security.
            No ads, no trackers, no selling your habits to anyone.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {["Row-level security", "Cross-device sync", "JSON export", "No tracking"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-3.5 py-2 text-[13px] text-foreground/85"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <div key={card.title} className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClassName}`}>
                <card.icon className="h-[22px] w-[22px]" strokeWidth={2} />
              </span>
              <p className="mt-4 text-[15px] font-bold">{card.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
