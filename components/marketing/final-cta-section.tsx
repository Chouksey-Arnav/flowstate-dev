import Link from "next/link";
import { ArrowRight, Apple } from "lucide-react";
import { DESKTOP_DOWNLOAD_MAC_URL } from "@/lib/site";

export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-8 text-center sm:pb-28">
      <h2 className="mx-auto max-w-[16ch] text-[38px] font-extrabold leading-[1] tracking-[-0.035em] sm:text-6xl md:text-[68px]">
        Stop reading about
        <br />
        productivity.
      </h2>
      <p className="mx-auto mt-5 max-w-[44ch] text-lg leading-relaxed text-muted-foreground sm:text-xl">
        You already know what to do. Open FlowState and do one thing. Momentum follows.
      </p>
      <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-[hsl(252,84%,57%)] px-7 py-4 text-base font-bold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_18px_44px_-14px_hsl(var(--primary)/0.9)] transition-all hover:-translate-y-0.5 hover:brightness-110 sm:text-[17px]"
        >
          Try the live app
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
        <a
          href={DESKTOP_DOWNLOAD_MAC_URL}
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-7 py-4 text-base font-bold text-foreground transition-colors hover:border-muted-foreground/40 hover:bg-secondary/60 sm:text-[17px]"
        >
          <Apple className="h-[18px] w-[18px]" />
          Get for Mac
        </a>
      </div>
    </section>
  );
}
