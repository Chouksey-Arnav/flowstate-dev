interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

/** Groups the dashboard into clearly labeled sections instead of one long stack of cards. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex items-baseline justify-between border-b border-border/60 pb-1.5 pt-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  );
}
