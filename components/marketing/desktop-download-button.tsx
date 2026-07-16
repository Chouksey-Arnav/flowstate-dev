"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DESKTOP_DOWNLOADS, DESKTOP_RELEASES_URL, type DesktopPlatform } from "@/lib/site";

function detectPlatform(): DesktopPlatform | "unsupported" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return "unsupported";
  if (/Mac/i.test(ua)) return "mac";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux/i.test(ua)) return "linux";
  return "unsupported";
}

interface DesktopDownloadButtonProps {
  size?: "default" | "large";
}

export function DesktopDownloadButton({ size = "default" }: DesktopDownloadButtonProps) {
  const [platform, setPlatform] = useState<DesktopPlatform | "unsupported" | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // Nothing detected yet (SSR / first paint) or on a phone/tablet where a
  // desktop install doesn't make sense — fall back to Mac as the most
  // common desktop OS rather than rendering an empty slot that shifts layout.
  const active = platform === "unsupported" || platform === null ? "mac" : platform;
  const download = DESKTOP_DOWNLOADS[active];

  const sizeClasses =
    size === "large"
      ? "px-7 py-4 text-base font-bold sm:text-[17px]"
      : "px-6 py-3.5 text-base font-semibold";

  return (
    <div className="inline-flex">
      <a
        href={download.url}
        className={cn(
          "group inline-flex items-center gap-2 rounded-l-2xl border border-r-0 border-border bg-card text-foreground transition-all hover:-translate-y-0.5 hover:border-muted-foreground/40 hover:bg-secondary/60",
          sizeClasses
        )}
      >
        <Monitor className="h-[17px] w-[17px] shrink-0" />
        Get for {download.label}
        <Download className="h-[15px] w-[15px] shrink-0 opacity-60 transition-transform group-hover:translate-y-0.5 group-hover:opacity-100" />
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Other desktop platforms"
            className={cn(
              "inline-flex items-center rounded-r-2xl border border-border bg-card px-3 text-foreground transition-all hover:-translate-y-0.5 hover:border-muted-foreground/40 hover:bg-secondary/60 data-[state=open]:bg-secondary/60",
              size === "large" ? "py-4" : "py-3.5"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          {(Object.keys(DESKTOP_DOWNLOADS) as DesktopPlatform[]).map((key) => (
            <DropdownMenuItem key={key} asChild className="cursor-pointer gap-2 py-2">
              <a href={DESKTOP_DOWNLOADS[key].url}>
                <Download className="h-3.5 w-3.5 opacity-60" />
                {DESKTOP_DOWNLOADS[key].label}
                <span className="ml-auto text-xs text-muted-foreground">
                  {DESKTOP_DOWNLOADS[key].fileLabel}
                </span>
              </a>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild className="cursor-pointer py-2 text-muted-foreground">
            <a href={DESKTOP_RELEASES_URL} target="_blank" rel="noopener noreferrer">
              All releases on GitHub
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
