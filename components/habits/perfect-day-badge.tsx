import { PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PerfectDayBadge() {
  return (
    <Badge className="bg-flow-green text-white">
      <PartyPopper className="mr-1 h-3 w-3" /> Perfect day
    </Badge>
  );
}
