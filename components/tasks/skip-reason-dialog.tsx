"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { REFLECTION_REASONS } from "@/lib/reflection";
import type { ReflectionReason } from "@/types";

interface SkipReasonDialogProps {
  open: boolean;
  taskTitle: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (reason: ReflectionReason) => void;
}

export function SkipReasonDialog({ open, taskTitle, onOpenChange, onSelect }: SkipReasonDialogProps) {
  const [picked, setPicked] = useState<ReflectionReason | null>(null);

  function handlePick(reason: ReflectionReason) {
    setPicked(reason);
    onSelect(reason);
    onOpenChange(false);
    setPicked(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Real quick — why are you skipping this?</DialogTitle>
          <DialogDescription>
            &ldquo;{taskTitle}&rdquo; isn&apos;t going anywhere. Naming the real reason is how the pattern
            stops repeating.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {REFLECTION_REASONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => handlePick(r.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10",
                picked === r.value && "border-primary bg-primary/10"
              )}
            >
              <span className="text-base leading-none">{r.emoji}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onOpenChange(false)}>
          Skip without saying why
        </Button>
      </DialogContent>
    </Dialog>
  );
}
