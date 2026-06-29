"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DailyGoalEditableProps {
  goal: string;
  onSave: (goal: string) => void;
}

export function DailyGoalEditable({ goal, onSave }: DailyGoalEditableProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal);

  function commit() {
    onSave(draft.trim());
    setEditing(false);
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-2 p-4">
        {editing ? (
          <>
            <Input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              placeholder="What's today's goal?"
              className="flex-1"
            />
            <Button size="icon" variant="ghost" onClick={commit}>
              <Check className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="flex-1 text-sm text-foreground">
              {goal || <span className="text-muted-foreground">Set today&apos;s goal</span>}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setDraft(goal);
                setEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
