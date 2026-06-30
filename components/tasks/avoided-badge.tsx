import { Flame } from "lucide-react";

export function AvoidedBadge({ days }: { days: number }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-flow-red/30 bg-flow-red/10 px-2 py-0.5 text-xs font-medium text-flow-red">
      <Flame className="h-3 w-3" /> Avoiding {days}d
    </span>
  );
}
