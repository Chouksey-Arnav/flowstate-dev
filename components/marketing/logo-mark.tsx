import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/40",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4.5 13.2a.7.7 0 0 0 .55 1.13H11l-1 8.67L19.5 10.8a.7.7 0 0 0-.55-1.13H12l1-7.67z" />
      </svg>
    </span>
  );
}
