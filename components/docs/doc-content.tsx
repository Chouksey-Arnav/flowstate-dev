import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import type { DocPage } from "@/lib/docs";

interface DocContentProps {
  doc: DocPage;
  prev?: DocPage;
  next?: DocPage;
}

export function DocContent({ doc, prev, next }: DocContentProps) {
  const Icon = doc.icon;

  return (
    <article className="max-w-3xl">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-primary">
        <Icon className="h-3.5 w-3.5" />
        {doc.readTime} read
      </div>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{doc.description}</p>

      <div className="mt-10 flex flex-col gap-9">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold tracking-tight">{section.heading}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 flex flex-col gap-2">
                {section.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/85">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {section.steps && (
              <ol className="mt-3 flex flex-col gap-2.5">
                {section.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
            {section.note && (
              <div className="mt-3 flex gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.05] p-3.5 text-sm leading-relaxed text-foreground/80">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {section.note}
              </div>
            )}
          </section>
        ))}
      </div>

      {(prev || next) && (
        <div className="mt-14 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
