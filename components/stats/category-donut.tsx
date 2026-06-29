"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PieChart as PieIcon } from "lucide-react";
import type { CategoryCount } from "@/lib/stats";

const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EF4444", "#A855F7"];

interface CategoryDonutProps {
  data: CategoryCount[];
}

export function CategoryDonut({ data }: CategoryDonutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed by category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState icon={PieIcon} title="No completions yet" description="Finish tasks to see a breakdown." />
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {data.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {data.map((entry, i) => (
              <li key={entry.category} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {entry.category} ({entry.count})
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
