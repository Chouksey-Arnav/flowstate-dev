import Link from "next/link";
import { Github } from "lucide-react";
import { GITHUB_REPO_URL } from "@/lib/site";

export function OpenSourceSection() {
  return (
    <section id="opensource" className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
      <div className="relative overflow-hidden rounded-[28px] border border-primary/25 bg-gradient-to-br from-primary/25 via-background to-background p-8 sm:p-10 md:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/25 blur-[80px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-[80px]"
        />
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              <Github className="h-[15px] w-[15px]" />
              Open source
            </span>
            <h2 className="mt-4 text-[28px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl md:text-[44px]">
              Free, MIT-licensed, and yours to fork.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-foreground/75">
              FlowState is built in the open. Clone it, self-host it, rip out the parts you don&apos;t want, or send a
              PR. Issues and contributions are welcome — this is meant to be built on.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-[15px] font-bold text-black transition-[filter] hover:brightness-90"
              >
                <Github className="h-[18px] w-[18px]" />
                Star on GitHub
              </a>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-6 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-primary/[0.18]"
              >
                Try the live app
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 border-b border-border/60 bg-card/60 px-3.5 py-2.5">
              <span className="h-[11px] w-[11px] rounded-full bg-flow-red" />
              <span className="h-[11px] w-[11px] rounded-full bg-flow-yellow" />
              <span className="h-[11px] w-[11px] rounded-full bg-flow-green" />
              <span className="ml-2 font-mono text-[11.5px] text-muted-foreground/70">terminal</span>
            </div>
            <div className="p-5 font-mono text-[12.5px] leading-[1.9]">
              <p className="text-muted-foreground/70">
                <span className="text-primary">$</span> git clone{" "}
                <span className="text-foreground/80">github.com/Chouksey-Arnav/flowstate-dev</span>
              </p>
              <p className="text-muted-foreground/70">
                <span className="text-primary">$</span> cd flowstate-dev
              </p>
              <p className="text-muted-foreground/70">
                <span className="text-primary">$</span> npm install
              </p>
              <p className="text-muted-foreground/70">
                <span className="text-primary">$</span> npm run dev
              </p>
              <p className="mt-2.5 text-flow-green">
                ▲ ready on <span className="text-foreground/80">http://localhost:3000</span>
              </p>
              <p className="text-muted-foreground/70">
                ◦ redirecting → <span className="text-accent">/login</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
