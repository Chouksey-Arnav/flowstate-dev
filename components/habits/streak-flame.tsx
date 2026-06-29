import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className }: StreakFlameProps) {
  if (streak <= 0) return null;
  const scale = Math.min(1 + streak * 0.04, 1.8);

  return (
    <span className={cn("inline-flex items-center gap-1 text-flow-yellow", className)}>
      <Flame
        className="h-4 w-4"
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        fill="currentColor"
      />
      <span className="text-xs font-semibold">{streak}</span>
    </span>
  );
}
