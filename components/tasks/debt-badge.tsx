"use client";

import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDebtWeight, timesMissed } from "@/lib/reckoning";
import { getDebtLine } from "@/lib/guilt";
import type { GuiltIntensity, Task } from "@/types";

interface DebtBadgeProps {
  task: Task;
  intensity: GuiltIntensity;
}

const WEIGHT_CLASS = {
  none: "",
  light: "border-flow-yellow/30 bg-flow-yellow/10 text-flow-yellow",
  heavy: "border-flow-red/30 bg-flow-red/10 text-flow-red",
  crushing: "border-flow-red/60 bg-flow-red/15 text-flow-red animate-debt-throb",
} as const;

/**
 * The count of days this exact task was promised and skipped, on the task
 * itself. It escalates in colour and weight rather than in wording, so a
 * long-dodged task looks heavier in a list without shouting a paragraph.
 */
export function DebtBadge({ task, intensity }: DebtBadgeProps) {
  const n = timesMissed(task);
  if (n <= 0) return null;
  const weight = getDebtWeight(task);

  return (
    <span
      title={getDebtLine(task, intensity)}
      className={cn(
        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        WEIGHT_CLASS[weight]
      )}
    >
      <History className="h-3 w-3" />
      Broken {n}×
    </span>
  );
}
