"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UsernameFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  status?: "idle" | "checking" | "available" | "taken" | "invalid";
  statusMessage?: string | null;
  autoFocus?: boolean;
}

/**
 * The "@" is permanent chrome, not something the user types — matches how
 * usernames are stored and displayed everywhere else in the app.
 */
export function UsernameField({ id, value, onChange, status = "idle", statusMessage, autoFocus }: UsernameFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Username</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          @
        </span>
        <Input
          id={id}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value.replace(/^@+/, "").replace(/\s/g, ""))}
          placeholder="yourname"
          autoComplete="username"
          className="pl-6"
        />
      </div>
      {statusMessage && (
        <p
          className={cn(
            "text-xs",
            status === "available" && "text-emerald-500",
            (status === "taken" || status === "invalid") && "text-destructive",
            status === "checking" && "text-muted-foreground"
          )}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
