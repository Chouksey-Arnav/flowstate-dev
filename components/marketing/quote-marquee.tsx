const QUOTES = [
  "The task you're avoiding is the one that matters most.",
  "Motivation gets you started. Momentum keeps you going.",
  "Done is the engine of more.",
  "Clarity comes from action, not thought.",
  "Procrastination is just fear wearing a to-do list.",
];

export function QuoteMarquee() {
  const items = [...QUOTES, ...QUOTES];

  return (
    <div className="mt-16 overflow-hidden border-y border-border/50 py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-[fs-marquee_42s_linear_infinite] gap-12 whitespace-nowrap text-[15px] font-medium text-muted-foreground/80">
        {items.map((quote, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>{quote}</span>
            <span className="text-primary/60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
