import { format } from "date-fns";
import { dayOfYear, daysInYear } from "@/lib/dates";

export function DateCounter() {
  const now = new Date();
  return (
    <p className="mt-1 text-sm font-medium text-muted-foreground/80">
      <span className="text-foreground/90">{format(now, "EEEE, MMMM d")}</span>
      <span className="mx-2 opacity-30">|</span>
      <span>Day {dayOfYear(now)} of {daysInYear(now.getFullYear())}</span>
    </p>
  );
}
