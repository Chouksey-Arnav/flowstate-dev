import { useEffect, useState } from "react";

/** Forces a re-render on an interval so time-driven UI (streak warnings, urgency tiers) stays fresh without any task/habit changes. */
export function useNowTick(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
