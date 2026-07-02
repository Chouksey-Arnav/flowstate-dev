"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabitStore } from "@/store/habitStore";
import { HABIT_ICON_NAMES, getHabitIcon } from "@/lib/habit-icons";
import { cn } from "@/lib/utils";
import type { Habit, HabitCategory } from "@/types";

const CATEGORIES: HabitCategory[] = ["Health", "Business", "Learning", "Mental", "Misc"];

const FREQUENCY_OPTIONS = [
  { value: 7, label: "Every day" },
  { value: 6, label: "6x / week" },
  { value: 5, label: "5x / week" },
  { value: 4, label: "4x / week" },
  { value: 3, label: "3x / week" },
  { value: 2, label: "2x / week" },
  { value: 1, label: "1x / week" },
];

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
}

export function HabitFormDialog({ open, onOpenChange, habit }: HabitFormDialogProps) {
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(HABIT_ICON_NAMES[0]);
  const [category, setCategory] = useState<HabitCategory>("Health");
  const [timesPerWeek, setTimesPerWeek] = useState(7);

  useEffect(() => {
    if (open) {
      setName(habit?.name ?? "");
      setIcon(habit?.icon ?? HABIT_ICON_NAMES[0]);
      setCategory(habit?.category ?? "Health");
      setTimesPerWeek(habit?.timesPerWeek ?? 7);
    }
  }, [open, habit]);

  function handleSubmit() {
    if (!name.trim()) return;
    if (habit) {
      updateHabit(habit.id, { name: name.trim(), icon, category, timesPerWeek });
    } else {
      addHabit({ name: name.trim(), icon, category, timesPerWeek });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{habit ? "Edit habit" : "New habit"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as HabitCategory)}>
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

          <div className="space-y-1.5">
            <Label>How often</Label>
            <Select value={String(timesPerWeek)} onValueChange={(v) => setTimesPerWeek(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {HABIT_ICON_NAMES.map((name) => {
                const Icon = getHabitIcon(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIcon(name)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md border",
                      icon === name ? "border-primary bg-accent" : "border-border"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {habit ? "Save" : "Add habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
