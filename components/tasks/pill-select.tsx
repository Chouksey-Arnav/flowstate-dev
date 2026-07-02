"use client";

import { cn } from "@/lib/utils";

interface PillOption<T extends string> {
  value: T;
  label: string;
  accent: string;
}

interface PillSelectProps<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "default";
}

export function PillSelect<T extends string>({ options, value, onChange, size = "default" }: PillSelectProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border border-border/70 bg-secondary/50 font-medium text-muted-foreground transition-all hover:border-border hover:text-foreground",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              opt.accent
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
