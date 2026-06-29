"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export function UndoToast({ message, onUndo, onDismiss, durationMs = 5000 }: UndoToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
      <span className="text-sm text-foreground">{message}</span>
      <Button
        size="sm"
        variant="ghost"
        className="text-primary"
        onClick={() => {
          onUndo();
          onDismiss();
        }}
      >
        Undo
      </Button>
    </div>
  );
}
