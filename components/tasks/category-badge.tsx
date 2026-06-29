import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const STYLES: Record<Category, string> = {
  Business: "bg-flow-blue/15 text-flow-blue border-flow-blue/30",
  "CAC/Projects": "bg-flow-green/15 text-flow-green border-flow-green/30",
  Learning: "bg-flow-yellow/15 text-flow-yellow border-flow-yellow/30",
  Personal: "bg-flow-red/15 text-flow-red border-flow-red/30",
  Other: "bg-secondary text-muted-foreground border-border",
};

export function CategoryBadge({ category }: { category: Category }) {
  return <Badge className={cn(STYLES[category], "font-medium")}>{category}</Badge>;
}
