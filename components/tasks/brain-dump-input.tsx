"use client";

import { useState } from "react";
import { ListChecks, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BrainDumpReviewDialog, type BrainDumpDraft } from "./brain-dump-review-dialog";
import { generateId } from "@/lib/id";

export function BrainDumpInput() {
  const [text, setText] = useState("");
  const [drafts, setDrafts] = useState<BrainDumpDraft[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);

  const lineCount = text.split("\n").map((l) => l.trim()).filter(Boolean).length;

  function handleReview() {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    setDrafts(
      lines.map((title) => ({
        id: generateId(),
        title,
        priority: "MEDIUM",
        difficulty: "MEDIUM",
        category: "Other",
      }))
    );
    setReviewOpen(true);
  }

  function handleCommitted() {
    setReviewOpen(false);
    setText("");
  }

  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-primary/[0.03] p-3.5">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Brain dump — one task per line, review before it hits your list
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Call the dentist\nFinish slide deck\nBuy groceries"}
        className="min-h-[68px]"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {lineCount > 0 ? `${lineCount} task${lineCount === 1 ? "" : "s"} detected` : " "}
        </span>
        <Button size="sm" disabled={lineCount === 0} onClick={handleReview}>
          <ListChecks className="mr-1.5 h-3.5 w-3.5" />
          Review {lineCount > 0 ? lineCount : ""} task{lineCount === 1 ? "" : "s"}
        </Button>
      </div>

      <BrainDumpReviewDialog
        key={drafts.map((d) => d.id).join(",")}
        open={reviewOpen}
        drafts={drafts}
        onOpenChange={setReviewOpen}
        onCommitted={handleCommitted}
      />
    </div>
  );
}
