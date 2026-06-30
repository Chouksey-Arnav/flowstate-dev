import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className }: StreakFlameProps) {
  if (streak <= 0) return null;
  const scale = Math.min(1 + streak * 0.03, 1.4);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-flow-yellow/25 bg-flow-yellow/10 px-2 py-0.5 text-flow-yellow",
        className
      )}
    >
      <Flame
        className="h-3.5 w-3.5"
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        fill="currentColor"
      />
      <span className="text-xs font-semibold tabular-nums">{streak}</span>
    </span>
  );
}
