import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DesktopDownloadButton } from "@/components/marketing/desktop-download-button";

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
        <DesktopDownloadButton size="large" />
      </div>
    </section>
  );
}
