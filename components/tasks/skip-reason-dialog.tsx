"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { REFLECTION_REASONS, getReasonMeta } from "@/lib/reflection";
import { timesMissed } from "@/lib/reckoning";
import { useReflectionStore } from "@/store/reflectionStore";
import type { ReflectionReason, Task } from "@/types";

interface SkipReasonDialogProps {
  open: boolean;
  task?: Task;
  onOpenChange: (open: boolean) => void;
  onSelect: (reason: ReflectionReason) => void;
}

export function SkipReasonDialog({ open, task, onOpenChange, onSelect }: SkipReasonDialogProps) {
  const [picked, setPicked] = useState<ReflectionReason | null>(null);
  const entries = useReflectionStore((s) => s.entries);

  // The last excuse this exact task got, in the user's own past words. Nothing
  // FlowState can write lands as hard as being shown what you said last time.
  const lastExcuse = task
    ? [...entries]
        .filter((e) => e.taskId === task.id && e.context === "skip")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    : undefined;

  const broken = task ? timesMissed(task) : 0;

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
            &ldquo;{task?.title ?? ""}&rdquo; isn&apos;t going anywhere. Naming the real reason is how
            the pattern stops repeating.
          </DialogDescription>
        </DialogHeader>

        {(lastExcuse || broken > 0) && (
          <div className="flex gap-2.5 rounded-lg border border-flow-red/25 bg-flow-red/[0.05] px-3 py-2.5">
            <History className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flow-red" />
            <div className="min-w-0 text-xs leading-relaxed">
              {broken > 0 && (
                <p className="font-medium text-foreground">
                  You&apos;ve already broken this promise {broken}×.
                </p>
              )}
              {lastExcuse && (
                <p className="text-muted-foreground">
                  Last time you said: {getReasonMeta(lastExcuse.reason).emoji}{" "}
                  <span className="italic">
                    &ldquo;{getReasonMeta(lastExcuse.reason).label.toLowerCase()}&rdquo;
                  </span>
                  .
                </p>
              )}
            </div>
          </div>
        )}

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
