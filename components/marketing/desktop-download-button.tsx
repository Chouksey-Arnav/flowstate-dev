"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, Download, Monitor, Terminal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DESKTOP_DOWNLOADS, DESKTOP_RELEASES_URL, type DesktopPlatform } from "@/lib/site";
import { DESKTOP_INSTALL_INSTRUCTIONS } from "@/lib/desktop-install";

function detectPlatform(): DesktopPlatform | "unsupported" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return "unsupported";
  if (/Mac/i.test(ua)) return "mac";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux/i.test(ua)) return "linux";
  return "unsupported";
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-background/60 py-2.5 pl-3.5 pr-2">
      <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <code className="flex-1 whitespace-pre-wrap break-all text-[13px] text-foreground">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy command"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-primary" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
}

function InstallHelpDialog({
  platform,
  onOpenChange,
}: {
  platform: DesktopPlatform | null;
  onOpenChange: (open: boolean) => void;
}) {
  const info = platform ? DESKTOP_INSTALL_INSTRUCTIONS[platform] : null;

  return (
    <Dialog open={platform !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {info && (
          <>
            <DialogHeader>
              <DialogTitle>{info.title}</DialogTitle>
              <DialogDescription>{info.intro}</DialogDescription>
            </DialogHeader>
            {info.command && <CopyCommand command={info.command} />}
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {info.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <DialogFooter>
              <a
                href="/docs/installing-the-desktop-app"
                className="text-sm text-primary hover:underline"
              >
                Full install docs
              </a>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DesktopDownloadButtonProps {
  size?: "default" | "large";
}

export function DesktopDownloadButton({ size = "default" }: DesktopDownloadButtonProps) {
  const [platform, setPlatform] = useState<DesktopPlatform | "unsupported" | null>(null);
  const [helpPlatform, setHelpPlatform] = useState<DesktopPlatform | null>(null);

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
    <div className="inline-flex flex-col items-center gap-2">
      <div className="inline-flex">
        <a
          href={download.url}
          onClick={() => setHelpPlatform(active)}
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
                <a href={DESKTOP_DOWNLOADS[key].url} onClick={() => setHelpPlatform(key)}>
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
      <button
        type="button"
        onClick={() => setHelpPlatform(active)}
        className="text-xs text-muted-foreground/70 underline-offset-2 transition-colors hover:text-foreground hover:underline"
      >
        Trouble opening it after downloading?
      </button>
      <InstallHelpDialog platform={helpPlatform} onOpenChange={(open) => !open && setHelpPlatform(null)} />
    </div>
  );
}
