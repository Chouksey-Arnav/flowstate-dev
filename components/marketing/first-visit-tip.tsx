"use client";

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";

const STORAGE_KEY = "flowstate-seen-device-tip";

export function FirstVisitTip() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    setMounted(true);
    const showTimer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(showTimer);
  }, []);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setMounted(false), 400);
  }

  if (!mounted) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-5 left-1/2 z-50 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Smartphone className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="font-semibold">By the way</span> — FlowState is built to live on your phone, in your
            pocket, ready the moment a task needs doing. It runs just as well on desktop, so start wherever you are.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
