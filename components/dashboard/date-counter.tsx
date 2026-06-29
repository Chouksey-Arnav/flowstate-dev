import { format } from "date-fns";
import { dayOfYear, daysInYear } from "@/lib/dates";

export function DateCounter() {
  const now = new Date();
  return (
    <p className="text-sm text-muted-foreground">
      {format(now, "EEEE, MMMM d, yyyy")} · Day {dayOfYear(now)} of {daysInYear(now.getFullYear())}
    </p>
  );
}
