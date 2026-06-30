"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Priority, Difficulty, TaskFilters } from "@/types";

const CATEGORIES: Category[] = ["Business", "CAC/Projects", "Learning", "Personal", "Other"];
const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];
const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  const hasFilters = filters.category || filters.priority || filters.difficulty;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.category ?? "all"}
        onValueChange={(v) => onChange({ ...filters, category: v === "all" ? undefined : (v as Category) })}
      >
        <SelectTrigger className="h-9 w-[150px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? "all"}
        onValueChange={(v) => onChange({ ...filters, priority: v === "all" ? undefined : (v as Priority) })}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.difficulty ?? "all"}
        onValueChange={(v) => onChange({ ...filters, difficulty: v === "all" ? undefined : (v as Difficulty) })}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All difficulties</SelectItem>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d} value={d}>
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...filters, category: undefined, priority: undefined, difficulty: undefined })}
        >
          <X className="mr-1 h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
