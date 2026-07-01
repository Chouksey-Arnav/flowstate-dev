"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const URGE_PLANS = [
  "Close the tab and stand up for 30 seconds",
  "Use the site blocker instead of relying on willpower",
  "Text my accountability person before I open anything else",
  "Set a 5-minute timer and just start typing",
];

interface IntentionDialogProps {
  open: boolean;
  taskTitle?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { whyItMatters: string; ifUrgePlan: string }) => void;
}

export function IntentionDialog({ open, taskTitle, onOpenChange, onConfirm }: IntentionDialogProps) {
  const [whyItMatters, setWhyItMatters] = useState("");
  const [ifUrgePlan, setIfUrgePlan] = useState("");

  function handleConfirm() {
    onConfirm({ whyItMatters: whyItMatters.trim(), ifUrgePlan: ifUrgePlan.trim() || URGE_PLANS[0] });
    setWhyItMatters("");
    setIfUrgePlan("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Before you start — quick gut check</DialogTitle>
          <DialogDescription>
            {taskTitle ? `You're about to focus on "${taskTitle}".` : "You're about to start a focus session."}{" "}
            Thirty seconds here makes the next 25 minutes much harder to abandon.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="why-matters">Why does finishing this actually matter today?</Label>
            <Textarea
              id="why-matters"
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              placeholder="e.g. If I don't do this now it slips another week and I fall behind."
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>If the urge to open YouTube / socials hits, I will instead:</Label>
            <div className="flex flex-col gap-1.5">
              {URGE_PLANS.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setIfUrgePlan(plan)}
                  className={cn(
                    "rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/40",
                    ifUrgePlan === plan && "border-primary bg-primary/10"
                  )}
                >
                  {plan}
                </button>
              ))}
            </div>
            <Textarea
              value={ifUrgePlan}
              onChange={(e) => setIfUrgePlan(e.target.value)}
              placeholder="Or write your own..."
              rows={1}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Lock it in & start</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
