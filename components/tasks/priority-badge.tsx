import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

const STYLES: Record<Priority, string> = {
  HIGH: "bg-flow-red/15 text-flow-red border-flow-red/30",
  MEDIUM: "bg-flow-yellow/15 text-flow-yellow border-flow-yellow/30",
  LOW: "bg-secondary text-muted-foreground border-border",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge className={cn(STYLES[priority], "font-medium")}>{priority}</Badge>;
}
