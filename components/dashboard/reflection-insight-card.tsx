"use client";

import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReasonMeta, getTopReason } from "@/lib/reflection";
import type { ReflectionEntry } from "@/types";

interface ReflectionInsightCardProps {
  entries: ReflectionEntry[];
}

export function ReflectionInsightCard({ entries }: ReflectionInsightCardProps) {
  const top = getTopReason(entries, 7);
  if (!top) return null;

  const meta = getReasonMeta(top.reason);
  const times = top.count === 1 ? "once" : `${top.count} times`;

  return (
    <Card className="border-flow-yellow/25 bg-flow-yellow/[0.04]">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-flow-yellow">
          <Brain className="h-4 w-4" /> Why you&apos;ve been stalling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-foreground">
          This week you skipped tasks because{" "}
          <span className="font-medium">&ldquo;{meta.label.toLowerCase()}&rdquo;</span> {times}. {meta.emoji}
        </p>
        <p className="rounded-lg border border-flow-yellow/20 bg-card p-2.5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Try this: </span>
          {meta.tip}
        </p>
      </CardContent>
    </Card>
  );
}
