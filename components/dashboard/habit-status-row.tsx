import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getHabitIcon } from "@/lib/habit-icons";
import { isCompletedToday } from "@/lib/habits";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types";

interface HabitStatusRowProps {
  habits: Habit[];
}

export function HabitStatusRow({ habits }: HabitStatusRowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s habits</CardTitle>
      </CardHeader>
      <CardContent className={habits.length === 0 ? undefined : "flex flex-wrap gap-3"}>
        {habits.length === 0 && (
          <EmptyState
            icon={Flame}
            title="No habits yet"
            description="Add one to start tracking your streak."
            className="py-8"
          />
        )}
        {habits.map((habit) => {
          const Icon = getHabitIcon(habit.icon);
          const done = isCompletedToday(habit);
          return (
            <div key={habit.id} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border",
                  done ? "border-transparent bg-flow-green text-white" : "border-border text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="max-w-[64px] truncate text-[10px] text-muted-foreground">{habit.name}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
