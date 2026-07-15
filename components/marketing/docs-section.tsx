import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { DOCS } from "@/lib/docs";

const FEATURED_SLUGS = ["tasks", "rewards", "habits", "gamification-xp"];

export function DocsSection() {
  const featured = FEATURED_SLUGS.map((slug) => DOCS.find((d) => d.slug === slug)).filter(
    (d): d is (typeof DOCS)[number] => Boolean(d)
  );

  return (
    <section id="docs" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          Documentation
        </span>
        <h2 className="mx-auto mt-4 max-w-[22ch] text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl">
          Every feature, actually documented.
        </h2>
        <p className="mx-auto mt-4 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
          No guesswork and no support tickets — full write-ups on tasks, rewards, focus, habits, XP, and every
          setting in between.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((doc) => {
          const Icon = doc.icon;
          return (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[15px] font-bold text-foreground">
                  {doc.title}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{doc.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-[15px] font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary/40"
        >
          Browse all docs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
