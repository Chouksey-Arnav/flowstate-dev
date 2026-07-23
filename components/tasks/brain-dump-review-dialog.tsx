"use client";

import { useState } from "react";
import { Sparkles, Target, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PillSelect } from "./pill-select";
import { useTaskStore } from "@/store/taskStore";
import { useSettingsStore } from "@/store/settingsStore";
import { xpForTaskCompletion } from "@/lib/xp";
import { toDateKey } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Category, Difficulty, Priority } from "@/types";

const CATEGORIES: Category[] = ["Business", "CAC/Projects", "Learning", "Personal", "Other"];

const PRIORITY_OPTIONS: { value: Priority; label: string; accent: string }[] = [
  { value: "HIGH", label: "High", accent: "data-[active=true]:border-flow-red/50 data-[active=true]:bg-flow-red/15 data-[active=true]:text-flow-red" },
  { value: "MEDIUM", label: "Med", accent: "data-[active=true]:border-flow-yellow/50 data-[active=true]:bg-flow-yellow/15 data-[active=true]:text-flow-yellow" },
  { value: "LOW", label: "Low", accent: "data-[active=true]:border-border data-[active=true]:bg-secondary data-[active=true]:text-foreground" },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; accent: string }[] = [
  { value: "EASY", label: "Easy", accent: "data-[active=true]:border-flow-green/50 data-[active=true]:bg-flow-green/15 data-[active=true]:text-flow-green" },
  { value: "MEDIUM", label: "Med", accent: "data-[active=true]:border-flow-blue/50 data-[active=true]:bg-flow-blue/15 data-[active=true]:text-flow-blue" },
  { value: "HARD", label: "Hard", accent: "data-[active=true]:border-flow-red/50 data-[active=true]:bg-flow-red/15 data-[active=true]:text-flow-red" },
];

export interface BrainDumpDraft {
  id: string;
  title: string;
  priority: Priority;
  difficulty: Difficulty;
  category: Category;
}

interface BrainDumpReviewDialogProps {
  open: boolean;
  drafts: BrainDumpDraft[];
  onOpenChange: (open: boolean) => void;
  onCommitted: () => void;
}

export function BrainDumpReviewDialog({ open, drafts, onOpenChange, onCommitted }: BrainDumpReviewDialogProps) {
  const addTask = useTaskStore((s) => s.addTask);
  const reorderAll = useTaskStore((s) => s.reorderAll);
  const setCommitment = useSettingsStore((s) => s.setCommitment);

  const [rows, setRows] = useState<BrainDumpDraft[]>(drafts);
  const [nextId, setNextId] = useState<string | undefined>(undefined);

  function updateRow(id: string, patch: Partial<BrainDumpDraft>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (nextId === id) setNextId(undefined);
  }

  const totalXp = rows.reduce((sum, r) => sum + xpForTaskCompletion(r.difficulty, r.priority), 0);

  function handleConfirm() {
    if (rows.length === 0) {
      onOpenChange(false);
      return;
    }
    const created = rows.map((r) =>
      addTask({
        title: r.title.trim(),
        category: r.category,
        priority: r.priority,
        difficulty: r.difficulty,
        dueDate: toDateKey(),
      })
    );

    if (nextId) {
      const chosen = created.find((_, i) => rows[i].id === nextId);
      if (chosen) {
        const others = useTaskStore.getState().tasks.filter((t) => t.id !== chosen.id);
        reorderAll([chosen, ...others].map((t, i) => ({ ...t, order: i })));
        setCommitment(chosen.id, toDateKey());
      }
    }

    onCommitted();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/30">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>Review your brain dump</DialogTitle>
              <DialogDescription className="mt-0">
                Fine-tune each task, then pick the one you&apos;re doing next.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
          {rows.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nothing left to add — go back and dump a few more thoughts.
            </p>
          )}
          {rows.map((row, i) => {
            const rowXp = xpForTaskCompletion(row.difficulty, row.priority);
            const isNext = nextId === row.id;
            return (
              <div
                key={row.id}
                className={cn(
                  "space-y-2.5 rounded-xl border p-3 transition-colors",
                  isNext ? "border-flow-red/40 bg-flow-red/[0.06]" : "border-border/60 bg-secondary/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <Input
                    value={row.title}
                    onChange={(e) => updateRow(row.id, { title: e.target.value })}
                    className="h-8 flex-1 text-sm"
                    placeholder="Task title"
                  />
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                    <Sparkles className="h-3 w-3" /> {rowXp}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-flow-red"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pl-7">
                  <PillSelect
                    size="sm"
                    options={PRIORITY_OPTIONS}
                    value={row.priority}
                    onChange={(v) => updateRow(row.id, { priority: v })}
                  />
                  <PillSelect
                    size="sm"
                    options={DIFFICULTY_OPTIONS}
                    value={row.difficulty}
                    onChange={(v) => updateRow(row.id, { difficulty: v })}
                  />
                  <Select value={row.category} onValueChange={(v) => updateRow(row.id, { category: v as Category })}>
                    <SelectTrigger className="h-7 w-auto gap-1.5 border-none bg-secondary/60 px-2.5 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    type="button"
                    onClick={() => setNextId((prev) => (prev === row.id ? undefined : row.id))}
                    className={cn(
                      "ml-auto flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      isNext
                        ? "border-flow-red/50 bg-flow-red/15 text-flow-red"
                        : "border-border/70 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Target className="h-3 w-3" /> {isNext ? "Doing next" : "Do next"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {rows.length} task{rows.length === 1 ? "" : "s"} worth
            <span className="flex items-center gap-1 font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> {totalXp} XP
            </span>
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={rows.length === 0}>
              Add {rows.length || ""} task{rows.length === 1 ? "" : "s"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
