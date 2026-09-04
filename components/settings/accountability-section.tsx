"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSettingsStore } from "@/store/settingsStore";
import { useLedgerStore } from "@/store/ledgerStore";
import { GUILT_INTENSITIES, WHY_PROMPT, getReckoningCopy } from "@/lib/guilt";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/dates";
import type { DayRecord, GuiltIntensity } from "@/types";

/** A stand-in bad day, so the intensity setting can be heard before it's lived. */
const SAMPLE_DAY: DayRecord = {
  date: toDateKey(new Date(Date.now() - 86400000)),
  verdict: "broken",
  dueCount: 3,
  doneCount: 0,
  missed: [
    {
      taskId: "sample",
      title: "Finish the pitch deck",
      priority: "HIGH",
      xpForfeited: 52,
      timesMissedBefore: 1,
      wasCommitment: true,
      recurring: false,
    },
  ],
  focusMinutes: 0,
  habitsDue: 4,
  habitsDone: 1,
  xpEarned: 0,
  xpForfeited: 52,
  commitmentTitle: "Finish the pitch deck",
  commitmentKept: false,
  streakBefore: 6,
  acknowledged: true,
  sealedAt: new Date().toISOString(),
};

export function AccountabilitySection() {
  const guiltIntensity = useSettingsStore((s) => s.guiltIntensity);
  const why = useSettingsStore((s) => s.why);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const setWhy = useSettingsStore((s) => s.setWhy);
  const acknowledgeAll = useLedgerStore((s) => s.acknowledgeAll);

  const [draft, setDraft] = useState(why ?? "");
  const [saved, setSaved] = useState(false);

  const preview = getReckoningCopy(SAMPLE_DAY, guiltIntensity);

  function pick(value: GuiltIntensity) {
    updateSettings({ guiltIntensity: value });
  }

  function saveWhy() {
    setWhy(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4" /> Accountability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>How hard should FlowState push?</Label>
          <p className="text-xs text-muted-foreground">
            When a day closes with work unfinished, FlowState shows you exactly what you let go.
            This sets the tone of that conversation — it never changes what gets recorded, only
            how bluntly it&apos;s said.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {GUILT_INTENSITIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => pick(option.value)}
                aria-pressed={guiltIntensity === option.value}
                className={cn(
                  "rounded-lg border border-border/60 bg-secondary/30 p-3 text-left transition-colors hover:border-primary/40",
                  guiltIntensity === option.value && "border-primary bg-primary/10"
                )}
              >
                <p className="text-sm font-semibold text-foreground">{option.label}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {option.description}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-dashed border-border/60 bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How that sounds
            </p>
            <p className="mt-1.5 text-sm font-medium text-foreground">{preview.headline}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{preview.body}</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/60 pt-4">
          <Label htmlFor="why-statement">{WHY_PROMPT.title}</Label>
          <p className="text-xs text-muted-foreground">{WHY_PROMPT.description}</p>
          <Textarea
            id="why-statement"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={WHY_PROMPT.placeholder}
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={saveWhy} disabled={draft.trim() === (why ?? "").trim()}>
              Save
            </Button>
            {saved && <span className="text-xs text-flow-green">Saved.</span>}
          </div>
        </div>

        <div className="space-y-2 border-t border-border/60 pt-4">
          <Label>Pending reckonings</Label>
          <p className="text-xs text-muted-foreground">
            Clears any closed days still queued to be shown. Your history stays on record in
            Stats — this only stops them appearing on screen.
          </p>
          <Button variant="outline" size="sm" onClick={acknowledgeAll}>
            Mark all as faced
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
