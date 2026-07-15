"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DOC_CATEGORIES, DOCS } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block" aria-label="Docs navigation">
      <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col gap-6 overflow-y-auto pb-10 pr-2">
        <Link
          href="/docs"
          className={cn(
            "rounded-lg px-3 py-2 text-[13.5px] font-bold transition-colors",
            pathname === "/docs" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
          )}
        >
          Overview
        </Link>
        {DOC_CATEGORIES.map((cat) => (
          <div key={cat.key}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/70">{cat.label}</p>
            <div className="mt-1.5 flex flex-col gap-0.5">
              {DOCS.filter((d) => d.category === cat.key).map((doc) => {
                const active = pathname === `/docs/${doc.slug}`;
                const Icon = doc.icon;
                return (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {doc.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="md:hidden">
      <select
        aria-label="Jump to a doc page"
        value={pathname}
        onChange={(e) => router.push(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground"
      >
        <option value="/docs">Overview</option>
        {DOC_CATEGORIES.map((cat) => (
          <optgroup key={cat.key} label={cat.label}>
            {DOCS.filter((d) => d.category === cat.key).map((doc) => (
              <option key={doc.slug} value={`/docs/${doc.slug}`}>
                {doc.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
