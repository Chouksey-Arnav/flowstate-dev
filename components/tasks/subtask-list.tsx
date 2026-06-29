"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubTask } from "@/types";

interface SubtaskListProps {
  subtasks: SubTask[];
  onToggle: (subtaskId: string) => void;
  onAdd?: (title: string) => void;
  onDelete?: (subtaskId: string) => void;
}

export function SubtaskList({ subtasks, onToggle, onAdd, onDelete }: SubtaskListProps) {
  const [draft, setDraft] = useState("");

  function handleAdd() {
    const title = draft.trim();
    if (!title || !onAdd) return;
    onAdd(title);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      {subtasks.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <Checkbox checked={s.completed} onCheckedChange={() => onToggle(s.id)} />
          <span className={cn("flex-1 text-sm", s.completed && "text-muted-foreground line-through")}>
            {s.title}
          </span>
          {onDelete && (
            <button onClick={() => onDelete(s.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
      {onAdd && (
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Add subtask…"
            className="h-8 text-sm"
          />
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
