import { Github } from "lucide-react";
import { GITHUB_REPO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export function GithubStarButton({ className }: { className?: string }) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-muted-foreground/40 hover:bg-secondary/60",
        className
      )}
    >
      <Github className="h-4 w-4" />
      <span>GitHub</span>
    </a>
  );
}
