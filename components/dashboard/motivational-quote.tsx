import { Quote } from "lucide-react";
import { getHourlyQuote } from "@/lib/quotes";

export function MotivationalQuote() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
      <Quote className="h-4 w-4 shrink-0" />
      <span>{getHourlyQuote()}</span>
    </div>
  );
}
