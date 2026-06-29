"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/taskStore";

export function BrainDumpInput() {
  const [text, setText] = useState("");
  const addTask = useTaskStore((s) => s.addTask);

  function handleSubmit() {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    for (const title of lines) {
      addTask({ title, category: "Other", priority: "MEDIUM" });
    }
    setText("");
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        Brain dump — one task per line
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Call the dentist\nFinish slide deck\nBuy groceries"}
        className="min-h-[60px]"
      />
      <div className="mt-2 flex justify-end">
        <Button size="sm" disabled={!text.trim()} onClick={handleSubmit}>
          Add all
        </Button>
      </div>
    </div>
  );
}
