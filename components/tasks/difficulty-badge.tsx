import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

const STYLES: Record<Difficulty, string> = {
  HARD: "bg-flow-red/15 text-flow-red border-flow-red/30",
  MEDIUM: "bg-flow-blue/15 text-flow-blue border-flow-blue/30",
  EASY: "bg-flow-green/15 text-flow-green border-flow-green/30",
};

const LABELS: Record<Difficulty, string> = {
  HARD: "Hard",
  MEDIUM: "Medium",
  EASY: "Easy",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge className={cn(STYLES[difficulty], "font-medium")}>{LABELS[difficulty]}</Badge>;
}
