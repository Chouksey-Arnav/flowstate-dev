import { CheckCheck } from "lucide-react";
import { StatCard } from "@/components/stats/stat-card";

interface TodayProgressCardProps {
  completedToday: number;
  totalToday: number;
}

export function TodayProgressCard({ completedToday, totalToday }: TodayProgressCardProps) {
  const pct = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);
  return (
    <StatCard
      icon={CheckCheck}
      label="Today's progress"
      value={`${completedToday}/${totalToday}`}
      hint={totalToday === 0 ? "Nothing due today yet" : `${pct}% done`}
    />
  );
}
