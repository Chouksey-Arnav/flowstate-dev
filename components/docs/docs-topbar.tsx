import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/marketing/logo-mark";

export function DocsTopbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-foreground">
            <LogoMark className="h-7 w-7" />
            <span className="text-[15px] font-bold tracking-tight">FlowState</span>
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
          <Link href="/docs" className="hidden text-sm font-semibold text-muted-foreground hover:text-foreground sm:block">
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-primary to-[hsl(252,84%,58%)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_10px_26px_-12px_hsl(var(--primary)/0.8)] transition-transform hover:brightness-110"
          >
            Launch app
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
