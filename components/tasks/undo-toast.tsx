"use client";

import { useEffect } from "react";
import { PartyPopper } from "lucide-react";
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
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-flow-green/30 bg-card px-4 py-3 shadow-lg">
      <PartyPopper className="h-4 w-4 shrink-0 text-flow-green" />
      <span className="text-sm font-medium text-foreground">{message}</span>
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
