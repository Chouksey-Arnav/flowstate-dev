import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { DOC_CATEGORIES, DOCS } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

const TITLE = "Documentation";
const DESCRIPTION = "Everything FlowState does, documented: tasks, focus, habits, stats, rewards, XP, settings, and privacy.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/docs`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/docs`,
  },
};

export default function DocsIndexPage() {
  return (
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
        <BookOpen className="h-3.5 w-3.5" />
        Documentation
      </span>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        Everything FlowState does, documented.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Every tool, every number, every setting — how it works and why it&apos;s built that way. New here? Start with
        the introduction. Otherwise, jump straight to what you need.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {DOC_CATEGORIES.map((cat) => (
          <div key={cat.key}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{cat.label}</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DOCS.filter((d) => d.category === cat.key).map((doc) => {
                const Icon = doc.icon;
                return (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        {doc.title}
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{doc.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
