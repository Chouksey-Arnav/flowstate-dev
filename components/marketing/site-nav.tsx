"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { LogoMark } from "@/components/marketing/logo-mark";
import { GithubStarButton } from "@/components/marketing/github-star-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#gamification", label: "Progress" },
  { href: "#privacy", label: "Privacy" },
  { href: "#opensource", label: "Open source" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
        <Link href="#top" className="flex items-center gap-2.5 text-foreground" onClick={() => setOpen(false)}>
          <LogoMark className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">FlowState</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <GithubStarButton />
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-primary to-[hsl(252,84%,58%)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_10px_26px_-12px_hsl(var(--primary)/0.8)] transition-transform hover:brightness-110"
          >
            Launch app
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-border/60 bg-background/95 transition-[grid-template-rows] duration-200 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
        )}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 px-6 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <GithubStarButton className="flex-1 justify-center" />
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-primary to-[hsl(252,84%,58%)] px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Launch app
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
