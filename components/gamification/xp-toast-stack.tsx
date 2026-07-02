"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useXpToastStore } from "@/store/xpToastStore";

const AUTO_DISMISS_MS = 2600;

function XpToastItem({ id, amount, label }: { id: string; amount: number; label: string }) {
  const dismiss = useXpToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex items-center gap-2 rounded-full border border-primary/25 bg-card/95 py-1.5 pl-2 pr-3.5 shadow-card-hover backdrop-blur-md"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm font-semibold tabular-nums text-primary">+{amount} XP</span>
      <span className="max-w-[10rem] truncate text-xs text-muted-foreground">{label}</span>
    </motion.div>
  );
}

/** Mounted once at the app root — a passive stack of "+XP" pop-ups fed by xpToastStore. */
export function XpToastStack() {
  const toasts = useXpToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <XpToastItem key={t.id} id={t.id} amount={t.amount} label={t.label} />
        ))}
      </AnimatePresence>
    </div>
  );
}
