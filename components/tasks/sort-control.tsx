"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortBy } from "@/types";

const OPTIONS: { value: SortBy; label: string }[] = [
  { value: "manual", label: "Manual order" },
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Date created" },
];

interface SortControlProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortBy)}>
      <SelectTrigger className="h-9 w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
