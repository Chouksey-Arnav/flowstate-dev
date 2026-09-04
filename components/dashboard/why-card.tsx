"use client";

import { useState } from "react";
import { Pencil, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSettingsStore } from "@/store/settingsStore";
import { WHY_PROMPT, getWhyReminder } from "@/lib/guilt";
import type { GuiltIntensity } from "@/types";

interface WhyCardProps {
  intensity: GuiltIntensity;
}

/**
 * The user's own reason, in their own words, held on file.
 *
 * This is the highest-leverage piece of the whole accountability system and
 * the cheapest to build: no copy FlowState writes will ever hit as hard as a
 * sentence the user wrote themselves on a day they meant it. It shows here
 * every day, and it's quoted back verbatim on the closed-day screen.
 */
export function WhyCard({ intensity }: WhyCardProps) {
  const why = useSettingsStore((s) => s.why);
  const setWhy = useSettingsStore((s) => s.setWhy);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(why ?? "");

  function save() {
    setWhy(draft);
    setEditing(false);
  }

  if (editing || !why?.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-flow-yellow/30 bg-flow-yellow/[0.03] p-4">
        <p className="text-sm font-semibold text-foreground">{WHY_PROMPT.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {WHY_PROMPT.description}
        </p>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={WHY_PROMPT.placeholder}
          rows={2}
          className="mt-3"
        />
        <div className="mt-2 flex gap-2">
          <Button size="sm" disabled={!draft.trim()} onClick={save}>
            Save it
          </Button>
          {why?.trim() && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft(why);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl border border-flow-yellow/25 bg-flow-yellow/[0.04] p-4">
      <div className="flex gap-2.5">
        <Quote className="mt-0.5 h-4 w-4 shrink-0 text-flow-yellow/80" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-relaxed text-foreground">{why}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">{getWhyReminder(why, intensity)}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          title="Rewrite your why"
          className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => {
            setDraft(why);
            setEditing(true);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
