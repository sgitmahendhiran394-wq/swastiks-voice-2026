import { cn } from "@/lib/utils";

/** Swastiks wordmark + Engineers' Day lockup. */
export function BrandLockup({ size = "md", className, align = "center" }: { size?: "sm" | "md" | "lg"; className?: string; align?: "center" | "left" }) {
  const isLg = size === "lg";
  const isSm = size === "sm";
  return (
    <div className={cn("flex flex-col", align === "center" ? "items-center text-center" : "items-start text-left", className)}>
      <div className="flex items-center gap-3">
        <Emblem className={cn(isLg ? "h-12 w-12" : isSm ? "h-7 w-7" : "h-9 w-9")} />
        <span
          className={cn(
            "font-display font-bold uppercase tracking-[0.42em] text-foreground",
            isLg ? "text-2xl md:text-3xl" : isSm ? "text-sm" : "text-lg",
          )}
        >
          Swastiks
        </span>
      </div>
      {!isSm && (
        <div className={cn("mt-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent", isLg ? "w-64" : "w-40")} />
      )}
    </div>
  );
}

/** Gear-like geometric emblem in gold with a red core. */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient id="emblem-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--gold-light)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#emblem-gold)" strokeWidth="2.2">
        <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" />
        <circle cx="24" cy="24" r="10" />
      </g>
      <circle cx="24" cy="24" r="4" fill="var(--red-bright)" />
      <g stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round">
        <line x1="24" y1="8" x2="24" y2="14" />
        <line x1="24" y1="34" x2="24" y2="40" />
        <line x1="10" y1="16" x2="15" y2="19" />
        <line x1="33" y1="29" x2="38" y2="32" />
        <line x1="10" y1="32" x2="15" y2="29" />
        <line x1="33" y1="19" x2="38" y2="16" />
      </g>
    </svg>
  );
}
