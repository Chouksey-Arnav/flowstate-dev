import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { GITHUB_REPO_URL } from "@/lib/site";

export function HeroSection() {
  return (
    <header id="top" className="mx-auto max-w-4xl px-6 pb-10 pt-16 text-center sm:pt-20 md:pt-24">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-2 pr-3.5 text-xs font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] tracking-wide text-primary">
          <Sparkles className="h-3 w-3" />
          Open source
        </span>
        Runs entirely in your browser · MIT licensed
      </div>

      <h1 className="mx-auto mt-6 max-w-[16ch] text-[44px] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-6xl md:text-[78px]">
        Stop thinking.
        <br />
        <span className="text-gradient">Start doing.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground sm:text-xl">
        FlowState is a dark, no-excuses productivity app. Tasks, a drift-free focus timer, habits, and stats — wired
        to a leveling system that scores your discipline and hunts the one task you keep avoiding.
      </p>

      <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-[hsl(252,84%,57%)] px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_16px_40px_-14px_hsl(var(--primary)/0.85)] transition-all hover:-translate-y-0.5 hover:brightness-110"
        >
          Try the live app
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-muted-foreground/40 hover:bg-secondary/60"
        >
          <Github className="h-[17px] w-[17px]" />
          Star on GitHub
        </a>
      </div>
      <p className="mt-4 text-[13.5px] text-muted-foreground/70">No paywall. No ads. No tracking. Your data stays yours.</p>
    </header>
  );
}
