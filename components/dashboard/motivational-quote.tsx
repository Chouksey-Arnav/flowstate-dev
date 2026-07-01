import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface MotivationalQuoteProps {
  quote: string;
  intense?: boolean;
}

export function MotivationalQuote({ quote, intense }: MotivationalQuoteProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm",
        intense
          ? "border-flow-red/30 bg-flow-red/5 text-flow-red font-medium"
          : "border-border text-muted-foreground"
      )}
    >
      <Quote className="h-4 w-4 shrink-0" />
      <span>{quote}</span>
    </div>
  );
}
