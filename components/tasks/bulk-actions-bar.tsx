"use client";

import { CheckCheck, Archive, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  count: number;
  onComplete: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionsBar({ count, onComplete, onArchive, onDelete, onClear }: BulkActionsBarProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5">
      <span className="text-sm text-foreground">{count} selected</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onComplete}>
          <CheckCheck className="mr-1.5 h-4 w-4" /> Complete
        </Button>
        <Button variant="ghost" size="sm" onClick={onArchive}>
          <Archive className="mr-1.5 h-4 w-4" /> Archive
        </Button>
        <Button variant="ghost" size="sm" className="text-flow-red" onClick={onDelete}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
