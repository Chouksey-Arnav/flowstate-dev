"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/taskStore";

export function QuickAddButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const addTask = useTaskStore((s) => s.addTask);

  function handleSubmit() {
    if (!title.trim()) return;
    addTask({ title: title.trim(), category: "Other", priority: "MEDIUM" });
    setTitle("");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" /> Quick add task
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Task title..."
        className="max-w-xs"
      />
      <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>
        Add
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </div>
  );
}
