import { LogoMark } from "@/components/marketing/logo-mark";
import { GITHUB_REPO_URL, SITE_URL } from "@/lib/site";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#gamification", label: "Progress" },
  { href: "#privacy", label: "Privacy" },
  { href: GITHUB_REPO_URL, label: "GitHub", external: true },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-10">
        <a href={SITE_URL} className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <div>
            <p className="text-[15px] font-bold leading-tight">FlowState</p>
            <p className="text-xs text-muted-foreground/70">Stop thinking. Start doing.</p>
          </div>
        </a>
        <div className="flex items-center gap-6 text-[13.5px] text-muted-foreground">
          {LINKS.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} className="hover:text-foreground">
                {link.label}
              </a>
            )
          )}
        </div>
        <p className="text-xs text-muted-foreground/60">MIT licensed · Built in the open</p>
      </div>
    </footer>
  );
}
