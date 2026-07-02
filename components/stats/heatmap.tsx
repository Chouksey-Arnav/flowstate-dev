"use client";

import { useState } from "react";
import { addMonths, format, getDay, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthHeatmap } from "@/lib/stats";
import { toDateKey } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

function intensityClass(count: number): string {
  if (count === 0) return "bg-secondary";
  if (count === 1) return "bg-flow-green/30";
  if (count === 2) return "bg-flow-green/60";
  return "bg-flow-green";
}

interface HeatmapProps {
  tasks: Task[];
}

export function Heatmap({ tasks }: HeatmapProps) {
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
  const days = getMonthHeatmap(tasks, monthDate);
  const leadingBlanks = getDay(monthDate); // 0 = Sunday
  const todayKey = toDateKey();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{format(monthDate, "MMMM yyyy")}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setMonthDate((d) => addMonths(d, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setMonthDate((d) => addMonths(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`blank-${i}`} />)}
          {days.map((day) => (
            <div
              key={day.dateKey}
              title={`${day.dateKey}: ${day.count} completed`}
              className={cn(
                "flex aspect-square items-center justify-center rounded-sm text-[10px] text-foreground/70",
                intensityClass(day.count),
                day.dateKey === todayKey && "ring-1 ring-inset ring-primary"
              )}
            >
              {Number(day.dateKey.slice(-2))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
