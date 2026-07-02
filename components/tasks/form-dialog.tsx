"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Gauge, Sparkles, Target } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubtaskList } from "./subtask-list";
import { PillSelect } from "./pill-select";
import { useTaskStore } from "@/store/taskStore";
import { useSettingsStore } from "@/store/settingsStore";
import { generateId } from "@/lib/id";
import { xpForTaskCompletion, MIN_CUSTOM_XP, MAX_CUSTOM_XP } from "@/lib/xp";
import { toDateKey } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Task, Category, Priority, Difficulty, SubTask } from "@/types";

const CATEGORIES: Category[] = ["Business", "CAC/Projects", "Learning", "Personal", "Other"];

const PRIORITY_OPTIONS: { value: Priority; label: string; accent: string }[] = [
  { value: "HIGH", label: "High", accent: "data-[active=true]:border-flow-red/50 data-[active=true]:bg-flow-red/15 data-[active=true]:text-flow-red" },
  { value: "MEDIUM", label: "Medium", accent: "data-[active=true]:border-flow-yellow/50 data-[active=true]:bg-flow-yellow/15 data-[active=true]:text-flow-yellow" },
  { value: "LOW", label: "Low", accent: "data-[active=true]:border-border data-[active=true]:bg-secondary data-[active=true]:text-foreground" },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; accent: string }[] = [
  { value: "EASY", label: "Easy", accent: "data-[active=true]:border-flow-green/50 data-[active=true]:bg-flow-green/15 data-[active=true]:text-flow-green" },
  { value: "MEDIUM", label: "Medium", accent: "data-[active=true]:border-flow-blue/50 data-[active=true]:bg-flow-blue/15 data-[active=true]:text-flow-blue" },
  { value: "HARD", label: "Hard", accent: "data-[active=true]:border-flow-red/50 data-[active=true]:bg-flow-red/15 data-[active=true]:text-flow-red" },
];

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const reorderAll = useTaskStore((s) => s.reorderAll);
  const setCommitment = useSettingsStore((s) => s.setCommitment);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [customXp, setCustomXp] = useState(false);
  const [xpValue, setXpValue] = useState("20");
  const [doNext, setDoNext] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setCategory(task?.category ?? "Other");
      setPriority(task?.priority ?? "MEDIUM");
      setDifficulty(task?.difficulty ?? "MEDIUM");
      setDueDate(task?.dueDate ?? "");
      setEstimatedMinutes(task?.estimatedMinutes ? String(task.estimatedMinutes) : "");
      setSubtasks(task?.subtasks ?? []);
      setCustomXp(typeof task?.xpOverride === "number");
      setXpValue(String(task?.xpOverride ?? xpForTaskCompletion(task?.difficulty ?? "MEDIUM", task?.priority ?? "MEDIUM")));
      setDoNext(false);
    }
  }, [open, task]);

  const computedXp = xpForTaskCompletion(difficulty, priority);
  const previewXp = useMemo(() => {
    if (!customXp) return computedXp;
    const n = Number(xpValue);
    if (!Number.isFinite(n)) return computedXp;
    return Math.min(MAX_CUSTOM_XP, Math.max(MIN_CUSTOM_XP, Math.round(n)));
  }, [customXp, xpValue, computedXp]);

  function handleSubmit() {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      difficulty,
      dueDate: dueDate || undefined,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      subtasks,
      tags: task?.tags ?? [],
      xpOverride: customXp ? previewXp : undefined,
    };

    let savedId = task?.id;
    if (task) {
      updateTask(task.id, payload);
    } else {
      const created = addTask(payload);
      savedId = created.id;
      if (doNext) {
        reorderAll(
          [created, ...useTaskStore.getState().tasks.filter((t) => t.id !== created.id)].map((t, i) => ({
            ...t,
            order: i,
          }))
        );
      }
    }
    if (doNext && savedId) {
      setCommitment(savedId, toDateKey());
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/30">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
              <DialogDescription className="mt-0">
                {task ? "Adjust the details — XP updates live." : "Shape it exactly how you want, XP included."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-flow-red" /> Priority
            </Label>
            <PillSelect options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-flow-blue" /> Difficulty
            </Label>
            <PillSelect options={DIFFICULTY_OPTIONS} value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-minutes">Estimated minutes</Label>
              <Input
                id="task-minutes"
                type="number"
                min={0}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-3.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-xp" className="flex items-center gap-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Assign custom XP
              </Label>
              <Switch id="custom-xp" checked={customXp} onCheckedChange={setCustomXp} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {customXp
                ? "Set exactly what this task should pay out when it's done."
                : `Auto-calculated from difficulty + priority.`}
            </p>
            {customXp && (
              <Input
                type="number"
                min={MIN_CUSTOM_XP}
                max={MAX_CUSTOM_XP}
                value={xpValue}
                onChange={(e) => setXpValue(e.target.value)}
                className="mt-2 h-9"
              />
            )}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-card/60 px-3 py-2">
              <span className="text-xs text-muted-foreground">This task will award</span>
              <span className="flex items-center gap-1 text-sm font-bold tabular-nums text-primary">
                <Sparkles className="h-3.5 w-3.5" /> +{previewXp} XP
              </span>
            </div>
          </div>

          {!task && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setDoNext((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDoNext((v) => !v);
                }
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-colors",
                doNext
                  ? "border-flow-red/40 bg-flow-red/10"
                  : "border-dashed border-border hover:border-border/80 hover:bg-secondary/40"
              )}
            >
              <Target className={cn("h-4 w-4 shrink-0", doNext ? "text-flow-red" : "text-muted-foreground")} />
              <span className="flex-1">
                <span className={cn("block text-sm font-medium", doNext ? "text-flow-red" : "text-foreground")}>
                  Do this next
                </span>
                <span className="block text-xs text-muted-foreground">
                  Lock it in as today&apos;s One Thing and push it to the top of your list.
                </span>
              </span>
              <Switch checked={doNext} onCheckedChange={setDoNext} tabIndex={-1} />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Subtasks</Label>
            <SubtaskList
              subtasks={subtasks}
              onToggle={(id) =>
                setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))
              }
              onAdd={(t) => setSubtasks((prev) => [...prev, { id: generateId(), title: t, completed: false }])}
              onDelete={(id) => setSubtasks((prev) => prev.filter((s) => s.id !== id))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {task ? "Save changes" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
