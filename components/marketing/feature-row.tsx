import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureRowProps {
  icon: LucideIcon;
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  description: string;
  bullets: string[];
  bulletClassName: string;
  reverse?: boolean;
  children: React.ReactNode;
}

export function FeatureRow({
  icon: Icon,
  eyebrow,
  eyebrowClassName,
  title,
  description,
  bullets,
  bulletClassName,
  reverse,
  children,
}: FeatureRowProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className={cn(reverse && "md:order-2")}>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
              eyebrowClassName
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
          <h3 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight sm:text-3xl md:text-[38px]">
            {title}
          </h3>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{description}</p>
          <ul className="mt-5 flex flex-col gap-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5 text-[15px] text-foreground/90">
                <Check className={cn("mt-0.5 h-[19px] w-[19px] shrink-0", bulletClassName)} strokeWidth={2.4} />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(reverse && "md:order-1")}>{children}</div>
      </div>
    </section>
  );
}
