"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { GITHUB_REPO_URL, GITHUB_API_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function formatStars(count: number) {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(count < 10000 ? 1 : 0)}k`;
}

export function GithubStarButton({ className }: { className?: string }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(GITHUB_API_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
      <span className="tabular-nums">{stars !== null ? formatStars(stars) : "Star"}</span>
    </a>
  );
}
