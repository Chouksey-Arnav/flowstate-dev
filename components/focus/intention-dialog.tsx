"use client";

import { useState } from "react";
import { Target } from "lucide-react";
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
      <DialogContent className="max-w-lg border-white/10 bg-card/95 p-0 backdrop-blur-2xl">
        <div className="relative overflow-hidden p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <DialogHeader className="relative space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Before you start: Gut Check</DialogTitle>
              <DialogDescription className="mt-2 text-base text-muted-foreground">
                {taskTitle ? (
                  <>You&apos;re committing to <span className="font-semibold text-foreground">“{taskTitle}”</span>.</>
                ) : (
                  "You're about to start a deep focus session."
                )}
                <br />
                Intentionality is the antidote to procrastination.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="relative mt-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="why-matters" className="text-sm font-bold uppercase tracking-wider text-primary/80">
                1. Why does this matter?
              </Label>
              <Textarea
                id="why-matters"
                className="min-h-[100px] border-white/5 bg-white/[0.03] text-base placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                placeholder="Example: Completing this now removes the stress for the rest of the day."
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-primary/80">
                2. Your Battle Plan for Urges
              </Label>
              <p className="text-xs text-muted-foreground">If the urge to distract hits, I will instead:</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {URGE_PLANS.map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setIfUrgePlan(plan)}
                    className={cn(
                      "rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left text-xs leading-relaxed text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground",
                      ifUrgePlan === plan && "border-primary/50 bg-primary/10 text-primary shadow-glow"
                    )}
                  >
                    {plan}
                  </button>
                ))}
              </div>
              <Textarea
                className="border-white/5 bg-white/[0.03] text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                value={ifUrgePlan}
                onChange={(e) => setIfUrgePlan(e.target.value)}
                placeholder="Or define your own strategy..."
                rows={1}
              />
            </div>
          </div>

          <DialogFooter className="relative mt-10 gap-3 border-t border-white/5 pt-6 sm:justify-between sm:space-x-0">
            <Button variant="ghost" className="px-6" onClick={() => onOpenChange(false)}>
              Back out
            </Button>
            <Button size="lg" className="px-8 font-bold shadow-glow" onClick={handleConfirm}>
              Lock it in & Start
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
