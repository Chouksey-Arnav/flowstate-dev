"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DaySeriesPoint } from "@/lib/stats";

interface WeeklyChartMiniProps {
  data: DaySeriesPoint[];
}

export function WeeklyChartMini({ data }: WeeklyChartMiniProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>This week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
